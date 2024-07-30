/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

$(document).ready(function () {
    $('#automation-form').submit(function (e) {
        e.preventDefault();
        let _this = $(this);
        let form_input = _this.find('input');
        let url = form_input.val();
        let pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,6})(\/[a-zA-Z0-9#-\/]*)?$/;
        let preloader = `<div class="preloader"><div><div class="preloader-wrap"><div></div><div></div><div></div><div></div></div></div></div>`;


        if (pattern.test(url)) {
            form_input.removeClass('invalid');
            $('.error-msg').remove();

            // For Desktop
            $.ajax({
                url: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=desktop&category=performance&category=accessibility`,
                method: 'GET',
                beforeSend: function () {
                    $(preloader).insertAfter(form_input);
                    $(form_input).attr('disabled', 'disabled');
                },
                success: function (res) {
                    $(form_input).removeAttr('disabled');
                    $('.preloader').remove();

                    console.log(res.lighthouseResult.categories.performance.score);
                },
                error: function (error) {
                    $(form_input).removeAttr('disabled');
                    $('.preloader').remove();

                    console.error('Error:', error);
                }
            });
        } else {
            form_input.addClass('invalid');
            $(`<span class="error-msg">Invalid URL</span>`).insertAfter(form_input);
        }
    });


    // setInterval(() => {
    //     console.log('Connection Status', navigator.onLine);
    // }, 1000);
});