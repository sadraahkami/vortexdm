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

func TestRefreshExpiredTaskURL(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_refresh_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	// Mock Server 1: Original URL (simulating 2048 byte file)
	mockServer1 := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Length", "2048")
		w.Header().Set("Accept-Ranges", "bytes")
		w.WriteHeader(http.StatusOK)
		w.Write(make([]byte, 2048))
	}))
	defer mockServer1.Close()

	// Mock Server 2: Renewed URL with matching 2048 byte file
	mockServer2 := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Length", "2048")
		w.Header().Set("Accept-Ranges", "bytes")
		w.WriteHeader(http.StatusOK)
		w.Write(make([]byte, 2048))
	}))
	defer mockServer2.Close()

	// Mock Server 3: Mismatched size URL (1024 bytes)
	mockServer3 := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Length", "1024")
		w.Header().Set("Accept-Ranges", "bytes")
		w.WriteHeader(http.StatusOK)
		w.Write(make([]byte, 1024))
	}))
	defer mockServer3.Close()

	engine := downloader.NewEngine(tempDir, 2)
	defer engine.Close()

	task, err := engine.CreateTask(mockServer1.URL+"/expired_file.iso", "expired_file.iso", "", 2)
	if err != nil {
		t.Fatalf("CreateTask failed: %v", err)
	}

	// 1. Refresh should fail if size mismatches
	err = engine.RefreshTaskURL(task.ID, mockServer3.URL+"/mismatched.iso")
	if err == nil {
		t.Errorf("Expected error for mismatched size, got nil")
	}

	// 2. Refresh should succeed with matching server
	err = engine.RefreshTaskURL(task.ID, mockServer2.URL+"/fresh_token_file.iso")
	if err != nil {
		t.Fatalf("RefreshTaskURL failed unexpectedly: %v", err)
	}

	refreshedTask := engine.GetTask(task.ID)
	if refreshedTask.URL != mockServer2.URL+"/fresh_token_file.iso" {
		t.Errorf("URL was not updated, got %s", refreshedTask.URL)
	}

	// 3. Test HTTP Endpoint POST /api/tasks/refresh-url
	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	srv := server.NewServer(engine, sched, nil)
	handler := srv.SetupRoutes()

	reqBody, _ := json.Marshal(map[string]string{
		"task_id": task.ID,
		"new_url": mockServer1.URL+"/renewed_again.iso",
	})
	req := httptest.NewRequest("POST", "/api/tasks/refresh-url", bytes.NewReader(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK from refresh-url endpoint, got %d: %s", w.Code, w.Body.String())
	}
}
