package tests

import (
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/traffic"
)

func TestDetectTraffic(t *testing.T) {
	// Iranian domain test
	irInfo := traffic.DetectTraffic("https://dl.soft98.ir/soft/file.rar")
	if !irInfo.IsDomestic {
		t.Errorf("expected soft98.ir to be domestic, got international")
	}
	if irInfo.Label != "نیم‌بها" {
		t.Errorf("expected نیم‌بها label, got %s", irInfo.Label)
	}

	// International domain test
	intlInfo := traffic.DetectTraffic("https://github.com/archive/v1.0.0.zip")
	if intlInfo.IsDomestic {
		t.Errorf("expected github.com to be international, got domestic")
	}
	if intlInfo.Label != "تمام‌بها" {
		t.Errorf("expected تمام‌بها label, got %s", intlInfo.Label)
	}
}
