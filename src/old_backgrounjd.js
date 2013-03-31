var tabId;
chrome.extension.onMessage.addListener(function(feeds, sender, sendResponse) {
	chrome.tabs.create({"url": feeds.url}, function(tab){
		tabId = tab.id;
		});
	sendResponse();
}); 

function netErrorHandler(msg){
	chrome.tabs.sendMessage(tabId,
			{
			   'type' : 'netError' 
			});
}
	var getURLParamters = window.getURLParamters;
	var manifest = window.getManifest();
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

	function net_login(successCall){
		var username = db_getUsername();
		var password = db_getPassword();
		if (!(username && password)){
			$('#token-modal').modal({ closable: false }).modal('show');
			return;
		}
		$.post( URL_CONST['login'], 
				{
					'userid' : username,
			'userpass' : password,
				} , function(data){
					window.setTimeout(successCall, 1000);
				}
			  ).fail(netErrorHandler);
	}

	function old_db_getUsername(){
		return localStorage.getItem('learn_username', '');
	}
	function old_db_getPassword(){
		var password = localStorage.getItem('learn_encrypt_password', '');
		if (!password){
			return password;
		}
		return sjcl.decrypt("LEARNpassword", password);
	}
	function db_getUsername(){
		return 
function net_getCourseList(callback){
	var parser = new DOMParser();
	$.get( URL_CONST['course'], function(data) {
		var courseDocument = parser.parseFromString(data, 'text/html');
		var courseList = courseDocument.querySelectorAll('#info_1 a');
		courseList = Array.prototype.slice.call(courseList);
		db_updateCourseList( courseList, callback)
	}).fail(netErrorHandler);
}
function net_submitServer(){
	//TODO
	/*
	var username = db_getUsername();
	var url = 'http://thudev.sinaapp.com/learn/log.php';
	var hw_num = $('#unread-deadline').text();
	$.post(url, {
		'user' : username,
		'version' : CONST['version'],
		'hw_num' : hw_num,
	}
	);
	*/
}
function db_set(key, value){
	return chrome.stroage.local.set({key : value});
}
function db_get(key, defaultValue){
	return 
function db_fixOldMess(){
	//2.0 version:0
	//2.0 -> 2.0.1	version:1
	if (version_control('check', 1)){
		var passwordTemp = localStorage.getItem('learn_passwd');
		if (passwordTemp){	
			localStorage.removeItem('learn_passwd');
			old_db_saveToken(old_db_getUsername(), passwordTemp);
		}
		version_control('set', 1);
	}
	// 2.0.1 -> 2.1  version:2
	if (version_control('check', 2)){
		var d = localStorage.getItem('deadline_list');
		if (d){
			d = JSON.parse(d);
			for (var item in d){
				if (d[item].type){
					break;
				}
				d[item].type = 'd';
				d[item].id = d[item].deadlineId;
			}
			d = JSON.stringify(d);
			localStorage.setItem('deadline_list', d);
		}
		var d = localStorage.getItem('notification_list');
		if (d){
			d = JSON.parse(d);
			for (var item in d){
				if (d[item].type){
					break;
				}
				d[item].type = 'n';
			}
			d = JSON.stringify(d);
			localStorage.setItem('notification_list', d);
		}
		version_control('set', 2);
	}
	if (version_control('check', 3)){
		var d = localStorage.getItem('deadline_list');
		var temp;
		if (d){
			d = JSON.parse(d);
			for (var item in d){
				temp[item] = d[item];
				temp[item].start = new Date(temp[item].start);
				temp[item].end = new Date(temp[item].end);
			}
			db_set('deadline_list', temp);
		}
		var d = localStorage.getItem('notification_list');
		var temp;
		if (d){
			d = JSON.parse(d);
			for (var item in d){
				temp[item] = d[item];
				temp[item].day = new Date(temp[item].day);
			}
			db_set('notification_list', temp);
		}
		var d = localStorage.getItem('file_list');
		var temp;
		if (d){
			d = JSON.parse(d);
			for (var item in d){
				temp[item] = d[item];
				temp[item].day = new Date(temp[item].day);
			}
			db_set('file_list', temp);
		}
		db_set('learn_username')
		version_control('set', 3);
	}

}
// version is a unsigned int
// op = check, return whether need version update
// op = set, set version.
function version_control(op, version){
	if (op == 'check'){
		var cur = localStorage.getItem('learn_version_flag', '0');
		if (version > cur){
			return true;
		}
		else{
			return false;
		}
	}
	if (op == 'set'){
		localStorage.setItem('learn_version_flag', version);
	}
}


function db_updateCourseList(courseList, args){
	var db_courseList = [];
	for (var i = 0; i < courseList.length; i++){
		id = getURLParamters(courseList[i].getAttribute('href')).course_id;
		var name = $.trim(courseList[i].innerText);
		name = name.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1];
		var course = { 
			'id' : id,
			'name' : name,
			};
		db_courseList.push(course);
	}
	localStorage.course_list = JSON.stringify(db_courseList);
	if (args){
		args(db_courseList);
	}
}

function old_db_saveToken(username, password){
	localStorage.setItem('learn_username', username);
	var encryptPassword = sjcl.encrypt("LEARNpassword", password);
	localStorage.setItem('learn_encrypt_password', encryptPassword);
}
// TODO STOP HERE
function db_updateList(type, List, args, collectCallback){
	var _name = CONST.cacheListName[type];
	if (!_name) return;
	if (localStorage.getItem(_name)){
		var oldList = JSON.parse(localStorage.getItem(_name));
		List = mergeList(List, oldList);
	}
	localStorage.setItem(_name, JSON.stringify(List));
	if (args){
		args(type, List, collectCallback);
	}
}
function setState(op, node){	//allowed state = 'readed', 'unread', 'stared'
	var id = node.getAttribute('data-args');
	var cur_state = node.className.match(/is-(\w*)/)[1];
	var type = node.className.match(/deadline|notification|file/)[0];
	if (!(id )){
		return
	}
	var target_state = CONST.changeState[cur_state][op];
	if (target_state == cur_state){
		return;
	}
	node.className = node.className.replace('is-' + cur_state, 'is-' + target_state);
	var _name = CONST.cacheListName[type];
	var List = localStorage.getItem(_name);
	if (!List) return;
	var List = JSON.parse(List);
	List[id].state = target_state;
	localStorage[_name] = JSON.stringify(List);
}

function mergeList(newList, oldList){
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

function db_clearCache(type){
	localStorage.removeItem(CONST.cacheListName[type]);
}
function db_setAllReaded(type){
	var _name = CONST.cacheListName[type];
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
function evaluation(type, entry){
	var today = new Date();
	var e = 0;
	var read_status_priority = {
		'readed' : 0,
		'unread' : UNREAD_FLAG,
		'stared' : STARED_FLAG,
	}
	e += read_status_priority[entry.state];
	if (type == 'deadline'){
		e += HOMEWORK_FLAG;
		var dueDays = Math.floor((new Date(entry.end) - today) / (60 * 60 * 1000 * 24));
		entry['dueDays'] = dueDays;
		if (dueDays < 0){
			e += EXPIRED_FLAG;
		}
		else{
			e += dueDays;
		}
		if (entry.submit_state === '已经提交'){
			e += SUBMIT_FLAG;
		}
		if (dueDays == 0){
			e += HOMEWORK_TODAY_FLAG;
		}
	}
	else if (type == 'notification'){
		var dueDays = Math.floor((new Date(entry.day) - today) / (60 * 60 * 1000 * 24));
		e -= dueDays;
	}
	else if (type == 'file'){
		var dueDays = Math.floor((new Date(entry.day) - today) / (60 * 60 * 1000 * 24));
		e -= dueDays;
	}
	entry['eval'] = e;
	return entry;
}
// 完全完成时，调用successCallback(list)，list为总查询结构
// progressCallback为进度汇报，返回完成百分比，0~1的实数
// type = 'deadline' / 'notification'
function traverseCourse(type, successCallback, progressCallback, collectCallback){
	var lists = {};
	var unChecked;
	var totalWorker;
	var linkPrefix = URL_CONST[type];
	if (!linkPrefix)
		successCallback([]);
	var parser = new DOMParser();
	processCourseList(false, function(courseList){
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
				$.get(linkPrefix, { course_id: courseId }, function (data) {
					var homeworkDocument = parser.parseFromString(data, 'text/html');
					var homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2');
					for (var j = 0, attr; j < homeworkList.length; j++) {
						var attr = homeworkList[j].querySelectorAll('td');
						if (type == 'deadline'){
							var title = $(attr[0].querySelector('a')).attr('href');
							var id = getURLParamters(title).id;	
							lists[id] = {
								type: 'd',
								courseId: courseId,
								courseName: courseName,
								name: $.trim(attr[0].innerText),
								start: new Date($.trim(attr[1].innerText)),
								end: new Date($.trim(attr[2].innerText) + ' 23:59:59'),
								submit_state: $.trim(attr[3].innerText),
								state : 'unread',
								id : id,
								resultState : !((attr[5].querySelector('#lookinfo')).disabled),
							};
						}
						else if(type == 'notification'){
							var title = $(attr[1].querySelector('a')).attr('href');
							var id = getURLParamters(title).id;
							lists[id] = {
								type: 'n',
								id : id,
								courseId: courseId,
								courseName: courseName,
								name: $.trim(attr[1].innerText),
								day: new Date($.trim(attr[3].innerText)),
								href: $.trim($(attr[1]).find("a").attr('href')),
								state: 'unread',
							};
						}
						else if(type == 'file'){
							var title = $(attr[1].querySelectorAll('a')).attr('href');
							var id = getURLParamters(title).file_id;
							lists[id] = {
								type : 'f',
								id : id,
								courseId : courseId,
								courseName : courseName,
								name : $.trim(attr[1].innerText),
								day: new Date($.trim(attr[4].innerText)),
								href: $.trim($(attr[1]).find("a").attr('href')),
								explanation : $.trim(attr[2].innerText),
								state: 'unread',
							};
						}
					}
					unChecked--;
					if (progressCallback){
						progressCallback(1 - unChecked / totalWorker);
					}
					if (unChecked === 0) {
						db_updateList(type, lists, successCallback, collectCallback);
					}
				}, 'html').fail(netErrorHandler);
			};
			worker(i);
		}
	});
}
