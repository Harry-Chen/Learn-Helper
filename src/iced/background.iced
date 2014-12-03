parser = new DOMParser()
#getURLParamters = window.getURLParamters
errorEnum = ['noToken', 'netFail']

errorHandler = (type) ->
    chrome.extension.sendMessage(
        type : 'error'
        data : type
    )
    progressLoader('end')


net_vaildToken = (username, password, sendResponse) ->
    if not username or not password
        sendResponse(
            op : 'failToken'
            reason : '请输入用户名和密码'
        )
        return
    $.post(
        URL_CONST['login']
        'userid' : username
        'userpass' : password
        (data) ->
            if (data.search 'window.alert') isnt -1
                sendResponse(
                    op : 'failToken'
                    reason : '验证失败，请检查用户名密码'
                )
                return
            else
                $.post(
                    URL_CONST['new_login'],
                    'i_user' : username
                    'i_pass' : password
                    (data) ->
                        if db_getUsername isnt username
                            chrome.storage.local.clear()
                            localStorage.clear()
                        db_saveToken(username, password)
                        sendResponse(op : 'savedToken')
                    )
        ).fail ->
            sendResponse(
                op : 'failToken'
                reason : '无法连接到网络学堂，请检查网络学堂能否打开'
            )
net_login = (successCall, force) ->
    username = db_getUsername()
    password = db_getPassword()
    if not username or not password
        errorHandler 'noToken'
        return
    if force or updateJudge 'loginTime', 'check'
        $.post(
            URL_CONST['login'],
            'userid' : username
            'userpass' : password
            (data) ->
                $.post(
                    URL_CONST['new_login'],
                    'i_user' : username
                    'i_pass' : password
                    (data) ->
                        updateJudge 'loginTime', 'set'
                        localStorage.setItem('lastLogin', new Date())
                        successCall && window.setTimeout successCall, 800
                    ).fail ->
                        errorHandler 'netFail'
            ).fail ->
                errorHandler 'netFail'
    else
        successCall && successCall()

net_digDetail = (type, id, force, callback) ->
    await db_get type + '_list', {}, defer list
    if (not force) and list[id].detail
        console.log 'from storage'
        callback(
            type
            list[id]
        )
    else
        console.log 'from network'
        net_login ->
            if type is 'notification'
                href = 'http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+ list[id].href
                await $.get(href, defer data).fail ->
                    errorHandler 'netFail'
                detail = parser.parseFromString data, 'text/html'
                table = detail.querySelectorAll '#table_box .tr_l2'
                list[id].detail =
                    title : $.trim table[0].innerText
                    content : table[1].innerHTML
            else if type is 'deadline'
                href = URL_CONST['deadline_detail'] + '?id=' + id + '&course_id=' + list[id].courseId
                await $.get(href, defer data).fail ->
                    errorHandler 'netFail'
                detail = parser.parseFromString data, 'text/html'
                # add base_url to all link
                for item in detail.querySelectorAll 'a[target="_top"]'
                    item.href = URL_CONST.base_URL + item.getAttribute('href')

                table = detail.querySelectorAll '#table_box .tr_2'
                list[id].detail =
                    title : $.trim table[0].innerText
                    content : table[1].children[0].innerHTML
                    attach : table[2].innerHTML
                    uploadText : table[3].children[0].innerHTML
                    uploadAttach : table[4].innerHTML
            db_set type + '_list', list
            callback type, list[id]

db_getUsername = ->
    localStorage.getItem 'learn_username', ''
db_getPassword = ->
    password = localStorage.getItem 'learn_encrypt_password', ''
    if not password
        return password
    sjcl.decrypt "LEARNpassword", password
net_getCourseList = (callback) ->
    $.get(
        URL_CONST['course']
        (data) ->
            courseDocument = parser.parseFromString data, 'text/html'
            courseList = courseDocument.querySelectorAll '#info_1 a'
            courseList = Array.prototype.slice.call courseList
            db_updateCourseList courseList, callback
    ).fail ->
        errorHandler 'netFail'
net_submitServer = ->
    username = db_getUsername()
    url = 'http://thudev.sinaapp.com/learn/log.php'
    hw_num = localStorage.getItem('number_deadline', 0)
    $.post(
        url
        'user' : username
        'version' : CONST['version']
        'hw_num' : hw_num
    )
db_set = (key, value, callback) ->
    tmp = {}
    tmp[key] = JSON.stringify value
    chrome.storage.local.set tmp, callback
