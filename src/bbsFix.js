$(function(){
	$('.tr_l2').each(function() {
		if (!this.innerHTML.match(/<[a-zA-Z]+[^>]*>/))
			$(this).wrapInner('<pre style="width:700px"/>');
	});
});
