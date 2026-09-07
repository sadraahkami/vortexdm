<?php
/**
 * Admin dashboard template for VortexDM Companion.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap vortexdm-admin-wrap">
    <div class="vortexdm-header">
        <div class="vortexdm-branding">
            <span class="vortexdm-logo-icon">⚡</span>
            <div>
                <h1><?php esc_html_e('VortexDM Companion Studio', 'vortexdm-companion'); ?></h1>
                <p class="vortexdm-subtitle"><?php esc_html_e('Seamless integration between WordPress and VortexDM Ultra Download Engine.', 'vortexdm-companion'); ?></p>
            </div>
        </div>
        <div class="vortexdm-version-badge">v<?php echo esc_html(VORTEXDM_VERSION); ?></div>
    </div>

    <div class="vortexdm-grid">
        <!-- Main Settings Column -->
        <div class="vortexdm-col-main">
            <div class="vortexdm-card">
                <h2><?php esc_html_e('General Configuration', 'vortexdm-companion'); ?></h2>
                <form method="post" action="options.php">
                    <?php
                    settings_fields('vortexdm_settings_group');
                    ?>
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="vortexdm_api_endpoint"><?php esc_html_e('VortexDM API Endpoint:', 'vortexdm-companion'); ?></label>
                            </th>
                            <td>
                                <div class="vortexdm-input-group">
                                    <input type="url" id="vortexdm_api_endpoint" name="vortexdm_settings[api_endpoint]" 
                                           value="<?php echo esc_attr($settings['api_endpoint']); ?>" class="regular-text code" />
                                    <button type="button" id="vortexdm_btn_test_conn" class="button button-secondary">
                                        <?php esc_html_e('Test Connection', 'vortexdm-companion'); ?>
                                    </button>
                                </div>
                                <p class="description">
                                    <?php esc_html_e('Local or remote URL where VortexDM is running (default: http://127.0.0.1:8080).', 'vortexdm-companion'); ?>
                                </p>
                                <div id="vortexdm_test_result" class="vortexdm-notice hidden"></div>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row"><?php esc_html_e('Deep-Link Launcher:', 'vortexdm-companion'); ?></th>
                            <td>
                                <label>
                                    <input type="checkbox" name="vortexdm_settings[enable_deeplink]" value="1" <?php checked($settings['enable_deeplink'], 1); ?> />
                                    <?php esc_html_e('Enable vortexdm:// direct app launcher button on download boxes', 'vortexdm-companion'); ?>
                                </label>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row"><?php esc_html_e('Domestic Traffic Badge:', 'vortexdm-companion'); ?></th>
                            <td>
                                <label>
                                    <input type="checkbox" name="vortexdm_settings[show_traffic_badge]" value="1" <?php checked($settings['show_traffic_badge'], 1); ?> />
                                    <?php esc_html_e('Allow display of Iranian domestic half-price indicator badge', 'vortexdm-companion'); ?>
                                </label>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="vortexdm_card_theme"><?php esc_html_e('Default Visual Theme:', 'vortexdm-companion'); ?></label>
                            </th>
                            <td>
                                <select id="vortexdm_card_theme" name="vortexdm_settings[card_theme]">
                                    <option value="modern_dark" <?php selected($settings['card_theme'], 'modern_dark'); ?>>
                                        <?php esc_html_e('Modern Dark (Glassmorphism)', 'vortexdm-companion'); ?>
                                    </option>
                                    <option value="sleek_light" <?php selected($settings['card_theme'], 'sleek_light'); ?>>
                                        <?php esc_html_e('Sleek Light', 'vortexdm-companion'); ?>
                                    </option>
                                    <option value="minimal" <?php selected($settings['card_theme'], 'minimal'); ?>>
                                        <?php esc_html_e('Minimal Clean', 'vortexdm-companion'); ?>
                                    </option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="vortexdm_btn_label"><?php esc_html_e('VortexDM Button Label:', 'vortexdm-companion'); ?></label>
                            </th>
                            <td>
                                <input type="text" id="vortexdm_btn_label" name="vortexdm_settings[vortex_download_label]" 
                                       value="<?php echo esc_attr($settings['vortex_download_label']); ?>" class="regular-text" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="vortexdm_direct_label"><?php esc_html_e('Direct Button Label:', 'vortexdm-companion'); ?></label>
                            </th>
                            <td>
                                <input type="text" id="vortexdm_direct_label" name="vortexdm_settings[direct_download_label]" 
                                       value="<?php echo esc_attr($settings['direct_download_label']); ?>" class="regular-text" />
                            </td>
                        </tr>
                    </table>

                    <?php submit_button(__('Save Settings', 'vortexdm-companion')); ?>
                </form>
            </div>
        </div>

        <!-- Sidebar / Shortcode Helper Column -->
        <div class="vortexdm-col-side">
            <div class="vortexdm-card">
                <h3><?php esc_html_e('Shortcode Quick Generator', 'vortexdm-companion'); ?></h3>
                <p><?php esc_html_e('Paste this shortcode into any WordPress post or page:', 'vortexdm-companion'); ?></p>

                <div class="vortexdm-code-box">
                    <code>[vortex_download url="https://example.com/file.zip" title="Latest Release" size="85 MB" domestic="true"]</code>
                </div>

                <h4><?php esc_html_e('Supported Attributes:', 'vortexdm-companion'); ?></h4>
                <ul class="vortexdm-attribute-list">
                    <li><strong>url:</strong> <?php esc_html_e('Direct download URL (Required)', 'vortexdm-companion'); ?></li>
                    <li><strong>title:</strong> <?php esc_html_e('File name / Title', 'vortexdm-companion'); ?></li>
                    <li><strong>size:</strong> <?php esc_html_e('File size (e.g. 50 MB, 1.2 GB)', 'vortexdm-companion'); ?></li>
                    <li><strong>version:</strong> <?php esc_html_e('Software version string', 'vortexdm-companion'); ?></li>
                    <li><strong>hash:</strong> <?php esc_html_e('SHA-256 or MD5 integrity checksum', 'vortexdm-companion'); ?></li>
                    <li><strong>domestic:</strong> <?php esc_html_e('"true" for domestic half-price indicator', 'vortexdm-companion'); ?></li>
                </ul>
            </div>

            <div class="vortexdm-card vortexdm-highlight-card">
                <h3><?php esc_html_e('About VortexDM', 'vortexdm-companion'); ?></h3>
                <p><?php esc_html_e('VortexDM is a modern, zero-dependency download manager engineered in Go with multi-segmented concurrency, proxy routing, Wi-Fi mobile sharing, and media streaming preview.', 'vortexdm-companion'); ?></p>
                <a href="https://github.com/sadraahkami/vortexdm" target="_blank" rel="noopener noreferrer" class="button button-primary">
                    <?php esc_html_e('GitHub Repository', 'vortexdm-companion'); ?> ↗
                </a>
            </div>
        </div>
    </div>
</div>
