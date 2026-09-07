package downloader

import (
	"context"
	"crypto/tls"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"sync/atomic"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/analytics"
	"github.com/sadraahkami/vortexdm/pkg/traffic"
	"github.com/sadraahkami/vortexdm/pkg/utils"
)

type Engine struct {
	tasks          map[string]*Task
	mu             sync.RWMutex
	client         *http.Client
	downloadDir    string
	maxConcurrent  int
	runningCount   int
	bytesWindow    int64
	currentSpeed   float64
	subscribers    []chan *Task
	subscribersMu  sync.Mutex
	stopTickerChan chan struct{}
	limiter        *SpeedLimiter
}

func NewEngine(downloadDir string, maxConcurrent int) *Engine {
	if downloadDir == "" {
		downloadDir = filepath.Join(".", "downloads")
	}
	os.MkdirAll(downloadDir, 0755)

	customTransport := &http.Transport{
		TLSClientConfig:       &tls.Config{InsecureSkipVerify: true},
		MaxIdleConns:          100,
		MaxIdleConnsPerHost:   32,
		IdleConnTimeout:       90 * time.Second,
		ResponseHeaderTimeout: 30 * time.Second,
	}

	eng := &Engine{
		tasks:          make(map[string]*Task),
		downloadDir:    downloadDir,
		maxConcurrent:  maxConcurrent,
		client:         &http.Client{Transport: customTransport, Timeout: 0},
		subscribers:    make([]chan *Task, 0),
		stopTickerChan: make(chan struct{}),
		limiter:        NewSpeedLimiter(0),
	}

	eng.startSpeedTicker()
	analytics.InitAnalytics(downloadDir)
	return eng
}

func (e *Engine) Close() {
	close(e.stopTickerChan)
}

func (e *Engine) Subscribe() chan *Task {
	e.subscribersMu.Lock()
	defer e.subscribersMu.Unlock()
	ch := make(chan *Task, 50)
	e.subscribers = append(e.subscribers, ch)
	return ch
}

func (e *Engine) Unsubscribe(ch chan *Task) {
	e.subscribersMu.Lock()
	defer e.subscribersMu.Unlock()
	for i, sub := range e.subscribers {
		if sub == ch {
			e.subscribers = append(e.subscribers[:i], e.subscribers[i+1:]...)
			close(ch)
			break
		}
	}
}

func (e *Engine) broadcast(t *Task) {
	e.subscribersMu.Lock()
	defer e.subscribersMu.Unlock()
	for _, sub := range e.subscribers {
		select {
		case sub <- t:
		default:
		}
	}
}

func (e *Engine) startSpeedTicker() {
	ticker := time.NewTicker(500 * time.Millisecond)
	go func() {
		lastTime := time.Now()
		for {
			select {
			case <-e.stopTickerChan:
				ticker.Stop()
				return
			case now := <-ticker.C:
				dt := now.Sub(lastTime).Seconds()
				lastTime = now

				window := atomic.SwapInt64(&e.bytesWindow, 0)
				speed := 0.0
				if dt > 0 {
					speed = float64(window) / dt
				}
				e.currentSpeed = speed

				// Update tasks that are downloading
				e.mu.RLock()
				for _, t := range e.tasks {
					if t.Status == StatusDownloading {
						t.UpdateProgressStats(speed)
						e.broadcast(t)
					}
				}
				e.mu.RUnlock()
			}
		}
	}()
}

