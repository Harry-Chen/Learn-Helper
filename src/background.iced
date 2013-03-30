parser = new DOMParser()
#getURLParamters = window.getURLParamters
URL_CONST = 
	'login' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp'	#登陆页
	'course' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp'		#本学期课程
	'course_all' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?typepage=2'		#全部课程
	'notification' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getnoteid_student.jsp'		#课程公告
	'course_info' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_info.jsp'		#课程信息
	'file' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/download.jsp'		#课程文件
	'resource' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/ware_list.jsp'		#教学资源
	'deadline' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp'		#课程作业
	'mentor' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getbbsid_student.jsp'		#课程答疑
	'discuss' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/gettalkid_student.jsp'		#课程讨论
	'course_page' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp'		#课程页面
	'deadline_detail' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp' #作业详细
	'deadline_submit' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_submit.jsp' #作业提交
	'deadline_review' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_view.jsp' #作业批阅
CONST =
	'version' : window.getManifest().version
	'featureName' : [ 'deadline', 'notification', 'file']
	'GUIListName' :
		'deadline' : '#nearby-deadline'
		'notification' : '#category-heading'
		'file'  : '#file-heading'
	'cacheListName' :
		'courseList' : 'course_list'
		'deadline' : 'deadline_list'
		'notification' : 'notification_list'
		'file' : 'file_list'
	'ignoreListName' :
		'deadline' : 'ignore_list_deadline'
		'notification' : 'ignore_list_notification'
		'file' : 'ignore_list_file'
	'changeState' :
		'unread' :
			'read' : 'readed'
			'star' : 'stared'
		'readed' :
			'read' : 'readed'
			'star' : 'stared'
		'stared' :
			'read' : 'stared'
			'star' : 'readed'
errorEnum = ['noToken', 'netFail']
state=
	tabId : null
chrome.extension.onMessage.addListener (feeds, sender, sendResponse) ->
	chrome.tabs.create
		'url' : feeds.url
		(tab) ->
			state.tabId = tab.id
	sendResponse()

errorHandler = (type) ->
	chrome.tabs.sendMessage state.tabId,
		'type' : type

net_login = (successCall) ->
	username = db_getUsername()
	password = db_getPassword()
	if not username or not password
		errorHandler 'noToken'
		return
	$.post(
		URL_CONST['login'],
		'userid' : username
		'userpass' : password
		(data) ->
			window.setTimeout successCall, 1000
		).fail(errorHandler 'netFail')
old_db_getUsername = ->
	localStorage.getItem 'learn_username', ''
old_db_getPassword = ->
	password = localStorage.getItem 'learn_encrypt_password', ''
	if not password
		return password
	sjcl.decrypt "LEARNpassword", password
db_getUsername = ->
	#TODO
net_getCourseList = (callback) ->
	$.get(
		URL_CONST['course']
		(data) ->
			courseDocument = parser.parseFromString data, 'text/html'
			courseList = courseDocument.querySelectorAll '#info_1 a'
			courseList = Array.prototype.slice.call courseList
			db_updateCourseList courseList, callback
	).fail(errorHandler 'netFail')
net_submitServer = ->
	#TODO
	#username = db_getUsername()
	#url = 'http://thudev.sinaapp.com/learn/log.php'
	#hw_num = $('#unread-deadline').text()
	#$.post(
	#	url
	#	'user' : username
	#	'version' : CONST['version']
	#	'hw_num' : hw_num
	#)
db_set = (key, value, callback) ->
	tmp = {}
	tmp[key] = value
	chrome.storage.local.set tmp, callback
db_get = (key, defaultValue, callback) ->
	chrome.storage.local.get key, (result) ->
		if result[key] is undefined
			callback defaultValue
		callback result[key]

db_set 'a','b'
await db_get 'd', 'c', defer result
console.log result
db_fixOldMess = ->
	#2.0 version:0
	#2.0 -> 2.0.1	version:1
	if version_control 'check', 1
		passwordTemp = localStorage.getItem 'learn_passwd'
		if passwordTemp
			localStorage.removeItem 'learn_passwd'
			old_db_saveToken old_db_getUsername(), passwordTemp
		version_control 'set', 1
	#2.0.1 -> 2.1  version:2
	if version_control 'check', 2
		d = localStorage.getItem 'deadline_list'
		if d
			d = JSON.parse d
			for item in d
				if d[item].type
					break
				d[item].type = 'd'
				d[item].id = d[item].deadlineId
			d = JSON.stringify d
			localStorage.setItem 'deadline_list', d
		d = localStorage.getItem 'notification_list'
		if d
			d = JSON.parse d
			for item in d
				if d[item].type
					break
				d[item].type = 'n'
			d = JSON.stringify d
			localStorage.setItem 'notification_list', d
		d = localStorage.getItem 'file_list'
		version_control 'set', 2
	# version 3
	if version_control 'check', 3
		d = localStorage.getItem 'deadline_list'
		if d
			d = JSON.parse d
			for item in d
				temp[item] = d[item]
				temp[item].start = new Date(temp[item].start)
				temp[item].end = new Date(temp[item].end)
			await db_set 'deadline_list', temp, defer TC
		d = localStorage.getItem 'notification_list'
		if d
			d = JSON.parse(d)
			for item in d
				temp[item] = d[item]
				temp[item].day = new Date(temp[item].day)
			await db_set 'notification_list', temp, defer TC
		d = localStorage.getItem('file_list')
		if d
			d = JSON.parse(d)
			for item in d
				temp[item] = d[item]
				temp[item].day = new Date(temp[item].day)
			await db_set 'file_list', temp, defer TC
		db_saveToken old_db_getUsername, old_db_getPassword
		version_control('set', 3)
# version is a unsigned int
# op = check, return whether need version update
# op = set, set version.
version_control = (op, version)->
	if op is'check'
		cur = localStorage.getItem 'learn_version_flag', '0'
		if version > cur
			return true
		else
			return false
	if op is 'set'
		localStorage.setItem 'learn_version_flag', version

db_updateCourseList = (courseList, args) ->
	db_courseList = [];
	for i in [0...courseList.length]
		id = getURLParamters(courseList[i].getAttribute('href')).course_id
		name = $.trim courseList[i].innerText
		name = name.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1]
		db_courseList.push
			'id' : id
			'name' : name
	localStorage.course_list = JSON.stringify(db_courseList)
	if args
		args db_courseList
old_db_saveToken = (username, password) ->
	localStorage.setItem('learn_username', username)
	encryptPassword = sjcl.encrypt("LEARNpassword", password)
	localStorage.setItem('learn_encrypt_password', encryptPassword)
db_saveToken = (username, password) ->
	await db_set 'learn_username', username, defer TC
	encryptPassword = sjcl.encrypt("LEARNpassword", password)
	await db_set 'learn_encrypt_password', encryptPassword, defer TC
