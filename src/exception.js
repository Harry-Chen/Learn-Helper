function init(){
	var parser = new DOMParser();
	var result = "";
	var bg = chrome.extension.getBackgroundPage();
	bg.processCourseList(false, createTable);
	$("#clearall").click(function(){clearAll()});
}
function createTable(courseList){
	var table = $('#course_table');
	table.children().remove();
	var head = $("<tr><th>课程序号</th><th>课程名称</th> <th>屏蔽作业</th> <th>屏蔽通知</th> <th>屏蔽文件</th> <th> 屏蔽讨论区</th></tr>");
	table.append(head);
	for (var i = 0; i < courseList.length; i++) {
		var id = courseList[i].id;
		var name = courseList[i].name;
		var row = $("<tr></tr>");
		var check = checkCourse(id);
		var hw_b = '<button class="exbtn checked' + (+check[0]) + '" data-args="' + 
					id + ',0,' + (+check[0]) +'">' + (check[0] ? "屏蔽" : "显示") + '</button>';
		var no_b = '<button class="exbtn checked' + (+check[1]) + '" data-args="' +
					id + ',1,' + (+check[1]) +'">' + (check[1] ? "屏蔽" : "显示") + '</button>';
		var fi_b = '<button class="exbtn checked' + (+check[2]) + '" data-args="' +
					id + ',2,' + (+check[2]) +'">' + (check[2] ? "屏蔽" : "显示") + '</button>';
		var di_b = '<button class="exbtn checked' + (+check[3]) + '" data-args="' +
					id + ',3,' + (+check[3]) +'">' + (check[3] ? "屏蔽" : "显示") + '</button>';
		var line = "<td>" + id + "</td><td>" + name + "</td><td>" +
			hw_b + "</td><td>" + no_b + "</td><td>" + fi_b + '</td><td>' + di_b + '</td>';
		row.html(line);
		table.append(row);
	}
	$('.exbtn').click(function() {
		var args = this.getAttribute('data-args').split(',');
		addException.apply(null, args);
		init();
	});
}
function checkCourse(id){
	hw_list = JSON.parse(localStorage.getItem("ignore_list_deadline")) || [];
	notifi_list = JSON.parse(localStorage.getItem("ignore_list_notification")) || [];
	file_list = JSON.parse(localStorage.getItem("ignore_list_file")) || [];
	discuss_list = JSON.parse(localStorage.getItem("ignore_list_discuss")) || [];
	return [hw_list.indexOf(id) !== -1, notifi_list.indexOf(id) !== -1, file_list.indexOf(id) !== -1, discuss_list.indexOf(id) !== -1];
}	
//op = 1 => 取消
//op = 0 => 添加	
//type = 0 =>作业, type = 1 => 通知
function addException(id, type, op){
	console.log(id , type , op);
	if (type == 0){
		var listname = "ignore_list_deadline";
	}
	else if (type == 1){
		var listname ="ignore_list_notification";
	}
	else if (type == 2){
		var listname ="ignore_list_file";
	}
	else if (type == 3){
		var listname ="ignore_list_discuss";
	}
	else{
		return;
	}
	var list = [];
	if (localStorage.getItem(listname)){
		list = JSON.parse(localStorage.getItem(listname));
	}
	for (var i = 0; i < list.length; i++){
		if (list[i] == id){
			if (op == 1){
				list[i] = list[list.length - 1];
				list.pop();
				localStorage[listname] = JSON.stringify(list);
			}
			return;
		}
	}
	list.push(id);
	localStorage[listname] = JSON.stringify(list);
	console.log(list);
}

function clearAll(){
	localStorage.removeItem("ignore_list_deadline");
	localStorage.removeItem("ignore_list_notification");
	localStorage.removeItem("ignore_list_file");
	localStorage.removeItem("ignore_list_discuss");
	window.location.reload();
}

$(function(){
	init();
});
