package tests

import (
	"testing"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
)

func TestSpeedLimiter(t *testing.T) {
	limiter := downloader.NewSpeedLimiter(100 * 1024) // 100 KB/s
	if limiter.GetLimit() != 100*1024 {
		t.Fatalf("expected 100KB/s limit, got %d", limiter.GetLimit())
	}

	start := time.Now()
	// Simulate reading 150 KB
	limiter.Throttle(150 * 1024)
	elapsed := time.Since(start)

	// Since limit is 100 KB/s and we requested 150 KB with bucket initially having 100 KB, deficit is 50 KB -> sleep ~0.5s
	if elapsed < 200*time.Millisecond {
		t.Errorf("limiter did not throttle adequately, elapsed: %v", elapsed)
	}

	// Test unthrottled
	limiter.SetLimit(0)
	start = time.Now()
	limiter.Throttle(1024 * 1024)
	if time.Since(start) > 50*time.Millisecond {
		t.Errorf("unlimited mode should not sleep")
	}
}
