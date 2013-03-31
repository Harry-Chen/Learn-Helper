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
	version : window.getManifest().version
	featureName : [ 'deadline', 'notification', 'file']
	GUIListName :
		deadline : '#nearby-deadline'
		notification : '#category-heading'
		file  : '#file-heading'
	cacheListName :
		courseList : 'course_list'
		deadline : 'deadline_list'
		notification : 'notification_list'
		file : 'file_list'
	ignoreListName :
		deadline : 'ignore_list_deadline'
		notification : 'ignore_list_notification'
		file : 'ignore_list_file'
	changeState :
		unread :
			read : 'readed'
			star : 'stared'
		readed :
			read : 'readed'
			star : 'stared'
		stared :
			read : 'stared'
			star : 'readed'
	evalFlag :
		EXPIRED : 2 << 13
		READED : 0
		UNREAD : - (2 << 15)
		STARED : - (2 << 16)
		SUBMIT :  (2 << 8)
		HOMEWORK : - (2 << 3)
		HOMEWORK_TODAY : -(2 << 8)
	stateTrans :
		submitted : '已经提交'
		unsubmit : '尚未提交'
errorEnum = ['noToken', 'netFail']
state=
	tabId : null

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
		).fail ->
			errorHandler 'netFail'
db_getUsername = ->
	localStorage.getItem 'learn_username', ''
db_getPassword = ->
	password = localStorage.getItem 'learn_encrypt_password', ''
	if not password
		return password
	sjcl.decrypt "LEARNpassword", password
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
	tmp[key] = JSON.stringify value
	chrome.storage.local.set tmp, callback
db_get = (key, defaultValue, callback) ->
	chrome.storage.local.get key, (result) ->
		if result[key] is undefined
			callback defaultValue
		callback (JSON.parse result[key])

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
			for key, value of d
				if value.type
					break
				value.type = 'd'
				value.id = value.deadlineId
			localStorage.setItem 'deadline_list', (JSON.stringify d)

		d = localStorage.getItem 'notification_list'
		if d
			d = JSON.parse d
			for key, value of d
				if value.type
					break
				value.type = 'n'
			localStorage.setItem 'notification_list', (JSON.stringify d)
		version_control 'set', 2
	# version 3
	if true or version_control 'check', 3
		d = localStorage.getItem 'deadline_list'
		temp = {}
		if d
			d = JSON.parse d
			for key, value of d
				temp[key] = value
				temp[key].start = new Date(value.start)
				temp[key].end = new Date(value.end)
			db_set 'deadline_list', temp
		d = localStorage.getItem 'notification_list'
		if d
			d = JSON.parse(d)
			for key, value of d
				temp[key] = value
				temp[key].day = new Date(value.day)
			db_set 'notification_list', temp
		d = localStorage.getItem('file_list')
		if d
			d = JSON.parse(d)
			for key, value of d
				temp[key] = value
				temp[key].day = new Date(value.day)
			db_set 'file_list', temp
		localStorage.removeItem 'deadline_list'
		localStorage.removeItem 'notification_list'
		localStorage.removeItem 'file_list'
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

db_updateCourseList = (courseList, callback) ->
	db_courseList = []
	for i in [0...courseList.length]
		id = getURLParamters(courseList[i].getAttribute('href')).course_id
		name = $.trim courseList[i].innerText
		name = name.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1]
		db_courseList.push
			'id' : id
			'name' : name
	localStorage.setItem 'course_list', JSON.stringify(db_courseList)
	if callback
		callback db_courseList

db_saveToken = (username, password) ->
	localStorage.setItem('learn_username', username)
	encryptPassword = sjcl.encrypt("LEARNpassword", password)
	localStorage.setItem('learn_encrypt_password', encryptPassword)

db_updateList = (type, list, callback, collectCallback, finishCallback) ->
	_name = CONST.cacheListName[type]
	if not _name
		return
	await db_get _name, {}, defer oldList
	if oldList
		list = mergeList list, oldList
	db_set _name, list
	callback and callback(type, list, collectCallback, finishCallback)

db_setState = (type, id, targetState) ->
	if not (id and type and targetState)
		return
	_name = CONST.cacheListName[type]
	await db_get _name, {}, defer list
	if not list
		return
	list[id].state = targetState
	db_set _name, list
db_clearCache = (type) ->
	db_set CONST.cacheListName[type], ''
db_setAllReaded = (type) ->
	_name = CONST.cacheListName[type]
	await db_get _name, {}, defer list
	for key of list
		if not list[key] is 'stared'
			list[key].state = 'readed'
	db_set _name, list
#CONTROLLER
mergeList = (newList, oldList) ->
	if not oldList
		return newList
	temp = {}
	for key, value of oldList
		if newList[key]
			temp[key] = newList[key]
			temp[key].state = value.state
	for key, value of newList
		if not oldList[key]
			temp[key] = value
	return temp
evaluation = (type, entry) ->
	today = new Date()
	e = 0
	read_status_priority =
		'readed' : CONST.evalFlag.READED
		'unread' : CONST.evalFlag.UNREAD
		'stared' : CONST.evalFlag.STARED
	e += read_status_priority[entry.state]
	if type is 'deadline'
		e += CONST.evalFlag.HOMEWORK
		dueDays = Math.floor((new Date(entry.end) - today) / (60 * 60 * 1000 * 24))
		entry['dueDays'] = dueDays
		if dueDays < 0
			e += CONST.evalFlag.EXPIRED
		else
			e += dueDays
		if entry.submit_state is CONST.stateTrans.submitted
			e += CONST.evalFlag.SUBMIT_FLAG
		if dueDays is 0
			e += CONST.evalFlag.HOMEWORK_TODAY
	else if (type is 'notification') or (type is 'file')
		dueDays = Math.floor((new Date(entry.day) - today) / (60 * 60 * 1000 * 24))
		e -= dueDays
	entry['eval'] = e
	return entry

