clearCache = ->
	bg = chrome.extension.getBackgroundPage()
	bg.db_clearCache 'courseList'
	bg.db_clearCache 'deadline'
	bg.db_clearCache 'notification'
	bg.db_clearCache 'file'
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
		$('#unread-' + type).text(num);
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
		line += '<a class="title" target="content-frame" data-args="read" href="' + URL_CONST['deadline_detail'] + '?id=' + data.id + '&course_id=' + data.courseId + '">'
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
		line += '<a class="title" target="content-frame" data-args="read" href="http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+
			data.href+'"><span class="tag theme-purple"><i class="icon-bullhorn"></i></span> ' + data.name + '</a></td>'
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
		callback (JSON.parse result[key])

gui_clearList = (type) ->
	$(CONST.GUIListName[type]).find('li').remove()
gui_updateNormalList = (type) ->
	gui_clearList type
	await db_get ('cache_' + type), [], defer list
	if type is 'collect'
		console.log list
	GUIList = $(CONST.GUIListName[type])
	counter = 0
	for value in list
		line = gui_main_createNewLine(value)
		GUIList.append $(line)
	$(CONST.GUIListName[type]  + ' .title').click =>
		args = this.getAttribute('data-args').split(',')
		args.push(this.parentNode)
		setState.apply(null, args)
	$(CONST.GUIListName[type] + ' .add-star').click =>
		args = this.getAttribute('data-args').split(',')
		args.push(this.parentNode.parentNode)
		setState.apply(null, args)
	$(CONST.GUIListName[type] + ' .set-readed').click =>
		args = this.getAttribute('data-args').split(',')
		args.push(this.parentNode.parentNode)
		setState.apply(null, args)
loadData = ->
	gui_updateCourseList()
	gui_updatePopupNumber()
	for name in CONST.listTemp
		gui_updateNormalList(name)

$ ->
	chrome.extension.sendRequest(
		op:'load'
		(response) ->
			console.log response.op
			if response.op is 'ready'
				loadData()
	)
