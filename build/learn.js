(function() {
    "use strict";

    var injectScript = function() {
        var s = document.createElement('script');
        s.src = chrome.extension.getURL("learn.inject.js");
        document.head.appendChild(s);
    };

    var href= window.location.href;
    if (href.match(/student\/download\.jsp/)) {
        var eHide = document.querySelector('#table_box:nth-child(1)');
        eHide.style.display = 'none';
		
        var e = document.querySelector('#table_box:nth-child(2)');
        e.style.position = "relative";
        e.style.top = "25px";
        e.style.borderTop = 'none';
        injectScript();
    } else if (href.match(/bbs\/talk_list_student\.jsp/)) {
        var e = document.querySelector('#info_1 tr:nth-child(3) td');
        e.style.borderTop = "none";

        e = document.querySelector('#info_1 tr:nth-child(4) table:nth-child(2)');
        e.style.position = "relative";
        e.style.top = "-5px";

        e = e.querySelectorAll(".textTD");
        for (var i = 0; i < e.length; i++) {
            e[i].style.padding = "5px";
        };

        injectScript();
    }

})();



