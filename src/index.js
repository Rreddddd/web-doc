let $window;
let doc_content,doc_content_wrapper;
function initView(){
    $window=$(window);
    doc_content=$(".doc-content");
    doc_content_wrapper=doc_content.find(".doc-content");
    initPrint();
}

$(function(){
    initView();
});

function initPrint(){
    $window.on("keydown",function(event){
        if(event.ctrlKey && event.which===80){
            enterPrintView();
            setTimeout(function(){
                exitPrintView();
            },1000);
        }
    });
}

function enterPrintView(){
    doc_content.addClass("print");
}

function exitPrintView(){
    doc_content.removeClass("print");
}