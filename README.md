# VortexDM ⚡
### Next-Gen Multi-Threaded Concurrent Download Manager written in Go
**دانلود منیجر نسل جدید چندکانکشنه، فوق‌سریع و بدون وابستگی با زبان Go**

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.26+-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go Version" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-informational?style=for-the-badge&logo=windows" alt="Platforms" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20%26%20Modular-blueviolet?style=for-the-badge" alt="Clean Architecture" />
  <img src="https://img.shields.io/badge/UI-Cyber%20Glassmorphism%20SSE-00f2fe?style=for-the-badge" alt="UI" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Overview | معرفی پروژه

**VortexDM** is a blazingly fast, lightweight, and modern multi-threaded download manager written entirely in **pure Go**. It splits large downloads into up to **32 parallel Goroutine workers**, maximizes connection bandwidth through HTTP `Range` requests, and writes segments concurrently to disk without slow post-assembly concatenation.

**VortexDM** یک دانلود منیجر فوق‌العاده سبک، سریع و مدرن است که با زبان **Go خالص** و بدون نیاز به پایتون، ران‌تایم‌های سنگین، یا نودجی‌اس ساخته شده است. این نرم‌افزار فایل‌ها را به **۳۲ قطعه‌ی همزمان (Goroutine)** تقسیم نموده و با متد پیشرفته‌ی `os.File.WriteAt` داده‌ها را بدون نیاز به مرحله‌ی ادغام و هدررفت زمان، مستقیماً داخل فایل ذخیره می‌کند.

---

## ✨ Key Features | قابلیت‌های کلیدی

- 📱 **Wi-Fi Mobile Sharing via QR Code:** Scan a QR code on any smartphone camera to stream and download files over the local network with zero cables.
- 🎬 **In-Flight Media Streaming Preview:** Stream partial video/audio files directly from disk via HTTP 206 `Range` requests while the download is actively running.
- 🛡️ **Smart SOCKS5 & HTTP Proxy Engine:** Pure-Go RFC 1928 client with automatic domestic Iranian traffic bypass (`ProxyBypassDomestic`) preserving half-price domestic tariffs.
- ⚡ **Built-in Network Ping & Speed Benchmark:** Live latency and download throughput tester with an animated 60 FPS HTML5 Canvas speedometer gauge.
- 🔌 **WordPress Companion Plugin:** Official companion plugin (`[vortex_download]`) offering modern download cards, one-click `vortexdm://` deep-links, and domestic traffic badges.
- 🎛️ **Dual-Mode Interface (Simple vs PRO):** One-click toggle between an ultra-clean, distraction-free minimalist mode and an advanced IDM-grade power studio.
- 📁 **Custom Download Destination Paths:** Set a global default download folder or specify custom save folders per task.
- 🔗 **Expired Link Refresher:** Update expired temporary or tokenized download URLs in-place and resume seamlessly from the exact byte where interruption occurred.
- 📦 **Pure Go Native Archive Extractor:** Built-in `.zip` decompression with Zip-Slip path traversal security guard and auto-extract upon completion.
- 🔊 **Zero-Byte Synthesized Audio Feedback:** Pristine futuristic chimes and blips generated procedurally via Web Audio API with zero external audio assets.
- 🚀 **Turbo Multi-Threaded Engine:** Parallel chunk downloading utilizing Go Goroutines (up to 32 parallel connections).
- 🧩 **Zero-Concatenation Storage:** Direct byte positioning via `os.File.WriteAt`, eliminating slow final assembly file merging.
- 💻 **Zero-Friction Standalone Executable:** Single 7MB `.exe` containing all embedded UI assets and PE resources — run directly with zero installation.
- 🌐 **Official Browser Extension (Chrome/Edge/Brave/Opera):** Manifest V3 extension with context-menu "Download with VortexDM" and automatic download interception.
- 📥 **Batch Multi-URL Downloader:** Import dozens of download URLs simultaneously with queue selection, parallel thread tuning, and auto-start.
- 🔒 **Cryptographic Checksum Verifier (SHA-256 & MD5):** Real-time file integrity check directly from the context menu with automated hash comparison banner.
- 📋 **Clipboard Auto-Sniffing:** Non-intrusive floating toast detecting copied downloadable links (`.zip`, `.iso`, `.exe`, `.mp4`, etc.) with quick-download action.
- 🔔 **Native Windows Balloon Toasts & Live Tray Tooltip:** Win32 tray notifications on task completion and dynamic throughput + active download count on hover.
- 📌 **Windows System Tray Minimization:** One-click minimize to Windows notification tray overflow area (`^`), keeping taskbar clean with background downloads.
- 📊 **Bandwidth & Traffic Usage Analytics:** Live tracking of billing cycle data consumption with domestic (نیم‌بها) vs international breakdown, calculated savings, and interactive 24h/14d HTML5 Canvas distribution charts.
- 📋 **Dynamic Custom Queues & Priority Ordering:** Create tailored download queues (Movies, Software, Courses) and reorder download sequence with Up/Down (`▲`/`▼`) buttons.
- ⏰ **IDM-Grade Night Scheduler & Wheel Time Picker:** Auto-download queues during off-peak hours with smooth mouse wheel scrolling over hours/minutes, plus automatic PC shutdown / sleep upon completion.
- 🇮🇷 **LinkIrani.ir Domestic Traffic Inspector:** Automatic detection of Iranian half-price (نیم‌بها) servers and instant verification against LinkIrani.ir.
- 🖥️ **Native Desktop App Mode:** Instant frameless desktop app window via Microsoft Edge App Mode or system browser.
- ⚡ **Real-Time Chunk Visualizer & Canvas Graph:** Live visual segment bars and animated 60 FPS speedometer.
- 🔄 **Resumable Downloads & State Persistence:** Automatic recovery of paused or interrupted tasks via `.vortex` state files.
- 📂 **Smart Category Classifier:** Automatic detection of Videos, Music, Software, Archives, and Documents.
- 🌐 **Full Bilingual Support:** Instant toggle between English (LTR) and Persian / فارسی (RTL).
- 🐳 **Docker Ready:** Deployable on headless NAS, home servers, or Raspberry Pi with a single `docker compose up -d`.

