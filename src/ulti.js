$(function (){
		window.getURLParamters = function(url) {
		var params = {};
		url = url.split('?').pop().split('&');
		for (var i = 0, tmp; i < url.length; i++) {
		tmp = url[i].split('=');
		params[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
		};
		return params;
		}
});
