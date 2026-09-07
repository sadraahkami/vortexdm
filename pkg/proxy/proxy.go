package proxy

import (
	"context"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/sadraahkami/vortexdm/pkg/settings"
	"github.com/sadraahkami/vortexdm/pkg/traffic"
)

// DialSOCKS5 establishes a TCP connection to targetAddr via the SOCKS5 proxy at proxyAddr.
// Implements RFC 1928 client protocol without external third-party dependencies.
func DialSOCKS5(ctx context.Context, proxyAddr, targetAddr string, timeout time.Duration) (net.Conn, error) {
	var d net.Dialer
	d.Timeout = timeout

	conn, err := d.DialContext(ctx, "tcp", proxyAddr)
	if err != nil {
		return nil, fmt.Errorf("socks5: dial proxy %s failed: %w", proxyAddr, err)
	}

	// Step 1: Greeting (Version 5, 1 Method, No Authentication 0x00)
	if _, err := conn.Write([]byte{0x05, 0x01, 0x00}); err != nil {
		conn.Close()
		return nil, fmt.Errorf("socks5: handshake write greeting failed: %w", err)
	}

	// Read greeting response (2 bytes)
	var resp [2]byte
	if _, err := io.ReadFull(conn, resp[:]); err != nil {
		conn.Close()
		return nil, fmt.Errorf("socks5: handshake read greeting response failed: %w", err)
	}

	if resp[0] != 0x05 {
		conn.Close()
		return nil, fmt.Errorf("socks5: unsupported version: %d", resp[0])
	}
	if resp[1] != 0x00 {
		conn.Close()
		return nil, fmt.Errorf("socks5: proxy requires authentication (method %d)", resp[1])
	}

	// Step 2: Parse target host and port
	host, portStr, err := net.SplitHostPort(targetAddr)
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("socks5: invalid target address %s: %w", targetAddr, err)
	}
	port, err := strconv.Atoi(portStr)
	if err != nil || port <= 0 || port > 65535 {
		conn.Close()
		return nil, fmt.Errorf("socks5: invalid target port: %s", portStr)
	}

	// Construct connect request buffer
	// [VER, CMD, RSV, ATYP, DST.ADDR, DST.PORT]
	req := make([]byte, 0, 260)
	req = append(req, 0x05, 0x01, 0x00)

	ip := net.ParseIP(host)
	if ip == nil {
		// Domain name
		if len(host) > 255 {
			conn.Close()
			return nil, errors.New("socks5: domain name too long")
		}
		req = append(req, 0x03, byte(len(host)))
		req = append(req, host...)
	} else if ipv4 := ip.To4(); ipv4 != nil {
		// IPv4
		req = append(req, 0x01)
		req = append(req, ipv4...)
	} else {
		// IPv6
		req = append(req, 0x04)
		req = append(req, ip.To16()...)
	}

	// Port (2 bytes Big Endian)
	portBuf := make([]byte, 2)
	binary.BigEndian.PutUint16(portBuf, uint16(port))
	req = append(req, portBuf...)

	if _, err := conn.Write(req); err != nil {
		conn.Close()
		return nil, fmt.Errorf("socks5: write connect request failed: %w", err)
	}

	// Step 3: Read connect response header [VER, REP, RSV, ATYP]
	var repHeader [4]byte
	if _, err := io.ReadFull(conn, repHeader[:]); err != nil {
		conn.Close()
		return nil, fmt.Errorf("socks5: read connect response failed: %w", err)
	}

	if repHeader[0] != 0x05 {
		conn.Close()
		return nil, fmt.Errorf("socks5: invalid response version: %d", repHeader[0])
	}
	if repHeader[1] != 0x00 {
		conn.Close()
		return nil, formatSocksError(repHeader[1])
	}

	// Drain bound address and port according to ATYP to leave stream clean
	switch repHeader[3] {
	case 0x01: // IPv4
		var drain [4 + 2]byte
		io.ReadFull(conn, drain[:])
	case 0x04: // IPv6
		var drain [16 + 2]byte
		io.ReadFull(conn, drain[:])
	case 0x03: // Domain
		var lenBuf [1]byte
		if _, err := io.ReadFull(conn, lenBuf[:]); err == nil {
			drain := make([]byte, int(lenBuf[0])+2)
			io.ReadFull(conn, drain)
		}
	}

	return conn, nil
}

func formatSocksError(code byte) error {
	switch code {
	case 0x01:
		return errors.New("socks5: general SOCKS server failure")
	case 0x02:
		return errors.New("socks5: connection not allowed by ruleset")
	case 0x03:
		return errors.New("socks5: network unreachable")
	case 0x04:
		return errors.New("socks5: host unreachable")
	case 0x05:
		return errors.New("socks5: connection refused")
	case 0x06:
		return errors.New("socks5: TTL expired")
	case 0x07:
		return errors.New("socks5: command not supported")
	case 0x08:
		return errors.New("socks5: address type not supported")
	default:
		return fmt.Errorf("socks5: error code 0x%02x", code)
	}
}

// NewTransport returns an optimized http.Transport respecting the configured proxy and smart bypass rules.
func NewTransport(cfg settings.Settings, targetURL string) *http.Transport {
	baseTransport := &http.Transport{
		MaxIdleConns:        100,
		MaxIdleConnsPerHost: 32,
		IdleConnTimeout:     90 * time.Second,
		DisableCompression:  true,
	}

	if !cfg.ProxyEnabled || strings.TrimSpace(cfg.ProxyAddress) == "" {
		return baseTransport
	}

	// Smart Domestic Bypass: Iranian servers connect directly for maximum speed and half-price tariff
	if cfg.ProxyBypassDomestic && targetURL != "" {
		if traffic.DetectTraffic(targetURL).IsDomestic {
			return baseTransport
		}
	}

	proxyType := strings.ToLower(strings.TrimSpace(cfg.ProxyType))
	proxyAddr := strings.TrimSpace(cfg.ProxyAddress)

	if proxyType == "http" || proxyType == "https" {
		raw := proxyAddr
		if !strings.HasPrefix(raw, "http://") && !strings.HasPrefix(raw, "https://") {
			raw = "http://" + raw
		}
		if u, err := url.Parse(raw); err == nil {
			baseTransport.Proxy = http.ProxyURL(u)
			return baseTransport
		}
	}

	// Default to SOCKS5
	baseTransport.DialContext = func(ctx context.Context, network, addr string) (net.Conn, error) {
		return DialSOCKS5(ctx, proxyAddr, addr, 20*time.Second)
	}

	return baseTransport
}
