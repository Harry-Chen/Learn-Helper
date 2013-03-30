var getURLParamters = window.getURLParamters;
var manifest = getManifest();
var CONST = {
	'version': manifest.version,
	'featureName' : [ 'deadline', 'notification', 'file'],
	'GUIListName' : {
		'deadline' : '#nearby-deadline',
		'notification' : '#category-heading',
		'file'  : '#file-heading',
	},
	'cacheListName' : {
		'courseList' : 'course_list',
		'deadline' : 'deadline_list',
		'notification' : 'notification_list',
		'file' : 'file_list',
	},
	'ignoreListName' : {
		'deadline' : 'ignore_list_deadline',
		'notification' : 'ignore_list_notification',
		'file' : 'ignore_list_file',
	},
	'changeState' : {
		'unread' : {
			'read' : 'readed',
			'star' : 'stared'
		},
		'readed' : {
			'read' : 'readed',
			'star' : 'stared'
		},
		'stared' : {
			'read' : 'stared',
			'star' : 'readed'
		}
	},
};
var URL_CONST = {
	'login' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp',	//登陆页
		'course' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp',		//本学期课程
		'course_all' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?typepage=2',		//全部课程
		'notification' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getnoteid_student.jsp',		//课程公告
		'course_info' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_info.jsp',		//课程信息
		'file' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/download.jsp',		//课程文件
		'resource' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/ware_list.jsp',		//教学资源
		'deadline' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp',		//课程作业
		'mentor' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getbbsid_student.jsp',		//课程答疑
		'discuss' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/gettalkid_student.jsp',		//课程讨论
		'course_page' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp',		//课程页面
		'deadline_detail' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp', //作业详细
		'deadline_submit' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_submit.jsp', //作业提交
		'deadline_review' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_view.jsp', //作业批阅
};


function net_vaildToken(username, password, successCall, failCall){
	if (!(username && password)){
		failCall("请输入用户名和密码");
		return;
	}
	$.post( URL_CONST['login'], 
			{
				'userid' : username,
	'userpass' : password,
			} , function(data){
				if (data.search('alert') != -1){
					failCall('验证失败，请检查用户名密码的正确性');
					return;
				}
				successCall();
			}
		  ).fail(function(){
		failCall('验证失败，请检查网络连接');
	});
}


function clearCache(){
	db_clearCache('courseList');
	db_clearCache('deadline');
	db_clearCache('notification');
	db_clearCache('file');
}

function gui_main_updateCourseList(courseList){
	var GUIlist= $('#course-list');
	$('#course-list .folder').remove();
	for (var i = 0; i < courseList.length; i++){
		var id = courseList[i].id;
		var name = courseList[i].name;
		var k = $(
				'<li class="folder">' +
				'<a href="#"><i class="icon-book"></i> ' + name + '</a>' + 
				'<ul class="subfolder">' +
				'<li><a target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + id + '"><i class="icon-bullhorn"></i> 课程公告</a></li>' +
				'<li><a target="content-frame" href="' + URL_CONST['course_info'] +  '?course_id=' + id + '"><i class="icon-info-sign"></i> 课程信息</a></li>' +
				'<li><a target="content-frame" href="' + URL_CONST['file'] +         '?course_id=' + id + '"><i class="icon-download-alt"></i> 课程文件</a></li>' +
				'<li><a target="content-frame" href="' + URL_CONST['resource'] +     '?course_id=' + id + '"><i class="icon-cloud"></i> 教学资源</a></li>' +
				'<li><a target="content-frame" href="' + URL_CONST['deadline'] +     '?course_id=' + id + '"><i class="icon-pencil"></i> 课程作业</a></li>' +
				'<li><a target="content-frame" href="' + URL_CONST['mentor'] +       '?course_id=' + id + '"><i class="icon-question-sign"></i> 课程答疑</a></li>' +
				'<li><a target="content-frame" href="' + URL_CONST['discuss'] +      '?course_id=' + id + '"><i class="icon-comments"></i> 课程讨论</a></li>' +
				'<li><a target="_blank"        href="' + URL_CONST['course_page'] +  '?course_id=' + id + '"><i class="icon-external-link"></i> 在新窗口中打开</a></li>' +
				'</ul>' +
				'</li>'
				);
		GUIlist.append(k);
	}
}
function gui_main_updatePopupNumber(type, number){
	$('#unread-' + type).text(number);
}
function getTheme(dueDays, submit_state){
	var prefix = 'theme-';
	if (dueDays < 0){
		return prefix + 'black';
	}
	if (submit_state === '已经提交'){
		return prefix + 'green';
	}
	else{
		if (dueDays < 3){
			return prefix + 'red';
		}
		if (dueDays < 5){
			return prefix + 'orange';
		}
	}
	return '';
}

