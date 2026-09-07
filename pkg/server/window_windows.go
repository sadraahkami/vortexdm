//go:build windows

package server

import (
	"strings"
	"syscall"
	"unsafe"
)

var (
	modUser32          = syscall.NewLazyDLL("user32.dll")
	procShowWindow     = modUser32.NewProc("ShowWindow")
	procEnumWindows    = modUser32.NewProc("EnumWindows")
	procGetWindowTextW = modUser32.NewProc("GetWindowTextW")
)

const (
	swMinimize = 6
	swRestore  = 9
)

// MinimizeAppWindow finds any window belonging to VortexDM and minimizes it
func MinimizeAppWindow() bool {
	found := false
	cb := syscall.NewCallback(func(hwnd syscall.Handle, lparam uintptr) uintptr {
		var buf [256]uint16
		r, _, _ := procGetWindowTextW.Call(uintptr(hwnd), uintptr(unsafe.Pointer(&buf[0])), 256)
		if r > 0 {
			title := syscall.UTF16ToString(buf[:r])
			if strings.Contains(title, "VortexDM") {
				procShowWindow.Call(uintptr(hwnd), uintptr(swMinimize))
				found = true
				return 0 // stop enumeration
			}
		}
		return 1 // continue enumeration
	})

	procEnumWindows.Call(cb, 0)
	return found
}
