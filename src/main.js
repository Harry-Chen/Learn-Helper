var tr_deadline = document.createElement("tr")
document.querySelector("#left_menu > tbody").appendChild(tr_deadline)
var ref = chrome.extension.getURL("deadline.html")
tr_deadline.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Deadline！！！！</a></td>'

var tr_notification = document.createElement("tr")
document.querySelector("#left_menu > tbody").appendChild(tr_notification)
ref = chrome.extension.getURL("notification.html")
tr_notification.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Notification！！！！</a></td>'

