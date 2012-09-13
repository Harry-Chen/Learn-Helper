(function() {
    "use strict";

    var injectScript = function() {
        var s = document.createElement('script');
        s.src = chrome.extension.getURL("learn.inject.js");
        document.head.appendChild(s);
    };

    var href= window.location.href;
    if (href.match(/student\/download\.jsp/)) {
        var e = document.getElementById('table_box');
        e.style.position = "absolute";
        e.style.top = "-30px";
        injectScript();
    } else if (href.match(/bbs\/talk_list_student\.jsp/)) {
        var e = document.querySelector('#info_1 tr:nth-child(4) table:nth-child(2)');
        e.style.position = "relative";
        e.style.top = "-26px";
        injectScript();
    }

})();
