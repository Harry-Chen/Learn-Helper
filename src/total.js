var getURLParamters = window.getURLParamters;
function net_login(){
	var username = localStorage.getItem('learn_username');
	var password = localStorage.getItem('learn_passwd');
	if (!(username && password)){
		errorHandeler('no account set');
		return;
	}
	$.post("https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp", 
		{
			'userid' : username,
			'userpass' : password,
		} , function(data){
		}
	).fail(netErrorHandler);
}
function net_getCourseList(callback){
	var parser = new DOMParser();
	$.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp', function(data) {
	//$.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?typepage=2', function(data) {
			var courseDocument = parser.parseFromString(data, 'text/html');
			var courseList = courseDocument.querySelectorAll('#info_1 a');
			courseList = Array.prototype.slice.call(courseList);
			db_updateCourseList( courseList, callback)
			}).fail(netErrorHandler);
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
	var choose = {
		'deadline' : 'deadline_list',
		'notification' : 'notification_list'
	};
	var _name = choose[type];
	if (!_name) return;
	if (localStorage.getItem(_name)){
		var oldList = JSON.parse(localStorage.getItem(_name));
		List = mergeList(List, oldList);
	}
	localStorage.setItem(_name, JSON.stringify(List));
	if (args){
		args(List);
	}
}
function setState(type, id, state){	//allowed state = 'readed', 'unread', 'stared'
	var choose = {
		'd' : 'deadline_list',
		'n' : 'notification_list',
	}
	var _name = choose[type];
	if (!(id && state)){
		return
	}
	var List = localStorage.getItem(_name);
	if (!List) return;
	var List = JSON.parse(List);
	List[id].state = state;
	localStorage[_name] = JSON.stringify(List);
}

function mergeList(newList, oldList){
	//TODO ddl的时候需要更新作业状态！！！！！！！！！！！！！！！！！！！！！！！
	if (!oldList) return newList;
	temp = {};
	for (k in oldList){
		if (newList[k]){
			temp[k] = newList[k];	//转移旧通知
			temp[k].state = oldList[k].state;
		}
	}
	for (k in newList){
		if (!oldList[k]){
			temp[k] = newList[k];	//转移新通知
		}
	}
	return temp;
}

//operation = 'add', 'remove'
//type = 'deadline', 'notification'
function db_changeException(operation, courseId, type){
	var _name;
	var choose = {
		'deadline' : 'ignore_list_deadline',
		'notification' : 'ignore_list_notification'
	};
	var list = [];
	if (!type) return false;
	_name = choose[type];
	if (!_name) return false;
	if (localStorage.getItem(_name)){
		list = JSON.parse(localStorage.getItem(_name));	
	}
	for (var i = 0; i < list.length; i++){
		if (list[i] == courseId){
			if (op == 'remove'){
				list[i] = list[list.length - 1];
				list.pop();
				localStorage.setItem(_name, JSON.stringify(list));
				return true;
			}
			return false;
		}
	}
	list.push(id);
	localStorage.setItem(_name, JSON.stringify(list));
	return true;
}

function db_clearCache(type){
	var choose = {
		'courseList' : 'course_list',
		'deadline' : 'deadline_list',
		'notification' : 'notification_list'
	};
	localStorage.removeItem(choose[type]);
}

function clearCache(){
	db_clearCache('courseList');
	db_clearCache('deadline');
	db_clearCache('notification');
}

function db_setAllReaded(type){
	var choose = {
		'deadline' : 'deadline_list',
		'notification' : 'notification_list'
	};
	var _name = choose[type];
	var List = [];
	if (localStorage.getItem(_name))
		List = JSON.parse(localStorage.getItem(_name));
	for (var k in List){
		if (List[k].state != 'stared'){
			List[k].state = 'readed';
		}
	}
	localStorage.setItem(_name, JSON.stringify(List));
}
	

function gui_main_updateCourseList(courseList){
	var GUIlist= $('#course-list');
	$('#course-list .folder').remove();
	for (var i = 0; i < courseList.length; i++){
		var id = courseList[i].id;
		var name = courseList[i].name;
		var k = $('<li class="folder"> <a target="_blank" ' + 
			'href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp' + 
			'?course_id=' + id + '"><i class="icon-book"></i>' + name + '</a></li>');
		GUIlist.append(k);
	}
}
function gui_main_updatePopupNumber(type, number){
	$('#' + type + '-counter').text(number);
}

