var tr = document.createElement("tr");
document.querySelector("#left_menu > tbody").appendChild(tr);

var ref = chrome.extension.getURL("handler.html") + "?id=";
tr.innerHTML = '<td class="menu_common"><a href="#" onclick="window.open(\'' + ref + '\' + window.location.href.match(/\\d+$/)[0]);return false;">DDL忽略本课</a></td>';

