//go:build windows

package tray

import (
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"unsafe"
)

const (
	NIM_ADD    = 0x00000000
	NIM_MODIFY = 0x00000001
	NIM_DELETE = 0x00000002

	NIF_MESSAGE = 0x00000001
	NIF_ICON    = 0x00000002
	NIF_TIP     = 0x00000004
	NIF_INFO    = 0x00000010

	NIIF_NONE    = 0x00000000
	NIIF_INFO    = 0x00000001
	NIIF_WARNING = 0x00000002
	NIIF_ERROR   = 0x00000003

	WM_DESTROY      = 0x0002
	WM_USER         = 0x0400
	WM_TRAYICON     = WM_USER + 101
	WM_LBUTTONUP    = 0x0202
	WM_LBUTTONDBLCLK = 0x0203
	WM_RBUTTONUP    = 0x0205
	WM_COMMAND      = 0x0111

	IMAGE_ICON       = 1
	LR_LOADFROMFILE  = 0x0010
	LR_DEFAULTSIZE   = 0x0040

	MF_STRING    = 0x0000
	MF_SEPARATOR = 0x0800
	TPM_BOTTOMALIGN = 0x0020
	TPM_RIGHTALIGN  = 0x0008

	SW_HIDE    = 0
	SW_SHOW    = 5
	SW_MINIMIZE = 6
	SW_RESTORE = 9

	ID_TRAY_OPEN     = 1001
	ID_TRAY_RESUME   = 1002
	ID_TRAY_PAUSE    = 1003
	ID_TRAY_EXIT     = 1004
)

var (
	modUser32           = syscall.NewLazyDLL("user32.dll")
	modKernel32         = syscall.NewLazyDLL("kernel32.dll")
	modShell32          = syscall.NewLazyDLL("shell32.dll")

	procRegisterClassExW  = modUser32.NewProc("RegisterClassExW")
	procCreateWindowExW   = modUser32.NewProc("CreateWindowExW")
	procDefWindowProcW    = modUser32.NewProc("DefWindowProcW")
	procDestroyWindow     = modUser32.NewProc("DestroyWindow")
	procPostQuitMessage   = modUser32.NewProc("PostQuitMessage")
	procGetMessageW       = modUser32.NewProc("GetMessageW")
	procTranslateMessage  = modUser32.NewProc("TranslateMessage")
	procDispatchMessageW  = modUser32.NewProc("DispatchMessageW")
	procLoadImageW        = modUser32.NewProc("LoadImageW")
	procLoadIconW         = modUser32.NewProc("LoadIconW")
	procGetCursorPos      = modUser32.NewProc("GetCursorPos")
	procSetForegroundWindow = modUser32.NewProc("SetForegroundWindow")
	procCreatePopupMenu   = modUser32.NewProc("CreatePopupMenu")
	procAppendMenuW       = modUser32.NewProc("AppendMenuW")
	procTrackPopupMenu    = modUser32.NewProc("TrackPopupMenu")
	procDestroyMenu       = modUser32.NewProc("DestroyMenu")
	procShowWindow        = modUser32.NewProc("ShowWindow")
	procEnumWindows       = modUser32.NewProc("EnumWindows")
	procGetWindowTextW    = modUser32.NewProc("GetWindowTextW")

	procGetModuleHandleW  = modKernel32.NewProc("GetModuleHandleW")
	procShellNotifyIconW  = modShell32.NewProc("Shell_NotifyIconW")
)

type POINT struct {
	X int32
	Y int32
}

type WNDCLASSEXW struct {
	CbSize        uint32
	Style         uint32
	LpfnWndProc   uintptr
	CbClsExtra    int32
	CbWndExtra    int32
	HInstance     syscall.Handle
	HIcon         syscall.Handle
	HCursor       syscall.Handle
	HbrBackground syscall.Handle
	LpszMenuName  *uint16
	LpszClassName *uint16
	HIconSm       syscall.Handle
}

type NOTIFYICONDATAW struct {
	CbSize           uint32
	HWnd             syscall.Handle
	UID              uint32
	UFlags           uint32
	UCallbackMessage uint32
	HIcon            syscall.Handle
	SzTip            [128]uint16
	DwState          uint32
	DwStateMask      uint32
	SzInfo           [256]uint16
	UTimeoutOrVersion uint32
	SzInfoTitle      [64]uint16
	DwInfoFlags      uint32
	GuidItem         [16]byte
	HBalloonIcon     syscall.Handle
}

type TrayManager struct {
	hWnd       syscall.Handle
	nid        NOTIFYICONDATAW
	hIcon      syscall.Handle
	onOpen     func()
	onPauseAll func()
	onResumeAll func()
	onExit     func()
}

var globalTray *TrayManager

