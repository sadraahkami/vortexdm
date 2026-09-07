package tests

import (
	"testing"

	"github.com/sadraahkami/vortexdm/pkg/utils"
)

func TestFormatBytes(t *testing.T) {
	cases := []struct {
		input    int64
		expected string
	}{
		{0, "0 B"},
		{500, "500 B"},
		{1024, "1.00 KB"},
		{1048576, "1.00 MB"},
		{1073741824, "1.00 GB"},
	}

	for _, c := range cases {
		res := utils.FormatBytes(c.input)
		if res != c.expected {
			t.Errorf("FormatBytes(%d) = %s; want %s", c.input, res, c.expected)
		}
	}
}

func TestFormatSpeed(t *testing.T) {
	res := utils.FormatSpeed(1048576)
	if res != "1.00 MB/s" {
		t.Errorf("FormatSpeed(1048576) = %s; want 1.00 MB/s", res)
	}
}

func TestFormatDuration(t *testing.T) {
	if utils.FormatDuration(45) != "00:45" {
		t.Errorf("expected 00:45, got %s", utils.FormatDuration(45))
	}
	if utils.FormatDuration(125) != "02:05" {
		t.Errorf("expected 02:05, got %s", utils.FormatDuration(125))
	}
	if utils.FormatDuration(3665) != "01h 01m" {
		t.Errorf("expected 01h 01m, got %s", utils.FormatDuration(3665))
	}
}

func TestDetectCategory(t *testing.T) {
	cases := []struct {
		filename string
		expected utils.Category
	}{
		{"movie.mp4", utils.CategoryVideo},
		{"song.mp3", utils.CategoryAudio},
		{"archive.zip", utils.CategoryArchive},
		{"setup.exe", utils.CategorySoftware},
		{"report.pdf", utils.CategoryDocument},
		{"unknown.xyz", utils.CategoryOther},
	}

	for _, c := range cases {
		res := utils.DetectCategory(c.filename)
		if res != c.expected {
			t.Errorf("DetectCategory(%s) = %s; want %s", c.filename, res, c.expected)
		}
	}
}