function gui_main_createNewLine(data){
	var line = '<li class="message ';
	var id = data.id;
	if (data.type === 'd'){ // DDL
		var dueDays = data.dueDays;
		line += 'deadline ';
		line += 'is-' + data.state + ' ';
		line += ((data.submit_state == '已经提交')?'is-submitted' :'') + ' ';
		line += '" data-args=' + id + '> '

			line += '<a class="title" target="content-frame" data-args="read" href="' + URL_CONST['deadline_detail'] + '?id=' + data.id + '&course_id=' + data.courseId + '">';

		line += '<span class="tag ' + getTheme(dueDays, data.submit_state) + '">'
			if (data.submit_state == '已经提交'){
				line += '<i class="icon-check"></i>';
			}else{
				line += '<i class="icon-pencil"></i>';
			}
		if (dueDays >= 0){
			line += ' ' + dueDays;
		}
		line += '</span> ' + data.name + '</a>';

		line += '<span class="description">' + new Date(data.end).Format("yyyy-MM-dd") + ' - ' + data.submit_state + '</span>';

		line += '<div class="toolbar">';
		line += '<a class="handin-link" target="content-frame" href="' + URL_CONST['deadline_submit'] + '?id=' + data.id + '&course_id=' + data.courseId + '">提交链接</a> ' ;
		line += '<a class="add-star" href="#" data-args="star">置顶</a> ';
		//TODO homework file's link
		//line += '<a class="attachment-file" href="#"><i class="icon-paper-clip"></i>尚未完成</a>';
		// CSS TODO review-link none
		if (data.resultState){
			line += '<a class="review-link" target="content-frame" href="' + URL_CONST['deadline_review'] + '?id=' + data.id + '&course_id=' + data.courseId + '">查看批阅</a>';
		}
		else if (data.submit_state != '尚未提交'){
			line += '<a class="review-link none">尚未批阅</a>';
		}

		line += '<a target="content-frame" class="course-name" href="' + URL_CONST['deadline'] + '?course_id=' + data.courseId + '">' + data.courseName.replace(/\(\d+\)\(.*$/, '') + '</a>';
		line += '</div>';
	}
	else if (data.type === 'n'){ //NOTI
		line += 'notification ';
		line += 'is-' + data.state + ' ';
		line += '" data-args=' + id + '> '

			line += '<a class="title" target="content-frame" data-args="read" href="http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+ 
			data.href+'"><span class="tag theme-purple"><i class="icon-bullhorn"></i></span> ' + data.name + '</a></td>';

		line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '</span>';
		line += '<div class="toolbar">';
		line += '<a class="add-star" href="#" data-args="star">置顶</a>';
		line += '<a class="course-name" target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>';
		line += '</div>';
	}
	else if (data.type === 'f'){ // FILE
		line += 'file ';
		line += 'is-' + data.state + ' ';
		line += '" data-args=' + id + '> '
			line += '<a class="title" target="content-frame" data-args="read" href="https://learn.tsinghua.edu.cn'+ 
			data.href+'"><span class="tag theme-magenta"><i class="icon-download-alt"></i></span> ' + data.name + '</a></td>';
		line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '&nbsp;&nbsp;' + data.explanation + '</span>';
		line += '<div class="toolbar">';
		line += '<a class="add-star" href="#" data-args="star">置顶</a>';
		line += '<a class="set-readed" href="#" data-args="read">设为已读</a>';
		line += '<a class="course-name" target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>';
		line += '</div>';
	}
	line += '</li>';
	return line;
}

function gui_main_updateNormalList(type, List, collectCallback){
	temp = [];
	for (id in List){
		temp.push(evaluation(type, List[id]));
	}
	collectCallback && collectCallback(temp);
	List = temp.sort(function(a, b) {
		return a.eval - b.eval;
	});
	var GUIList = $(CONST.GUIListName[type]);
	var today = new Date();
	var counter = 0;
	for (var i = 0; i < List.length; i++){
		var data = List[i];
		if (type == 'deadline' && data.submit_state === '尚未提交' && data.dueDays >= 0){
			counter += 1;
		}
		if (type != 'deadline' && data.state === 'unread'){
			counter += 1;
		}
		var line = gui_main_createNewLine(data);
		GUIList.append($(line));
	}
	$(CONST.GUIListName[type] + ' .' + type + ' .title').click(function() {
		var args = this.getAttribute('data-args').split(',');
		args.push(this.parentNode);
		setState.apply(null, args);
	});
	$(CONST.GUIListName[type] + ' .' + type + ' .add-star').click(function() {
		var args = this.getAttribute('data-args').split(',');
		args.push(this.parentNode.parentNode);
		setState.apply(null, args);
	});
	$(CONST.GUIListName[type] + ' .' + type + ' .set-readed').click(function() {
		var args = this.getAttribute('data-args').split(',');
		args.push(this.parentNode.parentNode);
		setState.apply(null, args);
	});
	gui_main_updatePopupNumber(type, counter);
}


var gui_main_updateCollect = function() {
	var listCount = 0;
	var cList = [];
	return function _gui_main_updateCollect(instruction){
		if (instruction === 'setter'){
			return function(d){
				cList = cList.concat(d);
				listCount += 1;
				gui_main_updateCollect('update');
			};
		}
		if (instruction === 'update' && listCount == 3){
			var GUIList = $('#js-new');
			GUIList.children().remove();
			cList = cList.sort(function(a, b) {
				return a.eval - b.eval;
			});
			for (var i = 0; i < cList.length && cList[i].eval < 7 && i < 20; i++){
				var line = gui_main_createNewLine(cList[i]);
				GUIList.append($(line));
			}
			// reset cList;
			cList = [];
			listCount = 0;

			$('#js-new .title').click(function() {
				var args = this.getAttribute('data-args').split(',');
				args.push(this.parentNode);
				setState.apply(null, args);
			});
			$('#js-new .add-star').click(function() {
				var args = this.getAttribute('data-args').split(',');
				args.push(this.parentNode.parentNode);
				setState.apply(null, args);
			});
			$('#js-new .set-readed').click(function() {
				var args = this.getAttribute('data-args').split(',');
				args.push(this.parentNode.parentNode);
				setState.apply(null, args);
			});
			net_submitServer();
		}
	}
}();


function processCourseList(update, callback, progressCallback){	// update list when var update = true or no cache, callback function called with a list.
	progressCallback && progressCallback(0);
	var courseList = localStorage.course_list;
	if (!courseList || update){
		net_getCourseList(progressCallback ? function() { callback.apply(this, arguments); progressCallback(1); } : callback);
		return;
	}
	courseList = JSON.parse(courseList);
	callback(courseList);
	progressCallback && progressCallback(1);
}

function processNormalList(type, update, callback, progressCallback, collectCallback){
	$( CONST.GUIListName[type] + ' li').remove();
	progressCallback && progressCallback(0);
	var cacheList = localStorage.getItem( CONST.cacheListName[type] );
	if (!cacheList|| update){
		traverseCourse(type, callback, progressCallback, collectCallback);
		return;
	}
	cacheList= JSON.parse(cacheList);
	callback(type, cacheList, collectCallback);
	progressCallback && progressCallback(1);
}

function filterCourse(list, type){	//type = 'deadline' / 'notification'
	var _name;
	if (!type) return list;
	_name = CONST.ignoreListName[type];
	if (!_name) return list;

	var courseFliter = [];
	if (localStorage.getItem(_name)){
		courseFliter = JSON.parse(localStorage.getItem(_name));
	}
	list = list.filter(function(x) { return courseFliter.indexOf(x.id) < 0; });
	return list;
}


//ErrorHandler
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {  
		// netErrorHandler
		if (request.type === 'netError'){
			$('#net-error-modal').modal('show');
		}
}); 

