package tests

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/server"
)

func TestServerEndpointsAndAssets(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_srv_test_*")
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

	// Test 1: Root index.html serving
	req := httptest.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /, got %d", w.Code)
	}
	body := w.Body.String()
	if !strings.Contains(body, "favicon.ico") {
		t.Errorf("Root index.html missing favicon.ico link")
	}
	if !strings.Contains(body, "manifest.json") {
		t.Errorf("Root index.html missing manifest.json link")
	}
	if !strings.Contains(body, `name="color-scheme" content="dark"`) {
		t.Errorf("Root index.html missing dark color-scheme meta tag")
	}

	// Test 2: Favicon serving
	reqFav := httptest.NewRequest("GET", "/favicon.ico", nil)
	wFav := httptest.NewRecorder()
	handler.ServeHTTP(wFav, reqFav)
	if wFav.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /favicon.ico, got %d", wFav.Code)
	}

	// Test 3: Manifest serving
	reqMan := httptest.NewRequest("GET", "/manifest.json", nil)
	wMan := httptest.NewRecorder()
	handler.ServeHTTP(wMan, reqMan)
	if wMan.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /manifest.json, got %d", wMan.Code)
	}

	// Test 4: Window minimize endpoint
	reqMin := httptest.NewRequest("POST", "/api/window/minimize", nil)
	wMin := httptest.NewRecorder()
	handler.ServeHTTP(wMin, reqMin)
	if wMin.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /api/window/minimize, got %d", wMin.Code)
	}

	// Test 5: Folder browser endpoint
	reqBrowse := httptest.NewRequest("GET", "/api/dialog/browse-folder", nil)
	wBrowse := httptest.NewRecorder()
	handler.ServeHTTP(wBrowse, reqBrowse)
	if wBrowse.Code != http.StatusOK {
		t.Errorf("Expected 200 OK for /api/dialog/browse-folder, got %d", wBrowse.Code)
	}
	if !strings.Contains(wBrowse.Body.String(), `"path":`) {
		t.Errorf("Browse folder response missing path field: %s", wBrowse.Body.String())
	}
}
