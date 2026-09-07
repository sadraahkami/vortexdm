<?php
/**
 * Core orchestrator singleton for VortexDM Companion.
 */

if (!defined('ABSPATH')) {
    exit;
}

class VortexDM_Companion {

    private static $instance = null;
    public $admin = null;
    public $shortcode = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
        $this->init_components();
    }

    private function init_hooks() {
        add_action('init', array($this, 'load_textdomain'));
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));
        add_action('admin_enqueue_scripts', array($this, 'register_admin_assets'));
    }

    private function init_components() {
        $this->admin = new VortexDM_Admin();
        $this->shortcode = new VortexDM_Shortcode();
    }

    public function load_textdomain() {
        load_plugin_textdomain('vortexdm-companion', false, dirname(VORTEXDM_PLUGIN_BASENAME) . '/languages');
    }

    public function register_assets() {
        wp_register_style(
            'vortexdm-frontend-css',
            VORTEXDM_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            VORTEXDM_VERSION
        );

        wp_register_script(
            'vortexdm-frontend-js',
            VORTEXDM_PLUGIN_URL . 'assets/js/frontend.js',
            array(),
            VORTEXDM_VERSION,
            true
        );
    }

    public function register_admin_assets($hook) {
        if ('toplevel_page_vortexdm-settings' !== $hook) {
            return;
        }

        wp_enqueue_style(
            'vortexdm-admin-css',
            VORTEXDM_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            VORTEXDM_VERSION
        );

        wp_enqueue_script(
            'vortexdm-admin-js',
            VORTEXDM_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            VORTEXDM_VERSION,
            true
        );

        wp_localize_script('vortexdm-admin-js', 'vortexdm_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('vortexdm_admin_nonce')
        ));
    }
}
