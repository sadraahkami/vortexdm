package settings

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

type Settings struct {
	DefaultDownloadDir  string `json:"default_download_dir"`
	SoundEnabled        bool   `json:"sound_enabled"`
	AutoExtractZip      bool   `json:"auto_extract_zip"`
	UIMode              string `json:"ui_mode"` // "simple" or "pro"
	ProxyEnabled        bool   `json:"proxy_enabled"`
	ProxyType           string `json:"proxy_type"` // "socks5" or "http"
	ProxyAddress        string `json:"proxy_address"`
	ProxyBypassDomestic bool   `json:"proxy_bypass_domestic"`
}

type Manager struct {
	mu       sync.RWMutex
	filePath string
	data     Settings
}

var (
	globalManager *Manager
	once          sync.Once
)

// Init initializes the settings manager from a base directory
func Init(baseDir string) *Manager {
	once.Do(func() {
		cfgPath := filepath.Join(baseDir, "vortex_settings.json")
		m := &Manager{
			filePath: cfgPath,
			data: Settings{
				DefaultDownloadDir:  filepath.Join(baseDir, "downloads"),
				SoundEnabled:        true,
				AutoExtractZip:      false,
				UIMode:              "simple",
				ProxyEnabled:        false,
				ProxyType:           "socks5",
				ProxyAddress:        "127.0.0.1:10808",
				ProxyBypassDomestic: true,
			},
		}
		m.load()
		globalManager = m
	})
	return globalManager
}

// GetInstance returns the singleton settings manager
func GetInstance() *Manager {
	return globalManager
}

func (m *Manager) load() {
	f, err := os.Open(m.filePath)
	if err != nil {
		m.saveUnlocked()
		return
	}
	defer f.Close()

	var loaded Settings
	if err := json.NewDecoder(f).Decode(&loaded); err == nil {
		if loaded.DefaultDownloadDir != "" {
			m.data.DefaultDownloadDir = loaded.DefaultDownloadDir
		}
		m.data.SoundEnabled = loaded.SoundEnabled
		m.data.AutoExtractZip = loaded.AutoExtractZip
		if loaded.UIMode != "" {
			m.data.UIMode = loaded.UIMode
		}
		m.data.ProxyEnabled = loaded.ProxyEnabled
		if loaded.ProxyType != "" {
			m.data.ProxyType = loaded.ProxyType
		}
		if loaded.ProxyAddress != "" {
			m.data.ProxyAddress = loaded.ProxyAddress
		}
		m.data.ProxyBypassDomestic = loaded.ProxyBypassDomestic
	}
}

func (m *Manager) saveUnlocked() error {
	f, err := os.OpenFile(m.filePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(m.data)
}

// Get returns a copy of current settings
func (m *Manager) Get() Settings {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.data
}

// Update updates settings in thread-safe manner and flushes to disk
func (m *Manager) Update(newSettings Settings) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if newSettings.DefaultDownloadDir != "" {
		m.data.DefaultDownloadDir = filepath.Clean(newSettings.DefaultDownloadDir)
		os.MkdirAll(m.data.DefaultDownloadDir, 0755)
	}
	m.data.SoundEnabled = newSettings.SoundEnabled
	m.data.AutoExtractZip = newSettings.AutoExtractZip
	if newSettings.UIMode != "" {
		m.data.UIMode = newSettings.UIMode
	}
	m.data.ProxyEnabled = newSettings.ProxyEnabled
	if newSettings.ProxyType != "" {
		m.data.ProxyType = newSettings.ProxyType
	}
	if newSettings.ProxyAddress != "" {
		m.data.ProxyAddress = newSettings.ProxyAddress
	}
	m.data.ProxyBypassDomestic = newSettings.ProxyBypassDomestic

	return m.saveUnlocked()
}
