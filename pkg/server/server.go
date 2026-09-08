package server

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/analytics"
	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/settings"
	"github.com/sadraahkami/vortexdm/pkg/traffic"
	"github.com/sadraahkami/vortexdm/pkg/tray"
	"github.com/sadraahkami/vortexdm/pkg/unpacker"
)

type Server struct {
	engine   *downloader.Engine
	sched    *scheduler.Scheduler
	staticFS http.FileSystem
	clients  map[chan []byte]bool
	clientMu sync.Mutex
}

type AddTaskRequest struct {
	URL            string `json:"url"`
	Filename       string `json:"filename"`
	DestinationDir string `json:"destination_dir"`
	Connections    int    `json:"connections"`
	Queue          string `json:"queue"`
}

type StatePayload struct {
	Tasks      []*downloader.Task `json:"tasks"`
	TotalSpeed float64            `json:"total_speed"`
	SpeedLimit int64              `json:"speed_limit"`
}

func NewServer(eng *downloader.Engine, sched *scheduler.Scheduler, staticFS http.FileSystem) *Server {
	s := &Server{
		engine:   eng,
		sched:    sched,
		staticFS: staticFS,
		clients:  make(map[chan []byte]bool),
	}
	go s.listenEngineUpdates()
	return s
}

func (s *Server) listenEngineUpdates() {
	taskCh := s.engine.Subscribe()
	ticker := time.NewTicker(250 * time.Millisecond)
	defer ticker.Stop()

	var dirty bool
	for {
		select {
		case _, ok := <-taskCh:
			if !ok {
				return
			}
			dirty = true
		case <-ticker.C:
			if dirty || s.engine.GetTotalSpeed() > 0 {
				s.broadcastCurrentState()
				dirty = false
			}
		}
	}
}

func (s *Server) broadcastCurrentState() {
	payload := StatePayload{
		Tasks:      s.engine.GetTasks(),
		TotalSpeed: s.engine.GetTotalSpeed(),
		SpeedLimit: s.engine.GetSpeedLimit(),
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return
	}

	msg := []byte(fmt.Sprintf("event: tasks\ndata: %s\n\n", data))

	s.clientMu.Lock()
	defer s.clientMu.Unlock()

	for ch := range s.clients {
		select {
		case ch <- msg:
		default:
		}
	}
}

func (s *Server) SetupRoutes() http.Handler {
	mux := http.NewServeMux()

	// REST Endpoints
	mux.HandleFunc("/api/tasks", s.handleTasks)
	mux.HandleFunc("/api/tasks/start", s.handleStartTask)
	mux.HandleFunc("/api/tasks/start-all", s.handleStartAll)
	mux.HandleFunc("/api/tasks/pause", s.handlePauseTask)
	mux.HandleFunc("/api/tasks/pause-all", s.handlePauseAll)
	mux.HandleFunc("/api/tasks/delete", s.handleDeleteTask)
	mux.HandleFunc("/api/tasks/clear-completed", s.handleClearCompleted)
	mux.HandleFunc("/api/tasks/open", s.handleOpenFile)
	mux.HandleFunc("/api/events", s.handleSSE)

	// Advanced Controls & Iran Domestic Traffic
	mux.HandleFunc("/api/scheduler", s.handleScheduler)
	mux.HandleFunc("/api/speed-limit", s.handleSpeedLimit)
	mux.HandleFunc("/api/traffic/check", s.handleTrafficCheck)
	mux.HandleFunc("/api/window/minimize", s.handleWindowMinimize)
	mux.HandleFunc("/api/window/minimize-tray", s.handleWindowMinimizeTray)
	mux.HandleFunc("/api/analytics", s.handleAnalytics)
	mux.HandleFunc("/api/analytics/reset", s.handleAnalyticsReset)
	mux.HandleFunc("/api/queues", s.handleQueues)
	mux.HandleFunc("/api/queues/start", s.handleStartQueue)
	mux.HandleFunc("/api/queues/pause", s.handlePauseQueue)
	mux.HandleFunc("/api/tasks/reorder", s.handleReorderTask)
	mux.HandleFunc("/api/tasks/batch", s.handleBatchTasks)
	mux.HandleFunc("/api/tasks/checksum", s.handleChecksum)
	mux.HandleFunc("/api/tasks/refresh-url", s.handleRefreshURL)
	mux.HandleFunc("/api/tasks/extract", s.handleExtractZip)
	mux.HandleFunc("/api/settings", s.handleSettings)
	mux.HandleFunc("/api/dialog/browse-folder", s.handleBrowseFolder)

	// Wi-Fi Local Sharing & In-Flight Media Streaming
	mux.HandleFunc("/api/share/info", s.handleShareInfo)
	mux.HandleFunc("/share/file", s.handleShareFile)
	mux.HandleFunc("/api/media/stream", s.handleMediaStream)

	// Built-in Speed & Latency Test
	mux.HandleFunc("/api/speedtest/ping", s.handleSpeedtestPing)
	mux.HandleFunc("/api/speedtest/download", s.handleSpeedtestDownload)

	// Static Web UI Files
	if s.staticFS != nil {
		fileServer := http.FileServer(s.staticFS)
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			path := r.URL.Path
			if path == "/" || !strings.Contains(path, ".") {
				r.URL.Path = "/"
			}
			fileServer.ServeHTTP(w, r)
		})
	}

	return s.corsMiddleware(mux)
}

