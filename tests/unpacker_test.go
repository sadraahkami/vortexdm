package tests

import (
	"archive/zip"
	"bytes"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/server"
	"github.com/sadraahkami/vortexdm/pkg/unpacker"
)

func createTestZip(t *testing.T, targetZipPath string) {
	buf := new(bytes.Buffer)
	w := zip.NewWriter(buf)

	// File 1 in root of archive
	f1, err := w.Create("hello.txt")
	if err != nil {
		t.Fatalf("Failed to create zip entry: %v", err)
	}
	f1.Write([]byte("Hello VortexDM!"))

	// File 2 in nested directory
	f2, err := w.Create("nested/document.pdf")
	if err != nil {
		t.Fatalf("Failed to create nested zip entry: %v", err)
	}
	f2.Write([]byte("%PDF-1.4 Mock PDF Content"))

	if err := w.Close(); err != nil {
		t.Fatalf("Failed to close zip writer: %v", err)
	}

	if err := os.WriteFile(targetZipPath, buf.Bytes(), 0644); err != nil {
		t.Fatalf("Failed to write zip file: %v", err)
	}
}

func TestZipExtractionAndZipSlipProtection(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_unpacker_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	zipPath := filepath.Join(tempDir, "archive.zip")
	createTestZip(t, zipPath)

	// 1. Normal Extraction
	extractDir := filepath.Join(tempDir, "output")
	resDir, err := unpacker.ExtractZip(zipPath, extractDir)
	if err != nil {
		t.Fatalf("ExtractZip failed: %v", err)
	}
	if resDir != extractDir {
		t.Errorf("Expected resDir %s, got %s", extractDir, resDir)
	}

	content1, err := os.ReadFile(filepath.Join(extractDir, "hello.txt"))
	if err != nil || string(content1) != "Hello VortexDM!" {
		t.Errorf("Extracted file content mismatch: %v, content: %s", err, string(content1))
	}

	content2, err := os.ReadFile(filepath.Join(extractDir, "nested", "document.pdf"))
	if err != nil || string(content2) != "%PDF-1.4 Mock PDF Content" {
		t.Errorf("Extracted nested file content mismatch: %v", err)
	}

	// 2. Test HTTP Endpoint POST /api/tasks/extract?id=...
	engine := downloader.NewEngine(tempDir, 2)
	defer engine.Close()

	task, err := engine.CreateTask("http://example.com/archive.zip", "archive.zip", "", 1)
	if err != nil {
		t.Fatalf("CreateTask failed: %v", err)
	}
	zipData, _ := os.ReadFile(zipPath)
	os.WriteFile(task.FinalPath, zipData, 0644)

	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	srv := server.NewServer(engine, sched, nil)
	handler := srv.SetupRoutes()

	req := httptest.NewRequest("POST", "/api/tasks/extract?id="+task.ID, nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK from extract endpoint, got %d: %s", w.Code, w.Body.String())
	}
}
