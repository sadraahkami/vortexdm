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

var reopenCallback func()

func SetReopenCallback(cb func()) {
	reopenCallback = cb
}

func RestoreAppWindow() bool {
	if reopenCallback != nil {
		go reopenCallback()
		return true
	}
	return false
}

func UpdateTooltip(text string) {}

func ShowBalloon(title, msg string) {}

