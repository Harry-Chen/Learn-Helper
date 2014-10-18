window.URL_CONST =
    'login' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp'    #登陆页
    'course' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp'        #本学期课程
    'course_all' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?typepage=2'        #全部课程
    'notification' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getnoteid_student.jsp'        #课程公告
    'course_info' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_info.jsp'        #课程信息
    'file' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/download.jsp'        #课程文件
    'resource' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/ware_list.jsp'        #教学资源
    'deadline' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp'        #课程作业
    'mentor' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getbbsid_student.jsp'        #课程答疑
    'discuss' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/gettalkid_student.jsp'        #课程讨论
    'discuss_detail' : 'http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/talk_reply_student.jsp'
    'course_page' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp'        #课程页面
    'deadline_detail' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp' #作业详细
    'deadline_submit' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_submit.jsp' #作业提交
    'deadline_review' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_view.jsp' #作业批阅
    'base_URL' : 'http://learn.tsinghua.edu.cn'
    'new_login' : 'https://id.tsinghua.edu.cn/do/off/ui/auth/login/post/fa8077873a7a80b1cd6b185d5a796617/0?/j_spring_security_thauth_roaming_entry' #login
    'new_course' : 'http://learn.cic.tsinghua.edu.cn/f/student/courselist'  #current courses
    'new_course_info' : 'http://learn.cic.tsinghua.edu.cn/f/student/courseinfo/'
    'new_course_file' : 'http://learn.cic.tsinghua.edu.cn/f/student/courseware/'
    'new_course_homework' : 'http://learn.cic.tsinghua.edu.cn/f/student/homework/'
    'new_group_learning' : 'http://learn.cic.tsinghua.edu.cn/f/student/groupLearning/'
    'new_forum' : 'http://learn.cic.tsinghua.edu.cn/f/student/forum/'
    'new_course_page': 'http://learn.cic.tsinghua.edu.cn/f/student/coursehome/'
    'new_notification' : 'http://learn.cic.tsinghua.edu.cn/b/myCourse/notice/list/' #notification
    'new_deadline' : 'http://learn.cic.tsinghua.edu.cn/b/myCourse/homework/list4Student/' #homework
    'new_deadline_submit' : 'http://learn.cic.tsinghua.edu.cn/f/student/homework/hw_detail/'
    'new_deadline_review' : 'http://learn.cic.tsinghua.edu.cn/f/student/homework/hw_result/'
    'new_file' : 'http://learn.cic.tsinghua.edu.cn/b/myCourse/tree/getCoursewareTreeData/' #file
    'new_discuss' : 'http://learn.cic.tsinghua.edu.cn/b/topic/list/1/' #discuss
    'new_discuss_detail' : 'http://learn.cic.tsinghua.edu.cn/f/student/forum/courseReplyList/'
    'new_base_URL' : 'http://learn.cic.tsinghua.edu.cn'
window.CONST =
    version : window.getManifest().version
    featureName : [ 'deadline', 'notification', 'file', 'discuss']
    collectNumber : 20
    collectEvalLimit : 7
    GUIListName :
        discuss : '#recent-discuss'
        deadline : '#nearby-deadline'
        notification : '#category-heading'
        file  : '#file-heading'
        collect : '#js-new'
    listTemp : ['collect', 'deadline', 'notification', 'file', 'discuss']
    panelTran :
        collect : 'main-page'
        deadline : 'deadline-page'
        notification : 'notification-page'
        file : 'file-page'
        discuss : 'discuss-page'
    cacheListName :
        courseList : 'course_list'
        deadline : 'deadline_list'
        notification : 'notification_list'
        file : 'file_list'
        discuss : 'discuss_list'
    ignoreListName :
        deadline : 'ignore_list_deadline'
        notification : 'ignore_list_notification'
        file : 'ignore_list_file'
        discuss : 'ignore_list_discuss'
    changeState :
        unread :
            read : 'readed'
            star : 'stared'
        readed :
            read : 'readed'
            star : 'stared'
        stared :
            read : 'stared'
            star : 'readed'
    evalFlag :
        EXPIRED : 2 << 13
        READED : 0
        UNREAD : - (2 << 15)
        STARED : - (2 << 16)
        SUBMIT :  (2 << 8)
        HOMEWORK : - (2 << 3)
        HOMEWORK_TODAY : -(2 << 8)
    stateTrans :
        submitted : '已经提交'
        unsubmit : '尚未提交'
