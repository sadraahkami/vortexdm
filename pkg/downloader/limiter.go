package downloader

import (
	"sync"
	"time"
)

// SpeedLimiter controls and throttles the aggregate download rate across all goroutines.
type SpeedLimiter struct {
	mu           sync.RWMutex
	limitPerSec  int64 // 0 = unlimited
	lastTokenRef time.Time
	bucket       float64
}

func NewSpeedLimiter(limitPerSec int64) *SpeedLimiter {
	return &SpeedLimiter{
		limitPerSec:  limitPerSec,
		lastTokenRef: time.Now(),
		bucket:       float64(limitPerSec),
	}
}

func (l *SpeedLimiter) SetLimit(limitPerSec int64) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.limitPerSec = limitPerSec
	l.bucket = float64(limitPerSec)
	l.lastTokenRef = time.Now()
}

func (l *SpeedLimiter) GetLimit() int64 {
	l.mu.RLock()
	defer l.mu.RUnlock()
	return l.limitPerSec
}

// Throttle calculates sleep duration based on bytes read to enforce speed cap.
func (l *SpeedLimiter) Throttle(bytesRead int) {
	l.mu.Lock()
	defer l.mu.Unlock()

	if l.limitPerSec <= 0 || bytesRead <= 0 {
		return
	}

	now := time.Now()
	elapsed := now.Sub(l.lastTokenRef).Seconds()
	l.lastTokenRef = now

	// Refill bucket
	l.bucket += elapsed * float64(l.limitPerSec)
	if l.bucket > float64(l.limitPerSec) {
		l.bucket = float64(l.limitPerSec)
	}

	// Deduct
	l.bucket -= float64(bytesRead)

	if l.bucket < 0 {
		deficit := -l.bucket
		sleepSecs := deficit / float64(l.limitPerSec)
		if sleepSecs > 1.0 {
			sleepSecs = 1.0
		}
		time.Sleep(time.Duration(sleepSecs * float64(time.Second)))
		l.bucket = 0
		l.lastTokenRef = time.Now()
	}
}