func NewTray(onPauseAll, onResumeAll, onExit func()) *TrayManager {
	tm := &TrayManager{
		onOpen:      RestoreAppWindow,
		onPauseAll:  onPauseAll,
		onResumeAll: onResumeAll,
		onExit:      onExit,
	}
	globalTray = tm
	go tm.runMessageLoop()
	return tm
}

func (tm *TrayManager) runMessageLoop() {
	hInstance, _, _ := procGetModuleHandleW.Call(0)
	className, _ := syscall.UTF16PtrFromString("VortexDMTrayClass")

	wndProcCallback := syscall.NewCallback(func(hWnd syscall.Handle, msg uint32, wParam uintptr, lParam uintptr) uintptr {
		switch msg {
		case WM_TRAYICON:
			switch lParam {
			case WM_LBUTTONUP, WM_LBUTTONDBLCLK:
				RestoreAppWindow()
			case WM_RBUTTONUP:
				tm.showContextMenu(hWnd)
			}
			return 0
		case WM_COMMAND:
			switch wParam {
			case ID_TRAY_OPEN:
				RestoreAppWindow()
			case ID_TRAY_PAUSE:
				if tm.onPauseAll != nil {
					tm.onPauseAll()
				}
			case ID_TRAY_RESUME:
				if tm.onResumeAll != nil {
					tm.onResumeAll()
				}
			case ID_TRAY_EXIT:
				if tm.onExit != nil {
					tm.onExit()
				}
				os.Exit(0)
			}
			return 0
		case WM_DESTROY:
			procPostQuitMessage.Call(0)
			return 0
		}
		r, _, _ := procDefWindowProcW.Call(uintptr(hWnd), uintptr(msg), wParam, lParam)
		return r
	})

	var wc WNDCLASSEXW
	wc.CbSize = uint32(unsafe.Sizeof(wc))
	wc.LpfnWndProc = wndProcCallback
	wc.HInstance = syscall.Handle(hInstance)
	wc.LpszClassName = className

	procRegisterClassExW.Call(uintptr(unsafe.Pointer(&wc)))

	hWnd, _, _ := procCreateWindowExW.Call(
		0,
		uintptr(unsafe.Pointer(className)),
		uintptr(unsafe.Pointer(className)),
		0,
		0, 0, 0, 0,
		0, 0,
		hInstance,
		0,
	)

	tm.hWnd = syscall.Handle(hWnd)

	// Load Icon: try app.ico on disk, fallback to standard application icon
	icoPath, _ := filepath.Abs("app.ico")
	icoPathPtr, _ := syscall.UTF16PtrFromString(icoPath)
	hIcon, _, _ := procLoadImageW.Call(
		0,
		uintptr(unsafe.Pointer(icoPathPtr)),
		IMAGE_ICON,
		16, 16,
		LR_LOADFROMFILE,
	)

	if hIcon == 0 {
		// Fallback to loaded icon from PE resource or default application icon
		hIcon, _, _ = procLoadIconW.Call(hInstance, 1)
		if hIcon == 0 {
			hIcon, _, _ = procLoadIconW.Call(0, 32512) // IDI_APPLICATION
		}
	}
	tm.hIcon = syscall.Handle(hIcon)

	// Setup NOTIFYICONDATAW
	tm.nid.CbSize = uint32(unsafe.Sizeof(tm.nid))
	tm.nid.HWnd = tm.hWnd
	tm.nid.UID = 1
	tm.nid.UFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP
	tm.nid.UCallbackMessage = WM_TRAYICON
	tm.nid.HIcon = tm.hIcon

	tip, _ := syscall.UTF16FromString("VortexDM - Professional Download Manager")
	copy(tm.nid.SzTip[:], tip)

	procShellNotifyIconW.Call(NIM_ADD, uintptr(unsafe.Pointer(&tm.nid)))

	// Standard Win32 message loop
	var msg struct {
		HWnd    syscall.Handle
		Message uint32
		WParam  uintptr
		LParam  uintptr
		Time    uint32
		Pt      POINT
	}

	for {
		r, _, _ := procGetMessageW.Call(uintptr(unsafe.Pointer(&msg)), 0, 0, 0)
		if r == 0 || r == ^uintptr(0) {
			break
		}
		procTranslateMessage.Call(uintptr(unsafe.Pointer(&msg)))
		procDispatchMessageW.Call(uintptr(unsafe.Pointer(&msg)))
	}

	// Cleanup on exit
	procShellNotifyIconW.Call(NIM_DELETE, uintptr(unsafe.Pointer(&tm.nid)))
}

