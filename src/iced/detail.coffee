easyStateList = ['readed', 'stared']
globalStateFlag = 0
args = new Object()
detailLoader = (type, id, force) ->
	if type is 'file'
		return
	chrome.extension.sendMessage(
		op : 'detail'
		force : force
		data :
			type : type
			id : id
		(response) ->
			d = response.data
			$('body').addClass response.type
			if response.type is 'notification'
				$('.noti-wrap').show()
				$('.title').text(d.detail.title)
				# use try to filter <script>
				try
					$('.content').html(d.detail.content)
				preTarget = $('.content')
				if not preTarget.html().match(/<[a-zA-Z]+[^>]*>/)
					preTarget.wrapInner('<pre style="width:700px;"/>')
				$('.date').text(new Date(d.day).Format("yyyy-MM-dd"))
				$('.courseName').text(d.courseName)
				$('.author').text(d.author)
			else if response.type is 'deadline'
				$('.ddl-wrap').show()
				$('.title').text(d.detail.title)
				# use try to filter <script>
				try
					$('.content').html(d.detail.content)
				$('.date').text(new Date(d.end).Format("yyyy-MM-dd"))
				$('.courseName').text(d.courseName)
				# use try to filter <script>
				try
					$('.uploadText').html(d.detail.uploadText)
				$('.uploadAttach').html(d.detail.uploadAttach)
				$('.attach').html(d.detail.attach)
			$('.loading').hide()
			$('.action-refresh').removeClass('icon-spin')
			if d.state is 'stared'
				$('.action-star').addClass('is-stared')
				globalStateFlag = 1
			else
				$('.action-star').addClass('is-readed')
				globalStateFlag = 0

	)
init = ->
	args = window.getURLParamters(window.location.href.replace(/#*$/, ''))
	detailLoader(args.type, args.id, false)
	$('.action-refresh').click (e)->
		e.preventDefault()
		update()
	$('.action-star').click (e)->
		e.preventDefault()
		starClick()
update = ->
	$('.action-refresh').addClass('icon-spin')
	$('.loading').show()
	$('.noti-wrap').hide()
	$('.ddl-wrap').hide()
	detailLoader(args.type, args.id, true)
	return
starClick = ->
	$('.action-star').removeClass('is-' + easyStateList[globalStateFlag])
	globalStateFlag = 1 - globalStateFlag
	chrome.extension.sendMessage(
		op : 'subState'
		data :
			type : args.type
			id : args.id
			targetState : easyStateList[globalStateFlag]
	)
	$('.action-star').addClass('is-' + easyStateList[globalStateFlag])
	return
$ ->
	$('.action-refresh').addClass('icon-spin')
	$('.noti-wrap').hide()
	$('.ddl-wrap').hide()
	init()
