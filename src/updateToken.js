function update(){
	var username = $('#username').attr('value');
	var password = $('#password').attr('value');
	if (!(username && password)){
		alert('请输入用户名密码');
		return;
	}
	$.post("https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp", 
		{
			'userid' : username,
			'userpass' : password,
		} , function(data){
			console.log(data);
			if (data.search('alert') != -1){
				alert('验证失败，请检查用户名密码的正确性');
				return;
			}
			savePassword(username,password);
			alert('已经储存');
		}
	).fail(function(){
		alert('验证失败，请检查网络连接');
	});
}
function savePassword(username, passwd){
	localStorage.setItem('learn_username', username);
	localStorage.setItem('learn_passwd', passwd);
}

$(function(){
	$('#submit').click(update);
	$('#delete').click(function(){
		savePassword('','');
		alert('已经删除');
	});
});
