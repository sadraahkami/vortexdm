package tests

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/server"
)

func TestCustomQueuesAndReordering(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_queue_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	engine := downloader.NewEngine(tempDir, 4)
	defer engine.Close()

	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	// 1. Add Custom Queue
	customQ := &scheduler.QueueConfig{
		Name:          "movies",
		Enabled:       true,
		StartTime:     "03:00",
		StopTime:      "06:00",
		Days:          []int{1, 2, 3},
		MaxConcurrent: 1,
	}

	if err := sched.AddOrUpdateCustomQueue("movies", customQ); err != nil {
		t.Fatalf("Failed to add custom queue: %v", err)
	}

	cfg := sched.GetConfig()
	if _, ok := cfg.CustomQueues["movies"]; !ok {
		t.Errorf("Custom queue 'movies' not found in config")
	}

	// 2. Delete Custom Queue
	if err := sched.DeleteCustomQueue("movies"); err != nil {
		t.Fatalf("Failed to delete custom queue: %v", err)
	}
	cfgAfter := sched.GetConfig()
	if _, ok := cfgAfter.CustomQueues["movies"]; ok {
		t.Errorf("Custom queue 'movies' should have been deleted")
	}
}

func TestQueueStartAndPauseEndpoints(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_q_api_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	engine := downloader.NewEngine(tempDir, 4)
	defer engine.Close()

	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	srv := server.NewServer(engine, sched, http.Dir("../ui"))
	handler := srv.SetupRoutes()

	// Test Start Queue endpoint
	reqStart := httptest.NewRequest(http.MethodPost, "/api/queues/start?queue=main", nil)
	wStart := httptest.NewRecorder()
	handler.ServeHTTP(wStart, reqStart)
	if wStart.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /api/queues/start, got %d", wStart.Code)
	}

	// Test Pause Queue endpoint
	reqPause := httptest.NewRequest(http.MethodPost, "/api/queues/pause?queue=main", nil)
	wPause := httptest.NewRecorder()
	handler.ServeHTTP(wPause, reqPause)
	if wPause.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /api/queues/pause, got %d", wPause.Code)
	}
}