---

## 📊 Comparison Table | جدول مقایسه

| Feature / ابزار | VortexDM ⚡ | IDM (Internet Download Manager) | Aria2 | Python Downloaders |
| :--- | :---: | :---: | :---: | :---: |
| **Language & Performance** | Pure Go (Native) | C++ (Proprietary) | C++ (CLI only) | Python (Interpreted) |
| **Zero Runtime Needed** | ✅ (Single binary) | ⚠️ (Windows installer) | ✅ (Binary) | ❌ (Requires Python runtime) |
| **Dual-Mode UI (Simple & PRO)** | ✅ 1-Click Toggle | ❌ Cluttered always | ❌ None | ❌ Rare |
| **Wi-Fi Mobile Sharing (QR Code)**| ✅ LAN Stream + QR | ❌ None | ❌ None | ❌ None |
| **In-Flight Streaming Preview**| ✅ HTTP 206 Partial Stream | ⚠️ Video only with limitations | ❌ None | ❌ None |
| **SOCKS5 with Domestic Bypass**| ✅ RFC 1928 + Smart Bypass | ⚠️ Proxy without smart bypass | ⚠️ Manual proxy | ⚠️ Needs PySocks |
| **Direct WriteAt (No Merge)**| ✅ Instant | ❌ Merges at 100% | ✅ Chunk mapping | ❌ Slow disk merge |
| **Expired Link Refresher** | ✅ In-place refresh | ✅ Supported | ❌ Manual reconfigure | ❌ Rare |
| **Built-in Archive Extractor**| ✅ Pure Go (.zip) | ❌ None | ❌ None | ⚠️ Requires external |
| **Built-in Speed Benchmark** | ✅ Ping + MB/s Gauge | ❌ None | ❌ None | ❌ None |
| **System Tray Minimization** | ✅ Windows Win32 Tray | ✅ Windows Tray | ❌ None | ⚠️ Heavy PyQt / None |
| **Bandwidth & Traffic Analytics**| ✅ 24h/14d + Domestic (نیم‌بها) | ❌ Basic log | ❌ None | ❌ None |
| **WordPress Companion Plugin** | ✅ Official Companion Plugin | ❌ None | ❌ None | ❌ None |
| **Custom Queues & Reordering**| ✅ Dynamic + ▲/▼ Priority | ✅ Queues | ⚠️ Manual CLI | ❌ Rare |
| **Mouse-Wheel Time Picker** | ✅ Smooth Scroll | ❌ Spinners | ❌ None | ❌ None |
| **Iranian Domestic Traffic (نیم‌بها)**| ✅ Native LinkIrani check | ❌ None | ❌ None | ❌ None |
| **Cyber UI & Chunk Visualizer**| ✅ Live Neon SSE | ❌ Outdated 90s UI | ❌ No native UI | ⚠️ Basic Tkinter/PyQt |
| **Cross-Platform & Docker** | ✅ Windows/Linux/Mac/Docker | ❌ Windows only | ✅ All platforms | ✅ All platforms |
| **License & Freedom** | 💚 100% Free & Open Source | 🔴 Paid / Trialware | 💚 Open Source | 💚 Open Source |