func (e *Engine) ProbeURL(rawURL string) (filename string, size int64, supportsRange bool, err error) {
	req, err := http.NewRequest("HEAD", rawURL, nil)
	if err != nil {
		return "", 0, false, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexDM/1.0")

	resp, err := e.client.Do(req)
	if err != nil || resp.StatusCode >= 400 {
		// Fallback to GET with Range: bytes=0-0
		getReq, getErr := http.NewRequest("GET", rawURL, nil)
		if getErr != nil {
			return "", 0, false, err
		}
		getReq.Header.Set("Range", "bytes=0-0")
		getReq.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexDM/1.0")

		getResp, getErr := e.client.Do(getReq)
		if getErr != nil {
			return "", 0, false, getErr
		}
		defer getResp.Body.Close()
		resp = getResp
	} else {
		defer resp.Body.Close()
	}

	size = resp.ContentLength
	if resp.Header.Get("Accept-Ranges") == "bytes" || resp.StatusCode == http.StatusPartialContent {
		supportsRange = true
	}

	// Try extracting filename from Content-Disposition
	cd := resp.Header.Get("Content-Disposition")
	if cd != "" {
		if _, params, err := mime.ParseMediaType(cd); err == nil {
			if fn, ok := params["filename"]; ok {
				filename = fn
			}
		}
	}

	// Fallback to URL path
	if filename == "" {
		if parsedURL, err := url.Parse(rawURL); err == nil {
			base := filepath.Base(parsedURL.Path)
			if base != "" && base != "/" && base != "." {
				filename = base
			}
		}
	}

	if filename == "" {
		filename = fmt.Sprintf("download_%d.bin", time.Now().Unix())
	}

	return filename, size, supportsRange, nil
}

func (e *Engine) CreateTask(rawURL string, customFilename string, numConnections int) (*Task, error) {
	filename, size, supportsRange, err := e.ProbeURL(rawURL)
	if err != nil {
		return nil, fmt.Errorf("failed to probe URL: %w", err)
	}

	if customFilename != "" {
		filename = customFilename
	}

	if numConnections <= 0 {
		numConnections = 8
	}

	taskID := fmt.Sprintf("%x", time.Now().UnixNano())
	finalPath := filepath.Join(e.downloadDir, filename)

	cat := string(utils.DetectCategory(filename))
	tr := traffic.DetectTraffic(rawURL)

	task := &Task{
		ID:              taskID,
		URL:             rawURL,
		Filename:        filename,
		Category:        cat,
		DestinationDir:  e.downloadDir,
		FinalPath:       finalPath,
		TotalSize:       size,
		Status:          StatusQueued,
		SupportsRange:   supportsRange,
		NumConnections:  numConnections,
		Queue:           "main",
		TrafficBadge:    tr.TrafficBadge,
		TrafficLabel:    tr.Label,
		LinkIraniURL:    tr.LinkIraniURL,
		IPAddress:       tr.IPAddress,
		CreatedAt:       time.Now(),
		ProgressPercent: 0,
		ETA:             "--:--",
	}

	task.FormattedTotal = utils.FormatBytes(size)
	task.FormattedProgress = "0 B"
	task.FormattedSpeed = "0 B/s"

	// Plan Chunks
	if supportsRange && size > 1024*1024 {
		chunkSize := size / int64(numConnections)
		chunks := make([]*Chunk, numConnections)
		for i := 0; i < numConnections; i++ {
			start := int64(i) * chunkSize
			end := start + chunkSize - 1
			if i == numConnections-1 {
				end = size - 1
			}
			chunks[i] = &Chunk{
				Index:       i,
				StartOffset: start,
				EndOffset:   end,
				Downloaded:  0,
				Total:       end - start + 1,
				Size:        end - start + 1,
				Completed:   false,
			}
		}
		task.Chunks = chunks
	} else {
		task.NumConnections = 1
		task.Chunks = []*Chunk{
			{
				Index:       0,
				StartOffset: 0,
				EndOffset:   size - 1,
				Downloaded:  0,
				Total:       size,
				Size:        size,
				Completed:   false,
			},
		}
	}

	e.mu.Lock()
	task.Order = len(e.tasks) + 1
	e.tasks[taskID] = task
	e.mu.Unlock()

	task.SaveState()
	return task, nil
}

func (e *Engine) StartTask(taskID string) error {
	e.mu.Lock()
	task, exists := e.tasks[taskID]
	e.mu.Unlock()

	if !exists {
		return fmt.Errorf("task %s not found", taskID)
	}

	task.mu.Lock()
	if task.Status == StatusDownloading {
		task.mu.Unlock()
		return nil
	}

	ctx, cancel := context.WithCancel(context.Background())
	task.cancelFunc = cancel
	task.Status = StatusDownloading
	task.mu.Unlock()

	go e.runDownload(ctx, task)
	return nil
}

func (e *Engine) PauseTask(taskID string) error {
	e.mu.Lock()
	task, exists := e.tasks[taskID]
	e.mu.Unlock()

	if !exists {
		return fmt.Errorf("task %s not found", taskID)
	}

	task.mu.Lock()
	if task.Status == StatusDownloading && task.cancelFunc != nil {
		task.cancelFunc()
		task.Status = StatusPaused
		task.SpeedBytesPerSec = 0
		task.FormattedSpeed = "0 B/s"
		task.SaveState()
	}
	task.mu.Unlock()

	e.broadcast(task)
	return nil
}

func (e *Engine) DeleteTask(taskID string, deleteFiles bool) error {
	e.mu.Lock()
	task, exists := e.tasks[taskID]
	if exists {
		delete(e.tasks, taskID)
	}
	e.mu.Unlock()

	if !exists {
		return nil
	}

	e.PauseTask(taskID)

	os.Remove(task.StateFilePath())
	if deleteFiles {
		os.Remove(task.FinalPath)
	}
	return nil
}

func (e *Engine) GetTasks() []*Task {
	e.mu.RLock()
	defer e.mu.RUnlock()

	list := make([]*Task, 0, len(e.tasks))
	for _, t := range e.tasks {
		list = append(list, t)
	}
	return list
}

func (e *Engine) GetTask(taskID string) *Task {
	e.mu.RLock()
	defer e.mu.RUnlock()
	return e.tasks[taskID]
}

func (e *Engine) GetTotalSpeed() float64 {
	return e.currentSpeed
}

func (e *Engine) StartAll() {
	e.mu.RLock()
	tasksToStart := make([]string, 0)
	for id, t := range e.tasks {
		if t.Status == StatusPaused || t.Status == StatusQueued || t.Status == StatusError {
			tasksToStart = append(tasksToStart, id)
		}
	}
	e.mu.RUnlock()

	for _, id := range tasksToStart {
		e.StartTask(id)
	}
}

func (e *Engine) PauseAll() {
	e.mu.RLock()
	tasksToPause := make([]string, 0)
	for id, t := range e.tasks {
		if t.Status == StatusDownloading {
			tasksToPause = append(tasksToPause, id)
		}
	}
	e.mu.RUnlock()

	for _, id := range tasksToPause {
		e.PauseTask(id)
	}
}

func (e *Engine) ClearCompleted() {
	e.mu.Lock()
	completedIDs := make([]string, 0)
	for id, t := range e.tasks {
		if t.Status == StatusCompleted {
			completedIDs = append(completedIDs, id)
		}
	}
	for _, id := range completedIDs {
		t := e.tasks[id]
		delete(e.tasks, id)
		os.Remove(t.StateFilePath())
	}
	e.mu.Unlock()
}

func (e *Engine) SetSpeedLimit(limitBytesPerSec int64) {
	if e.limiter != nil {
		e.limiter.SetLimit(limitBytesPerSec)
	}
}

func (e *Engine) GetSpeedLimit() int64 {
	if e.limiter != nil {
		return e.limiter.GetLimit()
	}
	return 0
}

func (e *Engine) StartQueue(queueName string) {
	e.mu.RLock()
	tasksToStart := make([]*Task, 0)
	for _, t := range e.tasks {
		if (queueName == "" || t.Queue == queueName) && (t.Status == StatusPaused || t.Status == StatusQueued || t.Status == StatusError) {
			tasksToStart = append(tasksToStart, t)
		}
	}
	e.mu.RUnlock()

	// Sort tasks by priority Order ascending
	sort.Slice(tasksToStart, func(i, j int) bool {
		return tasksToStart[i].Order < tasksToStart[j].Order
	})

	for _, t := range tasksToStart {
		e.StartTask(t.ID)
	}
}

func (e *Engine) ReorderTask(taskID string, newOrder int) {
	e.mu.Lock()
	defer e.mu.Unlock()
	task, exists := e.tasks[taskID]
	if !exists {
		return
	}
	task.mu.Lock()
	task.Order = newOrder
	task.mu.Unlock()
	task.SaveState()
	e.broadcast(task)
}

func (e *Engine) PauseQueue(queueName string) {
	e.mu.RLock()
	tasksToPause := make([]string, 0)
	for id, t := range e.tasks {
		if (queueName == "" || t.Queue == queueName) && t.Status == StatusDownloading {
			tasksToPause = append(tasksToPause, id)
		}
	}
	e.mu.RUnlock()

	for _, id := range tasksToPause {
		e.PauseTask(id)
	}
}

func (e *Engine) IsQueueDone(queueName string) bool {
	e.mu.RLock()
	defer e.mu.RUnlock()

	count := 0
	for _, t := range e.tasks {
		if queueName == "" || t.Queue == queueName {
			count++
			if t.Status != StatusCompleted {
				return false
			}
		}
	}
	return count > 0
}

func (e *Engine) runDownload(ctx context.Context, task *Task) {
	file, err := os.OpenFile(task.FinalPath, os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		task.mu.Lock()
		task.Status = StatusError
		task.ErrorMessage = err.Error()
		task.mu.Unlock()
		e.broadcast(task)
		return
	}
	defer file.Close()

	if task.TotalSize > 0 {
		file.Truncate(task.TotalSize)
	}

	var wg sync.WaitGroup
	errChan := make(chan error, len(task.Chunks))

	isDom := task.TrafficBadge == "domestic"
	onBytesRead := func(n int) {
		atomic.AddInt64(&e.bytesWindow, int64(n))
		if e.limiter != nil {
			e.limiter.Throttle(n)
		}
		if a := analytics.GetAnalytics(); a != nil {
			a.RecordDownload(int64(n), isDom, "")
		}
	}

	for _, chunk := range task.Chunks {
		if chunk.Completed {
			continue
		}

		wg.Add(1)
		go func(c *Chunk) {
			defer wg.Done()
			if err := c.DownloadChunk(ctx, e.client, task.URL, file, onBytesRead); err != nil {
				if err != context.Canceled {
					errChan <- err
				}
			}
		}(chunk)
	}

	wg.Wait()
	close(errChan)

	select {
	case <-ctx.Done():
		// Paused
		task.mu.Lock()
		task.Status = StatusPaused
		task.mu.Unlock()
		task.SaveState()
		e.broadcast(task)
		return
	default:
	}

	var hasErr error
	for err := range errChan {
		if err != nil {
			hasErr = err
			break
		}
	}

	task.mu.Lock()
	if hasErr != nil {
		task.Status = StatusError
		task.ErrorMessage = hasErr.Error()
	} else {
		task.Status = StatusCompleted
		now := time.Now()
		task.CompletedAt = &now
		task.ProgressPercent = 100.0
		task.ETA = "Done"
		task.SpeedBytesPerSec = 0
		task.FormattedSpeed = "0 B/s"
		os.Remove(task.StateFilePath()) // Clean state file on completion
		if a := analytics.GetAnalytics(); a != nil {
			a.RecordDownload(0, isDom, task.Filename)
		}
	}
	task.mu.Unlock()

	e.broadcast(task)
}
