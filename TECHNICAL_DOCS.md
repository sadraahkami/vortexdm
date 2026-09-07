# VortexDM - Technical Documentation
*Next-Generation High-Performance Multi-Threaded Download Manager in Go*

---

## 1. Architecture Overview

VortexDM is engineered with a modular, lock-free oriented Go architecture consisting of four decoupled layers:

```mermaid
graph TD
    Client[Browser / Edge Desktop App] -->|SSE EventStream / REST| Server[HTTP Server & SSE Hub]
    Server --> Engine[Download Engine]
    Engine -->|Goroutines Pool| Workers[Chunk Workers (up to 32)]
    Workers -->|HTTP Range GET| RemoteServer[Remote HTTP Server]
    Workers -->|os.File.WriteAt| Disk[Direct Disk Storage]
    Engine -->|State Persistence| VortexFile[.vortex JSON State]
```

### Layer Breakdown
- **Presentation Layer (`ui/` & `main.go`):** Embedded single-page application (`index.html`, `style.css`, `app.js`) utilizing HTML5 Canvas sparklines, CSS Grid, and Server-Sent Events (SSE).
- **Transport Layer (`pkg/server/`):** Go standard library `net/http` providing REST APIs and low-latency SSE push broadcasts.
- **Engine Layer (`pkg/downloader/engine.go`, `task.go`):** Task lifecycle orchestrator, HTTP probe inspector, throughput window calculator, and thread coordinator.
- **Worker Layer (`pkg/downloader/chunk.go`):** Concurrent goroutines executing bounded HTTP `Range` requests with atomic progress recording and direct offset writing.
- **Utility Layer (`pkg/utils/`):** Byte formatters, digital clock duration formats, and extension-to-category classifiers.

---

## 2. Concurrency & I/O Strategy

### 2.1 Elimination of File Merging (`WriteAt`)
Traditional download managers write chunks to temporary separate files (e.g. `file.part0`, `file.part1`) and concatenate them when 100% is reached. On multi-gigabyte files or HDDs, this results in significant disk I/O bottlenecks and temporary doubling of disk space.

VortexDM employs `os.File.WriteAt`:
1. The target file is opened in `os.O_CREATE|os.O_WRONLY` mode.
2. The file is pre-allocated with `file.Truncate(totalSize)` to ensure disk block contiguity.
3. Each worker goroutine reads from its HTTP connection and writes directly to its assigned byte position:
   ```go
   offset := c.StartOffset + c.Downloaded
   n, err := file.WriteAt(buf[:nRead], offset)
   ```
4. As soon as the last chunk finishes, the file is complete immediately with **0ms concatenation delay**.

### 2.2 Atomic Window Speed Calculation
To measure real-time throughput without lock contention:
- Each chunk worker calls an inline callback `onBytesRead(n)` which executes:
  ```go
  atomic.AddInt64(&e.bytesWindow, int64(n))
  ```
- A background ticker fires every 500ms, swaps `e.bytesWindow` with `0` atomically using `atomic.SwapInt64`, divides by elapsed time, and calculates bytes per second.

### 2.3 Real-Time SSE Broadcasting
Instead of expensive HTTP polling:
- The UI establishes a single persistent SSE connection to `/api/events`.
- The engine notifies subscribers through buffered Go channels (`chan *Task`).
- The SSE server writes compressed JSON diffs down the connection whenever state changes or download speed is active.

---

## 3. Task State & Resumption Protocol

Every active download maintains a JSON state file in the download directory named `<filename>.vortex`:

```json
{
  "id": "18f293b4a20",
  "url": "https://example.com/data.iso",
  "filename": "data.iso",
  "total_size": 2097152000,
  "downloaded": 104857600,
  "status": "downloading",
  "resumable": true,
  "connections": 8,
  "chunks": [
    {
      "index": 0,
      "start_offset": 0,
      "end_offset": 262143999,
      "downloaded": 13107200,
      "size": 262144000,
      "completed": false
    }
  ]
}
```

