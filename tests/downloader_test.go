package tests

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
)

func createRangeServer(payload []byte) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		totalLen := len(payload)
		w.Header().Set("Accept-Ranges", "bytes")
		w.Header().Set("Content-Disposition", "attachment; filename=\"testfile.dat\"")

		if r.Method == "HEAD" {
			w.Header().Set("Content-Length", strconv.Itoa(totalLen))
			w.WriteHeader(http.StatusOK)
			return
		}

		rangeHdr := r.Header.Get("Range")
		if rangeHdr == "" {
			w.Header().Set("Content-Length", strconv.Itoa(totalLen))
			w.WriteHeader(http.StatusOK)
			w.Write(payload)
			return
		}

		// Parse Range: bytes=start-end
		if strings.HasPrefix(rangeHdr, "bytes=") {
			parts := strings.Split(strings.TrimPrefix(rangeHdr, "bytes="), "-")
			start, _ := strconv.ParseInt(parts[0], 10, 64)
			end := int64(totalLen - 1)
			if len(parts) > 1 && parts[1] != "" {
				end, _ = strconv.ParseInt(parts[1], 10, 64)
			}
			if end >= int64(totalLen) {
				end = int64(totalLen - 1)
			}

			w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, totalLen))
			w.Header().Set("Content-Length", strconv.FormatInt(end-start+1, 10))
			w.WriteHeader(http.StatusPartialContent)
			w.Write(payload[start : end+1])
			return
		}

		w.WriteHeader(http.StatusBadRequest)
	}))
}

func TestMultiThreadedDownload(t *testing.T) {
	// 2 MB dummy data
	payloadSize := 2 * 1024 * 1024
	testData := make([]byte, payloadSize)
	rand.Read(testData)

	server := createRangeServer(testData)
	defer server.Close()

	tempDir := filepath.Join(os.TempDir(), fmt.Sprintf("vortex_test_%d", time.Now().UnixNano()))
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)

	engine := downloader.NewEngine(tempDir, 4)
	defer engine.Close()

	task, err := engine.CreateTask(server.URL, "testfile.dat", "", 4)
	if err != nil {
		t.Fatalf("CreateTask failed: %v", err)
	}

	if len(task.Chunks) != 4 {
		t.Fatalf("expected 4 chunks, got %d", len(task.Chunks))
	}

	if err := engine.StartTask(task.ID); err != nil {
		t.Fatalf("StartTask failed: %v", err)
	}

	// Wait for completion (up to 10 seconds)
	deadline := time.Now().Add(10 * time.Second)
	completed := false
	for time.Now().Before(deadline) {
		task = engine.GetTask(task.ID)
		if task.Status == downloader.StatusCompleted {
			completed = true
			break
		}
		if task.Status == downloader.StatusError {
			t.Fatalf("task entered error state: %s", task.ErrorMessage)
		}
		time.Sleep(100 * time.Millisecond)
	}

	if !completed {
		t.Fatalf("task did not complete in time, current status: %s, progress: %.2f%%", task.Status, task.ProgressPercent)
	}

	// Verify file integrity
	downloadedBytes, err := os.ReadFile(task.FinalPath)
	if err != nil {
		t.Fatalf("failed to read downloaded file: %v", err)
	}

	if !bytes.Equal(testData, downloadedBytes) {
		t.Fatalf("integrity check failed! Downloaded data does not match source")
	}

	// Test cleanup
	if err := engine.DeleteTask(task.ID, true); err != nil {
		t.Fatalf("DeleteTask failed: %v", err)
	}

	if _, err := os.Stat(task.FinalPath); !os.IsNotExist(err) {
		t.Errorf("file was not deleted after DeleteTask")
	}
}

func TestDuplicateTaskPreventionAndCustomDelete(t *testing.T) {
	testData := []byte("SAMPLE_DATA_FOR_DEDUPLICATION_TEST")
	server := createRangeServer(testData)
	defer server.Close()

	tempDir, err := os.MkdirTemp("", "vortex_dedup_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	engine := downloader.NewEngine(tempDir, 4)
	defer engine.Close()

	// 1. Create initial task
	task1, err := engine.CreateTask(server.URL, "file1.dat", tempDir, 2)
	if err != nil {
		t.Fatalf("CreateTask 1 failed: %v", err)
	}

	// 2. Attempt to create duplicate task with same URL while task1 is queued/active
	_, errDup := engine.CreateTask(server.URL, "file1_dup.dat", tempDir, 2)
	if errDup == nil {
		t.Fatalf("expected error when adding duplicate URL, but got nil")
	}

	// 3. Test DeleteTask with deleteFiles=false (preserves physical file)
	dummyPath := filepath.Join(tempDir, "file1.dat")
	if err := os.WriteFile(dummyPath, []byte("content"), 0644); err != nil {
		t.Fatalf("failed to write dummy file: %v", err)
	}

	if err := engine.DeleteTask(task1.ID, false); err != nil {
		t.Fatalf("DeleteTask failed: %v", err)
	}

	// Task should be removed from engine
	if engine.GetTask(task1.ID) != nil {
		t.Errorf("task was not removed from engine")
	}

	// Physical file should still exist
	if _, err := os.Stat(dummyPath); os.IsNotExist(err) {
		t.Errorf("physical file should NOT have been deleted when deleteFiles=false")
	}

	// 4. Now create task again (since old one was deleted) and delete with deleteFiles=true
	task2, err := engine.CreateTask(server.URL, "file1.dat", tempDir, 2)
	if err != nil {
		t.Fatalf("CreateTask 2 failed: %v", err)
	}

	if err := engine.DeleteTask(task2.ID, true); err != nil {
		t.Fatalf("DeleteTask 2 failed: %v", err)
	}

	if _, err := os.Stat(dummyPath); !os.IsNotExist(err) {
		t.Errorf("physical file SHOULD have been deleted when deleteFiles=true")
	}
}

