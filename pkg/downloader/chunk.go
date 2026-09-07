package downloader

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync/atomic"
)

// Chunk represents an individual segment of a multi-threaded download.
type Chunk struct {
	Index        int   `json:"index"`
	StartOffset  int64 `json:"start_offset"`
	EndOffset    int64 `json:"end_offset"`
	Downloaded   int64 `json:"downloaded"`
	Total        int64 `json:"total"`
	Size         int64 `json:"size"`
	Completed    bool  `json:"completed"`
}

// DownloadChunk downloads an individual chunk via HTTP Range request and writes to file with WriteAt.
func (c *Chunk) DownloadChunk(
	ctx context.Context,
	client *http.Client,
	url string,
	file *os.File,
	onBytesRead func(n int),
) error {
	if c.Completed || (c.Downloaded >= c.Total && c.Total > 0) {
		c.Completed = true
		return nil
	}

	startByte := c.StartOffset + c.Downloaded
	endByte := c.EndOffset

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return err
	}

	// Add Range header
	rangeHeader := fmt.Sprintf("bytes=%d-%d", startByte, endByte)
	req.Header.Set("Range", rangeHeader)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VortexDM/1.0")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusPartialContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code for range %s: %d", rangeHeader, resp.StatusCode)
	}

	buffer := make([]byte, 32*1024) // 32 KB buffer
	currentWritePos := startByte

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		n, readErr := resp.Body.Read(buffer)
		if n > 0 {
			_, writeErr := file.WriteAt(buffer[:n], currentWritePos)
			if writeErr != nil {
				return fmt.Errorf("failed to write to file at offset %d: %w", currentWritePos, writeErr)
			}

			currentWritePos += int64(n)
			atomic.AddInt64(&c.Downloaded, int64(n))

			if onBytesRead != nil {
				onBytesRead(n)
			}
		}

		if readErr != nil {
			if readErr == io.EOF {
				break
			}
			return readErr
		}
	}

	if c.Downloaded >= c.Total {
		c.Completed = true
	}

	return nil
}