- When a download is paused or interrupted, `cancelFunc()` halts worker goroutines.
- Each chunk's exact `Downloaded` offset is saved.
- Upon resumption, HTTP headers request `Range: bytes=(StartOffset + Downloaded)-(EndOffset)`.
- When the download completes, the `.vortex` state file is deleted.

---

## 4. API Reference

### `GET /api/tasks`
Returns current task snapshot and total download speed.
- **Response:**
  ```json
  {
    "tasks": [ ... ],
    "total_speed": 10485760.0
  }
  ```

### `POST /api/tasks`
Adds a new download task.
- **Payload:**
  ```json
  {
    "url": "https://speed.hetzner.de/100MB.bin",
    "filename": "custom_name.bin",
    "connections": 16
  }
  ```

### `POST /api/tasks/batch`
Imports and creates multiple download tasks simultaneously from a list of URLs.
- **Payload:**
  ```json
  {
    "urls": ["https://example.com/file1.zip", "https://example.com/file2.iso"],
    "queue": "night",
    "connections": 16,
    "start": true
  }
  ```

### `GET /api/tasks/checksum?id=<id>`
Computes and returns cryptographic SHA-256 and MD5 hashes of a completed downloaded file directly on disk using Go standard library streaming hashers (`crypto/sha256`, `crypto/md5`).
- **Response:**
  ```json
  {
    "task_id": "18f293b4a20",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "md5": "d41d8cd98f00b204e9800998ecf8427e"
  }
  ```

### `POST /api/tasks/start?id=<id>`
Resumes or starts a queued or paused task.

### `POST /api/tasks/start-all`
Resumes all queued, paused, or failed downloads concurrently.

### `POST /api/tasks/pause?id=<id>`
Pauses an active task and saves state.

### `POST /api/tasks/pause-all`
Pauses all currently downloading tasks and flushes their `.vortex` state files.

### `POST /api/tasks/clear-completed`
Clears all completed tasks from memory and cleans up obsolete state files.

### `POST /api/tasks/delete?id=<id>`
Cancels and removes the task and its local files.

### `POST /api/tasks/open?id=<id>`
Selects and reveals the file in the operating system's native file explorer (`explorer /select,` on Windows, `open -R` on macOS, `xdg-open` on Linux).

### `POST /api/window/minimize`
Minimizes the VortexDM desktop window via native Windows `user32.dll` syscall (`ShowWindow(hwnd, SW_MINIMIZE)`).

### `POST /api/window/minimize-tray`
Completely hides the application window from the taskbar and screen, docking it into the Windows notification system tray area (`^` overflow). Restorable with a single/double click or tray context menu.

### `GET /api/scheduler`
Returns current scheduler configuration for Main Queue, Night Queue, and custom queues.

### `POST /api/scheduler`
Saves and hot-reloads scheduler settings (start/stop times, active days, post-actions like PC shutdown).

### `GET /api/queues`
Retrieves all download queue configurations including built-in and dynamic custom queues.

### `POST /api/queues`
Creates or updates a custom download queue with custom name, concurrency limit, and schedules.

### `DELETE /api/queues?id=<id>`
Deletes a custom queue.

### `POST /api/tasks/reorder`
Updates execution priority/order for a specific download task inside its queue.

### `GET /api/analytics`
Returns comprehensive traffic analytics: billing cycle start date, total bytes consumed, domestic (نیم‌بها) bytes, international bytes, calculated bandwidth savings, 24-hour hourly distribution, 14-day daily distribution, and recent download traffic history.

### `POST /api/analytics/reset`
Resets the billing cycle statistics to zero.

### `GET /api/speed-limit`
Returns active aggregate bandwidth ceiling (`{"limit": 2097152}`).

### `POST /api/speed-limit`
Sets global download speed cap using token-bucket rate limiter.

### `GET /api/traffic/check?url=<url>`
Analyzes URL host/IP against Iranian domestic CIDRs and ASNs. Returns `{ is_domestic: bool, label: "نیم‌بها", linkirani_url: "..." }`.

---

## 5. Advanced Engine Subsystems

