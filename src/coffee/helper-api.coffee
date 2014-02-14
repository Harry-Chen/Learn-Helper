define ['api', 'q', 'util/storage-adapter', 'history-event', 'sync-setting'],
  (API, Q, Storage, HistoryEvent, SyncSetting) ->
    class MemCache
      constructor: (storageKey, defaultValue) ->
        @key = "memcache_#{storageKey}"
        @value = defaultValue
        @storage = new Storage 'local'
        (@storage.get @key, defaultValue)
          .done( (result) =>
            @value = result
            return
          )
        return
      get: ->
        return @value
      set: (value, pend) ->
        @value = value
        if not pend
          @dump()
      dump: () ->
        @storage.set @key, @value
        return

    Feature = [
      'homework'
      'notification'
      'discuss'
      'file'
    ]
    class HelperAPI
      constructor: (username, password) ->
        @api = new API username, password
        @courseList = new MemCache 'courseList', []
        @cache = new MemCache 'itemList', {}

      _mergeCourseList: (newList) ->
        # accept new course list and return merged list
        oldList = @courseList.get()
        filterMap = {}
        for course in oldList
          filterMap[course.id] = course.filter
        for course in newList
          if filterMap[course.id]
            course.filter = filterMap[course.id]
          else
            course.filter = {}
            course.filter[feature] = true for feature in Feature
        @courseList.set newList
        return newList

      setCourseFilter: (course_id, feature, status) ->
        exist = @courseList.get()
        for course in exist
          if course.id == course_id
            course.filter[feature] = !!status
            break
        return
      getCourseList: (force) ->
        # TODO 可添加每天更新一次课程列表
        exist = @courseList.get()
        if force or (SyncSetting.load 'no-cache-course-list') or exist.length == 0
          promise = (@api.getCourseList true)
            .then( (list) =>
              list = list[0...10]
              return (@_mergeCourseList list)
            )
          return promise
        else
          return Q(exist)

      refreshAll: ->
        defer = Q.defer()
        (@getCourseList true)
          .then( (list) =>
            promiseList = []
            finishNumber = 0
            totalNumber = 0
            for feature in Feature
              taskList = []
              for course in list
                if course.filter[feature]
                  # fitler = ture means this course.feature should be fetched
                  totalNumber += 1
                  taskPromise = (@api.getCourseDetail course.id, feature)
                    .then( (result) ->
                      finishNumber += 1
                      defer.notify finishNumber / totalNumber
                      return result
                    )
                  taskList.push taskPromise
              featurePromise = (Q.all taskList).then(
                (lists) ->
                  result = {}
                  for list in lists
                    # list if the result of getCourseDetail
                    for key of list
                      result[key] = list[key]
                  return result
              )
              promiseList.push featurePromise
            (Q.all promiseList).done(
              (nList) ->
                result = {}
                for i in [0...Feature.length]
                  result[Feature[i]] = nList[i]
                defer.resolve result
              (error) ->
                defer.reject error
            )
          )
        promise = defer.promise
          .then( (e) =>
            @_postProcessData(e)
          )
        return promise

      _postProcessData: (fetchlists) ->
        oldList = @cache.get()
        newList = {}
        for feature in Feature
          for id, fetch of fetchlists[feature]
            key = "#{feature}-#{id}"
            old = oldList[key]
            tmp = fetch
            tmp.state = 'new'
            if old
              tmp.state = old.state
              tmp.detail = old.detail
              switch tmp.type
                when 'discuss'
                  if old.replyNum < fetch.replyNum and old.state isnt 'stared'
                    tmp.state = 'new'
            newList[key] = tmp
        @cache.set newList
        return newList
      vaildState: ['new', 'old', 'started']
      setState: (type, id, state) ->
        if state not in @vaildState
          return
        list = @cache.get()
        item = list["#{type}-#{id}"]
        item.state = state if item
        @cache.set list
      readAll: () ->
        list = @cache.get()
        for key, item of list
          if item.state == 'new'
            item.state = 'old'
        @cache.set list
      getDetail: (type, id, force) ->
        list = @cache.get()
        key = "#{type}-#{id}"
        item = list[key]
        if not item
          throw new Error 'item not found'
        if not force and item.detail
          return Q item.detail
        # need load from network
        func_map =
          homework: @api.getHomeworkDetail
          discuss: @api.getDiscussDetail
          notification: @api.getNotificationDetail
        func = func_map[type]

        promise = (func item.courseId, item.id)
          .then( (result) =>
            list = @cache.get()
            list[key].detail = result
            @cache.set list
            return result
          )
        return promise

    return HelperAPI
