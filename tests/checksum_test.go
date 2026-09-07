package tests

import (
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/scheduler"
	"github.com/sadraahkami/vortexdm/pkg/server"
)

func TestChecksumVerification(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_checksum_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	content := []byte("VortexDM High Performance Download Manager Checksum Test Data 2026")
	hSha := sha256.Sum256(content)
	expectedSha256 := hex.EncodeToString(hSha[:])
	hMd5 := md5.Sum(content)
	expectedMd5 := hex.EncodeToString(hMd5[:])

	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Length", "66")
		w.WriteHeader(http.StatusOK)
		w.Write(content)
	}))
	defer mockServer.Close()

	engine := downloader.NewEngine(tempDir, 2)
	defer engine.Close()

	task, err := engine.CreateTask(mockServer.URL+"/test_checksum.iso", "test_checksum.iso", "", 1)
	if err != nil {
		t.Fatalf("Failed to create task: %v", err)
	}

	// Write mock payload to final file to simulate completed download
	if err := os.WriteFile(task.FinalPath, content, 0644); err != nil {
		t.Fatalf("Failed to write mock completed file: %v", err)
	}

	// 1. Direct Engine Checksum Calculation
	shaResult, md5Result, err := engine.CalculateChecksum(task.ID)
	if err != nil {
		t.Fatalf("CalculateChecksum returned error: %v", err)
	}
	if shaResult != expectedSha256 {
		t.Errorf("Expected SHA-256 %s, got %s", expectedSha256, shaResult)
	}
	if md5Result != expectedMd5 {
		t.Errorf("Expected MD5 %s, got %s", expectedMd5, md5Result)
	}

	// 2. HTTP Endpoint GET /api/tasks/checksum?id=...
	sched := scheduler.NewScheduler(tempDir, engine.StartQueue, engine.PauseQueue, engine.IsQueueDone)
	defer sched.Close()

	srv := server.NewServer(engine, sched, nil)
	handler := srv.SetupRoutes()

	req := httptest.NewRequest("GET", "/api/tasks/checksum?id="+task.ID, nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK from checksum endpoint, got %d: %s", w.Code, w.Body.String())
	}

	var resp struct {
		TaskID string `json:"task_id"`
		SHA256 string `json:"sha256"`
		MD5    string `json:"md5"`
	}
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("Failed to parse checksum response: %v", err)
	}
	if resp.SHA256 != expectedSha256 || resp.MD5 != expectedMd5 {
		t.Errorf("Mismatch in API response: sha256=%s, md5=%s", resp.SHA256, resp.MD5)
	}
}
