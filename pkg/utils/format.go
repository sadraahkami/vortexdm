package utils

import (
	"fmt"
	"math"
)

// FormatBytes formats a byte count into a human-readable string (B, KB, MB, GB).
func FormatBytes(b int64) string {
	if b <= 0 {
		return "0 B"
	}
	const unit = 1024
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	sizes := []string{"KB", "MB", "GB", "TB", "PB"}
	return fmt.Sprintf("%.2f %s", float64(b)/float64(div), sizes[exp])
}

// FormatSpeed formats transfer rate into a human-readable string (e.g., 4.25 MB/s).
func FormatSpeed(bytesPerSec float64) string {
	if bytesPerSec <= 0 {
		return "0 B/s"
	}
	if bytesPerSec < 1024 {
		return fmt.Sprintf("%.1f B/s", bytesPerSec)
	} else if bytesPerSec < 1024*1024 {
		return fmt.Sprintf("%.1f KB/s", bytesPerSec/1024.0)
	} else if bytesPerSec < 1024*1024*1024 {
		return fmt.Sprintf("%.2f MB/s", bytesPerSec/(1024.0*1024.0))
	}
	return fmt.Sprintf("%.2f GB/s", bytesPerSec/(1024.0*1024.0*1024.0))
}

// FormatDuration formats seconds into a human-readable countdown (e.g., 01:24 or 02h 15m).
func FormatDuration(seconds int64) string {
	if seconds <= 0 || math.IsInf(float64(seconds), 1) {
		return "--:--"
	}
	if seconds < 60 {
		return fmt.Sprintf("00:%02d", seconds)
	}
	m := seconds / 60
	s := seconds % 60
	if m < 60 {
		return fmt.Sprintf("%02d:%02d", m, s)
	}
	h := m / 60
	m = m % 60
	return fmt.Sprintf("%02dh %02dm", h, m)
}
