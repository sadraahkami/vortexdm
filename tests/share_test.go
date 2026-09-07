package tests

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/server"
)

func TestShareInfoAndFileDownload(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_share_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	testFilePath := filepath.Join(tempDir, "shared_test_video.mp4")
	testData := []byte("VORTEXDM_SAMPLE_VIDEO_CONTENT_BYTES_FOR_TESTING_PURPOSES_1234567890")
	if err := os.WriteFile(testFilePath, testData, 0644); err != nil {
		t.Fatalf("failed to write test file: %v", err)
	}

	eng := downloader.NewEngine(tempDir, 2)
	srv := server.NewServer(eng, nil, nil)
	handler := srv.SetupRoutes()

	// Manually inject task
	task, err := eng.CreateTask("http://example.com/shared_test_video.mp4", "shared_test_video.mp4", "", 1)
	if err != nil {
		t.Fatalf("failed to create task: %v", err)
	}
	task.FinalPath = testFilePath
	task.TotalSize = int64(len(testData))

	// 1. Test /api/share/info
	req := httptest.NewRequest("GET", "/api/share/info?id="+task.ID, nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rec.Code, rec.Body.String())
	}

	var info map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &info); err != nil {
		t.Fatalf("failed to parse share info JSON: %v", err)
	}
	if info["task_id"] != task.ID {
		t.Errorf("expected task_id %s, got %v", task.ID, info["task_id"])
	}
	if info["share_url"] == nil || info["share_url"] == "" {
		t.Errorf("expected non-empty share_url")
	}

	// 2. Test /share/file
	reqDownload := httptest.NewRequest("GET", "/share/file?id="+task.ID, nil)
	recDownload := httptest.NewRecorder()
	handler.ServeHTTP(recDownload, reqDownload)

	if recDownload.Code != http.StatusOK {
		t.Fatalf("expected status 200 for file download, got %d", recDownload.Code)
	}
	if recDownload.Body.String() != string(testData) {
		t.Errorf("file download content mismatch")
	}

	// 3. Test /api/media/stream with Range header
	reqStream := httptest.NewRequest("GET", "/api/media/stream?id="+task.ID, nil)
	reqStream.Header.Set("Range", "bytes=0-7")
	recStream := httptest.NewRecorder()
	handler.ServeHTTP(recStream, reqStream)

	if recStream.Code != http.StatusPartialContent {
		t.Fatalf("expected status 206 Partial Content, got %d", recStream.Code)
	}
	if recStream.Header().Get("Content-Type") != "video/mp4" {
		t.Errorf("expected Content-Type video/mp4, got %s", recStream.Header().Get("Content-Type"))
	}
	if recStream.Body.String() != string(testData[:8]) {
		t.Errorf("expected range bytes '%s', got '%s'", string(testData[:8]), recStream.Body.String())
	}
}

func TestSpeedtestEndpoints(t *testing.T) {
	eng := downloader.NewEngine("", 2)
	srv := server.NewServer(eng, nil, nil)
	handler := srv.SetupRoutes()

	// 1. Test /api/speedtest/ping
	reqPing := httptest.NewRequest("GET", "/api/speedtest/ping", nil)
	recPing := httptest.NewRecorder()
	handler.ServeHTTP(recPing, reqPing)

	if recPing.Code != http.StatusOK {
		t.Fatalf("expected 200 for ping, got %d", recPing.Code)
	}
	var pingResp map[string]interface{}
	if err := json.Unmarshal(recPing.Body.Bytes(), &pingResp); err != nil {
		t.Fatalf("failed to decode ping resp: %v", err)
	}
	if pingResp["pong"] != true {
		t.Errorf("expected pong: true")
	}

	// 2. Test /api/speedtest/download?size=1
	reqDL := httptest.NewRequest("GET", "/api/speedtest/download?size=1", nil)
	recDL := httptest.NewRecorder()
	handler.ServeHTTP(recDL, reqDL)

	if recDL.Code != http.StatusOK {
		t.Fatalf("expected 200 for speedtest download, got %d", recDL.Code)
	}
	bodyBytes, err := io.ReadAll(recDL.Body)
	if err != nil {
		t.Fatalf("failed to read speedtest payload: %v", err)
	}
	expectedLen := 1 * 1024 * 1024
	if len(bodyBytes) != expectedLen {
		t.Errorf("expected %d bytes, got %d", expectedLen, len(bodyBytes))
	}
}
