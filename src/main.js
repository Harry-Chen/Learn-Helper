var tr_deadline = document.createElement("tr");
var ref = chrome.extension.getURL("deadline.html");
tr_deadline.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Deadline</a></td>';

var tr_notification = document.createElement("tr");
ref = chrome.extension.getURL("notification.html");
tr_notification.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Notification</a></td>';

var tr_options = document.createElement("tr");
ref = chrome.extension.getURL("sample2.html");
tr_options.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Command Panel</a></td>';

var menu = document.querySelector("#left_menu > tbody");
menu.appendChild(tr_deadline);
menu.appendChild(tr_notification);
menu.appendChild(tr_options);
