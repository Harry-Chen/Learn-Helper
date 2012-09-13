(function() {
	 "use strict";

	if (window.location.href.match(/download\.jsp/)) {
		var e = document.getElementById('table_box');
		e.style.position = "absolute";
		e.style.top = "-30px";
	}
	else if (window.location.href.match(/talk_list_student\.jsp/)){
		var e = document.querySelector('#info_1 tr:nth-child(4) table:nth-child(2)');
		e.style.position = "relative";
		e.style.top = "-26px";
	}
 })();

