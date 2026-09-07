package analytics

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type LogEntry struct {
	Filename    string    `json:"filename"`
	Bytes       int64     `json:"bytes"`
	IsDomestic  bool      `json:"is_domestic"`
	Timestamp   time.Time `json:"timestamp"`
}

type HourBucket struct {
	Hour          string `json:"hour"` // "14:00"
	Domestic      int64  `json:"domestic"`
	International int64  `json:"international"`
	Total         int64  `json:"total"`
}

type DayBucket struct {
	Date          string `json:"date"` // "2026-09-07"
	Domestic      int64  `json:"domestic"`
	International int64  `json:"international"`
	Total         int64  `json:"total"`
}

type AnalyticsData struct {
	CycleStart         time.Time            `json:"cycle_start"`
	TotalBytes         int64                `json:"total_bytes"`
	DomesticBytes      int64                `json:"domestic_bytes"`
	InternationalBytes int64                `json:"international_bytes"`
	SavedBytes         int64                `json:"saved_bytes"`
	Hourly             map[string]*HourBucket `json:"hourly"` // Key: "YYYY-MM-DD-HH"
	Daily              map[string]*DayBucket  `json:"daily"`  // Key: "YYYY-MM-DD"
	RecentLogs         []LogEntry           `json:"recent_logs"`
}

type Analytics struct {
	data     AnalyticsData
	filePath string
	mu       sync.RWMutex
	dirty    bool
}

var (
	instance *Analytics
	once     sync.Once
)

func InitAnalytics(dataDir string) *Analytics {
	once.Do(func() {
		fp := filepath.Join(dataDir, "traffic_analytics.json")
		instance = &Analytics{
			filePath: fp,
			data: AnalyticsData{
				CycleStart: time.Now(),
				Hourly:     make(map[string]*HourBucket),
				Daily:      make(map[string]*DayBucket),
				RecentLogs: make([]LogEntry, 0),
			},
		}
		instance.load()
		go instance.saveLoop()
	})
	return instance
}

func GetAnalytics() *Analytics {
	return instance
}

func (a *Analytics) load() {
	a.mu.Lock()
	defer a.mu.Unlock()

	data, err := os.ReadFile(a.filePath)
	if err == nil {
		var d AnalyticsData
		if err := json.Unmarshal(data, &d); err == nil {
			if d.Hourly == nil {
				d.Hourly = make(map[string]*HourBucket)
			}
			if d.Daily == nil {
				d.Daily = make(map[string]*DayBucket)
			}
			a.data = d
		}
	}
}

func (a *Analytics) saveLoop() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		a.mu.Lock()
		if a.dirty {
			a.data.SavedBytes = a.data.DomesticBytes / 2
			payload, err := json.MarshalIndent(a.data, "", "  ")
			if err == nil {
				os.WriteFile(a.filePath, payload, 0644)
			}
			a.dirty = false
		}
		a.mu.Unlock()
	}
}

func (a *Analytics) RecordDownload(bytes int64, isDomestic bool, filename string) {
	if bytes <= 0 {
		return
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	now := time.Now()
	a.data.TotalBytes += bytes

	if isDomestic {
		a.data.DomesticBytes += bytes
	} else {
		a.data.InternationalBytes += bytes
	}
	a.data.SavedBytes = a.data.DomesticBytes / 2

	// Hourly bucket (key: YYYY-MM-DD-HH, label: HH:00)
	hKey := now.Format("2006-01-02-15")
	hBucket, exists := a.data.Hourly[hKey]
	if !exists {
		hBucket = &HourBucket{
			Hour: now.Format("15:00"),
		}
		a.data.Hourly[hKey] = hBucket
	}
	if isDomestic {
		hBucket.Domestic += bytes
	} else {
		hBucket.International += bytes
	}
	hBucket.Total += bytes

	// Daily bucket (key: YYYY-MM-DD, label: YYYY-MM-DD)
	dKey := now.Format("2006-01-02")
	dBucket, dExists := a.data.Daily[dKey]
	if !dExists {
		dBucket = &DayBucket{
			Date: dKey,
		}
		a.data.Daily[dKey] = dBucket
	}
	if isDomestic {
		dBucket.Domestic += bytes
	} else {
		dBucket.International += bytes
	}
	dBucket.Total += bytes

	// Recent logs
	if filename != "" {
		entry := LogEntry{
			Filename:   filename,
			Bytes:      bytes,
			IsDomestic: isDomestic,
			Timestamp:  now,
		}
		a.data.RecentLogs = append([]LogEntry{entry}, a.data.RecentLogs...)
		if len(a.data.RecentLogs) > 50 {
			a.data.RecentLogs = a.data.RecentLogs[:50]
		}
	}

	a.dirty = true
}

func (a *Analytics) ResetCycle() {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.data.CycleStart = time.Now()
	a.data.TotalBytes = 0
	a.data.DomesticBytes = 0
	a.data.InternationalBytes = 0
	a.data.SavedBytes = 0
	a.data.Hourly = make(map[string]*HourBucket)
	a.data.Daily = make(map[string]*DayBucket)
	a.data.RecentLogs = make([]LogEntry, 0)
	a.dirty = true
}

type AnalyticsSummary struct {
	CycleStart         time.Time     `json:"cycle_start"`
	TotalBytes         int64         `json:"total_bytes"`
	DomesticBytes      int64         `json:"domestic_bytes"`
	InternationalBytes int64         `json:"international_bytes"`
	SavedBytes         int64         `json:"saved_bytes"`
	Hourly             []*HourBucket `json:"hourly"`
	Daily              []*DayBucket  `json:"daily"`
	RecentLogs         []LogEntry    `json:"recent_logs"`
}

func (a *Analytics) GetSummary() AnalyticsSummary {
	a.mu.RLock()
	defer a.mu.RUnlock()

	// Extract sorted last 24 hours
	now := time.Now()
	hourlyList := make([]*HourBucket, 0, 24)
	for i := 23; i >= 0; i-- {
		t := now.Add(-time.Duration(i) * time.Hour)
		k := t.Format("2006-01-02-15")
		b, exists := a.data.Hourly[k]
		if exists {
			hourlyList = append(hourlyList, b)
		} else {
			hourlyList = append(hourlyList, &HourBucket{
				Hour: t.Format("15:00"),
			})
		}
	}

	// Extract sorted last 14 days
	dailyList := make([]*DayBucket, 0, 14)
	for i := 13; i >= 0; i-- {
		t := now.AddDate(0, 0, -i)
		k := t.Format("2006-01-02")
		b, exists := a.data.Daily[k]
		if exists {
			dailyList = append(dailyList, b)
		} else {
			dailyList = append(dailyList, &DayBucket{
				Date: t.Format("01/02"),
			})
		}
	}

	return AnalyticsSummary{
		CycleStart:         a.data.CycleStart,
		TotalBytes:         a.data.TotalBytes,
		DomesticBytes:      a.data.DomesticBytes,
		InternationalBytes: a.data.InternationalBytes,
		SavedBytes:         a.data.SavedBytes,
		Hourly:             hourlyList,
		Daily:              dailyList,
		RecentLogs:         a.data.RecentLogs,
	}
}
