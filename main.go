package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/downloader"
	"github.com/sadraahkami/vortexdm/pkg/server"
)

//go:embed all:ui
var uiEmbedFS embed.FS

func main() {
	portFlag := flag.Int("port", 4890, "Web UI Port (0 for auto-assign)")
	dirFlag := flag.String("dir", "", "Download storage directory")
	headlessFlag := flag.Bool("headless", false, "Run without launching desktop UI window")
	flag.Parse()

	// Ensure download directory is in the current working directory by default (saving space on C:)
	downloadDir := *dirFlag
	if downloadDir == "" {
		cwd, err := os.Getwd()
		if err != nil {
			downloadDir = filepath.Join(".", "downloads")
		} else {
			downloadDir = filepath.Join(cwd, "downloads")
		}
	}
	os.MkdirAll(downloadDir, 0755)

	log.Printf("[VortexDM] Starting Turbo Engine...")
	log.Printf("[VortexDM] Destination directory: %s", downloadDir)

	engine := downloader.NewEngine(downloadDir, 8)
	defer engine.Close()

	// Extract embedded UI filesystem
	subUI, err := fs.Sub(uiEmbedFS, "ui")
	if err != nil {
		log.Fatalf("[VortexDM] Failed to load embedded UI: %v", err)
	}

	srv := server.NewServer(engine, http.FS(subUI))

	// Bind listener
	listenAddr := fmt.Sprintf("127.0.0.1:%d", *portFlag)
	listener, err := net.Listen("tcp", listenAddr)
	if err != nil {
		// Fallback to random available port if 4890 is busy
		listener, err = net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			log.Fatalf("[VortexDM] Failed to bind TCP listener: %v", err)
		}
	}

	actualPort := listener.Addr().(*net.TCPAddr).Port
	appURL := fmt.Sprintf("http://127.0.0.1:%d", actualPort)

	log.Printf("=========================================================")
	log.Printf("   ⚡ VortexDM v1.0.0 is running successfully!")
	log.Printf("   👉 Web Dashboard: %s", appURL)
	log.Printf("=========================================================")

	// Launch Desktop App Window (Edge App Mode or Browser)
	if !*headlessFlag {
		go launchDesktopWindow(appURL)
	}

	httpServer := &http.Server{
		Handler: srv.SetupRoutes(),
	}

	go func() {
		if err := httpServer.Serve(listener); err != nil && err != http.ErrServerClosed {
			log.Printf("[VortexDM] Server error: %v", err)
		}
	}()

	// Graceful shutdown on Ctrl+C or kill signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[VortexDM] Shutting down gracefully...")
	httpServer.Close()
	log.Println("[VortexDM] Goodbye!")
}

// launchDesktopWindow launches a frameless modern native window using Edge App mode or default browser
func launchDesktopWindow(url string) {
	time.Sleep(200 * time.Millisecond)

	if runtime.GOOS == "windows" {
		// Try Microsoft Edge in standalone Application Mode (frameless webapp window)
		edgePaths := []string{
			filepath.Join(os.Getenv("ProgramFiles(x86)"), "Microsoft", "Edge", "Application", "msedge.exe"),
			filepath.Join(os.Getenv("ProgramFiles"), "Microsoft", "Edge", "Application", "msedge.exe"),
			filepath.Join(os.Getenv("LocalAppData"), "Microsoft", "Edge", "Application", "msedge.exe"),
		}

		for _, p := range edgePaths {
			if _, err := os.Stat(p); err == nil {
				cmd := exec.Command(p, fmt.Sprintf("--app=%s", url), "--window-size=1080,720")
				if err := cmd.Start(); err == nil {
					return
				}
			}
		}

		// Fallback to default browser
		exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
		return
	}

	if runtime.GOOS == "darwin" {
		exec.Command("open", url).Start()
		return
	}

	// Linux
	exec.Command("xdg-open", url).Start()
}
