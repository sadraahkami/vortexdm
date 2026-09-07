package scheduler

import (
	"encoding/json"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"sync"
	"time"
)

type QueueConfig struct {
	Name            string `json:"name"`
	Enabled         bool   `json:"enabled"`
	StartTime       string `json:"start_time"`       // "02:00"
	StopTime        string `json:"stop_time"`        // "07:30"
	Days            []int  `json:"days"`             // 0=Sun, 1=Mon, ..., 6=Sat
	ShutdownOnDone  bool   `json:"shutdown_on_done"` // Turn off computer when finished
	SleepOnDone     bool   `json:"sleep_on_done"`
	ExitAppOnDone   bool   `json:"exit_on_done"`
	MaxConcurrent   int    `json:"max_concurrent"`
	OneTimeOnly     bool   `json:"one_time_only"`
}

type SchedulerConfig struct {
	MainQueue  QueueConfig `json:"main_queue"`
	NightQueue QueueConfig `json:"night_queue"`
}

type Scheduler struct {
	config     SchedulerConfig
	configPath string
	mu         sync.RWMutex
	stopChan   chan struct{}
	onStart    func(queueName string)
	onPause    func(queueName string)
	isQueueDone func(queueName string) bool
}

func NewScheduler(configDir string, onStart, onPause func(string), isQueueDone func(string) bool) *Scheduler {
	cfgFile := filepath.Join(configDir, "scheduler.json")
	s := &Scheduler{
		configPath:  cfgFile,
		stopChan:    make(chan struct{}),
		onStart:     onStart,
		onPause:     onPause,
		isQueueDone: isQueueDone,
		config: SchedulerConfig{
			MainQueue: QueueConfig{
				Name:          "main",
				Enabled:       false,
				StartTime:     "01:00",
				StopTime:      "07:00",
				Days:          []int{0, 1, 2, 3, 4, 5, 6},
				MaxConcurrent: 2,
			},
			NightQueue: QueueConfig{
				Name:           "night",
				Enabled:        false,
				StartTime:      "02:00",
				StopTime:       "07:30",
				Days:           []int{0, 1, 2, 3, 4, 5, 6},
				ShutdownOnDone: false,
				MaxConcurrent:  1,
			},
		},
	}

	s.load()
	go s.runLoop()
	return s
}

func (s *Scheduler) Close() {
	close(s.stopChan)
}

func (s *Scheduler) GetConfig() SchedulerConfig {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.config
}

func (s *Scheduler) SaveConfig(cfg SchedulerConfig) error {
	s.mu.Lock()
	s.config = cfg
	s.mu.Unlock()

	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.configPath, data, 0644)
}

func (s *Scheduler) load() {
	data, err := os.ReadFile(s.configPath)
	if err != nil {
		return
	}
	var cfg SchedulerConfig
	if err := json.Unmarshal(data, &cfg); err == nil {
		s.config = cfg
	}
}

func (s *Scheduler) runLoop() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	var lastCheckedMinute string

	for {
		select {
		case <-s.stopChan:
			return
		case now := <-ticker.C:
			currentMinute := now.Format("15:04")
			if currentMinute == lastCheckedMinute {
				continue
			}
			lastCheckedMinute = currentMinute

			currentDay := int(now.Weekday())

			s.mu.RLock()
			queues := []QueueConfig{s.config.MainQueue, s.config.NightQueue}
			s.mu.RUnlock()

			for _, q := range queues {
				if !q.Enabled {
					continue
				}

				dayMatched := false
				for _, d := range q.Days {
					if d == currentDay {
						dayMatched = true
						break
					}
				}
				if !dayMatched && len(q.Days) > 0 {
					continue
				}

				// Check start time
				if currentMinute == q.StartTime {
					log.Printf("[Scheduler] Triggering start for queue: %s at %s", q.Name, currentMinute)
					if s.onStart != nil {
						s.onStart(q.Name)
					}
				}

				// Check stop time
				if currentMinute == q.StopTime {
					log.Printf("[Scheduler] Triggering pause for queue: %s at %s", q.Name, currentMinute)
					if s.onPause != nil {
						s.onPause(q.Name)
					}
				}

				// Check completion actions
				if (q.ShutdownOnDone || q.SleepOnDone || q.ExitAppOnDone) && s.isQueueDone != nil {
					if s.isQueueDone(q.Name) {
						s.executePostAction(q)
					}
				}
			}
		}
	}
}

func (s *Scheduler) executePostAction(q QueueConfig) {
	log.Printf("[Scheduler] Queue %s finished. Executing post-download action...", q.Name)

	if q.ShutdownOnDone {
		if runtime.GOOS == "windows" {
			exec.Command("shutdown", "/s", "/t", "60", "/c", "VortexDM: All scheduled downloads complete. System will shut down in 60s.").Start()
		} else {
			exec.Command("shutdown", "-h", "+1").Start()
		}
		return
	}

	if q.SleepOnDone {
		if runtime.GOOS == "windows" {
			exec.Command("rundll32.exe", "powrprof.dll,SetSuspendState", "0,1,0").Start()
		}
		return
	}

	if q.ExitAppOnDone {
		os.Exit(0)
	}
}
