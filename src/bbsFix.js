$(function(){
	$('.tr_l2').each(function() {
		if (!this.innerHTML.match(/<[a-zA-Z]+[^>]*>/)) {
			var $this = $(this);
			$this.wrapInner('<pre style="width:700px;max-height:' + $this.height() + 'px;overflow:auto"/>');
		}
	});
	$('textarea[name="post_detail"], textarea[name="post_question_detail"]').replaceWith(function(){
		console.log(this);
		id = this.id;
		name = this.name;
		var target = document.createElement('div');
		target.innerHTML = this.innerHTML;
		target.__defineGetter__('value', function(){return target.textContent;});
		//Object.defineProperties(target, { value: { get: function() { return 'abcd'; } } }); 
		target.addEventListener('keydown', function(e) { e.stopPropagation(); }, false);
		target.addEventListener('keyup', function(e) { e.stopPropagation(); }, false);
		target = $(target);
		target.attr({
			'id': id,
			'name' : name,
			'contenteditable' : 'true',
		});
		target.css({
			width : '650px',
			'min-height' : '400px',
		});
		return target
	});
});