db_get = (key, defaultValue, callback) ->
    chrome.storage.local.get key, (result) ->
        if result[key] is undefined
            callback defaultValue
            return
        callback (JSON.parse result[key])

db_fixOldMess = ->
    #2.0 version:0
    #2.0 -> 2.0.1    version:1
    if version_control 'check', 1
        passwordTemp = localStorage.getItem 'learn_passwd'
        if passwordTemp
            localStorage.removeItem 'learn_passwd'
            db_saveToken db_getUsername(), passwordTemp
        version_control 'set', 1
    #2.0.1 -> 2.1  version:2
    if version_control 'check', 2
        d = localStorage.getItem 'deadline_list'
        if d
            d = JSON.parse d
            for key, value of d
                if value.type
                    break
                value.type = 'd'
                value.id = value.deadlineId
            localStorage.setItem 'deadline_list', (JSON.stringify d)

        d = localStorage.getItem 'notification_list'
        if d
            d = JSON.parse d
            for key, value of d
                if value.type
                    break
                value.type = 'n'
            localStorage.setItem 'notification_list', (JSON.stringify d)
        version_control 'set', 2
    # version 3
    if version_control 'check', 3
        d = localStorage.getItem 'deadline_list'
        temp = {}
        if d
            d = JSON.parse d
            for key, value of d
                temp[key] = value
                temp[key].start = new Date(value.start)
                temp[key].end = new Date(value.end)
            db_set 'deadline_list', temp
        d = localStorage.getItem 'notification_list'
        if d
            d = JSON.parse(d)
            for key, value of d
                temp[key] = value
                temp[key].day = new Date(value.day)
            db_set 'notification_list', temp
        d = localStorage.getItem('file_list')
        if d
            d = JSON.parse(d)
            for key, value of d
                temp[key] = value
                temp[key].day = new Date(value.day)
            db_set 'file_list', temp
        localStorage.removeItem 'deadline_list'
        localStorage.removeItem 'notification_list'
        localStorage.removeItem 'file_list'
        version_control('set', 3)
    if version_control 'check', 4
        if localStorage.getItem 'ran_before', false
            localStorage.setItem 'currentTerm', '未记录'
        else
            localStorage.setItem 'ran_before', true
        version_control 'set', 4

    if version_control 'check', 5
        courseList = localStorage.getItem 'course_list', null
        if courseList
            courseList = JSON.parse(courseList)
            newList = []
            for course in courseList
                if course.id != undefined && course.version == 1
                    newList.push course
            courseList = localStorage.setItem 'course_list', JSON.stringify(newList)
            version_control 'set', 5

    if version_control 'check', 6
      localStorage.setItem 'next_force_update', true
      version_control 'set', 6
# version is a unsigned int
# op = check, return whether need version update
# op = set, set version.
version_control = (op, version)->
    if op is'check'
        cur = localStorage.getItem 'learn_version_flag', '0'
        if version > cur
            return true
        else
            return false
    if op is 'set'
        localStorage.setItem 'learn_version_flag', version

db_updateCourseList = (courseList, callback) ->
    db_courseList = []
    termCounter = {}
    for i in [0...courseList.length]
        url = courseList[i].getAttribute('href')
        if url.search(URL_CONST.new_base_URL) != -1
            id = url.substr url.lastIndexOf('/') + 1
            if not id
                console.log(url)
                continue
            name = $.trim courseList[i].innerText
            term = ($.trim name.match(/\(([^)]*)\)$/)[1])
            name = name.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1]
            termCounter[term] = ~~termCounter[term] + 1
            db_courseList.push
                'id' : id
                'name' : name
        else
            id = getURLParamters(courseList[i].getAttribute('href')).course_id
            if not id
                continue
            name = $.trim courseList[i].innerText
            term = ($.trim name.match(/\(([^)]*)\)$/)[1])
            name = name.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1]
            termCounter[term] = ~~termCounter[term] + 1
            db_courseList.push
                'id' : id
                'name' : name
    localStorage.setItem 'course_list', JSON.stringify(db_courseList)
    currentTerm = ""
    currentCount = 0
    for term of termCounter
        count = termCounter[term]
        if count > currentCount
            currentTerm = term
            currentCount = count
    if currentTerm
        localStorage.setItem 'currentTerm', currentTerm
    if callback
        callback db_courseList

db_saveToken = (username, password) ->
    localStorage.setItem('learn_username', username)
    encryptPassword = sjcl.encrypt("LEARNpassword", password)
    localStorage.setItem('learn_encrypt_password', encryptPassword)

