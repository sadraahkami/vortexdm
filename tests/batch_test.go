package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/server"
)

func TestBatchAddTasksAndAPI(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_batch_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Length", "1024")
		w.WriteHeader(http.StatusOK)
		w.Write(make([]byte, 1024))
	}))
	defer mockServer.Close()

	engine := downloader.NewEngine(tempDir, 4)
	defer engine.Close()

	urls := []string{
		mockServer.URL + "/file1.zip",
		mockServer.URL + "/file2.iso",
		mockServer.URL + "/file3.mp4",
	}

	// 1. Direct Engine BatchAddTasks
	tasks, errs := engine.BatchAddTasks(urls, "night", 4)
	if len(errs) > 0 {
		t.Errorf("Unexpected batch add errors: %v", errs)
	}
	if len(tasks) != 3 {
		t.Fatalf("Expected 3 tasks created, got %d", len(tasks))
	}
	for _, tsk := range tasks {
		if tsk.Queue != "night" {
			t.Errorf("Expected queue 'night', got '%s'", tsk.Queue)
		}
	}

	// 2. HTTP Endpoint POST /api/tasks/batch
	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	srv := server.NewServer(engine, sched, nil)
	handler := srv.SetupRoutes()

	reqBody, _ := json.Marshal(server.BatchAddTaskRequest{
		URLs:        []string{mockServer.URL + "/api_file1.bin", mockServer.URL + "/api_file2.bin"},
		Queue:       "custom-work",
		Connections: 8,
		Start:       false,
	})

	req := httptest.NewRequest("POST", "/api/tasks/batch", bytes.NewReader(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Expected 201 Created for batch endpoint, got %d: %s", w.Code, w.Body.String())
	}

	var resp struct {
		Tasks []*downloader.Task `json:"tasks"`
		Total int                `json:"total"`
	}
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	if resp.Total != 2 || len(resp.Tasks) != 2 {
		t.Fatalf("Expected 2 tasks in response, got %d", resp.Total)
	}
}