---

## 🚀 Getting Started | راهنمای راه‌اندازی

### Option 1: Standalone Windows Binary (Single File)
1. Download `VortexDM.exe` from [Releases](https://github.com/sadraahkami/vortexdm/releases).
2. Double-click `VortexDM.exe`.
3. The sleek desktop window will launch automatically!

### Option 2: Run from Source (Go 1.22+)
```bash
# Clone repository
git clone https://github.com/sadraahkami/vortexdm.git
cd vortexdm

# Run directly
go run main.go

# Or compile standalone binary
go build -ldflags="-s -w" -o VortexDM.exe .
```

### Option 3: Docker & Headless Server
```bash
docker-compose up -d
```
Access the dashboard at `http://localhost:4890`.

---

## ⚙️ CLI Flags | سوئیچ‌های خط فرمان

| Flag | Default | Description |
| :--- | :---: | :--- |
| `-port` | `4890` | Web UI & API port (`0` for random available port) |
| `-dir` | `./downloads` | Directory path where files will be stored |
| `-headless` | `false` | Run without launching native desktop window (ideal for NAS / servers) |

Example:
```bash
VortexDM.exe -port 8080 -dir "D:\MyDownloads" -headless
```

---

## 📁 Project Architecture | ساختار پروژه

```
VortexDM/
├── .github/workflows/
│   └── build-release.yml    # Automated multi-platform CI/CD release pipeline
├── pkg/
│   ├── downloader/          # Core multi-threaded download engine
│   │   ├── chunk.go         # HTTP Range worker & atomic byte tracker
│   │   ├── engine.go        # Goroutine orchestrator & speed ticker
│   │   └── task.go          # Task model, ETA calculation & .vortex state
│   ├── proxy/               # Pure-Go RFC 1928 SOCKS5 & HTTP proxy engine
│   │   └── proxy.go         # Proxy dialer with Iranian domestic traffic bypass
│   ├── scheduler/           # Night queue scheduler & OS actions
│   │   └── scheduler.go     # Background queue timer & PC power actions
│   ├── server/              # HTTP Server & Real-Time SSE Streamer
│   │   └── server.go        # REST API, SSE hub, QR Wi-Fi share, Range stream & speedtest
│   ├── settings/            # Thread-safe persistent configuration
│   │   └── settings.go      # vortex_settings.json persistence manager
│   ├── traffic/             # Network traffic inspector & analytics
│   │   ├── analytics.go     # Domestic vs intl billing cycle logger
│   │   └── iran.go          # LinkIrani CIDR heuristic evaluator
│   ├── unpacker/            # Pure-Go zip extractor
│   │   └── unpacker.go      # Zip-Slip protected archive unpacker
│   └── utils/               # Formatters & MIME category classifier
│       ├── category.go      # Extension category matcher
│       └── format.go        # Bytes & Duration formatters
├── extensions/              # Official browser extensions
│   └── vortexdm-chrome/     # Chrome / Edge / Brave Manifest V3 extension
├── wordpress-plugin/        # Official WordPress Companion Integration
│   └── vortexdm-companion/  # MVC WordPress plugin (shortcodes, deep-link, admin)
├── ui/                      # Cyber Dark Glassmorphic Web Dashboard
│   ├── app.js               # Dual-mode, QR generator, media player, speedtest & i18n
│   ├── index.html           # Modern responsive layout & modal dialogues
│   └── style.css            # Glowing neon dark cyber theme
├── tests/                   # Automated unit & integration tests (19 tests)
│   ├── batch_test.go        # Multi-URL batch importer unit test
│   ├── checksum_test.go     # SHA-256 & MD5 verifier test
│   ├── downloader_test.go   # Mock range server & chunk integrity verification
│   ├── proxy_test.go        # SOCKS5 handshake & domestic bypass unit test
│   ├── share_test.go        # QR share, media stream & speedtest unit test
│   └── utils_test.go        # Formatter & category unit tests
├── Dockerfile               # Alpine multi-stage container
├── docker-compose.yml       # Production stack definition
├── build.bat                # Standalone Windows build script
├── run.bat                  # Quick launch batch script
├── test.bat                 # Automated test runner (19 tests)
├── main.go                  # Main entry point & embedded UI launcher
├── TECHNICAL_DOCS.md        # Technical architecture documentation
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## 🧪 Running Tests | اجرای تست‌ها

```bash
# Run all unit and integration tests
go test -v ./tests/...
```

---

## 📄 License

This project is open-source and licensed under the **MIT License**.
See [LICENSE](LICENSE) for details.
