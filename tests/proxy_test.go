package tests

import (
	"context"
	"io"
	"net"
	"net/http"
	"testing"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/proxy"
	"github.com/sadraahkami/vortexdm/pkg/settings"
)

func TestSOCKS5HandshakeMock(t *testing.T) {
	// Start a mock SOCKS5 server on a random local port
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("failed to start mock SOCKS5 server: %v", err)
	}
	defer ln.Close()

	mockProxyAddr := ln.Addr().String()

	// Mock SOCKS5 server handler
	go func() {
		conn, err := ln.Accept()
		if err != nil {
			return
		}
		defer conn.Close()

		// Read greeting [0x05, 0x01, 0x00]
		greeting := make([]byte, 3)
		if _, err := io.ReadFull(conn, greeting); err != nil {
			return
		}
		// Send reply: version 5, no auth [0x05, 0x00]
		conn.Write([]byte{0x05, 0x00})

		// Read connect request header [VER 0x05, CMD 0x01, RSV 0x00, ATYP]
		reqHeader := make([]byte, 4)
		if _, err := io.ReadFull(conn, reqHeader); err != nil {
			return
		}

		// Drain target addr based on ATYP
		if reqHeader[3] == 0x03 { // domain
			var lenBuf [1]byte
			io.ReadFull(conn, lenBuf[:])
			domainBuf := make([]byte, int(lenBuf[0])+2) // domain + port
			io.ReadFull(conn, domainBuf)
		} else if reqHeader[3] == 0x01 { // IPv4
			ipv4Buf := make([]byte, 4+2)
			io.ReadFull(conn, ipv4Buf)
		}

		// Send success response: [0x05, 0x00, 0x00, 0x01, 127, 0, 0, 1, 0x1F, 0x90]
		conn.Write([]byte{0x05, 0x00, 0x00, 0x01, 127, 0, 0, 1, 0x1F, 0x90})
	}()

	// Dial through our pure-Go RFC 1928 SOCKS5 client
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	conn, err := proxy.DialSOCKS5(ctx, mockProxyAddr, "example.com:80", 2*time.Second)
	if err != nil {
		t.Fatalf("expected successful SOCKS5 dial, got error: %v", err)
	}
	defer conn.Close()
}

func TestProxyDomesticBypass(t *testing.T) {
	cfg := settings.Settings{
		ProxyEnabled:        true,
		ProxyType:           "socks5",
		ProxyAddress:        "127.0.0.1:10808",
		ProxyBypassDomestic: true,
	}

	// 1. Domestic Iranian URL (.ir) should bypass proxy completely
	trDomestic := proxy.NewTransport(cfg, "https://soft98.ir/download.zip")
	if trDomestic.DialContext != nil {
		t.Errorf("expected domestic URL to bypass proxy (DialContext should be nil), but proxy was applied")
	}

	// 2. International URL should route through proxy
	trIntl := proxy.NewTransport(cfg, "https://github.com/file.zip")
	if trIntl.DialContext == nil {
		t.Errorf("expected international URL to route through SOCKS5 proxy, but DialContext was nil")
	}

	// 3. HTTP Proxy mode test
	cfgHTTP := settings.Settings{
		ProxyEnabled:        true,
		ProxyType:           "http",
		ProxyAddress:        "127.0.0.1:8080",
		ProxyBypassDomestic: false,
	}
	trHTTP := proxy.NewTransport(cfgHTTP, "https://example.com/data.bin")
	req, _ := http.NewRequest("GET", "https://example.com/data.bin", nil)
	proxyURL, err := trHTTP.Proxy(req)
	if err != nil || proxyURL == nil || proxyURL.Host != "127.0.0.1:8080" {
		t.Errorf("expected HTTP proxy URL to be 127.0.0.1:8080, got %v (err: %v)", proxyURL, err)
	}
}
