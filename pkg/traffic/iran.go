package traffic

import (
	"fmt"
	"net"
	"net/url"
	"strings"
	"sync"
)

type TrafficInfo struct {
	IsDomestic   bool   `json:"is_domestic"`
	TrafficBadge string `json:"traffic_badge"` // "domestic" or "international"
	Label        string `json:"label"`         // "نیم‌بها" or "تمام‌بها"
	IPAddress    string `json:"ip_address"`
	Host         string `json:"host"`
	LinkIraniURL string `json:"linkirani_url"`
}

var (
	cacheMu sync.RWMutex
	ipCache = make(map[string]TrafficInfo)
)

// Well-known Iranian CIDR ranges (sample representative subnets of major Iranian datacenters: Asiatech, Shatel, Afranet, Tebyan, MCI, Irancell, ParsOnline, TCI)
var domesticSubnets = []string{
	"5.160.0.0/12",
	"5.200.0.0/14",
	"31.56.0.0/14",
	"37.130.0.0/16",
	"37.152.0.0/15",
	"37.156.0.0/15",
	"37.255.0.0/16",
	"46.100.0.0/15",
	"46.224.0.0/14",
	"78.38.0.0/15",
	"79.175.128.0/17",
	"80.191.0.0/16",
	"82.99.192.0/18",
	"85.185.0.0/16",
	"89.165.0.0/16",
	"91.98.0.0/15",
	"94.182.0.0/15",
	"151.232.0.0/14",
	"178.252.0.0/15",
	"185.8.172.0/22",
	"185.128.0.0/16",
	"185.143.232.0/22",
	"188.136.0.0/15",
	"194.225.0.0/16",
}

var parsedSubnets []*net.IPNet

func init() {
	for _, cidr := range domesticSubnets {
		_, ipNet, err := net.ParseCIDR(cidr)
		if err == nil {
			parsedSubnets = append(parsedSubnets, ipNet)
		}
	}
}

// DetectTraffic analyzes a URL to determine if it uses Iran domestic (half-price) bandwidth.
func DetectTraffic(rawURL string) TrafficInfo {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return defaultInternational("", rawURL)
	}

	host := parsed.Hostname()
	if host == "" {
		host = rawURL
	}

	cacheMu.RLock()
	cached, found := ipCache[host]
	cacheMu.RUnlock()
	if found {
		return cached
	}

	info := resolveAndClassify(host)

	cacheMu.Lock()
	ipCache[host] = info
	cacheMu.Unlock()

	return info
}

func resolveAndClassify(host string) TrafficInfo {
	linkIraniTarget := fmt.Sprintf("https://linkirani.ir/?url=%s", url.QueryEscape(host))

	// Fast heuristic for .ir TLD
	isIrTLD := strings.HasSuffix(strings.ToLower(host), ".ir")

	// DNS resolution with timeout
	var resolvedIP string
	ips, err := net.LookupIP(host)
	if err == nil && len(ips) > 0 {
		for _, ip := range ips {
			if ipv4 := ip.To4(); ipv4 != nil {
				resolvedIP = ipv4.String()
				break
			}
		}
	}

	isDomestic := false
	if resolvedIP != "" {
		testIP := net.ParseIP(resolvedIP)
		for _, subnet := range parsedSubnets {
			if subnet.Contains(testIP) {
				isDomestic = true
				break
			}
		}
	}

	// If resolved IP matched Iranian subnets or domain is .ir
	if isDomestic || isIrTLD {
		return TrafficInfo{
			IsDomestic:   true,
			TrafficBadge: "domestic",
			Label:        "نیم‌بها",
			IPAddress:    resolvedIP,
			Host:         host,
			LinkIraniURL: linkIraniTarget,
		}
	}

	return TrafficInfo{
		IsDomestic:   false,
		TrafficBadge: "international",
		Label:        "تمام‌بها",
		IPAddress:    resolvedIP,
		Host:         host,
		LinkIraniURL: linkIraniTarget,
	}
}

func defaultInternational(ip string, host string) TrafficInfo {
	return TrafficInfo{
		IsDomestic:   false,
		TrafficBadge: "international",
		Label:        "تمام‌بها",
		IPAddress:    ip,
		Host:         host,
		LinkIraniURL: fmt.Sprintf("https://linkirani.ir/?url=%s", url.QueryEscape(host)),
	}
}
