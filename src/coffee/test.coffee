require ['helper-api', 'q'], (API, Q) ->
  window.Q = Q

  window.test = (r) ->
    chrome.runtime.sendMessage(
      type: 'func'
      func: r
      (response) ->
        console.log 'ret:', response
    )
  chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
    if request.type is 'progress'
      console.log request.data