function updateData(update, list_update){
	$folder = $('.pane-folder');
	setLoading(0, $folder);
	var progress = [0, 0, 0, 0];

	var totalPart = 1 + CONST.featureName.length;
	if (update || list_update){
		net_login(function(){
			// login
			totalPart += 1;
			setLoading(1.0 / totalPart, $folder);
			processCourseList(list_update ? true : false, gui_main_updateCourseList, function(p) {
				progress[0] = p;
				setLoading((progress[0] + progress[1] + progress[2] + progress[3] + 1) / totalPart, $folder);
			});
			for (var i = 0; i < CONST.featureName.length; i++){
				processNormalList(CONST.featureName[i], update, gui_main_updateNormalList, function(kk){
					return function(p) {
						progress[kk + 1] = p;
						setLoading((progress[0] + progress[1] + progress[2] + progress[3] +  1) / totalPart, $folder);
					};
				}(i), 
				gui_main_updateCollect('setter')
				);
			}
		});
		return;
	}
	processCourseList(list_update ? true : false, gui_main_updateCourseList, function(p) {
		progress[0] = p;
		setLoading((progress[0] + progress[1] + progress[2] + progress[3]) / totalPart, $folder);
	});
	for (var i = 0; i < CONST.featureName.length; i++){
		processNormalList(CONST.featureName[i], update, gui_main_updateNormalList, function(kk){
			return function(p) {
				progress[kk + 1] = p;
				setLoading((progress[0] + progress[1] + progress[2] + progress[3] ) / totalPart, $folder);
			};
		}(i), 
		gui_main_updateCollect('setter')
		);
	}
}

