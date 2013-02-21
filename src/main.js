var tr_options = document.createElement("tr");
ref = chrome.extension.getURL("sample2.html");
tr_options.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Learn</a></td>';

var menu = document.querySelector("#left_menu > tbody");
menu.appendChild(tr_deadline);
menu.appendChild(tr_notification);
menu.appendChild(tr_options);
