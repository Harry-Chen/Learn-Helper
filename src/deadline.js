$(function() {
    "use strict";

    function getURLParamters(url) {
        var params = {};
        url = url.split('?').pop().split('&');
        for (var i = 0, tmp; i < url.length; i++) {
            tmp = url[i].split('=');
            params[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
        };
        return params;
    }

    var homeworks = [];
    var uncheckedHomework = 0;
    var parser = new DOMParser();

    function fillHomework(courseId, courseName) {
        $.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp', { course_id: courseId }, function (data) {
            var homeworkDocument = parser.parseFromString(data, 'text/html');
            var homeworkList = homeworkDocument.querySelectorAll('#table_box .tr1, #table_box .tr2');
            for (var i = 0, attr; i < homeworkList.length; i++) {
                attr = homeworkList[i].querySelectorAll('td');
                homeworks.push({
                    courseId: courseId,
                    courseName: courseName,
                    name: $.trim(attr[0].innerText),
                    start: new Date($.trim(attr[1].innerText)),
                    end: new Date($.trim(attr[2].innerText)),
                    state: $.trim(attr[3].innerText),
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
            if (a.state === b.state) {
                return b.end - a.end;
            }
            return (a.state === '尚未提交') ? -1 : 1;
        });
        var today = new Date();

        var html = '';
        html += '<table width="100%" border="2">';
        html += '<tr>';
        html += '<th>剩余天数</th>';
        html += '<th>截止日期</th>';
        html += '<th>作业名称</th>';
        html += '<th>课程名称</th>';
        html += '</tr>';
        for (var i = 0, dueDays; i < homeworks.length; i++) {
            dueDays = Math.floor((homeworks[i].end - today) / (60 * 60 * 1000 * 24));
            if (homeworks[i].state === '尚未提交' && dueDays >= 0) {
                html += '<tr style="color: red">';
            } else {
                html += '<tr>';
                dueDays = homeworks[i].state;
            }
            html += '<td>' + dueDays + '</td>';
            html += '<td>' + homeworks[i].end.toDateString() + '</td>';
            html += '<td>' + homeworks[i].name + '</td>';
            html += '<td><a target="_blank" href="http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/course_locate.jsp?course_id=' + homeworks[i].courseId + '">' + homeworks[i].courseName.replace(/\(\d+\)\(.*$/, '') + '</a></td>';
            html += '</tr>';
        };
        html += '</table>';
        $('#results').html(html);
    }

    $.get('http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp', function(data) {
        var courseDocument = parser.parseFromString(data, 'text/html');
        var coursesList = courseDocument.querySelectorAll('#info_1 a');
        uncheckedHomework += coursesList.length;
        for (var i = 0, courseId; i < coursesList.length; i++) {
            fillHomework(
                getURLParamters(coursesList[i].getAttribute('href')).course_id,
                $.trim(coursesList[i].innerText) // course name
            );
        }
    }, 'html');

});
