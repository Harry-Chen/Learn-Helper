window.URL_CONST =
	'login' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp'	#登陆页
	'course' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp'		#本学期课程
	'course_all' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?typepage=2'		#全部课程
	'notification' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getnoteid_student.jsp'		#课程公告
	'course_info' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_info.jsp'		#课程信息
	'file' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/download.jsp'		#课程文件
	'resource' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/ware_list.jsp'		#教学资源
	'deadline' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp'		#课程作业
	'mentor' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getbbsid_student.jsp'		#课程答疑
	'discuss' : 'https://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/gettalkid_student.jsp'		#课程讨论
	'course_page' : 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp'		#课程页面
	'deadline_detail' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp' #作业详细
	'deadline_submit' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_submit.jsp' #作业提交
	'deadline_review' : 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_view.jsp' #作业批阅
window.CONST =
	version : window.getManifest().version
	featureName : [ 'deadline', 'notification', 'file']
	collectNumber : 20
	collectEvalLimit : 7
	GUIListName :
		deadline : '#nearby-deadline'
		notification : '#category-heading'
		file  : '#file-heading'
		collect : '#js-new'
	listTemp : ['collect', 'deadline', 'notification', 'file']
	panelTran :
		collect : 'main-page'
		deadline : 'deadline-page'
		notification : 'notification-page'
		file : 'file-page'
	cacheListName :
		courseList : 'course_list'
		deadline : 'deadline_list'
		notification : 'notification_list'
		file : 'file_list'
	ignoreListName :
		deadline : 'ignore_list_deadline'
		notification : 'ignore_list_notification'
		file : 'ignore_list_file'
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
