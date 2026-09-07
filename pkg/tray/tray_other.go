//go:build !windows

package tray

type TrayManager struct{}

func NewTray(onPauseAll, onResumeAll, onExit func()) *TrayManager {
	return &TrayManager{}
}

func (tm *TrayManager) Close() {}

func HideToTray() bool {
	return false
}

func RestoreAppWindow() {}