### 5.1 Domestic Traffic & LinkIrani Integration (`pkg/traffic/iran.go`)
- Fast heuristic evaluation of `.ir` TLDs.
- Non-blocking DNS lookup of host IPs.
- Subnet evaluation against 24+ primary Iranian ISP/datacenter CIDRs (Asiatech, Shatel, MCI, Irancell, Afranet, TCI, Tebyan, ParsOnline).
- Dynamic LinkIrani.ir verification URL generation.

### 5.2 Scheduler & Automated Post-Actions (`pkg/scheduler/scheduler.go`)
- Dedicated Queue configurations (`main`, `night`, and custom queues).
- Background ticker monitoring current system clock every 5 seconds.
- Triggers automatic start at scheduled minute and graceful pause at stop minute.
- Windows OS native integration:
  - Automated PC shutdown via `shutdown /s /t 60`.
  - Automated system sleep via `rundll32.exe powrprof.dll,SetSuspendState`.

### 5.3 Smart Bandwidth Allocator (`pkg/downloader/limiter.go`)
- Token-bucket algorithm enforcing bandwidth limit across all concurrent Goroutines.
- Prevents connection starvation, allowing smooth concurrent web browsing and gaming while downloading.

### 5.4 Windows Native App Integration & Resources
- **Embedded PE Resources (`go-winres`):** Generates `rsrc_windows_amd64.syso` containing custom 256x256 high-resolution icons, application version metadata (Product Name: VortexDM v1.0.0), and Windows DPI-aware application manifest.
- **Standalone Web App Manifest (`ui/manifest.json`):** Serves multi-size application icons (16, 24, 32, 48, 64, 128, 192, 256, 512 px) ensuring Microsoft Edge and Chromium standalone app modes render crisp taskbar and window header icons without default web globe fallbacks.
- **Native Window Minimization (`pkg/server/window_windows.go`):** Direct Windows `user32.dll` enumeration and `ShowWindow` minimize calls wired to top ribbon controls.

### 5.5 Windows System Tray & Balloon Notifications (`pkg/tray/tray_windows.go`)
- Pure Go implementation using Windows Win32 APIs (`shell32.dll` and `user32.dll`) without CGO dependencies.
- Registered hidden window class (`WNDCLASSEXW`) receiving `WM_USER+1` tray notification messages.
- `Shell_NotifyIconW` creates the tray icon in the system clock notification overflow area (`^`).
- **Native Balloon Notifications (`ShowBalloon`):** Dispatches Win32 `NIF_INFO` toast notifications with native Windows chime upon completion of any download task.
- **Dynamic Throughput Tooltip (`UpdateTooltip`):** Periodically updates tray hover tooltip with aggregate download speed and active task count (e.g. `VortexDM: 12.45 MB/s (3 active)`).
- Left-click / double-click restores the window (`ShowWindow(SW_SHOW)`, `ShowWindow(SW_RESTORE)`, `SetForegroundWindow`).
- Right-click displays native Win32 popup menu (`CreatePopupMenu`, `TrackPopupMenuEx`) with Open, Pause All, Resume All, and Exit.
- `HideToTray()` calls `ShowWindow(hwnd, SW_HIDE)` to completely remove the app from the taskbar while keeping it active in the background.

### 5.6 Bandwidth & Traffic Analytics Engine (`pkg/analytics/analytics.go`)
- Thread-safe persistence (`traffic_analytics.json`) maintaining cumulative network traffic statistics across restarts.
- Categorizes downloaded bytes into Domestic (نیم‌بها) and International (تمام‌بها) in real-time as bytes arrive.
- Calculates bandwidth savings gained from half-price routing.
- Maintains 24-hour sliding hourly buckets and 14-day daily buckets for graphical visualization.
- Maintains an audit log of recent downloads with file names, sizes, and tariff classification.

### 5.7 Batch Downloader & Cryptographic Checksum Engine (`pkg/downloader/engine.go`)
- `BatchAddTasks(urls, queue, conns)`: Concurrently or sequentially analyzes and enqueues multiple URLs with uniform chunk partitioning.
- `CalculateChecksum(taskID)`: Streams file directly into SHA-256 and MD5 cryptographic hashers via `io.MultiWriter`, calculating verification digests without loading full files into RAM.

