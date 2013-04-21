detailLoader = (type, id) ->
	if type is 'file'
		return
	chrome.extension.sendMessage(
		op : 'detail'
		data :
			type : type
			id : id
		(response) ->
			d = response.data
			$('body').addClass response.type
			if response.type is 'notification'
				$('.noti-wrap').show()
				$('.title').text(d.detail.title)
				try
					$('.content').html(d.detail.content)
				catch e
					a = 1
				$('.date').text(new Date(d.day).Format("yyyy-MM-dd"))
				$('.courseName').text(d.courseName)
				$('.author').text(d.author)
			else if response.type is 'deadline'
				$('.ddl-wrap').show()
				$('.title').text(d.detail.title)
				$('.content').html(d.detail.content)
				$('.date').text(new Date(d.end).Format("yyyy-MM-dd"))
				$('.courseName').text(d.courseName)
				$('.uploadText').html(d.detail.uploadText)
				$('.uploadAttach').html(d.detail.uploadAttach)
				$('.attach').html(d.detail.attach)
			$('.loading').hide()
	)
init = ->
	args = window.getURLParamters(window.location.href)
	detailLoader(args.type, args.id)
$ ->
	$('.noti-wrap').hide()
	$('.ddl-wrap').hide()
	init()
