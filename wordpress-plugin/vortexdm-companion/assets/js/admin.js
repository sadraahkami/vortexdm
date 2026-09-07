/**
 * VortexDM Companion - Admin Scripts
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const testBtn = $('#vortexdm_btn_test_conn');
        const endpointInput = $('#vortexdm_api_endpoint');
        const resultNotice = $('#vortexdm_test_result');

        if (!testBtn.length) return;

        testBtn.on('click', function(e) {
            e.preventDefault();
            const endpoint = endpointInput.val().trim();

            testBtn.prop('disabled', true).text('Testing...');
            resultNotice.removeClass('success error hidden').text('Connecting to VortexDM...').show();

            $.ajax({
                url: vortexdm_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'vortexdm_test_connection',
                    nonce: vortexdm_ajax.nonce,
                    endpoint: endpoint
                },
                success: function(response) {
                    testBtn.prop('disabled', false).text('Test Connection');
                    if (response.success) {
                        resultNotice.removeClass('error').addClass('success').text(response.data.message);
                    } else {
                        resultNotice.removeClass('success').addClass('error').text(response.data.message || 'Connection failed');
                    }
                },
                error: function() {
                    testBtn.prop('disabled', false).text('Test Connection');
                    resultNotice.removeClass('success').addClass('error').text('AJAX request failed. Check server logs.');
                }
            });
        });
    });
})(jQuery);