### 5.8 Official Browser Extension (`extensions/vortexdm-chrome/`)
- Manifest V3 compliant extension compatible with Google Chrome, Microsoft Edge, Brave, and Opera.
- Native context menus: "Download with VortexDM" on any link, image, video, or audio file.
- Optional automatic download capture intercepting standard browser downloads and redirecting them to VortexDM's multi-connection engine.
- Instant popup status dashboard with one-click URL paste and download trigger.

---

## 6. High-Density UI Architecture

- **IDM-Grade Information Density:** Compact, sticky-header table grid (36px row height), allowing 20+ downloads visible simultaneously.
- **Tree Navigation & Collapsible Sidebar:** Left sidebar organized into Categories, Statuses, and Queues with one-click collapse/expand (`.sidebar-collapsed`) for maximum data visibility.
- **Batch Download Modal:** Clean multi-line URL importer supporting target queue selection, thread count configuration, and immediate auto-start.
- **File Checksum Verifier Modal:** Right-click context menu "Verify Checksum" displaying computed SHA-256 and MD5 hashes with real-time input comparison and visual match confirmation banner.
- **Clipboard Auto-Sniffing Toast:** Non-intrusive floating glassmorphic banner popping up when downloadable URLs (`.zip`, `.iso`, `.exe`, `.mp4`, etc.) are copied, offering single-click quick download.
- **Custom Queues Management:** One-click `+` button in sidebar to create named queues with custom concurrency limits, and instant filtering by queue.
- **Task Priority Reordering:** Dedicated `#` order column and Up/Down (`▲`/`▼`) buttons in each row to prioritize downloads.
- **Pure Bilingual Localization:** Strictly separated Persian and English typography without awkward parenthetical inline translations.
- **Mouse Wheel Time Picker:** Continuous increment/decrement of hours and minutes by rolling the mouse wheel over the time picker selectors.
- **Interactive Bandwidth Analytics Dashboard:** Full-screen modal with 4 metric cards (Total, Domestic, International, Savings), dual-mode HTML5 Canvas chart (hourly/daily), and recent file history.
- **International Mode Cleanups:** Automatic conditional hiding of Iran-specific modules (LinkIrani button, tariff column, domestic traffic notices) via `.iran-only` and `html[lang="en"]` selector when operating in English locale.
- **Universal Dark Translucent Scrollbars:** Engineered custom `::-webkit-scrollbar` and `scrollbar-width: thin` CSS specifications ensuring Windows OS never falls back to glaring white scrollbar tracks upon resizing.

---

## 7. Automated Testing Strategy

Suite of 12 unit and integration tests covering:
1. `TestBatchAddTasksAndAPI`: Validates bulk URL creation, queue assignment, and `POST /api/tasks/batch` REST endpoint.
2. `TestChecksumVerification`: Validates streaming SHA-256 and MD5 hash generation and `GET /api/tasks/checksum` endpoint.
3. `TestTrafficAnalytics`: Verifies thread-safe traffic recording, domestic/international separation, savings calculation, and cycle reset.
4. `TestCustomQueuesAndReordering`: Verifies custom queue creation, task assignment, order priority changes, and deletion.
5. `TestMultiThreadedDownload`: Multi-goroutine concurrent HTTP Range download with byte-by-byte integrity verification.
6. `TestSpeedLimiter`: Token-bucket throttle enforcement and unthrottled throughput.
7. `TestServerEndpointsAndAssets`: Validates root HTML, dark color-scheme meta, favicon, manifest, and window minimize endpoints.
8. `TestDetectTraffic`: Iranian domain detection (`soft98.ir` -> domestic نیم‌بها) vs international (`github.com` -> تمام‌بها).
9. `TestFormatBytes`, `TestFormatSpeed`, `TestFormatDuration`, `TestDetectCategory`.

Run tests:
```bash
cmd /c test.bat
```


