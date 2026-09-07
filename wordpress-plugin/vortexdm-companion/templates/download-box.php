<?php
/**
 * Frontend download card template for VortexDM Companion.
 *
 * Variables provided by VortexDM_Shortcode:
 * $download_url, $file_title, $file_size, $file_version, $file_hash, $is_domestic, $deeplink_url, $atts, $settings
 */

if (!defined('ABSPATH')) {
    exit;
}

$theme_class = 'vortex-theme-' . esc_attr($atts['theme']);
?>
<div class="vortexdm-card-wrap <?php echo esc_attr($theme_class); ?>">
    <div class="vortexdm-card-inner">
        <!-- Header & File Meta -->
        <div class="vortexdm-meta-row">
            <div class="vortexdm-file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </div>

            <div class="vortexdm-file-info">
                <h4 class="vortexdm-file-title"><?php echo esc_html($file_title); ?></h4>
                <div class="vortexdm-badges-row">
                    <?php if (!empty($file_version)): ?>
                        <span class="vortexdm-badge vortexdm-badge-ver"><?php echo esc_html($file_version); ?></span>
                    <?php endif; ?>

                    <?php if (!empty($file_size)): ?>
                        <span class="vortexdm-badge vortexdm-badge-size"><?php echo esc_html($file_size); ?></span>
                    <?php endif; ?>

                    <?php if ($is_domestic && !empty($settings['show_traffic_badge'])): ?>
                        <span class="vortexdm-badge vortexdm-badge-domestic" title="<?php esc_attr_e('Half-price domestic traffic verified', 'vortexdm-companion'); ?>">
                            🟢 <?php esc_html_e('نیم‌بها / داخلی', 'vortexdm-companion'); ?>
                        </span>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <?php if (!empty($file_hash)): ?>
            <div class="vortexdm-hash-row">
                <span class="vortexdm-hash-label"><?php esc_html_e('SHA-256 / Checksum:', 'vortexdm-companion'); ?></span>
                <code class="vortexdm-hash-code"><?php echo esc_html($file_hash); ?></code>
                <button type="button" class="vortexdm-btn-copy-hash" data-hash="<?php echo esc_attr($file_hash); ?>" title="<?php esc_attr_e('Copy Hash', 'vortexdm-companion'); ?>">
                    📋
                </button>
            </div>
        <?php endif; ?>

        <!-- Action Buttons -->
        <div class="vortexdm-actions-row">
            <?php if (!empty($settings['enable_deeplink'])): ?>
                <a href="<?php echo esc_url($deeplink_url); ?>" class="vortexdm-btn vortexdm-btn-primary vortexdm-btn-deeplink">
                    <span class="vortexdm-btn-icon">⚡</span>
                    <span><?php echo esc_html($atts['btn_text']); ?></span>
                </a>
            <?php endif; ?>

            <a href="<?php echo esc_url($download_url); ?>" class="vortexdm-btn vortexdm-btn-secondary" download>
                <span class="vortexdm-btn-icon">⬇</span>
                <span><?php echo esc_html($atts['alt_text']); ?></span>
            </a>
        </div>
    </div>
</div>
