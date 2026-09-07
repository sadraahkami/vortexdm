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

- 🚀 **Turbo Multi-Threaded Engine:** Parallel chunk downloading utilizing Go Goroutines (up to 32 parallel connections).
- 🧩 **Zero-Concatenation Storage:** Direct byte positioning via `os.File.WriteAt`, eliminating slow final assembly file merging.
- 💻 **Zero-Friction Standalone Executable:** Single 7MB `.exe` containing all embedded UI assets and PE resources — run directly with zero installation.
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
| **Direct WriteAt (No Merge)**| ✅ Instant | ❌ Merges at 100% | ✅ Chunk mapping | ❌ Slow disk merge |
| **System Tray Minimization** | ✅ Windows Win32 Tray | ✅ Windows Tray | ❌ None | ⚠️ Heavy PyQt / None |
| **Bandwidth & Traffic Analytics**| ✅ 24h/14d + Domestic (نیم‌بها) | ❌ Basic log | ❌ None | ❌ None |
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
│   ├── server/              # HTTP Server & Real-Time SSE Streamer
│   │   └── server.go        # REST API & Server-Sent Events hub
│   └── utils/               # Formatters & MIME category classifier
│       ├── category.go      # Extension category matcher
│       └── format.go        # Bytes & Duration formatters
├── ui/                      # Cyber Dark Glassmorphic Web Dashboard
│   ├── app.js               # SSE subscriber, canvas chart & i18n controller
│   ├── index.html           # Modern responsive layout & chunk grid
│   └── style.css            # Glowing neon dark cyber theme
├── tests/                   # Automated unit & integration tests
│   ├── downloader_test.go   # Mock range server & chunk integrity verification
│   └── utils_test.go        # Formatter & category unit tests
├── Dockerfile               # Alpine multi-stage container
├── docker-compose.yml       # Production stack definition
├── build.bat                # Standalone Windows build script
├── run.bat                  # Quick launch batch script
├── test.bat                 # Automated test runner
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
