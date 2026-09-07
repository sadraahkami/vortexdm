package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/server"
	"github.com/sadraahkami/vortexdm/pkg/settings"
)

func TestSettingsManagement(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_settings_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	mgr := settings.Init(tempDir)
	if mgr == nil {
		t.Fatal("Settings.Init returned nil")
	}

	// 1. Check default settings
	initial := mgr.Get()
	if initial.UIMode != "simple" {
		t.Errorf("Expected default UIMode 'simple', got '%s'", initial.UIMode)
	}
	if !initial.SoundEnabled {
		t.Errorf("Expected default SoundEnabled true")
	}

	// 2. Update settings
	customDownloads := filepath.Join(tempDir, "my_custom_downloads")
	err = mgr.Update(settings.Settings{
		DefaultDownloadDir: customDownloads,
		SoundEnabled:       false,
		AutoExtractZip:     true,
		UIMode:             "pro",
	})
	if err != nil {
		t.Fatalf("Update settings returned error: %v", err)
	}

	updated := mgr.Get()
	if updated.DefaultDownloadDir != customDownloads {
		t.Errorf("Expected updated dir '%s', got '%s'", customDownloads, updated.DefaultDownloadDir)
	}
	if updated.SoundEnabled != false {
		t.Errorf("Expected SoundEnabled false")
	}
	if updated.AutoExtractZip != true {
		t.Errorf("Expected AutoExtractZip true")
	}
	if updated.UIMode != "pro" {
		t.Errorf("Expected UIMode 'pro'")
	}

	// 3. Test HTTP Endpoints GET & POST /api/settings
	engine := downloader.NewEngine(tempDir, 2)
	defer engine.Close()

	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	srv := server.NewServer(engine, sched, nil)
	handler := srv.SetupRoutes()

	// GET
	reqGet := httptest.NewRequest("GET", "/api/settings", nil)
	wGet := httptest.NewRecorder()
	handler.ServeHTTP(wGet, reqGet)
	if wGet.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK for GET /api/settings, got %d", wGet.Code)
	}

	var fetched settings.Settings
	json.NewDecoder(wGet.Body).Decode(&fetched)
	if fetched.UIMode != "pro" {
		t.Errorf("Expected fetched UIMode 'pro', got '%s'", fetched.UIMode)
	}

	// POST
	newPayload, _ := json.Marshal(settings.Settings{
		DefaultDownloadDir: tempDir,
		SoundEnabled:       true,
		AutoExtractZip:     false,
		UIMode:             "simple",
	})
	reqPost := httptest.NewRequest("POST", "/api/settings", bytes.NewReader(newPayload))
	reqPost.Header.Set("Content-Type", "application/json")
	wPost := httptest.NewRecorder()
	handler.ServeHTTP(wPost, reqPost)
	if wPost.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK for POST /api/settings, got %d", wPost.Code)
	}

	if mgr.Get().UIMode != "simple" {
		t.Errorf("Expected manager updated to 'simple'")
	}
}
