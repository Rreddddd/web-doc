let $window, docOption = {
    percent: 100
};
let doc_container, doc_content, doc_content_wrapper;
let scroll_shadow, doc_footer;

function initView() {
    $window = $(window);
    doc_container = $(".doc-container");
    doc_content = doc_container.find(".doc-content");
    doc_content_wrapper = doc_container.find(".doc-content-wrapper");
    scroll_shadow = doc_container.find(".scroll-shadow");
    doc_footer = doc_container.find(".doc-footer");
    initPrint();
}

$(function () {
    initView();
    initDocContentScroll();
    initFooter();
});

function initDocContentScroll() {
    doc_content.webDocScroll({
        top: 50,
        bottom: 50,
        barSize: 0,
        onScroll: function (activePosition) {
            if (activePosition > 50) {
                scroll_shadow.addClass("show");
            } else {
                scroll_shadow.removeClass("show");
            }
        }
    });
}

let footer_btn_fullscreen, footer_btn_minus, footer_btn_percent, footer_btn_plus;

function initFooter() {
    footer_btn_fullscreen = doc_footer.find(".fullscreen").on("click", function () {
        if (footer_btn_fullscreen.hasClass("open")) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            let el = document.documentElement;
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (typeof rfs != "undefined" && rfs) {
                rfs.call(el);
            }
            footer_btn_fullscreen.removeClass("open");
        } else {
            let el = document.documentElement;
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (typeof rfs != "undefined" && rfs) {
                rfs.call(el);
                footer_btn_fullscreen.addClass("open");
            }
        }
    });
    footer_btn_minus = doc_footer.find(".minus").on("click", function () {
        let percent = docOption.percent - 5;
        if (percent < 50) {
            percent = 50;
        }
        scaleContent(percent);
    });
    footer_btn_plus = doc_footer.find(".plus").on("click", function () {
        let percent = docOption.percent + 5;
        if (percent > 200) {
            percent = 200;
        }
        scaleContent(percent);
    });
    footer_btn_percent = doc_footer.find(".percent").on("click", function () {

    });
    doc_container.onMousewheel(function (status, event) {
        if (event.ctrlKey) {
            if (status) {
                footer_btn_plus.click();
            } else {
                footer_btn_minus.click();
            }
            return false;
        }
    });
}

function scaleContent(percent) {
    let translateY = doc_content_wrapper.data("translateY") || 0;
    let scale = percent / 100;
    doc_content_wrapper.css("transform", "translateY(" + translateY + ") scale(" + scale + ")").data("scale", scale);
    docOption.percent = percent;
    footer_btn_percent.text(percent + "%");
    doc_content.webDocScroll("resize",scale);
}

function initPrint() {
    $window.on("keydown", function (event) {
        if (event.ctrlKey && event.which === 80) {
            enterPrintView();
            setTimeout(function () {
                exitPrintView();
            }, 1000);
        }
    });
}

function enterPrintView() {
    doc_content.addClass("print");
}

function exitPrintView() {
    doc_content.removeClass("print");
}

//------------------------ comment
$.fn.extend({
    onMousewheel: function (onChange) {
        let ele = this[0];
        onChange = onChange || function () {
        };
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
            ele.addEventListener('DOMMouseScroll', function (e) {
                if (onChange(e.detail > 0, e) === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, false);
        } else {
            ele.onmousewheel = function (e) {
                e = e || event;
                if (onChange(e.wheelDelta > 0, e) === false) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            };
        }
    }
});
let Arrays = {
    clone: function (arr) {
        let newArr = [];
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }
};