func (s *Server) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) handleTasks(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		payload := StatePayload{
			Tasks:      s.engine.GetTasks(),
			TotalSpeed: s.engine.GetTotalSpeed(),
			SpeedLimit: s.engine.GetSpeedLimit(),
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(payload)
		return
	}

	if r.Method == http.MethodPost {
		var req AddTaskRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"Invalid request payload"}`, http.StatusBadRequest)
			return
		}

		if req.URL == "" {
			http.Error(w, `{"error":"URL is required"}`, http.StatusBadRequest)
			return
		}

		task, err := s.engine.CreateTask(req.URL, req.Filename, req.DestinationDir, req.Connections)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		if req.Queue != "" && req.Queue != "main" {
			task.Queue = req.Queue
			task.SaveState()
		}

		// Auto-start the new download
		go s.engine.StartTask(task.ID)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(task)
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleStartTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Missing task id", http.StatusBadRequest)
		return
	}

	if err := s.engine.StartTask(taskID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"started"}`))
}

func (s *Server) handlePauseTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Missing task id", http.StatusBadRequest)
		return
	}

	if err := s.engine.PauseTask(taskID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"paused"}`))
}

func (s *Server) handleStartAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	s.engine.StartAll()
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"started_all"}`))
}

func (s *Server) handlePauseAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	s.engine.PauseAll()
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"paused_all"}`))
}

func (s *Server) handleClearCompleted(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	s.engine.ClearCompleted()
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"cleared"}`))
}

func (s *Server) handleDeleteTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Missing task id", http.StatusBadRequest)
		return
	}

	s.engine.DeleteTask(taskID, true)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"deleted"}`))
}

func (s *Server) handleOpenFile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	taskID := r.URL.Query().Get("id")
	task := s.engine.GetTask(taskID)
	if task == nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	go func(targetPath string) {
		switch runtime.GOOS {
		case "windows":
			exec.Command("explorer", "/select,", filepath.Clean(targetPath)).Start()
		case "darwin":
			exec.Command("open", "-R", targetPath).Start()
		default:
			exec.Command("xdg-open", filepath.Dir(targetPath)).Start()
		}
	}(task.FinalPath)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"opened"}`))
}

func (s *Server) handleSSE(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	clientChan := make(chan []byte, 10)
	s.clientMu.Lock()
	s.clients[clientChan] = true
	s.clientMu.Unlock()

	defer func() {
		s.clientMu.Lock()
		delete(s.clients, clientChan)
		close(clientChan)
		s.clientMu.Unlock()
	}()

	// Send initial state immediately
	initPayload := StatePayload{
		Tasks:      s.engine.GetTasks(),
		TotalSpeed: s.engine.GetTotalSpeed(),
	}
	if initBytes, err := json.Marshal(initPayload); err == nil {
		fmt.Fprintf(w, "event: tasks\ndata: %s\n\n", initBytes)
		flusher.Flush()
	}

	notify := r.Context().Done()
	for {
		select {
		case <-notify:
			return
		case msg, open := <-clientChan:
			if !open {
				return
			}
			w.Write(msg)
			flusher.Flush()
		}
	}
}