filterCourse = (list, type)	->
	if not type
		return list
	_name = CONST.ignoreListName[type]
	if not _name
		return list
	courseFliter = []
	if localStorage.getItem _name
		courseFliter = JSON.parse localStorage.getItem(_name)
	list = list.filter (x) ->
		return courseFliter.indexOf(x.id) < 0
	return list

processCourseList = (update, callback, progressCallback) ->
#update list when var update = true or no cache, callback function called with a list.
	progressCallback && progressCallback(0)
	courseList = localStorage.course_list
	if not courseList and update
		net_getCourseList (if progressCallback then ->
				callback.apply(this, arguments)
				progressCallback(1)
			else callback
		)
		return
	courseList = JSON.parse courseList
	progressCallback && progressCallback 1
	callback courseList
traverseCourse =(type, successCallback, progressCallback, collectCallback, finishCallback)->
	lists = {}
	unChecked = 0
	totalWorker = 0
	linkPrefix = URL_CONST[type]
	parser = new DOMParser()
	if not linkPrefix
		successCallback lists
	processCourseList false, (courseList)->
		courseList = filterCourse courseList, type
		unChecked = courseList.length
		totalWorker = unChecked
		if not unChecked
			successCallback lists
		for i in [0...courseList.length]
			do (i) ->
				courseId = courseList[i]['id']
				courseName = courseList[i]['name']
				$.get( linkPrefix,
					course_id: courseId
					(data) ->
						homeworkDocument = parser.parseFromString(data, 'text/html')
						homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2')
						for j in [0...homeworkList.length]
							attr = homeworkList[j].querySelectorAll('td')
							if type is 'deadline'
								title = $(attr[0].querySelector('a')).attr('href')
								id = getURLParamters(title).id
								lists[id] =
									type: 'd'
									courseId: courseId
									courseName: courseName
									name: $.trim(attr[0].innerText)
									start: new Date($.trim(attr[1].innerText))
									end: new Date($.trim(attr[2].innerText) + ' 23:59:59')
									submit_state: $.trim(attr[3].innerText)
									state : 'unread'
									id : id
									resultState : !((attr[5].querySelector('#lookinfo')).disabled)
							else if type is 'notification'
								title = $(attr[1].querySelector('a')).attr('href')
								id = getURLParamters(title).id
								lists[id] =
									type: 'n'
									id : id
									courseId: courseId
									courseName: courseName
									name: $.trim(attr[1].innerText)
									day: new Date($.trim(attr[3].innerText))
									href: $.trim($(attr[1]).find("a").attr('href'))
									state: 'unread'
							else if type is 'file'
								title = $(attr[1].querySelectorAll('a')).attr('href')
								id = getURLParamters(title).file_id
								lists[id] =
									type : 'f'
									id : id
									courseId : courseId
									courseName : courseName
									name : $.trim(attr[1].innerText)
									day: new Date($.trim(attr[4].innerText))
									href: $.trim($(attr[1]).find("a").attr('href'))
									explanation : $.trim(attr[2].innerText)
									state: 'unread'
						unChecked--
						progressCallback and progressCallback(1 - unChecked / totalWorker)
						if unChecked is 0
							db_updateList(type, lists, successCallback, collectCallback, finishCallback)
				'html'
				).fail ->
					errorHandler 'netFail'
	return

prepareNormalList = (type, list, collectCallback, finishCallback) ->
	temp = []
	counter = 0
	for id, value of list
		item = evaluation type, value
		if (not (type is 'deadline') and item.state is 'unread')
			counter += 1
		else if (type is 'deadline' and item.submit_state is CONST.stateTrans.unsubmit and item.dueDays >= 0)
			counter += 1
		temp.push item
	collectCallback && collectCallback temp
	list = temp.sort (a, b) ->
		return a.eval - b.eval
	db_set ('cache_' + type), list, ->
		finishCallback()
	localStorage.setItem('number_' + type, counter)
	return

prepareCollectList = do () ->
	listCount = 0
	cList = []
	backcallFunction = null
	return (instruction, data) ->
		if instruction is 'setter'
			return (list) ->
				cList = cList.concat(list)
				listCount += 1
				prepareCollectList('update')
		else if instruction is 'backcall'
			backcallFunction = data
		else if instruction is 'update' and listCount is CONST.featureName.length
			cList = cList.sort (a, b) ->
				return a.eval - b.eval
			# reset cList
			cList = []
			listCount = 0
			# save and backcall
			await db_set 'cache_collect', cList, defer TC
			backcallFunction and backcallFunction()

#INTERFACE
window.db_fixOldMess = db_fixOldMess
window.db_clearCache = db_clearCache

load = (sendResponse) ->
	#TODO whether need reload
	readyCounter = 0
	bc = ()->
		readyCounter++
		if readyCounter is (CONST.featureName.length + 1)
			sendResponse({op : 'ready'})
		return
	prepareCollectList('backcall', bc)
	for type in CONST.featureName
		traverseCourse(
			type
			prepareNormalList
			(p)->
				console.log(p)
				return
			prepareCollectList('setter')
			bc
		)
	return

chrome.extension.onMessage.addListener (feeds, sender, sendResponse) ->
	chrome.tabs.create
		'url' : feeds.url
		(tab) ->
			state.tabId = tab.id
	sendResponse()

chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
	console.log request.op
	if request.op is 'load'
		load(sendResponse)
