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
        let website = form_input.val();
        let pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,6})(\/[a-zA-Z0-9#-\/]*)?$/;
        let preloader = `<div class="preloader"><div><div class="preloader-wrap"><div></div><div></div><div></div><div></div></div></div></div>`;


        if (pattern.test(website)) {
            let strategy = 'desktop';

            form_input.removeClass('invalid');
            $('.error-msg').remove();

            // For Desktop
            $.ajax({
                url: pageInsightUrl(website, strategy),
                method: 'GET',
                beforeSend: function () {
                    $(preloader).insertAfter(form_input);
                    $(form_input).attr('disabled', 'disabled');
                },
                success: function (res) {
                    let strategy = 'mobile';
                    let desktop_result = res.lighthouseResult.categories.performance.score;
                    desktop_result = Math.trunc(desktop_result * 100);

                    $(form_input).removeAttr('disabled');
                    $('.preloader').remove();

                    // For Mobile
                    $.ajax({
                        url: pageInsightUrl(website, strategy),
                        method: 'GET',
                        beforeSend: function () {
                            $(preloader).insertAfter(form_input);
                            $(form_input).attr('disabled', 'disabled');
                        },
                        success: function (res) {
                            let mobile_result = res.lighthouseResult.categories.performance.score;
                            mobile_result = Math.trunc(mobile_result * 100);

                            $(form_input).removeAttr('disabled');
                            $('.preloader').remove();

                            // Colors for desktop
                            let color_desktop = '';
                            let border_desktop = '';
                            let bg_desktop = '';

                            if (desktop_result >= 90 && desktop_result <= 100) {
                                color_desktop = 'var(--good)';
                                border_desktop = 'var(--good)';
                                bg_desktop = 'var(--good-bg)';
                            }
                            else if (desktop_result >= 50 && desktop_result <= 89) {
                                color_desktop = 'var(--average)';
                                border_desktop = 'var(--average)';
                                bg_desktop = 'var(--average-bg)';
                            }
                            else {
                                color_desktop = 'var(--poor)';
                                border_desktop = 'var(--poor)';
                                bg_desktop = 'var(--poor-bg)';
                            }

                            // Colors for mobile
                            let color_mobile = '';
                            let border_mobile = '';
                            let bg_mobile = '';

                            if (mobile_result >= 90 && mobile_result <= 100) {
                                color_mobile = 'var(--good)';
                                border_mobile = 'var(--good)';
                                bg_mobile = 'var(--good-bg)';
                            }
                            else if (mobile_result >= 50 && mobile_result <= 89) {
                                color_mobile = 'var(--average)';
                                border_mobile = 'var(--average)';
                                bg_mobile = 'var(--average-bg)';
                            }
                            else {
                                color_mobile = 'var(--poor)';
                                border_mobile = 'var(--poor)';
                                bg_mobile = 'var(--poor-bg)';
                            }

                            let desktop_template = `<div class="pro_bar">
                                                        <div class="prog-1">  
                                                            <div class="c100 p${desktop_result} big">
                                                                <span>${desktop_result}</span>
                                                                <div class="sl">
                                                                    <div class="slice">
                                                                    <div class="bar"></div>
                                                                    <div class="fill"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 class="score_text">Dektop</h3>
                                                    </div>`;
                            let mobile_template = `<div class="pro_bar">
                                                        <div class="prog-1">  
                                                            <div class="c100 p${mobile_result} big">
                                                                <span>${mobile_result}</span>
                                                                <div class="sl">
                                                                    <div class="slice">
                                                                    <div class="bar"></div>
                                                                    <div class="fill"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 class="score_text">Mobile</h3>
                                                    </div>`;

                            $('.main_center_box').append(mobile_template);
                            $('.main_center_box').append(desktop_template);
                        },
                        error: function (error) {
                            $(form_input).removeAttr('disabled');
                            $('.preloader').remove();
                            console.error('Mobile Error:', error);
                        }
                    });
                },
                error: function (error) {
                    $(form_input).removeAttr('disabled');
                    $('.preloader').remove();
                    console.error('Desktop Error:', error);
                }
            });
        } else {
            form_input.addClass('invalid');
            $(`<span class="error-msg">Invalid URL</span>`).insertAfter(form_input);
        }
    });
});

// Functions
let pageInsightUrl = (website, strategy) => {
    let url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${website}&strategy=${strategy}&category=performance&category=accessibility`;
    return url;
}