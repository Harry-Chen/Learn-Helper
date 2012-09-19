$(function(){
	
	console.log(window.location.href);
	var args = window.getURLParamters(window.location.href);
	console.log(args);

	var id = args['id'];
//function addException(id){}
	var list = [];
	if (localStorage.getItem("ignore_list")){
		list = JSON.parse(localStorage.getItem("ignore_list"));	}
//	setTimeout(window.close, 2000);
	for (var i = 0; i < list.length; i++){
		if (list[i] == id){
			$("#info").text("重复添加");
			return;
		}
	}
	list.push(id);
	localStorage.ignore_list = JSON.stringify(list);
	
});
