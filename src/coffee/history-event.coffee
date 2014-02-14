define ->
  map = {}
  HistoryEvent =
    dump: ->
      localStorage.setItem 'history_event', (JSON.stringify map)
      return
    forget: (key) ->
      delete map[key]
      HistoryEvent.dump()
    indate: (key, interval) ->
      last = map[key]
      if last and Date.now() < last + interval * 1000
        return true
      return false
    exist: (key) ->
      if map[key]
        return true
      return false
    happen: (key) ->
      map[key] = Date.now()
      HistoryEvent.dump()
      return
  #TODO should able to change storage type
  map = (JSON.parse (localStorage.getItem 'history_event'))|| {}

  return HistoryEvent