function changeToken(){
	var username = $('#token-username').val();
	var password = $('#token-password').val();
	net_vaildToken(username, password, 
			function(){
				if (username === db_getUsername()){
					$('#token-modal').modal('hide');
				}
				localStorage.clear();
				db_saveToken(username, password);
				// update gui
				$('#token-modal').modal('hide');
				$('#msg-text').text('旧信息已全部删除，新用户名密码已储存。将在 3 秒内刷新该页面。');
				$('#msg-modal').modal('show');
				window.setTimeout(function(){
					location.reload();
				}, 3000);
			},
			function(msg){
				alert(msg);
			}
			);
}
function gui_main_switchPage(page){
	updateData(false);
	panelList = ['notification-page', 'deadline-page', 'main-page', 'file-page'];
	var currentPane = null;
	for (var i in panelList){
		var entry = panelList[i];
		if ($('#' + entry).is(':visible')) currentPane = $('#' + entry).hide();
	}
	currentPane.show();
	page = $('#' + page);
	if (currentPane.is(page)) {
		return;
	}
	currentPane.css({
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
	});
	var dx = currentPane.width();
	page.css({
		position: 'relative',
		left: dx,
	}).show();

	page.animate({
		left: 0
	}, 300);
	currentPane.animate({
		left: -dx,
		right: dx
	}, 300, function() {
		currentPane.hide();
		page.show();
	});
}

function initMain(update){
	db_fixOldMess();
	$('#token-modal').modal({
		title: '<i class="icon-signin"></i> 登录'
	});
	$('#msg-modal').modal({
		title: '<i class="icon-info-sign"></i> 通知'
	});
	$('#net-error-modal').modal({
		title: '<i class="icon-warning-sign"></i> 网络错误',
		closable : false
	});
	$('#option-clear-cache').click(clearCache);
	$('#option-set-all-read').click(setAllReaded);
	$('#option-force-reload-all').click(function(){
		updateData(true, true);
	});
	$('#option-change-token').click(function(){
		$('#token-modal').modal({ closable: true }).modal('show');
	});

	$('#token-form').on('submit', function() { changeToken(); return false; });

	$('#net-error-reload-btn').click(function(){
		location.reload();
	});
	$('#net-error-offline-btn').click(function(){
		$('#net-error-modal').modal('hide');
		initMain(false);
	});

	$('#switch-main-page').click(function(){gui_main_switchPage('main-page')});
	$('#switch-notification-page').click(function(){gui_main_switchPage('notification-page')});
	$('#switch-deadline-page').click(function(){gui_main_switchPage('deadline-page')});
	$('#switch-file-page').click(function(){gui_main_switchPage('file-page')});
	gui_main_switchPage('main-page');

	updateData(update);

}
function setAllReaded(){
	for (var i=0; i < CONST.featureName.length; i += 1){
		db_setAllReaded(CONST.featureName[i]);
	}
	updateData(false);
}

$(function(){
	console.log('aaa');
	var bg = chrome.extension.getBackgroundPage();
	if(bg){
		bg.net_login(function(){console.log('success')});
	}
	console.log('bbb');
});
