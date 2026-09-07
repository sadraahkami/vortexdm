package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/traffic"
)

type Server struct {
	engine   *downloader.Engine
	sched    *scheduler.Scheduler
	staticFS http.FileSystem
	clients  map[chan []byte]bool
	clientMu sync.Mutex
}

type AddTaskRequest struct {
	URL         string `json:"url"`
	Filename    string `json:"filename"`
	Connections int    `json:"connections"`
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

		task, err := s.engine.CreateTask(req.URL, req.Filename, req.Connections)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
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

