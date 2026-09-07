package downloader

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/utils"
)

type TaskStatus string

const (
	StatusQueued      TaskStatus = "queued"
	StatusDownloading TaskStatus = "downloading"
	StatusPaused      TaskStatus = "paused"
	StatusCompleted   TaskStatus = "completed"
	StatusError       TaskStatus = "error"
)

type Task struct {
	ID                string        `json:"id"`
	URL               string        `json:"url"`
	Filename          string        `json:"filename"`
	Category          string        `json:"category"`
	DestinationDir    string        `json:"destination_dir"`
	FinalPath         string        `json:"final_path"`
	TotalSize         int64         `json:"total_size"`
	DownloadedSize    int64         `json:"downloaded"`
	SpeedBytesPerSec  float64       `json:"speed"`
	FormattedSpeed    string        `json:"formatted_speed"`
	FormattedTotal    string        `json:"formatted_total"`
	FormattedProgress string        `json:"formatted_progress"`
	ProgressPercent   float64       `json:"progress"`
	ETA               string        `json:"eta"`
	Status            TaskStatus    `json:"status"`
	ErrorMessage      string        `json:"error_message,omitempty"`
	SupportsRange     bool          `json:"resumable"`
	NumConnections    int           `json:"connections"`
	Chunks            []*Chunk      `json:"chunks"`
	CreatedAt         time.Time     `json:"created_at"`
	CompletedAt       *time.Time    `json:"completed_at,omitempty"`

	// Runtime control fields
	mu         sync.RWMutex
	cancelFunc context.CancelFunc
}

func (t *Task) StateFilePath() string {
	return filepath.Join(t.DestinationDir, t.Filename+".vortex")
}

func (t *Task) SaveState() error {
	t.mu.RLock()
	defer t.mu.RUnlock()

	data, err := json.MarshalIndent(t, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(t.StateFilePath(), data, 0644)
}

func LoadTaskFromState(statePath string) (*Task, error) {
	data, err := os.ReadFile(statePath)
	if err != nil {
		return nil, err
	}
	var t Task
	if err := json.Unmarshal(data, &t); err != nil {
		return nil, err
	}
	return &t, nil
}

func (t *Task) UpdateProgressStats(speed float64) {
	t.mu.Lock()
	defer t.mu.Unlock()

	var downloaded int64
	for _, c := range t.Chunks {
		downloaded += c.Downloaded
	}
	t.DownloadedSize = downloaded
	t.SpeedBytesPerSec = speed

	if t.TotalSize > 0 {
		t.ProgressPercent = float64(t.DownloadedSize) / float64(t.TotalSize) * 100.0
		if t.ProgressPercent > 100.0 {
			t.ProgressPercent = 100.0
		}

		if speed > 0 {
			remainingBytes := t.TotalSize - t.DownloadedSize
			if remainingBytes > 0 {
				etaSecs := int64(float64(remainingBytes) / speed)
				t.ETA = utils.FormatDuration(etaSecs)
			} else {
				t.ETA = "00:00"
			}
		} else {
			t.ETA = "--:--"
		}
	} else {
		t.ProgressPercent = 0.0
		t.ETA = "--:--"
	}

	t.FormattedSpeed = utils.FormatSpeed(speed)
	t.FormattedTotal = utils.FormatBytes(t.TotalSize)
	t.FormattedProgress = utils.FormatBytes(t.DownloadedSize)
}
