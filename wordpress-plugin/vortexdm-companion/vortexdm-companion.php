<?php
/**
 * Plugin Name:       VortexDM Companion
 * Plugin URI:        https://github.com/sadraahkami/vortexdm
 * Description:       Official companion plugin for VortexDM download manager. Embed high-speed download cards, one-click VortexDM launcher links, and domestic traffic indicators into WordPress.
 * Version:           1.0.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            Sadra Ahkami
 * Author URI:        https://github.com/sadraahkami
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       vortexdm-companion
 * Domain Path:       /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin Constants
define('VORTEXDM_VERSION', '1.0.0');
define('VORTEXDM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VORTEXDM_PLUGIN_URL', plugin_dir_url(__FILE__));
define('VORTEXDM_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Require Core Classes
require_once VORTEXDM_PLUGIN_DIR . 'includes/class-vortex-companion.php';
require_once VORTEXDM_PLUGIN_DIR . 'includes/class-vortex-admin.php';
require_once VORTEXDM_PLUGIN_DIR . 'includes/class-vortex-shortcode.php';

/**
 * Plugin activation hook.
 */
function vortexdm_activate() {
    $defaults = array(
        'api_endpoint'          => 'http://127.0.0.1:8080',
        'enable_deeplink'       => 1,
        'show_traffic_badge'    => 1,
        'card_theme'            => 'modern_dark',
        'direct_download_label' => 'Direct Download',
        'vortex_download_label' => 'Download with VortexDM'
    );

    if (!get_option('vortexdm_settings')) {
        update_option('vortexdm_settings', $defaults);
    }
}
register_activation_hook(__FILE__, 'vortexdm_activate');

/**
 * Plugin deactivation hook.
 */
function vortexdm_deactivate() {
    // Keep settings preserved for re-activation.
}
register_deactivation_hook(__FILE__, 'vortexdm_deactivate');

/**
 * Launch plugin orchestrator.
 */
function vortexdm_run() {
    return VortexDM_Companion::get_instance();
}

vortexdm_run();