func (tm *TrayManager) showContextMenu(hWnd syscall.Handle) {
	var pt POINT
	procGetCursorPos.Call(uintptr(unsafe.Pointer(&pt)))

	hMenu, _, _ := procCreatePopupMenu.Call()
	if hMenu == 0 {
		return
	}
	defer procDestroyMenu.Call(hMenu)

	titleOpen, _ := syscall.UTF16PtrFromString("🚀 باز کردن VortexDM")
	titleResume, _ := syscall.UTF16PtrFromString("▶️ ادامه همه دانلودها")
	titlePause, _ := syscall.UTF16PtrFromString("⏸️ توقف همه دانلودها")
	titleExit, _ := syscall.UTF16PtrFromString("❌ خروج از برنامه")

	procAppendMenuW.Call(hMenu, MF_STRING, ID_TRAY_OPEN, uintptr(unsafe.Pointer(titleOpen)))
	procAppendMenuW.Call(hMenu, MF_SEPARATOR, 0, 0)
	procAppendMenuW.Call(hMenu, MF_STRING, ID_TRAY_RESUME, uintptr(unsafe.Pointer(titleResume)))
	procAppendMenuW.Call(hMenu, MF_STRING, ID_TRAY_PAUSE, uintptr(unsafe.Pointer(titlePause)))
	procAppendMenuW.Call(hMenu, MF_SEPARATOR, 0, 0)
	procAppendMenuW.Call(hMenu, MF_STRING, ID_TRAY_EXIT, uintptr(unsafe.Pointer(titleExit)))

	procSetForegroundWindow.Call(uintptr(hWnd))
	procTrackPopupMenu.Call(
		hMenu,
		TPM_BOTTOMALIGN|TPM_RIGHTALIGN,
		uintptr(pt.X),
		uintptr(pt.Y),
		0,
		uintptr(hWnd),
		0,
	)
}

func (tm *TrayManager) Close() {
	if tm.hWnd != 0 {
		procShellNotifyIconW.Call(NIM_DELETE, uintptr(unsafe.Pointer(&tm.nid)))
		procDestroyWindow.Call(uintptr(tm.hWnd))
	}
}

// HideToTray minimizes the VortexDM window and completely hides it from the taskbar
func HideToTray() bool {
	found := false
	cb := syscall.NewCallback(func(hwnd syscall.Handle, lparam uintptr) uintptr {
		var buf [256]uint16
		r, _, _ := procGetWindowTextW.Call(uintptr(hwnd), uintptr(unsafe.Pointer(&buf[0])), 256)
		if r > 0 {
			title := syscall.UTF16ToString(buf[:r])
			if strings.Contains(title, "VortexDM") {
				procShowWindow.Call(uintptr(hwnd), uintptr(SW_HIDE))
				found = true
				return 0
			}
		}
		return 1
	})
	procEnumWindows.Call(cb, 0)
	return found
}

// RestoreAppWindow restores the VortexDM window from the system tray to screen
func RestoreAppWindow() {
	cb := syscall.NewCallback(func(hwnd syscall.Handle, lparam uintptr) uintptr {
		var buf [256]uint16
		r, _, _ := procGetWindowTextW.Call(uintptr(hwnd), uintptr(unsafe.Pointer(&buf[0])), 256)
		if r > 0 {
			title := syscall.UTF16ToString(buf[:r])
			if strings.Contains(title, "VortexDM") {
				procShowWindow.Call(uintptr(hwnd), uintptr(SW_SHOW))
				procShowWindow.Call(uintptr(hwnd), uintptr(SW_RESTORE))
				procSetForegroundWindow.Call(uintptr(hwnd))
				return 0
			}
		}
		return 1
	})
	procEnumWindows.Call(cb, 0)
}

// UpdateTooltip dynamically changes the hover text shown on the system tray icon
func UpdateTooltip(text string) {
	if globalTray == nil || globalTray.hWnd == 0 {
		return
	}
	var nid NOTIFYICONDATAW
	nid.CbSize = uint32(unsafe.Sizeof(nid))
	nid.HWnd = globalTray.hWnd
	nid.UID = 1
	nid.UFlags = NIF_TIP

	tip, err := syscall.UTF16FromString(text)
	if err == nil {
		copy(nid.SzTip[:], tip)
		procShellNotifyIconW.Call(NIM_MODIFY, uintptr(unsafe.Pointer(&nid)))
	}
}

// ShowBalloon triggers a native Windows notification bubble/toast from the tray icon
func ShowBalloon(title, msg string) {
	if globalTray == nil || globalTray.hWnd == 0 {
		return
	}
	var nid NOTIFYICONDATAW
	nid.CbSize = uint32(unsafe.Sizeof(nid))
	nid.HWnd = globalTray.hWnd
	nid.UID = 1
	nid.UFlags = NIF_INFO

	titleUtf, _ := syscall.UTF16FromString(title)
	msgUtf, _ := syscall.UTF16FromString(msg)
	copy(nid.SzInfoTitle[:], titleUtf)
	copy(nid.SzInfo[:], msgUtf)
	nid.DwInfoFlags = NIIF_INFO
	nid.UTimeoutOrVersion = 5000 // 5 seconds display

	procShellNotifyIconW.Call(NIM_MODIFY, uintptr(unsafe.Pointer(&nid)))
}

