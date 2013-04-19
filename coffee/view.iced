gui_updateCourseList = () ->
	courseList= JSON.parse (localStorage.getItem 'course_list')
	GUIlist= $('#course-list')
	$('#course-list .folder').remove()
	for i in [0...courseList.length]
		id = courseList[i].id
		name = courseList[i].name
		k = $(
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
			)
		GUIlist.append(k)
gui_updatePopupNumber = ->
	for type in CONST.featureName
		num = localStorage.getItem('number_' + type, '0')
		$('#unread-' + type).text(num)
# ROW CREATOR
getTheme = (dueDays, submit_state) ->
	prefix = 'theme-'
	if (dueDays < 0)
		return prefix + 'black'
	if submit_state is CONST.stateTrans.submitted
		return prefix + 'green'
	else
		if dueDays < 3
			return prefix + 'red'
		if dueDays < 5
			return prefix + 'orange'
	return ''

gui_main_createNewLine = (data) ->
	line = '<li class="message '
	id = data.id
	if data.type is 'd' # DDL
		dueDays = data.dueDays
		line += 'deadline '
		line += 'is-' + data.state + ' '
		line += (if (data.submit_state is '已经提交') then 'is-submitted' else '' ) + ' '
		line += '" data-args=' + id + '> '
		line += '<a class="title" data-args="read" target="content-frame" href="subframe.html?type=deadline&id=' + id + '">'
		line += '<span class="tag ' + getTheme(dueDays, data.submit_state) + '">'
		if data.submit_state is CONST.stateTrans.submitted
			line += '<i class="icon-check"></i>'
		else
			line += '<i class="icon-pencil"></i>'
		if dueDays >= 0
			line += ' ' + dueDays
		line += '</span> ' + data.name + '</a>'
		line += '<span class="description">' + new Date(data.end).Format("yyyy-MM-dd") + ' - ' + data.submit_state + '</span>'
		line += '<div class="toolbar">'
		line += '<a class="handin-link" target="content-frame" href="' + URL_CONST['deadline_submit'] + '?id=' + data.id + '&course_id=' + data.courseId + '">提交链接</a> '
		line += '<a class="add-star" href="#" data-args="star">置顶</a> '
		#TODO homework file's link
		#line += '<a class="attachment-file" href="#"><i class="icon-paper-clip"></i>尚未完成</a>';
		if data.resultState
			line += '<a class="review-link" target="content-frame" href="' + URL_CONST['deadline_review'] + '?id=' + data.id + '&course_id=' + data.courseId + '">查看批阅</a>'
		else if data.submit_state isnt '尚未提交'
			line += '<a class="review-link none">尚未批阅</a>';
		line += '<a target="content-frame" class="course-name" href="' + URL_CONST['deadline'] + '?course_id=' + data.courseId + '">' + data.courseName.replace(/\(\d+\)\(.*$/, '') + '</a>'
		line += '</div>'
	else if data.type is 'n' #NOTI
		line += 'notification '
		line += 'is-' + data.state + ' '
		line += '" data-args=' + id + '> '
		#line += '<a class="title" target="content-frame" data-args="read" href="http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+
		line += '<a class="title" data-args="read" target="content-frame" href="subframe.html?type=notification&id=' + id + '"><span class="tag theme-purple"><i class="icon-bullhorn"></i></span> ' + data.name + '</a></td>'
		line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '</span>'
		line += '<div class="toolbar">'
		line += '<a class="add-star" href="#" data-args="star">置顶</a>'
		line += '<a class="course-name" target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>'
		line += '</div>'
	else if data.type is 'f' # FILE
		line += 'file '
		line += 'is-' + data.state + ' '
		line += '" data-args=' + id + '> '
		line += '<a class="title" target="content-frame" data-args="read" href="https://learn.tsinghua.edu.cn'+
			data.href+'"><span class="tag theme-magenta"><i class="icon-download-alt"></i></span> ' + data.name + '</a></td>'
		line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '&nbsp;&nbsp;' + data.explanation + '</span>'
		line += '<div class="toolbar">'
		line += '<a class="add-star" href="#" data-args="star">置顶</a>'
		line += '<a class="set-readed" href="#" data-args="read">设为已读</a>'
		line += '<a class="course-name" target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>'
		line += '</div>'
	line += '</li>'
	return line
db_get = (key, defaultValue, callback) ->
	chrome.storage.local.get key, (result) ->
		if result[key] is undefined
			callback defaultValue
			return
		callback (JSON.parse result[key])

gui_clearList = (type) ->
	$(CONST.GUIListName[type]).find('li').remove()
gui_updateNormalList = (type) ->
	gui_clearList type
	await db_get ('cache_' + type), [], defer list
	GUIList = $(CONST.GUIListName[type])
	counter = 0
	for value in list
		line = gui_main_createNewLine(value)
		GUIList.append $(line)
	$(CONST.GUIListName[type]  + ' .title').click (e) ->
		node = e.target
		args = node.getAttribute('data-args').split(',')
		args.push(node.parentNode)
		onItemClick.apply(null, args)
	$(CONST.GUIListName[type] + ' .add-star').click (e) ->
		node = e.target
		args = node.getAttribute('data-args').split(',')
		args.push(node.parentNode.parentNode)
		onItemClick.apply(null, args)
	$(CONST.GUIListName[type] + ' .set-readed').click (e) ->
		node = e.target
		args = node.getAttribute('data-args').split(',')
		args.push(node.parentNode.parentNode)
		onItemClick.apply(null, args)

# set read state and call background to load detail data
onItemClick= (op, node) ->
	id = node.getAttribute('data-args')
	cur_state = node.className.match(/is-(\w*)/)[1]
	type = node.className.match(/deadline|notification|file/)[0]
	target_state = CONST.changeState[cur_state][op]
	if target_state is cur_state
		return
	node.className = node.className.replace('is-' + cur_state, 'is-' + target_state)
	chrome.extension.sendMessage(
		op : 'state'
		data :
			type : type
			id : id
			targetState : target_state
		(response) ->
			gui_updatePopupNumber()
			for name in ['collect', type]
				entry = CONST.panelTran[name]
				if not $('#' + entry).is(':visible')
					gui_updateNormalList(name)
	)
gui_switchPage = (page) ->
	currentPane = null
	for name in CONST.listTemp
		entry = CONST.panelTran[name]
		if $('#' + entry).is(':visible')
			currentPane = $('#' + entry).hide()
			do (name) ->
				window.setTimeout(
					->
						gui_updateNormalList(name)
					300
				)
	currentPane.show()
	page = $('#' + page)
	if currentPane.is page
		return
	currentPane.css(
		position: 'absolute'
		top: 0
		left: 0
		right: 0
	)
	dx = currentPane.width()
	page.css(
		position: 'relative'
		left: dx
	).show()

	page.animate(
		left: 0
		300)
	currentPane.animate(
		left: -dx
		right: dx
		300
		->
			currentPane.hide()
			page.show()
	)
clearCache = ->
	chrome.extension.sendMessage(
		op:'clear'
		(response) ->
			for name in CONST.listTemp
				gui_updateNormalList(name)
	)
forceReload = ->
	chrome.extension.sendMessage(
		op:'forcereload'
		(response) ->
			for name in CONST.listTemp
				gui_updateNormalList(name)
			if response.op is 'ready'
				loadData()
	)
setAllReaded = ->
	chrome.extension.sendMessage(
		op:'allread'
		(response) ->
			loadData()
	)
changeToken = ->
	username = $('#token-username').val()
	password = $('#token-password').val()
	$('#msg-text').text '正在验证中...'
	chrome.extension.sendMessage(
		op : 'token'
		data :
			username : username
			password : password
		(response) ->
			if response.op is 'savedToken'
				$('#token-modal').modal('hide')
				$('#msg-text').text('旧信息已全部删除，新用户名密码已储存。将在 2 秒内刷新该页面。')
				$('#msg-modal').modal('show')
				window.setTimeout ->
						location.reload()
					2000
			else if response.op is 'failToken'
				alert response.reason
	)
guiInit = ->
	for name in CONST.listTemp
		page = CONST.panelTran[name]
		do (page) ->
			$('#switch-' + page).click ->
				gui_switchPage page
	gui_switchPage('main-page')
	$('#token-modal').modal
		title: '<i class="icon-signin"></i> 登录'
	$('#msg-modal').modal
		title: '<i class="icon-info-sign"></i> 通知'
	$('#net-error-modal').modal
		title: '<i class="icon-warning-sign"></i> 网络错误',
		closable : false
	$('#option-clear-cache').click(clearCache)
	$('#option-set-all-read').click(setAllReaded)
	$('#option-force-reload-all').click(forceReload)
	$('#option-change-token').click ->
		$('#token-modal').modal({ closable: true }).modal('show')
	$('#token-form').on 'submit', ->
		changeToken()
		return false
	$('#net-error-reload-btn').click ->
		location.reload()
	$('#net-error-offline-btn').click ->
		$('#net-error-modal').modal('hide')
		loadData()

# Message
loadData = ->
	gui_updateCourseList()
	gui_updatePopupNumber()
	for name in CONST.listTemp
		gui_updateNormalList(name)

$ ->
	chrome.extension.sendMessage(
		op:'load'
		(response) ->
			if response.op is 'ready'
				loadData()
	)
	guiInit()
	# Preload
	gui_updateCourseList()
	gui_updatePopupNumber()
	# Messager
	chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
		if request.op is 'progress'
			$folder = $ '.pane-folder'
			setLoading request.data, $folder
	#ErrorHandler
	chrome.extension.onMessage.addListener (request, sender, sendResponse)->
		if request.type is 'error'
			if request.data is 'netFail'
				$('#net-error-modal').modal('show')
			else if request.data is 'noToken'
				$('#token-modal').modal({ closable: true }).modal('show')
