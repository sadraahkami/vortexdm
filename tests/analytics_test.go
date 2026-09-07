package tests

import (
	"os"
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/analytics"
)

func TestTrafficAnalytics(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "vortex_analytics_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	a := analytics.InitAnalytics(tempDir)
	if a == nil {
		t.Fatalf("InitAnalytics returned nil")
	}

	a.ResetCycle()

	// Record domestic (نیم‌بها) download: 100 MB
	a.RecordDownload(100*1024*1024, true, "file_iran.zip")

	// Record international (تمام‌بها) download: 50 MB
	a.RecordDownload(50*1024*1024, false, "file_intl.zip")

	summary := a.GetSummary()

	expectedTotal := int64(150 * 1024 * 1024)
	if summary.TotalBytes != expectedTotal {
		t.Errorf("Expected TotalBytes %d, got %d", expectedTotal, summary.TotalBytes)
	}

	expectedDomestic := int64(100 * 1024 * 1024)
	if summary.DomesticBytes != expectedDomestic {
		t.Errorf("Expected DomesticBytes %d, got %d", expectedDomestic, summary.DomesticBytes)
	}

	expectedIntl := int64(50 * 1024 * 1024)
	if summary.InternationalBytes != expectedIntl {
		t.Errorf("Expected InternationalBytes %d, got %d", expectedIntl, summary.InternationalBytes)
	}

	expectedSavings := int64(50 * 1024 * 1024) // 100 MB / 2
	if summary.SavedBytes != expectedSavings {
		t.Errorf("Expected SavedBytes %d, got %d", expectedSavings, summary.SavedBytes)
	}

	if len(summary.RecentLogs) != 2 {
		t.Errorf("Expected 2 recent logs, got %d", len(summary.RecentLogs))
	}

	// Test Reset
	a.ResetCycle()
	emptySummary := a.GetSummary()
	if emptySummary.TotalBytes != 0 || emptySummary.DomesticBytes != 0 {
		t.Errorf("Expected reset total 0, got %d", emptySummary.TotalBytes)
	}
}