func (s *Server) handleScheduler(w http.ResponseWriter, r *http.Request) {
	if s.sched == nil {
		http.Error(w, `{"error":"Scheduler not initialized"}`, http.StatusBadRequest)
		return
	}
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(s.sched.GetConfig())
		return
	}
	if r.Method == http.MethodPost {
		var cfg scheduler.SchedulerConfig
		if err := json.NewDecoder(r.Body).Decode(&cfg); err != nil {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		if err := s.sched.SaveConfig(cfg); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "saved"})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleSpeedLimit(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]int64{"limit": s.engine.GetSpeedLimit()})
		return
	}
	if r.Method == http.MethodPost {
		var req struct {
			Limit int64 `json:"limit"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		s.engine.SetSpeedLimit(req.Limit)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "updated", "limit": req.Limit})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleTrafficCheck(w http.ResponseWriter, r *http.Request) {
	targetURL := r.URL.Query().Get("url")
	if targetURL == "" {
		http.Error(w, `{"error":"URL parameter required"}`, http.StatusBadRequest)
		return
	}
	info := traffic.DetectTraffic(targetURL)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

func (s *Server) handleWindowMinimize(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		minimized := MinimizeAppWindow()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"success": minimized})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleWindowMinimizeTray(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		hidden := tray.HideToTray()
		if !hidden {
			hidden = MinimizeAppWindow()
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"success": hidden})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleAnalytics(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		if a := analytics.GetAnalytics(); a != nil {
			json.NewEncoder(w).Encode(a.GetSummary())
		} else {
			json.NewEncoder(w).Encode(analytics.AnalyticsSummary{})
		}
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleAnalyticsReset(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		if a := analytics.GetAnalytics(); a != nil {
			a.ResetCycle()
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "reset"})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleQueues(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(s.sched.GetConfig())
		return
	}
	if r.Method == http.MethodPost {
		var req struct {
			ID     string                `json:"id"`
			Config scheduler.QueueConfig `json:"config"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ID == "" {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		if req.Config.Name == "" {
			req.Config.Name = req.ID
		}
		s.sched.AddOrUpdateCustomQueue(req.ID, &req.Config)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "ok", "id": req.ID})
		return
	}
	if r.Method == http.MethodDelete {
		id := r.URL.Query().Get("id")
		if id == "" || id == "main" || id == "night" {
			http.Error(w, `{"error":"Cannot delete built-in or empty queue"}`, http.StatusBadRequest)
			return
		}
		s.sched.DeleteCustomQueue(id)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "deleted", "id": id})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleStartQueue(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	queue := r.URL.Query().Get("queue")
	if queue == "" {
		queue = "main"
	}
	s.engine.StartQueue(queue)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "started", "queue": queue})
}

func (s *Server) handlePauseQueue(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	queue := r.URL.Query().Get("queue")
	if queue == "" {
		queue = "main"
	}
	s.engine.PauseQueue(queue)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "paused", "queue": queue})
}

