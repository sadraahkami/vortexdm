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

### `POST /api/tasks/start?id=<id>`
Resumes or starts a queued or paused task.

### `POST /api/tasks/pause?id=<id>`
Pauses an active task and saves state.

### `POST /api/tasks/delete?id=<id>`
Cancels and removes the task and its local files.

### `POST /api/tasks/open?id=<id>`
Selects and reveals the file in the operating system's native file explorer (`explorer /select,` on Windows, `open -R` on macOS, `xdg-open` on Linux).

### `GET /api/events`
Server-Sent Events (SSE) stream pushing `event: tasks` messages.

---

## 5. Automated Testing Strategy

Integration tests in `tests/downloader_test.go` utilize Go's `net/http/httptest`:
1. Creates an in-memory HTTP server handling `HEAD` and partial content `GET` (`Range: bytes=X-Y`).
2. Generates cryptographic pseudorandom binary data.
3. Executes 4 concurrent Goroutine downloads with `Engine.StartTask`.
4. Performs binary byte-for-byte comparison (`bytes.Equal`) to verify zero data corruption.
5. Verifies file cleanup on `DeleteTask`.

Run tests:
```bash
cmd /c test.bat
```
