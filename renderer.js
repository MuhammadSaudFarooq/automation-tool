/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

$(document).ready(function () {

    // Score Test
    $('#automation-form').submit(function (e) {
        e.preventDefault();
        let _this = $(this);
        let form_input = _this.find('input');
        let website = form_input.val();
        // let pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,6})(\/[a-zA-Z0-9#-\/]*)?$/;
        let pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+(com|net|edu|gov|co|io|us)(\/[a-zA-Z0-9#-\/]*)?$/;
        let preloader = `<div class="preloader"><div><span>Running Analysis</span><div class="preloader-wrap"><div></div><div></div><div></div><div></div></div></div></div>`;

        $('.performance-result .main_center_box').remove();

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
                success: function (desktop_res) {
                    let strategy = 'mobile';
                    let desktop_result = desktop_res.lighthouseResult.categories.performance.score;
                    let desktop_img_data = '';
                    desktop_result = Math.trunc(desktop_result * 100);

                    // Desktop Screenshot
                    if (desktop_res.lighthouseResult && desktop_res.lighthouseResult.audits && desktop_res.lighthouseResult.audits['final-screenshot']) {
                        desktop_img_data = desktop_res.lighthouseResult.audits['final-screenshot'].details.data;

                    } else {
                        console.log('Desktop Screenshot not available in the response');
                    }

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
                        success: function (mobile_res) {
                            let mobile_img_data = '';
                            let mobile_result = mobile_res.lighthouseResult.categories.performance.score;
                            mobile_result = Math.trunc(mobile_result * 100);

                            // Mobile Screenshot
                            if (mobile_res.lighthouseResult && mobile_res.lighthouseResult.audits && mobile_res.lighthouseResult.audits['final-screenshot']) {
                                mobile_img_data = mobile_res.lighthouseResult.audits['final-screenshot'].details.data;

                            } else {
                                console.log('Mobile Screenshot not available in the response');
                            }

                            $(form_input).removeAttr('disabled');
                            $('.preloader').remove();

                            let desktop_template = `<div class="main_center_box">
                                                        <div class="pro_bar">
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
                                                        </div>
                                                        <div class="desktop-img">
                                                            <img src='${desktop_img_data}' alt='Desktop Screenshot' />
                                                        </div>
                                                    </div>`;
                            let mobile_template = `<div class="main_center_box">
                                                        <div class="pro_bar">
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
                                                        </div>
                                                        <div class="mobile-img">
                                                            <img src='${mobile_img_data}' alt='Desktop Screenshot' />
                                                        </div>
                                                    </div>`;

                            // Render Result
                            $('.performance-result #step-1').append(desktop_template, mobile_template);
                        },
                        error: function (error) {
                            let mobile_result = 0;
                            let mobile_img_data = './images/mobile-placeholder.png';

                            $(form_input).removeAttr('disabled');
                            $('.preloader').remove();

                            if (error.status >= 200 && error.status < 300) { }
                            else {
                                let mobile_template = `<div class="main_center_box">
                                                            <div class="pro_bar">
                                                                <div class="prog-1">  
                                                                    <div class="c100 p${mobile_result} big">
                                                                        <span>!</span>
                                                                        <div class="sl">
                                                                            <div class="slice">
                                                                            <div class="bar"></div>
                                                                            <div class="fill"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <h3 class="score_text">Mobile</h3>
                                                            </div>
                                                            <div class="mobile-img">
                                                                <img src='${mobile_img_data}' alt='Desktop Screenshot' />
                                                            </div>
                                                        </div>`;

                                // Render Result
                                $('.performance-result #step-1').append(mobile_template);
                            }
                        }
                    });
                },
                error: function (error) {
                    let desktop_result = 0;
                    let mobile_result = 0;
                    let desktop_img_data = './images/desktop-placeholder.png';
                    let mobile_img_data = './images/mobile-placeholder.png';

                    $(form_input).removeAttr('disabled');
                    $('.preloader').remove();

                    if (error.status >= 200 && error.status < 300) { }
                    else {
                        let desktop_template = `<div class="main_center_box">
                                                    <div class="pro_bar">
                                                        <div class="prog-1">  
                                                            <div class="c100 p${desktop_result} big">
                                                                <span>!</span>
                                                                <div class="sl">
                                                                    <div class="slice">
                                                                    <div class="bar"></div>
                                                                    <div class="fill"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 class="score_text">Dektop</h3>
                                                    </div>
                                                    <div class="desktop-img">
                                                        <img src='${desktop_img_data}' alt='Desktop Screenshot' />
                                                    </div>
                                                </div>`;
                        let mobile_template = `<div class="main_center_box">
                                                    <div class="pro_bar">
                                                        <div class="prog-1">  
                                                            <div class="c100 p${mobile_result} big">
                                                                <span>!</span>
                                                                <div class="sl">
                                                                    <div class="slice">
                                                                    <div class="bar"></div>
                                                                    <div class="fill"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 class="score_text">Mobile</h3>
                                                    </div>
                                                    <div class="mobile-img">
                                                        <img src='${mobile_img_data}' alt='Desktop Screenshot' />
                                                    </div>
                                                </div>`;

                        // Render Result
                        $('.performance-result #step-1').append(desktop_template, mobile_template);
                    }

                }
            });
        } else {
            form_input.addClass('invalid');
            $('.error-msg').remove();
            $(`<span class="error-msg">Invalid URL</span>`).insertAfter(form_input);
        }
    });

    // .htaccess code copy
    $('#copy-btn').on('click', function () {
        // Get the code content
        let codeContent = $('#code-block').text().trim();

        // Create a temporary textarea element
        let tempTextarea = $('<textarea>');
        tempTextarea.val(codeContent);
        $('body').append(tempTextarea);

        // Select the content and copy it
        tempTextarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea
        tempTextarea.remove();

        // Optional: Provide feedback to the user
        $(this).text('copied');

        setTimeout(() => {
            $(this).text('copy');
        }, 5000);
    });

    // Generate PDF
    $('.generate-report-btn').on('click', function () {
        let _this = $(this);
        let doc = new jsPDF();
        let date = new Date();
        let file_name = 'Retainer_Progress_Sheet_' + date.getFullYear() + '_' + date.getMonth() + '_' + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '.pdf';

        // doc.text('Hello world!', 10, 10);
        // doc.save(file_name);
    });
});

// Functions
let pageInsightUrl = (website, strategy) => {
    let url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${website}&strategy=${strategy}&category=performance&category=accessibility&screenshot=true`;
    return url;
}