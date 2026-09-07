=== VortexDM Companion ===
Contributors: sadraahkami
Donate link: https://github.com/sadraahkami/vortexdm
Tags: download manager, downloads, vortexdm, file manager, digital downloads
Requires at least: 5.6
Tested up to: 6.7
Stable tag: 1.0.0
Requires PHP: 7.4
License: MIT
License URI: https://opensource.org/licenses/MIT

High-performance download distributor and companion plugin for VortexDM desktop download manager.

== Description ==

VortexDM Companion is the official WordPress integration for the ultra-fast, zero-dependency VortexDM desktop download manager.

= Key Features =
* **One-Click VortexDM Launcher:** Generate custom URI deep-links (`vortexdm://download?url=...`) that automatically push downloads straight to the user's VortexDM desktop application.
* **Modern Download Cards:** Responsive, aesthetic shortcode boxes showing file titles, sizes, versions, and direct download alternatives.
* **Iranian Domestic Traffic Badge:** Automatically highlight domestic half-price hosts to visitors with real-time verification indicators.
* **Zero Bloat & Blazing Fast:** Zero external JS/CSS dependencies, ultra-lightweight footprint matching the VortexDM design philosophy.
* **Customizable Shortcodes:** Flexible parameters for URL, title, size, checksum hash, and visual style.

== Installation ==

1. Upload the `vortexdm-companion` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Configure settings under **VortexDM** in the WordPress admin menu.
4. Use the `[vortex_download]` shortcode in any post, page, or widget.

== Usage ==

Insert the shortcode into any post or page:

`[vortex_download url="https://example.com/file.zip" title="Project Archive" size="45 MB" version="1.0" domestic="true"]`

Parameters:
* `url`: Direct file download URL (Required).
* `title`: Title or filename displayed on the download card.
* `size`: Human-readable file size (e.g. 120 MB, 1.4 GB).
* `version`: Version string (e.g. v2.4.1).
* `hash`: Expected SHA-256 or MD5 integrity checksum.
* `domestic`: Set to `true` to show the domestic half-price traffic indicator.

== Changelog ==

= 1.0.0 =
* Initial release of VortexDM Companion.
* Added `[vortex_download]` shortcode with deep-linking support.
* Added administrative connection tester to local/remote VortexDM engines.
* Added domestic Iranian traffic badge renderer.
