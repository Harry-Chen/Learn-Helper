(function() {
  var checkNewTerm, clearCache, db_clearCache, db_fixOldMess, db_get, db_getList, db_getPassword, db_getUsername, db_saveToken, db_set, db_setAllReaded, db_setState, db_updateCourseList, db_updateList, errorEnum, errorHandler, evaluation, filterCourse, flashResult, iced, load, mergeList, net_digDetail, net_getCourseList, net_login, net_submitServer, net_vaildToken, nextTermCallback, parser, prepareCollectList, prepareNormalList, processCourseList, progressLoader, readAll, recalculate, termHolder, traverseCourse, updateJudge, version_control, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {

      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) return this.continuation(this.ret);
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  parser = new DOMParser();

  errorEnum = ['noToken', 'netFail'];

  errorHandler = function(type) {
    chrome.extension.sendMessage({
      type: 'error',
      data: type
    });
    return progressLoader('end');
  };

  net_vaildToken = function(username, password, sendResponse) {
    if (!username || !password) {
      sendResponse({
        op: 'failToken',
        reason: '请输入用户名和密码'
      });
      return;
    }
    return $.post(URL_CONST['login'], {
      'userid': username,
      'userpass': password
    }, function(data) {
      if ((data.search('window.alert')) !== -1) {
        sendResponse({
          op: 'failToken',
          reason: '验证失败，请检查用户名密码'
        });
      } else {
        if (db_getUsername !== username) {
          chrome.storage.local.clear();
          localStorage.clear();
        }
        db_saveToken(username, password);
        return sendResponse({
          op: 'savedToken'
        });
      }
    }).fail(function() {
      return sendResponse({
        op: 'failToken',
        reason: '无法连接到网络学堂，请检查网络学堂能否打开'
      });
    });
  };

  net_login = function(successCall, force) {
    var password, username;
    username = db_getUsername();
    password = db_getPassword();
    if (!username || !password) {
      errorHandler('noToken');
      return;
    }
    if (force || updateJudge('loginTime', 'check')) {
      return $.post(URL_CONST['login'], {
        'userid': username,
        'userpass': password
      }, function(data) {
        updateJudge('loginTime', 'set');
        localStorage.setItem('lastLogin', new Date());
        return successCall && window.setTimeout(successCall, 800);
      }).fail(function() {
        return errorHandler('netFail');
      });
    } else {
      return successCall && successCall();
    }
  };

  net_digDetail = function(type, id, force, callback) {
    var list, ___iced_passed_deferral, __iced_deferrals, __iced_k,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "net_digDetail"
      });
      db_get(type + '_list', {}, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return list = arguments[0];
          };
        })(),
        lineno: 63
      }));
      __iced_deferrals._fulfill();
    })(function() {
      if ((!force) && list[id].detail) {
        console.log('from storage');
        return callback(type, list[id]);
      } else {
        console.log('from network');
        return net_login(function() {
          var data, detail, href, item, table, ___iced_passed_deferral1, __iced_deferrals, __iced_k,
            _this = this;
          __iced_k = __iced_k_noop;
          ___iced_passed_deferral1 = iced.findDeferral(arguments);
          (function(__iced_k) {
            if (type === 'notification') {
              href = 'http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/' + list[id].href;
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral1,
                  filename: "src/iced/background.iced"
                });
                $.get(href, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return data = arguments[0];
                    };
                  })(),
                  lineno: 74
                })).fail(function() {
                  return errorHandler('netFail');
                });
                __iced_deferrals._fulfill();
              })(function() {
                detail = parser.parseFromString(data, 'text/html');
                table = detail.querySelectorAll('#table_box .tr_l2');
                return __iced_k(list[id].detail = {
                  title: $.trim(table[0].innerText),
                  content: table[1].innerHTML
                });
              });
            } else {
              (function(__iced_k) {
                if (type === 'deadline') {
                  href = URL_CONST['deadline_detail'] + '?id=' + id + '&course_id=' + list[id].courseId;
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral1,
                      filename: "src/iced/background.iced"
                    });
                    $.get(href, __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          return data = arguments[0];
                        };
                      })(),
                      lineno: 83
                    })).fail(function() {
                      return errorHandler('netFail');
                    });
                    __iced_deferrals._fulfill();
                  })(function() {
                    var _i, _len, _ref;
                    detail = parser.parseFromString(data, 'text/html');
                    _ref = detail.querySelectorAll('a[target="_top"]');
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      item = _ref[_i];
                      item.href = URL_CONST.base_URL + item.getAttribute('href');
                    }
                    table = detail.querySelectorAll('#table_box .tr_2');
                    return __iced_k(list[id].detail = {
                      title: $.trim(table[0].innerText),
                      content: table[1].children[0].innerHTML,
                      attach: table[2].innerHTML,
                      uploadText: table[3].children[0].innerHTML,
                      uploadAttach: table[4].innerHTML
                    });
                  });
                } else {
                  return __iced_k();
                }
              })(__iced_k);
            }
          })(function() {
            db_set(type + '_list', list);
            return callback(type, list[id]);
          });
        });
      }
    });
  };

  db_getUsername = function() {
    return localStorage.getItem('learn_username', '');
  };

  db_getPassword = function() {
    var password;
    password = localStorage.getItem('learn_encrypt_password', '');
    if (!password) return password;
    return sjcl.decrypt("LEARNpassword", password);
  };

  net_getCourseList = function(callback) {
    return $.get(URL_CONST['course'], function(data) {
      var courseDocument, courseList;
      courseDocument = parser.parseFromString(data, 'text/html');
      courseList = courseDocument.querySelectorAll('#info_1 a');
      courseList = Array.prototype.slice.call(courseList);
      return db_updateCourseList(courseList, callback);
    }).fail(function() {
      return errorHandler('netFail');
    });
  };

  net_submitServer = function() {
    var hw_num, url, username;
    username = db_getUsername();
    url = 'http://thudev.sinaapp.com/learn/log.php';
    hw_num = localStorage.getItem('number_deadline', 0);
    return $.post(url, {
      'user': username,
      'version': CONST['version'],
      'hw_num': hw_num
    });
  };

  db_set = function(key, value, callback) {
    var tmp;
    tmp = {};
    tmp[key] = JSON.stringify(value);
    return chrome.storage.local.set(tmp, callback);
  };

  db_get = function(key, defaultValue, callback) {
    return chrome.storage.local.get(key, function(result) {
      if (result[key] === void 0) {
        callback(defaultValue);
        return;
      }
      return callback(JSON.parse(result[key]));
    });
  };

  db_fixOldMess = function() {
    var d, key, passwordTemp, temp, value;
    if (version_control('check', 1)) {
      passwordTemp = localStorage.getItem('learn_passwd');
      if (passwordTemp) {
        localStorage.removeItem('learn_passwd');
        db_saveToken(db_getUsername(), passwordTemp);
      }
      version_control('set', 1);
    }
    if (version_control('check', 2)) {
      d = localStorage.getItem('deadline_list');
      if (d) {
        d = JSON.parse(d);
        for (key in d) {
          value = d[key];
          if (value.type) break;
          value.type = 'd';
          value.id = value.deadlineId;
        }
        localStorage.setItem('deadline_list', JSON.stringify(d));
      }
      d = localStorage.getItem('notification_list');
      if (d) {
        d = JSON.parse(d);
        for (key in d) {
          value = d[key];
          if (value.type) break;
          value.type = 'n';
        }
        localStorage.setItem('notification_list', JSON.stringify(d));
      }
      version_control('set', 2);
    }
    if (version_control('check', 3)) {
      d = localStorage.getItem('deadline_list');
      temp = {};
      if (d) {
        d = JSON.parse(d);
        for (key in d) {
          value = d[key];
          temp[key] = value;
          temp[key].start = new Date(value.start);
          temp[key].end = new Date(value.end);
        }
        db_set('deadline_list', temp);
      }
      d = localStorage.getItem('notification_list');
      if (d) {
        d = JSON.parse(d);
        for (key in d) {
          value = d[key];
          temp[key] = value;
          temp[key].day = new Date(value.day);
        }
        db_set('notification_list', temp);
      }
      d = localStorage.getItem('file_list');
      if (d) {
        d = JSON.parse(d);
        for (key in d) {
          value = d[key];
          temp[key] = value;
          temp[key].day = new Date(value.day);
        }
        db_set('file_list', temp);
      }
      localStorage.removeItem('deadline_list');
      localStorage.removeItem('notification_list');
      localStorage.removeItem('file_list');
      version_control('set', 3);
    }
    if (version_control('check', 4)) {
      if (localStorage.getItem('ran_before', false)) {
        localStorage.setItem('currentTerm', '未记录');
      } else {
        localStorage.setItem('ran_before', true);
      }
      return version_control('set', 4);
    }
  };

  version_control = function(op, version) {
    var cur;
    if (op === 'check') {
      cur = localStorage.getItem('learn_version_flag', '0');
      if (version > cur) {
        return true;
      } else {
        return false;
      }
    }
    if (op === 'set') return localStorage.setItem('learn_version_flag', version);
  };

  db_updateCourseList = function(courseList, callback) {
    var count, currentCount, currentTerm, db_courseList, i, id, name, term, termCounter, _i, _ref;
    db_courseList = [];
    termCounter = {};
    for (i = _i = 0, _ref = courseList.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      id = getURLParamters(courseList[i].getAttribute('href')).course_id;
      if (id==undefined)
      {
        continue;
      }
      name = $.trim(courseList[i].innerText);
      term = $.trim(name.match(/\(([^)]*)\)$/)[1]);
      name = name.match(/^(.*)\s*\([^(]*\)\s*\([^(]*\)$/)[1];
      termCounter[term] = ~~termCounter[term] + 1;
      db_courseList.push({
        'id': id,
        'name': name
      });
    }
    localStorage.setItem('course_list', JSON.stringify(db_courseList));
    currentTerm = "";
    currentCount = 0;
    for (term in termCounter) {
      count = termCounter[term];
      if (count > currentCount) {
        currentTerm = term;
        currentCount = count;
      }
    }
    if (currentTerm) localStorage.setItem('currentTerm', currentTerm);
    if (callback) return callback(db_courseList);
  };

  db_saveToken = function(username, password) {
    var encryptPassword;
    localStorage.setItem('learn_username', username);
    encryptPassword = sjcl.encrypt("LEARNpassword", password);
    return localStorage.setItem('learn_encrypt_password', encryptPassword);
  };

  db_updateList = function(type, list, callback, collectCallback, finishCallback) {
    var oldList, ___iced_passed_deferral, __iced_deferrals, __iced_k, _name,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    _name = CONST.cacheListName[type];
    if (!_name) return;
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "db_updateList"
      });
      db_get(_name, {}, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return oldList = arguments[0];
          };
        })(),
        lineno: 251
      }));
      __iced_deferrals._fulfill();
    })(function() {
      if (oldList) list = mergeList(list, oldList);
      db_set(_name, list);
      return callback && callback(type, list, collectCallback, finishCallback);
    });
  };

  db_getList = function(type, callback, collectCallback, finishCallback) {
    var list, ___iced_passed_deferral, __iced_deferrals, __iced_k, _name,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    _name = CONST.cacheListName[type];
    if (!_name) return;
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "db_getList"
      });
      db_get(_name, {}, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return list = arguments[0];
          };
        })(),
        lineno: 260
      }));
      __iced_deferrals._fulfill();
    })(function() {
      return callback && callback(type, list, collectCallback, finishCallback);
    });
  };

  db_setState = function(type, id, targetState, cb) {
    var list, ___iced_passed_deferral, __iced_deferrals, __iced_k, _name,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    if (!(id && type && targetState)) return;
    _name = CONST.cacheListName[type];
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "db_setState"
      });
      db_get(_name, {}, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return list = arguments[0];
          };
        })(),
        lineno: 266
      }));
      __iced_deferrals._fulfill();
    })(function() {
      if (!list) return;
      list[id].state = targetState;
      return db_set(_name, list, function() {
        return cb && cb();
      });
    });
  };

  db_clearCache = function(type) {
    return db_set(CONST.cacheListName[type], '');
  };

  db_setAllReaded = function(type, cb) {
    var key, list, ___iced_passed_deferral, __iced_deferrals, __iced_k, _name,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    _name = CONST.cacheListName[type];
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "db_setAllReaded"
      });
      db_get(_name, {}, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return list = arguments[0];
          };
        })(),
        lineno: 276
      }));
      __iced_deferrals._fulfill();
    })(function() {
      for (key in list) {
        if (list[key] !== 'stared') list[key].state = 'readed';
      }
      return db_set(_name, list, cb);
    });
  };

  mergeList = function(newList, oldList) {
    var key, temp, value;
    if (!oldList) return newList;
    temp = {};
    for (key in oldList) {
      value = oldList[key];
      if (newList[key]) {
        temp[key] = newList[key];
        if (value.type === 't' && value.state !== 'stared' && value.reply_num < newList[key].reply_num) {
          temp[key].state = 'unread';
        } else {
          temp[key].state = value.state;
        }
        temp[key].detail = value.detail;
      }
    }
    for (key in newList) {
      value = newList[key];
      if (!oldList[key]) temp[key] = value;
    }
    return temp;
  };

  evaluation = function(type, entry) {
    var dueDays, e, read_status_priority, today;
    today = new Date();
    e = 0;
    read_status_priority = {
      'readed': CONST.evalFlag.READED,
      'unread': CONST.evalFlag.UNREAD,
      'stared': CONST.evalFlag.STARED
    };
    e += read_status_priority[entry.state];
    if (type === 'deadline') {
      e += CONST.evalFlag.HOMEWORK;
      dueDays = Math.floor((new Date(entry.end) - today) / (60 * 60 * 1000 * 24));
      entry['dueDays'] = dueDays;
      if (dueDays < 0) {
        e += CONST.evalFlag.EXPIRED;
      } else {
        e += dueDays;
      }
      if (entry.submit_state === CONST.stateTrans.submitted) {
        e += CONST.evalFlag.SUBMIT;
      }
      if (dueDays === 0) e += CONST.evalFlag.HOMEWORK_TODAY;
    } else if ((type === 'notification') || (type === 'file') || (type === 'discuss')) {
      dueDays = Math.floor((new Date(entry.day) - today) / (60 * 60 * 1000 * 24));
      e -= dueDays;
    }
    entry['eval'] = e;
    return entry;
  };

  filterCourse = function(list, type) {
    var courseFliter, _name;
    if (!type) return list;
    _name = CONST.ignoreListName[type];
    if (!_name) return list;
    courseFliter = [];
    if (localStorage.getItem(_name)) {
      courseFliter = JSON.parse(localStorage.getItem(_name));
    }
    list = list.filter(function(x) {
      return courseFliter.indexOf(x.id) < 0;
    });
    return list;
  };

  progressLoader = (function() {
    var progress, sendProgress, totalPart, trans;
    progress = [0, 0, 0, 0, 0, 0];
    totalPart = 2 + CONST.featureName.length;
    trans = {
      login: 0,
      courseList: 1,
      deadline: 2,
      notification: 3,
      file: 4,
      discuss: 5
    };
    sendProgress = function(p) {
      return chrome.extension.sendMessage({
        op: 'progress',
        data: p
      });
    };
    return function(type, p) {
      var i, sum, _i, _len;
      if (type === 'clear') {
        progress = [0, 0, 0, 0, 0, 0];
        sendProgress(0);
      }
      if (type === 'end') {
        return sendProgress(1);
      } else {
        progress[trans[type]] = p;
        sum = 0;
        for (_i = 0, _len = progress.length; _i < _len; _i++) {
          i = progress[_i];
          sum += i;
        }
        return sendProgress(sum / totalPart);
      }
    };
  })();

  processCourseList = function(update, callback, progressCallback) {
    var courseList;
    courseList = localStorage.course_list;
    if (!courseList || update) {
      net_getCourseList((progressCallback ? function() {
        progressCallback('courseList', 1);
        return callback.apply(this, arguments);
      } : callback));
      return;
    }
    courseList = JSON.parse(courseList);
    progressCallback && progressCallback('courseList', 1);
    return callback(courseList);
  };

  traverseCourse = function(type, successCallback, progressCallback, collectCallback, finishCallback, forceUpdate) {
    var linkPrefix, lists, totalWorker, unChecked;
    lists = {};
    unChecked = 0;
    totalWorker = 0;
    linkPrefix = URL_CONST[type];
    parser = new DOMParser();
    if (!linkPrefix) successCallback(lists);
    processCourseList(forceUpdate, function(courseList) {
      var i, _i, _ref, _results;
      courseList = filterCourse(courseList, type);
      unChecked = courseList.length;
      totalWorker = unChecked;
      if (!unChecked) successCallback(lists);
      _results = [];
      for (i = _i = 0, _ref = courseList.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push((function(i) {
          var courseId, courseName;
          courseId = courseList[i]['id'];
          courseName = courseList[i]['name'];
          return $.get(linkPrefix, {
            course_id: courseId
          }, function(data) {
            var attr, author, homeworkDocument, homeworkList, id, j, reply_num, title, _j, _ref1;
            homeworkDocument = parser.parseFromString(data, 'text/html');
            homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2');
            for (j = _j = 0, _ref1 = homeworkList.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
              attr = homeworkList[j].querySelectorAll('td');
              if (type === 'deadline') {
                title = $(attr[0].querySelector('a')).attr('href');
                id = getURLParamters(title).id;
                lists[id] = {
                  type: 'd',
                  courseId: courseId,
                  courseName: courseName,
                  name: $.trim(attr[0].innerText),
                  start: new Date($.trim(attr[1].innerText)),
                  end: new Date($.trim(attr[2].innerText) + ' 23:59:59'),
                  submit_state: $.trim(attr[3].innerText),
                  state: 'unread',
                  id: id,
                  resultState: !(attr[5].querySelector('#lookinfo')).disabled
                };
              } else if (type === 'notification') {
                title = $(attr[1].querySelector('a')).attr('href');
                id = getURLParamters(title).id;
                lists[id] = {
                  type: 'n',
                  id: id,
                  courseId: courseId,
                  courseName: courseName,
                  name: $.trim(attr[1].innerText),
                  day: new Date($.trim(attr[3].innerText)),
                  href: $.trim($(attr[1]).find("a").attr('href')),
                  author: $.trim(attr[2].innerText),
                  state: 'unread'
                };
              } else if (type === 'file') {
                title = $(attr[1].querySelectorAll('a')).attr('href');
                id = getURLParamters(title).file_id;
                lists[id] = {
                  type: 'f',
                  id: id,
                  courseId: courseId,
                  courseName: courseName,
                  name: $.trim(attr[1].innerText),
                  day: new Date($.trim(attr[4].innerText)),
                  href: $.trim($(attr[1]).find("a").attr('href')),
                  explanation: $.trim(attr[2].innerText),
                  state: 'unread'
                };
              } else if (type === 'discuss') {
                title = $(attr[0].querySelector('a'));
                id = getURLParamters(title.attr('href')).id;
                author = ($(attr[1])).text();
                reply_num = parseInt(($(attr[2])).text().match(/^(\d+)\//)[1]);
                lists[id] = {
                  type: 't',
                  id: id,
                  courseId: courseId,
                  courseName: courseName,
                  name: $.trim(title.text()),
                  day: new Date($.trim(attr[3].innerText)),
                  author: author,
                  reply_num: reply_num,
                  state: 'unread'
                };
              }
            }
            unChecked--;
            progressCallback && progressCallback(type, 1 - unChecked / totalWorker);
            if (unChecked === 0) {
              return db_updateList(type, lists, successCallback, collectCallback, finishCallback);
            }
          }, 'html').fail(function() {
            return errorHandler('netFail');
          });
        })(i));
      }
      return _results;
    }, progressCallback);
  };

  prepareNormalList = function(type, list, collectCallback, finishCallback) {
    var counter, id, item, temp, value;
    temp = [];
    counter = 0;
    for (id in list) {
      value = list[id];
      item = evaluation(type, value);
      if (!(type === 'deadline') && item.state === 'unread') {
        counter += 1;
      } else if (type === 'deadline' && item.submit_state === CONST.stateTrans.unsubmit && item.dueDays >= 0) {
        counter += 1;
      }
      temp.push(item);
    }
    collectCallback && collectCallback(temp);
    list = temp.sort(function(a, b) {
      return a["eval"] - b["eval"];
    });
    db_set('cache_' + type, list, function() {
      return finishCallback && finishCallback();
    });
    localStorage.setItem('number_' + type, counter);
  };

  prepareCollectList = (function() {
    var backcallFunction, cList, listCount;
    listCount = 0;
    cList = [];
    backcallFunction = null;
    return function(instruction, data) {
      var counter, item, temp;
      if (instruction === 'setter') {
        return function(list) {
          cList = cList.concat(list);
          listCount += 1;
          return prepareCollectList('update');
        };
      } else if (instruction === 'backcall') {
        return backcallFunction = data;
      } else if (instruction === 'update' && listCount === CONST.featureName.length) {
        cList = cList.sort(function(a, b) {
          return a["eval"] - b["eval"];
        });
        counter = 0;
        temp = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = cList.length; _i < _len; _i++) {
            item = cList[_i];
            if (counter++ < CONST.collectNumber && item["eval"] < CONST.collectEvalLimit) {
              _results.push(item);
            }
          }
          return _results;
        })();
        db_set('cache_collect', temp, function() {
          return backcallFunction && backcallFunction();
        });
        cList = [];
        return listCount = 0;
      }
    };
  })();

  updateJudge = function(keyName, op) {
    var lastTime, now;
    now = new Date();
    if (op === 'check') {
      lastTime = localStorage.getItem(keyName, null);
      if (!lastTime) return true;
      if (now - new Date(lastTime) > 5 * 60 * 1000) return true;
      return false;
    } else if (op === 'set') {
      return localStorage.setItem(keyName, now);
    } else if (op === 'history') {
      lastTime = localStorage.getItem(keyName, null);
      if (lastTime) return true;
      return false;
    }
  };

  load = function(force, sendResponse) {
    var bc, netSync, readyCounter, type, _i, _j, _len, _len1, _ref, _ref1, _results;
    readyCounter = 0;
    netSync = 0;
    _ref = CONST.listTemp;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      db_set('cache_' + name, {});
    }
    bc = function() {
      readyCounter++;
      if (readyCounter === (CONST.featureName.length + 1)) {
        if (netSync) {
          updateJudge('updateTime', 'set');
          net_submitServer();
        }
        sendResponse && sendResponse({
          op: 'ready'
        });
      }
    };
    if (force || updateJudge('updateTime', 'check')) {
      netSync = 1;
      progressLoader('clear');
      net_login(function() {
        var _j, _len1, _ref1, _results;
        progressLoader('login', 1);
        prepareCollectList('backcall', bc);
        _ref1 = CONST.featureName;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          type = _ref1[_j];
          _results.push(traverseCourse(type, prepareNormalList, progressLoader, prepareCollectList('setter'), bc, force));
        }
        return _results;
      });
    } else {
      prepareCollectList('backcall', bc);
      _ref1 = CONST.featureName;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        type = _ref1[_j];
        _results.push(db_getList(type, prepareNormalList, prepareCollectList('setter'), bc));
      }
      return _results;
    }
  };

  clearCache = function(sendResponse) {
    var TC, name, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i, _len, _ref,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    _ref = CONST.featureName;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      db_clearCache(name);
    }
    (function(__iced_k) {
      var _j, _len1, _ref1;
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "clearCache"
      });
      _ref1 = CONST.listTemp;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        db_set('cache_' + name, {}, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return TC = arguments[0];
            };
          })(),
          lineno: 573
        }));
      }
      __iced_deferrals._fulfill();
    })(function() {
      localStorage.removeItem('updateTime');
      localStorage.removeItem('course_list');
      localStorage.removeItem('currentTerm');
      return sendResponse && sendResponse();
    });
  };

  readAll = function(sendResponse) {
    var TC, name, ___iced_passed_deferral, __iced_deferrals, __iced_k,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(__iced_k) {
      var _i, _len, _ref;
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/background.iced",
        funcname: "readAll"
      });
      _ref = CONST.featureName;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        db_setAllReaded(name, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return TC = arguments[0];
            };
          })(),
          lineno: 581
        }));
      }
      __iced_deferrals._fulfill();
    })(function() {
      return flashResult(function() {
        return sendResponse({});
      });
    });
  };

  window.processCourseList = processCourseList;

  db_fixOldMess();

  chrome.browserAction.onClicked.addListener(function() {
    return chrome.tabs.create({
      'url': 'index.html'
    });
  });

  chrome.runtime.onMessage.addListener(function(feeds, sender, sendResponse) {
    if (feeds.op === 'load') {
      recalculate();
      checkNewTerm();
      load(false, sendResponse);
      return true;
    }
  });

  chrome.runtime.onMessage.addListener(function(feeds, sender, sendResponse) {
    var d;
    if (feeds.op === 'state') {
      d = feeds.data;
      db_setState(d.type, d.id, d.targetState, function() {
        return flashResult(function() {
          return sendResponse({});
        });
      });
      return true;
    } else if (feeds.op === 'subState') {
      d = feeds.data;
      db_setState(d.type, d.id, d.targetState, function() {
        return chrome.extension.sendMessage({
          type: 'update',
          data: d
        });
      });
      return false;
    }
  });

  chrome.runtime.onMessage.addListener(function(feeds, sender, sendResponse) {
    if (feeds.op === 'clear') {
      clearCache(sendResponse);
      return true;
    }
  });

  chrome.runtime.onMessage.addListener(function(feeds, sender, sendResponse) {
    if (feeds.op === 'forcereload') {
      load(true, sendResponse);
      return true;
    } else if (feeds.op === 'allread') {
      readAll(sendResponse);
      return true;
    } else if (feeds.op === 'token') {
      net_vaildToken(feeds.data.username, feeds.data.password, sendResponse);
      return true;
    } else if (feeds.op === 'detail') {
      net_digDetail(feeds.data.type, feeds.data.id, feeds.force, function(type, data) {
        return sendResponse({
          op: 'detailReady',
          type: type,
          data: data
        });
      });
      return true;
    }
  });

  flashResult = function(callback) {
    var bc, readyCounter, type, _i, _len, _ref, _results;
    readyCounter = 0;
    bc = function() {
      readyCounter++;
      if (readyCounter === (CONST.featureName.length + 1)) callback && callback();
    };
    prepareCollectList('backcall', bc);
    _ref = CONST.featureName;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      _results.push(db_getList(type, prepareNormalList, prepareCollectList('setter'), bc));
    }
    return _results;
  };

  recalculate = function() {
    if (updateJudge('updateTime', 'history')) {
      console.log('recalculate');
      return flashResult();
    }
  };

  checkNewTerm = function() {
    var lastTerm;
    lastTerm = localStorage.getItem('currentTerm', null);
    if (lastTerm) {
      return $.get(URL_CONST['course'], function(data) {
        var courseDocument, currentTerm;
        courseDocument = parser.parseFromString(data, 'text/html');
        currentTerm = $.trim((courseDocument.querySelector('.active_on')).innerText);
        if (lastTerm !== currentTerm) {
          return nextTermCallback(lastTerm, currentTerm);
        }
      });
    }
  };

  termHolder = {
    lastTerm: "",
    currentTerm: ""
  };

  nextTermCallback = function(lastTerm, currentTerm) {
    termHolder.lastTerm = lastTerm;
    termHolder.currentTerm = currentTerm;
    return chrome.extension.sendMessage({
      op: 'newTerm',
      data: termHolder
    });
  };

  chrome.runtime.onMessage.addListener(function(feeds, sender, sendResponse) {
    if (feeds.op === 'new_term') {
      clearCache();
      localStorage.setItem('currentTerm', termHolder.currentTerm);
      load(true, sendResponse);
      return true;
    }
    if (feeds.op === 'force_term') {
      localStorage.setItem('currentTerm', termHolder.currentTerm);
      return false;
    }
  });

}).call(this);
