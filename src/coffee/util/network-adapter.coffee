define ['jquery', 'q'], ($, Q) ->
  NetworkAdapter =
    post: (url, data) ->
      return Q ($.post url, data)
    get: (url, data) ->
      return Q ($.get url, data)
    getURLParameters: (url) ->
      params = {}
      for pair in (url.split '?').pop().split '&'
        [k, v] = pair.split '='
        params[(decodeURIComponent k)] = (decodeURIComponent v)
      return params
  return NetworkAdapter
