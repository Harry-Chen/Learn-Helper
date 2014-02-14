define ['q'], (Q) ->
  class StorageAdapter
    constructor: (type) ->
      switch type
        when 'sync'
          @storage = chrome.storage.sync
        when 'local'
          @storage = chrome.storage.local
        else
          @storage = chrome.storage.local

    set: (key, value) ->
      defer = Q.defer()
      tmp = {}
      tmp[key] = value
      chrome.storage.local.set tmp, ->
        defer.resolve()
      return defer.promise
    get: (key, defaultValue) ->
      defer = Q.defer()
      tmp = {}
      tmp[key] = defaultValue
      chrome.storage.local.get tmp, (result) ->
        defer.resolve result
      return defer.promise