function gui_main_updateDeadlineList(deadlineList){
	temp = [];
	for (id in deadlineList){
		temp.push(deadlineList[id]);
	}
	var read_status_priority = {
		'readed' : 0,
		'unread' : 1,
		'stared' : 2,
	}
	deadlineList = temp.sort(function(a, b) {
		if (a.state === b.state){
			if (a.submit_state=== '尚未提交' && a.end < new Date()) {
				return 1;
			}
			if (b.submit_state=== '尚未提交' && b.end < new Date()) {
				return -1;
			}
			if (a.submit_state=== b.submit_state) {
				return a.end - b.end;
			}
			return (a.submit_state=== '尚未提交') ? -1 : 1;
		}
		return read_status_priority[b.state] - read_status_priority[a.state];
	});

	var GUIList = $('#nearby-deadline li');
	GUIList.remove();
	var GUIList = $('#nearby-deadline');

	var today = new Date();
	var counter = 0;
	for (var i = 0; i < deadlineList.length; i++){
		var data = deadlineList[i];
		var id = data.deadlineId;
		if (data.submit_state === '尚未提交'){
			counter += 1;
		}
		dueDays = Math.floor((new Date(deadlineList[i].end) - today) / (60 * 60 * 1000 * 24));
		var line = '<li class="message homework ';
		line += 'is-' + data.state + ' ';
		line += ((data.submit_state == '已经提交')?'is-submitted' :'') + ' ';
		line += '"> '
		line += '<a class="title" target="content-frame" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp?id=' + data.deadlineId + '&course_id=' + data.courseId + '"> <span class="days-left">' + dueDays + '</span>' + data.name + '</a>';

		line += '<span class="description">' + new Date(data.end).Format("yyyy-MM-dd") + ' - ' + data.submit_state + '</span>';
		
		line += '<div class="toolbar">';
		line += '<a class="handin-link" target="content-frame" href=http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_submit.jsp?id=' + data.deadlineId + '&course_id=' + data.courseId + '">提交链接</a>"' ;
		line += '<a class="add-star" href="#">置顶</a>';
		line += '<a class="attachment-file" href="#"><i class="icon-paper-clip"></i>azip</a>';
		line += '<a target="content-frame" class="course-name" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp?course_id=' + data.courseId + '">' + data.courseName.replace(/\(\d+\)\(.*$/, '') + '</a>';
		line += '</div>';

		/*
		if (data.resultState){
			line += '<a class="hw-review-link" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_view.jsp?id=' + data.deadlineId + '&course_id=' + data.courseId + '">查看批阅</a>';
		}
		else{
			line += '<span class="hw-review-none" >未批阅</span>';
		}
		*/
		line += '</li>';
		GUIList.append($(line));
	}
	/* 
		$('.state-flag, .hw-jump').click(function() {
		var args = this.getAttribute('data-args').split(',');
		setState.apply(null, args);
		processDeadlineList(false, gui_main_updateDeadlineList);
	});
	*/
	
	gui_main_updatePopupNumber('deadline', counter);
}

function gui_main_updateNotificationList(notificationList){
	temp = [];
	for (id in notificationList){
		temp.push(notificationList[id]);
	}
	var priority = {
		'readed' : 0,
		'unread' : 1,
		'stared' : 2,
	};
	notificationList= temp.sort(function(a, b) {
		if (a.state === b.state){
			return new Date(b.day) - new Date(a.day);
		}
		return priority[b.state] - priority[a.state];
	});
	$('#category-heading li').remove();
	var GUIlist = $('#category-heading');
	var counter = 0;
	var today = new Date();
	for (var i = 0; i < notificationList.length; i++){
		var data = notificationList[i];
		var id = data.id;
		
		var line = '<li class="message notification ';
		line += 'is-' + data.state + ' ';
		line += '"> '

		line += '<a class="title" target="content-frame" href="http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+data.href+'">' + data.name + '</a></td>';

		line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '</span>';
		line += '<div class="toolbar">';
		line += '<a class="add-star" href="#">置顶</a>';
		line += '<a class="course-name" target="content-frame" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp?course_id=' + data.courseId + '">' + data.courseName + '</a>';
		line += '</div>';

		line += '</li>';
		GUIlist.append($(line));
	}
	/*
	$('.state-flag, .noti-jump').click(function() {
		var args = this.getAttribute('data-args').split(',');
		setState.apply(null, args);
		processNotificationList(false, gui_main_updateNotificationList);
	});
	*/
	gui_main_updatePopupNumber('notification', counter);
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
	var lists = {};
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
							var id = getURLParamters(title).id;	//goto http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp?id=
							lists[id] = {
								courseId: courseId,
								courseName: courseName,
								name: $.trim(attr[0].innerText),
								start: new Date($.trim(attr[1].innerText)),
								end: new Date($.trim(attr[2].innerText) + ' 23:59:59'),
								submit_state: $.trim(attr[3].innerText),
								state : 'unread',
								deadlineId : id,
								resultState : !attr[5].querySelector('#lookinfo').disabled,
							};
						}
						else if(type == 'notification'){
							var title = $(attr[1].querySelector('a')).attr('href');
							var id = getURLParamters(title).id;
							lists[id] = {
								id : id,
								courseId: courseId,
								courseName: courseName,
								name: $.trim(attr[1].innerText),
								day: new Date($.trim(attr[3].innerText)),
								href: $.trim($(attr[1]).find("a").attr('href')),
								state: 'unread',
							};
						}
					}
					unChecked--;
					if (progressCallback){
						progressCallback(1 - unChecked / totalWorker);
					}
					if (unChecked === 0) {
						db_updateList(type, lists, successCallback);
					}
				}, 'html').fail(netErrorHandler);
			};
			worker(i);
		}
	});
}

function print(list){
	console.log(list);
}

function netErrorHandler(msg){
	console.log('net failed' + '  msg= ' + msg);
}
function errorHandeler(msg){
	alert(msg);
}

function updateData(update, list_update){
	if (update || list_update){
		net_login();
	}
	processCourseList(list_update ? true : false, gui_main_updateCourseList);
	processDeadlineList(update, gui_main_updateDeadlineList);
	processNotificationList(update, gui_main_updateNotificationList);
}

function Init_main(update){
	updateData(update);
	$('#clear-cache-button').click(clearCache);
	$('#set-all-readed-button').click(setAllReaded);
	$('#force-reload-all').click(function(){
		updateData(true, true);
	});
}
function setAllReaded(){
	db_setAllReaded('notification');
	db_setAllReaded('deadline');
	updateData(false);
	
}
//Start
$(function(){
	Init_main(true);
});
