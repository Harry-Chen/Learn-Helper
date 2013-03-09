var tr_options = document.createElement("tr");
ref = chrome.extension.getURL("index.html");
tr_options.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Learn</a></td>';

var menu = document.querySelector("#left_menu > tbody");

menu.appendChild(tr_options);
