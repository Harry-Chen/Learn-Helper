var tr = document.createElement("tr")
document.querySelector("#left_menu > tbody").appendChild(tr)
var ref = chrome.extension.getURL("deadline.html")
tr.innerHTML = '<td class="menu_common"><a target="_blank" href="' + ref + '">Deadline！！！！</a></td>'

