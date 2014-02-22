define ['url-const', 'q', 'util/network-adapter', 'history-event'], (URLConst, Q, NAdapter, HistoryEvent) ->
  class LearnAPI
    constructor: (username, password) ->
      if not (username and password)
        throw new Error 'username or password is empty'
      @username = username
      @password = password

    _login: =>
      promise = NAdapter.post(URLConst.login,
        userid: @username
        userpass: @password
      ).then(
        (data) =>
          if data.match /window.alert/
            throw new Error 'Token Error'
          HistoryEvent.happen 'login'
          return
        (error) =>
          throw new Error 'Network Error'
      )
      .delay(300)
      return promise

    login: =>
      if HistoryEvent.indate 'login', 300
        #if already login, return a fulfilled promise
        return Q()
      else
        return @_login()
    _loginWrap: (func, args) ->
      promise = @login()
        .then( =>
          func args...
        )
      return promise

    _getCourseList: (all)=>
      url = URLConst.course
      url = URLConst.course_all if all
      promise = (NAdapter.get url)
        .then((data) ->
          parser = new DOMParser()
          doc = parser.parseFromString data, 'text/html'
          list = doc.querySelectorAll '#info_1 a'
          result = []
          for archor in list
            text = archor.innerText.trim()
            tmp =
              id: parseInt ((NAdapter.getURLParameters (archor.getAttribute 'href')).course_id)
              name: text.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1].trim()
              term: text.match(/\(([^)]*)\)$/)[1].trim()
            result.push tmp
          return result
        )
      return promise

    getCourseList: (all)->
      return (@_loginWrap @_getCourseList, arguments)

    _extractFromCoursePage: (type, courseId, attr) =>
      tmp = null
      switch type
        when 'homework'
          href = (attr[0].querySelector 'a').getAttribute 'href'
          id = parseInt (NAdapter.getURLParameters href).id
          tmp =
            type: type
            courseId: courseId
            id: id
            name: attr[0].innerText.trim()
            date: Date.parse attr[1].innerText.trim()
            submitDate: Date.parse attr[2].innerText.trim()
            submitState: attr[3].innerText.trim() == '已经提交'
            commentState: !((attr[5].querySelector '#lookinfo').disabled)
        when 'notification'
          href = (attr[1].querySelector 'a').getAttribute 'href'
          id = parseInt (NAdapter.getURLParameters href).id
          tmp =
            type: type
            courseId: courseId
            id: id
            name: attr[1].innerText.trim()
            date: Date.parse attr[3].innerText.trim()
            author: attr[2].innerText.trim()
        when 'file'
          href = (attr[1].querySelector 'a').getAttribute 'href'
          id = parseInt (NAdapter.getURLParameters href).file_id
          tmp =
            type: type
            courseId: courseId
            id: id
            name: attr[1].innerText.trim()
            date: Date.parse attr[4].innerText.trim()
            href: href
            author: attr[2].innerText.trim()
            explanation: attr[2].innerText.trim()
        when 'discuss'
          href = (attr[0].querySelector 'a').getAttribute 'href'
          id = parseInt (NAdapter.getURLParameters href).id
          match = attr[2].innerText.trim().match(/^(\d+)\//)
          replyNum = if match then (parseInt match[1]) else 0
          tmp =
            type: type
            courseId: courseId
            id: id
            name: attr[0].innerText.trim()
            date: Date.parse attr[3].innerText.trim()
            author: attr[1].innerText.trim()
            replyNum: replyNum
      return tmp

    # type: homework, file, notification, discuss
    _getCourseDetail: (courseId, type) =>
      promise = (NAdapter.get URLConst[type], course_id:courseId)
        .then( (data) =>
          parser = new DOMParser()
          doc = parser.parseFromString data, 'text/html'
          list = doc.querySelectorAll('#table_box .tr1, #table_box .tr2')
          result = {}
          for tr in list
            attr = tr.querySelectorAll('td')
            current = @_extractFromCoursePage type, courseId, attr
            result[current.id] = current
          return result
        )
    getCourseDetail: (courseId, type) ->
      return (@_loginWrap @_getCourseDetail, arguments)

    _getHomeworkDetail: (courseId, id) =>
      promise = (NAdapter.get URLConst.homework_detail, course_id: courseId, id: id)
        .then( (data) =>
          parser = new DOMParser()
          doc = parser.parseFromString data, 'text/html'
          console.log doc
          table = doc.querySelectorAll '#table_box .tr_2'
          tmp =
            title : table[0].innerText.trim()
            content : table[1].children[0].innerHTML
            attach : null
            uploadText : table[3].children[0].innerHTML
            uploadAttach : null
          if attachItem = table[2].querySelector 'a'
            tmp.attach =
              filename: attachItem.innerText.trim()
              path: URLConst.base_URL + attachItem.getAttribute 'href'
          if uploadItem = table[4].querySelector 'a'
            tmp.uploadAttach =
              filename: uploadItem.innerText.trim()
              path: URLConst.base_URL + uploadItem.getAttribute 'href'
          return tmp
        )
      return promise
    getHomeworkDetail: (courseId, id) ->
      return (@_loginWrap @_getHomeworkDetail, arguments)

    _getNotificationDetail: (courseId, id) =>
      promise = (NAdapter.get URLConst.notification_detail, course_id: courseId, id:id, bbs_type: '课程公告')
        .then( (data) =>
          parser = new DOMParser()
          doc = parser.parseFromString data, 'text/html'
          table = doc.querySelectorAll '#table_box .tr_l2'
          tmp =
            title: table[0].innerText.trim()
            content: table[1].innerHTML
          return tmp
        )
      return promise

    getNotificationDetail: (courseId, id) ->
      return (@_loginWrap @_getNotificationDetail, arguments)

    _getDiscussDetail: (courseId, id) =>
      promise = (NAdapter.get URLConst.discuss_detail, course_id: courseId, id:id)
        .then( (data) ->
          parser = new DOMParser()
          doc = parser.parseFromString data, 'text/html'
          # there are lot's of #table_box in html =_=
          tables = doc.querySelectorAll '#table_box'
          tables = Array.prototype.slice.call tables
          mainTd = tables.shift().querySelectorAll '.tr2, .tr_2'
          result =
            topic: mainTd[0].innerText.trim()
            posts: [
              content: mainTd[4].innerHTML
              author: mainTd[2].innerText.trim()
              date: Date.parse mainTd[3].innerText
              attach: null
            ]
          if attach = mainTd[5].querySelector 'a'
            result.posts[0].attach =
              filename: attach.innerText.trim()
              path: URLConst.base_URL + attach.getAttribute 'href'
          for reply in tables
            tds = reply.querySelectorAll '.tr2, .tr_2'
            tmp =
              content: tds[2].innerHTML
              author: tds[0].innerText.trim()
              date: Date.parse tds[1].innerText
              attach: null
            if attach = tds[3].querySelector 'a'
              tmp.attach =
                filename: attach.innerText.trim()
                path: URLConst.base_URL + attach.getAttribute 'href'
            result.posts.push tmp
          console.log result
          return result
        )
      return promise

    getDiscussDetail: (courseId, id) ->
      return (@_loginWrap @_getDiscussDetail, arguments)

  return LearnAPI
