<?php
/**
 * Admin interface and settings handler for VortexDM Companion.
 */

if (!defined('ABSPATH')) {
    exit;
}

class VortexDM_Admin {

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('wp_ajax_vortexdm_test_connection', array($this, 'ajax_test_connection'));
    }

    public function add_admin_menu() {
        add_menu_page(
            __('VortexDM Companion Settings', 'vortexdm-companion'),
            __('VortexDM', 'vortexdm-companion'),
            'manage_options',
            'vortexdm-settings',
            array($this, 'render_admin_page'),
            'dashicons-download',
            75
        );
    }

    public function register_settings() {
        register_setting('vortexdm_settings_group', 'vortexdm_settings', array(
            'sanitize_callback' => array($this, 'sanitize_settings')
        ));
    }

    public function sanitize_settings($input) {
        $clean = array();
        $clean['api_endpoint'] = isset($input['api_endpoint']) ? esc_url_raw(trim($input['api_endpoint'])) : 'http://127.0.0.1:8080';
        $clean['enable_deeplink'] = !empty($input['enable_deeplink']) ? 1 : 0;
        $clean['show_traffic_badge'] = !empty($input['show_traffic_badge']) ? 1 : 0;
        $clean['card_theme'] = in_array($input['card_theme'] ?? '', array('modern_dark', 'sleek_light', 'minimal')) ? $input['card_theme'] : 'modern_dark';
        $clean['direct_download_label'] = sanitize_text_field($input['direct_download_label'] ?? 'Direct Download');
        $clean['vortex_download_label'] = sanitize_text_field($input['vortex_download_label'] ?? 'Download with VortexDM');
        return $clean;
    }

    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have sufficient permissions to access this page.', 'vortexdm-companion'));
        }

        $settings = get_option('vortexdm_settings', array(
            'api_endpoint'          => 'http://127.0.0.1:8080',
            'enable_deeplink'       => 1,
            'show_traffic_badge'    => 1,
            'card_theme'            => 'modern_dark',
            'direct_download_label' => 'Direct Download',
            'vortex_download_label' => 'Download with VortexDM'
        ));

        include VORTEXDM_PLUGIN_DIR . 'templates/admin-dashboard.php';
    }

    public function ajax_test_connection() {
        check_ajax_referer('vortexdm_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Unauthorized permission', 'vortexdm-companion')));
        }

        $endpoint = isset($_POST['endpoint']) ? esc_url_raw($_POST['endpoint']) : 'http://127.0.0.1:8080';
        $endpoint = rtrim($endpoint, '/') . '/api/speedtest/ping';

        $response = wp_remote_get($endpoint, array(
            'timeout'   => 4,
            'sslverify' => false
        ));

        if (is_wp_error($response)) {
            wp_send_json_error(array(
                'message' => __('Cannot reach VortexDM engine: ', 'vortexdm-companion') . $response->get_error_message()
            ));
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($code === 200 && isset($data['ping_ms'])) {
            wp_send_json_success(array(
                'message' => sprintf(__('Connected to VortexDM engine successfully (Ping: %.1f ms)', 'vortexdm-companion'), $data['ping_ms']),
                'ping'    => $data['ping_ms']
            ));
        } else {
            wp_send_json_error(array(
                'message' => sprintf(__('Engine replied with unexpected status code %d', 'vortexdm-companion'), $code)
            ));
        }
    }
}