db_updateList = (type, list, callback, collectCallback, finishCallback) ->
    _name = CONST.cacheListName[type]
    if not _name
        return
    await db_get _name, {}, defer oldList
    if oldList
        list = mergeList list, oldList
    db_set _name, list
    callback and callback(type, list, collectCallback, finishCallback)
db_getList = (type, callback, collectCallback, finishCallback) ->
    _name = CONST.cacheListName[type]
    if not _name
        return
    await db_get _name, {}, defer list
    callback and callback(type, list, collectCallback, finishCallback)
db_setState = (type, id, targetState, cb) ->
    if not (id and type and targetState)
        return
    _name = CONST.cacheListName[type]
    await db_get _name, {}, defer list
    if not list
        return
    list[id].state = targetState
    db_set _name, list, ->
        cb && cb()
db_clearCache = (type) ->
    db_set CONST.cacheListName[type], ''
db_setAllReaded = (type, cb) ->
    _name = CONST.cacheListName[type]
    await db_get _name, {}, defer list
    for key of list
        if list[key] isnt 'stared'
            list[key].state = 'readed'
    db_set _name, list, cb
#CONTROLLER
mergeList = (newList, oldList) ->
    if not oldList
        return newList
    temp = {}
    for key, value of oldList
        if newList[key]
            temp[key] = newList[key]
            if value.type is 't' and value.state isnt 'stared' and value.reply_num < newList[key].reply_num
                temp[key].state = 'unread'
            else
                temp[key].state = value.state
            # save detail for cache
            temp[key].detail = value.detail
    for key, value of newList
        if not oldList[key]
            temp[key] = value
    return temp
evaluation = (type, entry) ->
    today = new Date()
    e = 0
    read_status_priority =
        'readed' : CONST.evalFlag.READED
        'unread' : CONST.evalFlag.UNREAD
        'stared' : CONST.evalFlag.STARED
    e += read_status_priority[entry.state]
    if type is 'deadline'
        e += CONST.evalFlag.HOMEWORK
        dueDays = Math.floor((new Date(entry.end) - today) / (60 * 60 * 1000 * 24))
        entry['dueDays'] = dueDays
        if dueDays < 0
            e += CONST.evalFlag.EXPIRED
        else
            e += dueDays
        if entry.submit_state is CONST.stateTrans.submitted
            e += CONST.evalFlag.SUBMIT
        if dueDays is 0
            e += CONST.evalFlag.HOMEWORK_TODAY
    else if (type is 'notification') or (type is 'file') or (type is 'discuss')
        dueDays = Math.floor((new Date(entry.day) - today) / (60 * 60 * 1000 * 24))
        e -= dueDays
    entry['eval'] = e
    return entry

filterCourse = (list, type)    ->
    if not type
        return list
    _name = CONST.ignoreListName[type]
    if not _name
        return list
    courseFliter = []
    if localStorage.getItem _name
        courseFliter = JSON.parse localStorage.getItem(_name)
    list = list.filter (x) ->
        return courseFliter.indexOf(x.id) < 0
    return list

progressLoader = do () ->
    progress = [0, 0, 0, 0, 0, 0]
    totalPart = 2 + CONST.featureName.length
    trans =
        login : 0
        courseList : 1
        deadline : 2
        notification : 3
        file : 4
        discuss: 5
    sendProgress = (p) ->
        chrome.extension.sendMessage(
            op : 'progress'
            data : p
        )
    return (type, p) ->
        if type is 'clear'
            progress = [0, 0, 0, 0, 0, 0]
            sendProgress 0
        if type is 'end'
            sendProgress 1
        else
            progress[trans[type]] = p
            sum = 0
            for i in progress
                sum += i
            sendProgress sum / totalPart

processCourseList = (update, callback, progressCallback) ->
#update list when var update = true or no cache, callback function called with a list.
    courseList = localStorage.course_list
    if not courseList or update
        net_getCourseList (if progressCallback then ->
                progressCallback 'courseList', 1
                callback.apply(this, arguments)
            else callback
        )
        return
    courseList = JSON.parse courseList
    progressCallback && progressCallback 'courseList', 1
    callback courseList