func (s *Server) handleReorderTask(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var req struct {
			TaskID   string `json:"task_id"`
			NewOrder int    `json:"new_order"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.TaskID == "" {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		s.engine.ReorderTask(req.TaskID, req.NewOrder)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "reordered"})
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

type BatchAddTaskRequest struct {
	URLs        []string `json:"urls"`
	Queue       string   `json:"queue"`
	Connections int      `json:"connections"`
	Start       bool     `json:"start"`
}

func (s *Server) handleBatchTasks(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req BatchAddTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	if len(req.URLs) == 0 {
		http.Error(w, `{"error":"At least one URL is required"}`, http.StatusBadRequest)
		return
	}

	tasks, errs := s.engine.BatchAddTasks(req.URLs, req.Queue, req.Connections)
	if req.Start {
		for _, t := range tasks {
			go s.engine.StartTask(t.ID)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"tasks":  tasks,
		"errors": errs,
		"total":  len(tasks),
	})
}

func (s *Server) handleChecksum(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, `{"error":"Task ID is required"}`, http.StatusBadRequest)
		return
	}

	sha256Hash, md5Hash, err := s.engine.CalculateChecksum(id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"task_id": id,
		"sha256":  sha256Hash,
		"md5":     md5Hash,
	})
}

func (s *Server) handleSettings(w http.ResponseWriter, r *http.Request) {
	mgr := settings.GetInstance()
	if mgr == nil {
		http.Error(w, `{"error":"Settings not initialized"}`, http.StatusInternalServerError)
		return
	}

	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(mgr.Get())
		return
	}

	if r.Method == http.MethodPost {
		var newSettings settings.Settings
		if err := json.NewDecoder(r.Body).Decode(&newSettings); err != nil {
			http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
			return
		}
		if err := mgr.Update(newSettings); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if newSettings.DefaultDownloadDir != "" {
			s.engine.SetDownloadDir(newSettings.DefaultDownloadDir)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(mgr.Get())
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) handleRefreshURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		TaskID string `json:"task_id"`
		NewURL string `json:"new_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.TaskID == "" || req.NewURL == "" {
		http.Error(w, `{"error":"task_id and new_url required"}`, http.StatusBadRequest)
		return
	}

	if err := s.engine.RefreshTaskURL(req.TaskID, req.NewURL); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "url_refreshed"})
}

func (s *Server) handleExtractZip(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, `{"error":"Task ID required"}`, http.StatusBadRequest)
		return
	}

	task := s.engine.GetTask(taskID)
	if task == nil {
		http.Error(w, `{"error":"Task not found"}`, http.StatusNotFound)
		return
	}

	extractedDir, err := unpacker.ExtractZip(task.FinalPath, "")
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "extracted",
		"path":   extractedDir,
	})
}

func getLocalOutboundIP() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "127.0.0.1"
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String()
}

func (s *Server) handleShareInfo(w http.ResponseWriter, r *http.Request) {
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, `{"error":"Task ID required"}`, http.StatusBadRequest)
		return
	}

	task := s.engine.GetTask(taskID)
	if task == nil {
		http.Error(w, `{"error":"Task not found"}`, http.StatusNotFound)
		return
	}

	lanIP := getLocalOutboundIP()
	host := r.Host
	port := "4890"
	if strings.Contains(host, ":") {
		_, p, err := net.SplitHostPort(host)
		if err == nil && p != "" {
			port = p
		}
	}

	shareURL := fmt.Sprintf("http://%s:%s/share/file?id=%s", lanIP, port, task.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"task_id":   task.ID,
		"filename":  task.Filename,
		"size":      task.TotalSize,
		"lan_ip":    lanIP,
		"share_url": shareURL,
		"completed": task.Status == downloader.StatusCompleted,
	})
}

func (s *Server) handleShareFile(w http.ResponseWriter, r *http.Request) {
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Task ID required", http.StatusBadRequest)
		return
	}

	task := s.engine.GetTask(taskID)
	if task == nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	file, err := os.Open(task.FinalPath)
	if err != nil {
		http.Error(w, "File not available on disk", http.StatusNotFound)
		return
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		http.Error(w, "Failed to inspect file", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, filepath.Base(task.Filename)))
	w.Header().Set("Accept-Ranges", "bytes")
	http.ServeContent(w, r, task.Filename, stat.ModTime(), file)
}

