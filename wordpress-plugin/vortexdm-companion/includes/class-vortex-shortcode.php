<?php
/**
 * Shortcode handler for [vortex_download].
 */

if (!defined('ABSPATH')) {
    exit;
}

class VortexDM_Shortcode {

    public function __construct() {
        add_shortcode('vortex_download', array($this, 'render_shortcode'));
    }

    public function render_shortcode($atts) {
        $settings = get_option('vortexdm_settings', array(
            'api_endpoint'          => 'http://127.0.0.1:8080',
            'enable_deeplink'       => 1,
            'show_traffic_badge'    => 1,
            'card_theme'            => 'modern_dark',
            'direct_download_label' => 'Direct Download',
            'vortex_download_label' => 'Download with VortexDM'
        ));

        $atts = shortcode_atts(array(
            'url'       => '',
            'title'     => '',
            'size'      => '',
            'version'   => '',
            'hash'      => '',
            'domestic'  => '',
            'theme'     => $settings['card_theme'] ?? 'modern_dark',
            'btn_text'  => $settings['vortex_download_label'] ?? 'Download with VortexDM',
            'alt_text'  => $settings['direct_download_label'] ?? 'Direct Download'
        ), $atts, 'vortex_download');

        $download_url = esc_url_raw($atts['url']);
        if (empty($download_url)) {
            return '<!-- VortexDM: Empty download URL provided -->';
        }

        // Auto-detect filename from URL if title is missing
        $file_title = !empty($atts['title']) ? sanitize_text_field($atts['title']) : basename(parse_url($download_url, PHP_URL_PATH));
        if (empty($file_title)) {
            $file_title = __('Download Package', 'vortexdm-companion');
        }

        $file_size = sanitize_text_field($atts['size']);
        $file_version = sanitize_text_field($atts['version']);
        $file_hash = sanitize_text_field($atts['hash']);

        // Traffic badge flag
        $is_domestic = false;
        if (!empty($atts['domestic'])) {
            $is_domestic = filter_var($atts['domestic'], FILTER_VALIDATE_BOOLEAN);
        }

        // URI scheme for deep-link
        $deeplink_url = 'vortexdm://download?url=' . rawurlencode($download_url);

        // Enqueue frontend styles and scripts on demand
        wp_enqueue_style('vortexdm-frontend-css');
        wp_enqueue_script('vortexdm-frontend-js');

        // Render template buffer
        ob_start();
        include VORTEXDM_PLUGIN_DIR . 'templates/download-box.php';
        return ob_get_clean();
    }
}