# traverse Course in course_list and save data to list
traverseCourse =(type, successCallback, progressCallback, collectCallback, finishCallback, forceUpdate)->
    lists = {}
    unChecked = 0
    totalWorker = 0
    linkPrefix = URL_CONST[type]
    newLinkPrefix = URL_CONST['new_'+type]
    parser = new DOMParser()
    if not linkPrefix
        successCallback lists
    processCourseList(forceUpdate, (courseList)->
        courseList = filterCourse courseList, type
        unChecked = courseList.length
        totalWorker = unChecked
        if not unChecked
            successCallback lists
        for i in [0...courseList.length]
            do (i) ->
                courseId = courseList[i]['id']
                courseName = courseList[i]['name']
                if courseId.search('-') isnt -1 # new learn
                    link = newLinkPrefix + courseId
                    if type != 'notification'
                        link += '/0'
                    $.get( link,
                        {
                            currentPage : 1
                            pageSize : 1000
                        }
                        (data) ->
                            if type is 'deadline'
                                for item in data.resultList
                                    title = item.courseHomeworkInfo.title
                                    id = parseInt item.courseHomeworkRecord.homewkId
                                    if item.courseHomeworkRecord.status == '0'
                                        submit_state = "尚未提交"
                                    else
                                        submit_state = "已经提交"
                                        
                                    if item.courseHomeworkRecord.homewkDetail is null
                                        text = ''
                                    else
                                        text = item.courseHomeworkRecord.homewkDetail
                                    if item.courseHomeworkRecord.resourcesMappingByHomewkAffix is null
                                        filename = "&nbsp;↵↵         无相关文件↵    ↵     "
                                    else
                                        filename = item.courseHomeworkRecord.resourcesMappingByHomewkAffix.fileName
                                        
                                    detail = 
                                        attach: "&nbsp;↵↵         无相关文件↵   ↵     "
                                        content: item.courseHomeworkInfo.detail
                                        title: item.courseHomeworkInfo.title
                                        uploadAttach: filename
                                        uploadText: text
                                    lists[id] =
                                        type: 'd'
                                        courseId: courseId
                                        courseName: courseName
                                        name: ($.trim title)
                                        start: new Date(item.courseHomeworkInfo.regDate)
                                        end: new Date(item.courseHomeworkInfo.endDate)
                                        submit_state: submit_state
                                        state : 'unread'
                                        id : id
                                        detail: detail
                                        resultState : parseInt item.courseHomeworkRecord.status > 1
                            else if type is 'notification'
                                for item in data.paginationList.recordList
                                    title = item.title
                                    id = item.id
                                    detail = 
                                        title: ($.trim title)
                                        content: item.detail
                                    lists[id] =
                                        type: 'n'
                                        id : id
                                        courseId: courseId
                                        courseName: courseName
                                        name: ($.trim title)
                                        href: ''
                                        day: new Date(item.regDate)
                                        detail: detail
                                        author: item.owner
                                        state: 'unread'
                            else if type is 'file'
                                for keyNode, node of data.resultList
                                    for keyCategory, category of node.childMapData
                                        for item in category.courseCoursewareList
                                            title = node.nodeName + '/' + category.courseOutlines.title + '/' + item.title
                                            id = item.resourcesMappingByFileId.fileId
                                            detail = item.detail
                                            if detail is null
                                                detail = ''
                                            lists[id] =
                                                type : 'f'
                                                id : id
                                                courseId : courseId
                                                courseName : courseName
                                                name : ($.trim title)
                                                day: new Date(item.resourcesMappingByFileId.regDate)
                                                href: ''
                                                explanation : detail
                                                state: 'unread'
                            else if type is 'discuss'
                                for item in data.recordList
                                    title = item.title
                                    id = item.topicId
                                    author = item.userName
                                    reply_num = item.replayCount
                                    lists[id] =
                                        type : 't' #talk
                                        id : id
                                        courseId: courseId
                                        courseName: courseName
                                        name: ($.trim title)
                                        day: new Date(item.userTime)
                                        author: author
                                        reply_num: reply_num
                                        state: 'unread'
                            unChecked--
                            progressCallback and progressCallback(type, 1 - unChecked / totalWorker)
                            if unChecked is 0
                                db_updateList(type, lists, successCallback, collectCallback, finishCallback)
                        'json'
                    ).fail ->
                        errorHandler 'netFail'
                else
                    $.get( linkPrefix,
                        course_id: courseId
                        (data) ->
                            homeworkDocument = parser.parseFromString(data, 'text/html')
                            homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2')
                            for j in [0...homeworkList.length]
                                attr = homeworkList[j].querySelectorAll('td')
                                if type is 'deadline'
                                    title = $(attr[0].querySelector('a')).attr('href')
                                    id = getURLParamters(title).id
                                    lists[id] =
                                        type: 'd'
                                        courseId: courseId
                                        courseName: courseName
                                        name: $.trim(attr[0].innerText)
                                        start: new Date($.trim(attr[1].innerText))
                                        end: new Date($.trim(attr[2].innerText) + ' 23:59:59')
                                        submit_state: $.trim(attr[3].innerText)
                                        state : 'unread'
                                        id : id
                                        resultState : !((attr[5].querySelector('#lookinfo')).disabled)
                                else if type is 'notification'
                                    title = $(attr[1].querySelector('a')).attr('href')
                                    id = getURLParamters(title).id
                                    lists[id] =
                                        type: 'n'
                                        id : id
                                        courseId: courseId
                                        courseName: courseName
                                        name: $.trim(attr[1].innerText)
                                        day: new Date($.trim(attr[3].innerText))
                                        href: $.trim($(attr[1]).find("a").attr('href'))
                                        author: $.trim(attr[2].innerText)
                                        state: 'unread'
                                else if type is 'file'
                                    title = $(attr[1].querySelectorAll('a')).attr('href')
                                    id = getURLParamters(title).file_id
                                    lists[id] =
                                        type : 'f'
                                        id : id
                                        courseId : courseId
                                        courseName : courseName
                                        name : $.trim(attr[1].innerText)
                                        day: new Date($.trim(attr[4].innerText))
                                        href: $.trim($(attr[1]).find("a").attr('href'))
                                        explanation : $.trim(attr[2].innerText)
                                        state: 'unread'
                                else if type is 'discuss'
                                    title = $(attr[0].querySelector('a'))
                                    id = getURLParamters(title.attr('href')).id
                                    author = ($ attr[1]).text()
                                    reply_num = parseInt(($ attr[2]).text().match(/^(\d+)\//)[1])
                                    lists[id] =
                                        type : 't' #talk
                                        id : id
                                        courseId: courseId
                                        courseName: courseName
                                        name: ($.trim title.text())
                                        day: new Date($.trim(attr[3].innerText))
                                        author: author
                                        reply_num: reply_num
                                        state: 'unread'
                            unChecked--
                            progressCallback and progressCallback(type, 1 - unChecked / totalWorker)
                            if unChecked is 0
                                db_updateList(type, lists, successCallback, collectCallback, finishCallback)
                        'html'
                    ).fail ->
                        errorHandler 'netFail'
    progressCallback)
    return

prepareNormalList = (type, list, collectCallback, finishCallback) ->
    temp = []
    counter = 0
    for id, value of list
        item = evaluation type, value
        if (not (type is 'deadline') and item.state is 'unread')
            counter += 1
        else if (type is 'deadline' and item.submit_state is CONST.stateTrans.unsubmit and item.dueDays >= 0)
            counter += 1
        temp.push item
    collectCallback && collectCallback temp
    list = temp.sort (a, b) ->
        return a.eval - b.eval
    db_set ('cache_' + type), list, ->
        finishCallback && finishCallback()
    localStorage.setItem('number_' + type, counter)
    return

prepareCollectList = do () ->
    listCount = 0
    cList = []
    backcallFunction = null
    return (instruction, data) ->
        if instruction is 'setter'
            return (list) ->
                cList = cList.concat(list)
                listCount += 1
                prepareCollectList('update')
        else if instruction is 'backcall'
            backcallFunction = data
        else if instruction is 'update' and listCount is CONST.featureName.length
            cList = cList.sort (a, b) ->
                return a.eval - b.eval
            counter = 0
            temp = (item for item in cList when (counter++ < CONST.collectNumber and item.eval < CONST.collectEvalLimit))
            # save and backcall
            db_set 'cache_collect', temp, ->
                backcallFunction and backcallFunction()
            # reset cList
            cList = []
            listCount = 0
# return whether need sync
# key name = updateTime or loginTime
updateJudge = (keyName, op) ->
    now = new Date()
    if op is 'check'
        lastTime = localStorage.getItem(keyName, null)
        if not lastTime
            return true
        if now - new Date(lastTime) > 5 * 60 * 1000
            return true
        return false
    else if op is 'set'
        localStorage.setItem(keyName, now)
    else if op is 'history'
        lastTime = localStorage.getItem(keyName, null)
        if lastTime
            return true
        return false

load = (force, sendResponse) ->
    readyCounter = 0
    netSync = 0
    for type in CONST.listTemp
        db_set 'cache_' + name, {}
    bc = ()->
        readyCounter++
        if readyCounter is (CONST.featureName.length + 1)
            if netSync
                updateJudge 'updateTime', 'set'
                net_submitServer()
            sendResponse && sendResponse({op : 'ready'})
        return
    if force or updateJudge('updateTime', 'check')
        netSync = 1
        progressLoader('clear')
        net_login ->
            progressLoader 'login', 1
            prepareCollectList('backcall', bc)
            for type in CONST.featureName
                traverseCourse(
                    type
                    prepareNormalList
                    progressLoader
                    prepareCollectList('setter')
                    bc
                    force
                )
        return
    else #no need to update
        prepareCollectList('backcall', bc)
        for type in CONST.featureName
            db_getList(
                type
                prepareNormalList
                prepareCollectList('setter')
                bc
            )
clearCache = (sendResponse) ->
    for name in CONST.featureName
        db_clearCache name
    await
        for name in CONST.listTemp
            db_set 'cache_' + name, {}, defer TC
    localStorage.removeItem('updateTime')
    localStorage.removeItem('course_list')
    localStorage.removeItem('currentTerm')
    sendResponse && sendResponse()
readAll = (sendResponse) ->
    await
        for name in CONST.featureName
            db_setAllReaded(name, defer TC)
    flashResult () ->
        sendResponse({})
#INTERFACE
window.processCourseList = processCourseList
db_fixOldMess()

chrome.browserAction.onClicked.addListener ->
    chrome.tabs.create
        'url' : 'index.html'
chrome.runtime.onMessage.addListener (feeds, sender, sendResponse) ->
    if feeds.op is 'load'
        force = localStorage.getItem 'next_force_update', false
        recalculate()
        checkNewTerm()
        load(force, sendResponse)
        localStorage.setItem 'next_force_update', false
        return true
chrome.runtime.onMessage.addListener (feeds, sender, sendResponse) ->
    if feeds.op is 'state'
        d = feeds.data
        db_setState d.type, d.id, d.targetState, ->
            flashResult () ->
                sendResponse({})
        return true
    else if feeds.op is 'subState'
        d = feeds.data
        db_setState d.type, d.id, d.targetState, ->
            #ask view to update
            #TODO something wrong still!
            chrome.extension.sendMessage(
                type : 'update'
                data : d
            )
        return false
chrome.runtime.onMessage.addListener (feeds, sender, sendResponse) ->
    if feeds.op is 'clear'
        clearCache sendResponse
        return true
chrome.runtime.onMessage.addListener (feeds, sender, sendResponse) ->
    if feeds.op is 'forcereload'
        load(true, sendResponse)
        return true
    else if feeds.op is 'allread'
        readAll sendResponse
        return true
    else if feeds.op is 'token'
        net_vaildToken feeds.data.username, feeds.data.password, sendResponse
        return true
    else if feeds.op is 'detail'
        net_digDetail feeds.data.type, feeds.data.id, feeds.force, (type, data)->
            sendResponse(
                op : 'detailReady'
                type : type
                data : data
            )
        return true

flashResult = (callback)->
    readyCounter = 0
    bc = ()->
        readyCounter++
        if readyCounter is (CONST.featureName.length + 1)
            callback && callback()
            return
    prepareCollectList('backcall', bc)
    for type in CONST.featureName
        db_getList(
            type
            prepareNormalList
            prepareCollectList('setter')
            bc
        )
recalculate = ->
    if updateJudge 'updateTime', 'history'
        console.log 'recalculate'
        flashResult()
checkNewTerm = ->
    lastTerm = localStorage.getItem 'currentTerm', null
    if lastTerm
        $.get(
            URL_CONST['course']
            (data) ->
                courseDocument = parser.parseFromString data, 'text/html'
                currentTermDom = courseDocument.querySelector '.active_on'
                if currentTermDom
                    currentTerm = $.trim currentTermDom.innerText
                    if lastTerm != currentTerm
                        nextTermCallback lastTerm, currentTerm
        )
termHolder =
    lastTerm : ""
    currentTerm : ""
nextTermCallback = (lastTerm, currentTerm) ->
    termHolder.lastTerm = lastTerm
    termHolder.currentTerm = currentTerm
    chrome.extension.sendMessage(
        op : 'newTerm'
        data : termHolder
    )
chrome.runtime.onMessage.addListener (feeds, sender, sendResponse) ->
    if feeds.op is 'new_term'
        clearCache()
        localStorage.setItem 'currentTerm', termHolder.currentTerm
        load(true, sendResponse)
        return true
    if feeds.op is 'force_term'
        localStorage.setItem 'currentTerm', termHolder.currentTerm
        return false
