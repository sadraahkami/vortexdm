//go:build !windows

package server

// MinimizeAppWindow is a no-op on non-Windows platforms
func MinimizeAppWindow() bool {
	return false
}
