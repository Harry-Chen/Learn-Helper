require ['helper-api', 'q', 'history-event'],
  (API, Q, HistoryEvent) ->
    console.log "background start at: #{new Date()}"
    HistoryEvent.forget 'login'
    # TODO INIT SyncSetting
    api = window.api = new API 'xxr10', 'ug920801'

    progressHandler = (progress) ->
      chrome.extension.sendMessage(
        type: 'progress'
        data: progress
      )
      return

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) ->
        if request.type is 'func'
          func = api[request.func]
          console.log request.func, request.args
          args = request.args
          promise = Q (func.apply api, args)
          promise.done(
            (result) ->
              sendResponse err: null, ret: result
              return
            (error) ->
              sendResponse err: result
              return
            (progress) ->
              progressHandler progress
              return
          )
          return true
    )
