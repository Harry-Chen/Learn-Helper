detailLoader = (type, id) ->
	if type is 'file'
		return
	chrome.extension.sendMessage(
		op : 'detail'
		data :
			type : type
			id : id
		(response) ->
			console.log response
			d = response.data
			$('.title').text(d.detail.title)
			$('.content').html(d.detail.content)
			$('.date').text(d.day)
			$('.courseName').text(d.courseName)
	)
init = ->
	args = window.getURLParamters(window.location.href)
	detailLoader(args.type, args.id)
$ ->
	init()
