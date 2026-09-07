/**
 * VortexDM Companion - Frontend Scripts
 */

document.addEventListener('DOMContentLoaded', function() {
    // Copy Hash to clipboard
    document.querySelectorAll('.vortexdm-btn-copy-hash').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const hash = this.getAttribute('data-hash');
            if (!hash) return;

            navigator.clipboard.writeText(hash).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1500);
            }).catch(() => {});
        });
    });
});
