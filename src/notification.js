$(function() {
    "use strict";
    var homeworks = [];
    var uncheckedHomework = 0;
    var parser = new DOMParser();
	var getURLParamters = window.getURLParamters;
    function fillHomework(courseId, courseName) {
		$.get('http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/getnoteid_student.jsp', { course_id: courseId }, function (data) {
			var homeworkDocument = parser.parseFromString(data, 'text/html');
			var homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2');
			for (var i = 0, attr; i < homeworkList.length; i++) {
				attr = homeworkList[i].querySelectorAll('td');
				homeworks.push({
					courseId: courseId,
					courseName: courseName,
					name: $.trim(attr[1].innerText),
					day: new Date($.trim(attr[3].innerText)),
					href: $.trim($(attr[1]).find("a").attr('href'))
				});
			};

			uncheckedHomework--;
			if (uncheckedHomework === 0) {
				displayHomework();
			}
		}, 'html');
    }

    function displayHomework() {
        homeworks = homeworks.sort(function(a, b) {
			return b.day - a.day;
        });

        var html = '';
        html += '<table width="100%" border="2">';
        html += '<tr>';
        html += '<th>课程名称</th>';
        html += '<th>公告标题</th>';
        html += '<th>发表日期</th>';
        html += '</tr>';
        for (var i = 0; i < homeworks.length; i++) {
			html += '<tr>';
            html += '<td><a target="_blank" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp?course_id=' + homeworks[i].courseId + '">' + homeworks[i].courseName.replace(/\(\d+\)\(.*$/, '') + '</a></td>';
            html += '<td><a target="_blank" href="http://learn.tsinghua.edu.cn/MultiLanguage/public/bbs/'+homeworks[i].href+'">' + homeworks[i].name + '</a></td>';
            html += '<td>' + homeworks[i].day.toDateString() + '</td>';
            html += '</tr>';
        };
        html += '</table>';
        $('#results').html(html);
    }

	function setDifference(a,b) { return a.filter(function(x) { return b.indexOf(x) < 0; }); }
    $.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp', function(data) {
        var courseDocument = parser.parseFromString(data, 'text/html');
        var coursesList = courseDocument.querySelectorAll('#info_1 a');
		coursesList = Array.prototype.slice.call(coursesList);
		var fliter = [];
		if (localStorage.getItem('ignore_list')){
			fliter = JSON.parse(localStorage.getItem('ignore_list'));
		}
		coursesList = coursesList.filter(function(x) { return fliter.indexOf(getURLParamters(x.getAttribute('href')).course_id) < 0; });
        uncheckedHomework += coursesList.length;
        for (var i = 0, courseId, match; i < coursesList.length; i++) {
			var id  = getURLParamters(coursesList[i].getAttribute('href')).course_id;
            fillHomework(id, $.trim(coursesList[i].innerText)); // course name
		}
    }, 'html');

});

