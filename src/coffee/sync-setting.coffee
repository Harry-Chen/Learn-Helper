define ['util/storage-adapter', 'history-event'], (Storage, HistoryEvent) ->
  deepCopy = (obj) ->
    if Object.prototype.toString.call(obj) == '[object Array]'
        out = []
        for i in [0...obj.length]
            out[i] = arguments.callee obj[i]
        return out
    if typeof obj == 'object'
        out = {}
        for i of obj
            out[i] = arguments.callee obj[i]
        return out
    return obj


  sync = new Storage 'sync'
  local = new Storage 'local'
  map = {}
  KEY = 'sync_setting'

  SyncSetting =
    map: {}
    dump: ->
      local.set KEY, map
      if not (HistoryEvent.indate KEY, 3600) #sync 1 times per hour
        sync.set KEY, map
      return
    set: (key, value) ->
      if map[key] == value
        return
      map[key] = value
      map._last_update = Date.now()
      SyncSetting.dump()
    load: (key) ->
      # lightweight version of get
      return map[key]
    get: (key) ->
      return (deepCopy map[key])

  #init
  if not map._last_update
    map._last_update = 0

  # get from Storage
  (local.get KEY, {_last_update: 0})
    .done( (localMap) ->
      if map._last_update < localMap._last_update
        map = localMap
    )
  (sync.get KEY, {_last_update: 0})
    .done( (syncMap) ->
      if map._last_update < syncMap._last_update
        map = syncMap
    )
  return SyncSetting