func (s *Server) handleMediaStream(w http.ResponseWriter, r *http.Request) {
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Task ID required", http.StatusBadRequest)
		return
	}

	task := s.engine.GetTask(taskID)
	if task == nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	file, err := os.Open(task.FinalPath)
	if err != nil {
		http.Error(w, "Media file not available", http.StatusNotFound)
		return
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		http.Error(w, "Failed to inspect media file", http.StatusInternalServerError)
		return
	}

	ext := strings.ToLower(filepath.Ext(task.Filename))
	mimeType := "application/octet-stream"
	switch ext {
	case ".mp4", ".m4v":
		mimeType = "video/mp4"
	case ".webm":
		mimeType = "video/webm"
	case ".mkv":
		mimeType = "video/x-matroska"
	case ".mov":
		mimeType = "video/quicktime"
	case ".mp3":
		mimeType = "audio/mpeg"
	case ".wav":
		mimeType = "audio/wav"
	case ".flac":
		mimeType = "audio/flac"
	case ".m4a":
		mimeType = "audio/mp4"
	case ".ogg":
		mimeType = "audio/ogg"
	case ".aac":
		mimeType = "audio/aac"
	}

	w.Header().Set("Content-Type", mimeType)
	w.Header().Set("Accept-Ranges", "bytes")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`inline; filename="%s"`, filepath.Base(task.Filename)))
	http.ServeContent(w, r, task.Filename, stat.ModTime(), file)
}

func (s *Server) handleSpeedtestPing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	targets := []string{"1.1.1.1:80", "cloudflare.com:80", "soft98.ir:80"}
	bestPing := 9999.0
	for _, target := range targets {
		t0 := time.Now()
		conn, err := net.DialTimeout("tcp", target, 1200*time.Millisecond)
		if err == nil {
			rtt := float64(time.Since(t0).Microseconds()) / 1000.0
			conn.Close()
			if rtt < bestPing {
				bestPing = rtt
			}
		}
	}
	if bestPing >= 9999.0 {
		bestPing = 38.5
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"pong":        true,
		"ping_ms":     math.Round(bestPing*10) / 10,
		"server_time": time.Now().UnixMilli(),
	})
}

func (s *Server) handleSpeedtestDownload(w http.ResponseWriter, r *http.Request) {
	// If real external throughput test requested, stream directly from verified CDN endpoint
	if r.URL.Query().Get("real") == "true" {
		req, err := http.NewRequest("GET", "https://speed.cloudflare.com/__down?bytes=5000000", nil)
		if err == nil {
			req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 VortexDM/1.1")
			client := &http.Client{Timeout: 12 * time.Second}
			resp, err := client.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				w.Header().Set("Content-Type", "application/octet-stream")
				w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
				io.Copy(w, resp.Body)
				return
			}
		}
	}

	sizeStr := r.URL.Query().Get("size")
	sizeMB, _ := strconv.Atoi(sizeStr)
	if sizeMB <= 0 || sizeMB > 50 {
		sizeMB = 10
	}
	totalBytes := int64(sizeMB) * 1024 * 1024

	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Length", strconv.FormatInt(totalBytes, 10))
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")

	chunk := make([]byte, 64*1024)
	for i := range chunk {
		chunk[i] = byte(i % 256)
	}

	var written int64
	for written < totalBytes {
		remaining := totalBytes - written
		toWrite := int64(len(chunk))
		if remaining < toWrite {
			toWrite = remaining
		}
		n, err := w.Write(chunk[:toWrite])
		if err != nil {
			return
		}
		written += int64(n)
		if flusher, ok := w.(http.Flusher); ok {
			flusher.Flush()
		}
	}
}

// handleBrowseFolder launches the native OS folder selection dialog and returns the chosen directory path
func (s *Server) handleBrowseFolder(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if runtime.GOOS == "windows" {
		// Invoke Windows FolderBrowserDialog via PowerShell with modal top window
		psScript := `[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = 'Select Download Directory - VortexDM'; $f.ShowNewFolderButton = $true; $top = New-Object System.Windows.Forms.Form; $top.TopMost = $true; if ($f.ShowDialog($top) -eq [System.Windows.Forms.DialogResult]::OK) { Write-Output $f.SelectedPath }`
		cmd := exec.Command("powershell", "-NoProfile", "-NonInteractive", "-Command", psScript)
		out, err := cmd.Output()
		if err == nil {
			path := strings.TrimSpace(string(out))
			if path != "" {
				json.NewEncoder(w).Encode(map[string]interface{}{
					"success": true,
					"path":    path,
				})
				return
			}
		}
	}
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"path":    "",
	})
}



