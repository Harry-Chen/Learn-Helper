$(function(){
	$('.tr_l2').each(function() {
		if (!this.innerHTML.match(/<[a-zA-Z]+[^>]*>/)) {
			var $this = $(this);
			$this.wrapInner('<pre style="width:700px;max-height:' + $this.height() + 'px;overflow:auto"/>');
		}
	});
});
