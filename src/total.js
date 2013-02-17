var getURLParamters = window.getURLParamters;

function net_getCourseList(callback){
	var parser = new DOMParser();
	$.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp', function(data) {
	//$.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?typepage=2', function(data) {
			var courseDocument = parser.parseFromString(data, 'text/html');
			var courseList = courseDocument.querySelectorAll('#info_1 a');
			courseList = Array.prototype.slice.call(courseList);
			db_updateCourseList( courseList, callback)
			});
}

function db_updateCourseList(courseList, args){
	var db_courseList = [];
	for (var i = 0; i < courseList.length; i++){
		id = getURLParamters(courseList[i].getAttribute('href')).course_id;
		var name = $.trim(courseList[i].innerText);
		name = name.match(/^([^(]*)\(/)[1];
		var course = { 'id' : id,
			 'name' : name
		};
		db_courseList.push(course);
	}
	localStorage.course_list = JSON.stringify(db_courseList);
	if (args){
		args(db_courseList);
	}
}
function db_updateList(type, List, args){
	if (type == 'deadline'){
		localStorage.deadline_list = JSON.stringify(List);
	}
	else if (type = 'notification'){
		localStorage.notification_list = JSON.stringify(List);
	}
	if (args){
		args(List);
	}
}

function gui_main_updateCourseList(courseList){
	var GUIlist= $('#course-list');
	GUIlist.children().remove();
	for (var i = 0; i < courseList.length; i++){
		var id = courseList[i].id;
		var name = courseList[i].name;
		var k = $('<li>' +
			'<a target="_blank" ' + 
			'href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp' + 
			'?course_id=' + id + '">' + name + '</a></li>');
		GUIlist.append(k);
	}
}
function sortDeadline(deadlineList){
	deadlineList= deadlineList.sort(function(a, b) {
		if (a.state === '尚未提交' && a.end < new Date()) {
			return 1;
		}
		if (b.state === '尚未提交' && b.end < new Date()) {
			return -1;
		}
		if (a.state === b.state) {
			return a.end - b.end;
		}
		return (a.state === '尚未提交') ? -1 : 1;
	});
}

function gui_main_updateDeadlineList(deadlineList){
	//deadlineList = sortDeadline(deadlineList);
	var GUIlist = $('#nearby-deadline tr');
	GUIlist.slice(1).remove();
	var GUIlist = $('#nearby-deadline');
	var today = new Date();
	for (var i = 0; i < deadlineList.length && i < 10; i++){
		dueDays = Math.floor((new Date(deadlineList[i].end) - today) / (60 * 60 * 1000 * 24));
		var line = '<tr>';
		line += '<td>' + dueDays + '</td>';
		line += '<td>' + new Date(deadlineList[i].end).toDateString() + '</td>';
		line += '<td>' + deadlineList[i].name + '</td>';
		line += '<td><a target="_blank" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp?course_id=' + deadlineList[i].courseId + '">' + deadlineList[i].courseName.replace(/\(\d+\)\(.*$/, '') + '</a></td>';
		line += '</tr>';
		GUIlist.append($(line));
	}
}

function gui_main_updateNotificationList(notificationList){
	//notificationList = sortDeadline(notificationList);
	var GUIlist = $('#unread-notification tr');
	GUIlist.slice(1).remove();
	var GUIlist = $('#unread-notification');
	var today = new Date();
	for (var i = 0; i < notificationList.length && i < 10; i++){
		var line = '<tr>';
		line += '<td>' + '未读' + '</td>';
		line += '<td><a target="_blank" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp?course_id=' + notificationList[i].courseId + '">' + notificationList[i].courseName + '</a></td>';
		line += '<td><a target="_blank" href="http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+notificationList[i].href+'">' + notificationList[i].name + '</a></td>';
		line += '<td>' + new Date(notificationList[i].day).toDateString() + '</td>';
		line += '</tr>';
		GUIlist.append($(line));
	}
}

function processCourseList(update, callback){	// update list when var update = true or no cache, callback function called with a list.
	var courseList = localStorage.course_list;
	if (!courseList || update){
		net_getCourseList(callback);
		return;
	}
	courseList = JSON.parse(courseList);
	callback(courseList);
}

function processDeadlineList(update, callback){
	var deadlineList = localStorage.deadline_list;
	if (!deadlineList || update){
		traverseCourse('deadline', callback, print);
		return;
	}
	deadlineList = JSON.parse(deadlineList);
	callback(deadlineList);
}
function processNotificationList(update, callback){
	var notificationList = localStorage.notification_list;
	if (!notificationList || update){
		traverseCourse('notification', callback, print);
		return;
	}
	notificationList = JSON.parse(notificationList);
	callback(notificationList);
}

function filterCourse(list, type){	//type = 'deadline' / 'notification'
	var _name;
	var choose = {
		'deadline' : 'ignore_list_deadline',
		'notification' : 'ignore_list_notification'
	};
	if (!type) return list;
	_name = choose[type];
	if (!_name) return list;

	var courseFliter = [];
	if (localStorage.getItem(_name)){
		courseFliter = JSON.parse(localStorage.getItem(_name));
	}
	list = list.filter(function(x) { return courseFliter.indexOf(x.id) < 0; });
	return list;
}

// 完全完成时，调用successCallback(list)，list为总查询结构
// progressCallback为进度汇报，返回完成百分比，0~1的实数
// type = 'deadline' / 'notification'
function traverseCourse(type, successCallback, progressCallback){
	var prefix = {
		'deadline' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp',
		'notification' : 'http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getnoteid_student.jsp'
	};
	var lists = [];
	var unChecked;
	var totalWorker;
	var linkPrefix = prefix[type];
	if (!linkPrefix)
		successCallback([]);
	var parser = new DOMParser();
	processCourseList(true, function(courseList){
		courseList = filterCourse(courseList, type);
		unChecked = courseList.length;
		totalWorker = unChecked;
		if (!unChecked){
			successCallback(lists);
		}
		for (var i = 0; i < courseList.length; i++) {
			function worker(num){
				var courseId = courseList[num]['id'];
				var courseName = courseList[num]['name'];
				$.get(linkPrefix , { course_id: courseId }, function (data) {
					var homeworkDocument = parser.parseFromString(data, 'text/html');
					var homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2');
					for (var j = 0, attr; j < homeworkList.length; j++) {
						var attr = homeworkList[j].querySelectorAll('td');
						if (type == 'deadline'){
							var title = $(attr[0].querySelector('a')).attr('href');
							lists.push({
								courseId: courseId,
								courseName: courseName,
								name: $.trim(attr[0].innerText),
								start: new Date($.trim(attr[1].innerText)),
								end: new Date($.trim(attr[2].innerText) + ' 23:59:59'),
								state: $.trim(attr[3].innerText),
								deadlineId : getURLParamters(title).id,	//goto http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp?id=
								//TODO resultState : ,
								//resultLink;
							});
						}
						else if(type == 'notification'){
							lists.push({
								courseId: courseId,
								courseName: courseName,
								name: $.trim(attr[1].innerText),
								day: new Date($.trim(attr[3].innerText)),
								href: $.trim($(attr[1]).find("a").attr('href'))
							});
						}
					}
					unChecked--;
					if (progressCallback){
						progressCallback(1 - unChecked / totalWorker);
					}
					if (unChecked === 0 && successCallback) {
						db_updateList(type, lists, successCallback);
					}
				}, 'html');
			};
			worker(i);
		}
	});
}

function print(list){
	console.log(list);
}
//Start
$(function(){
	processCourseList(true, gui_main_updateCourseList);
	processDeadlineList(true, gui_main_updateDeadlineList);
	processNotificationList(true, gui_main_updateNotificationList);
});
