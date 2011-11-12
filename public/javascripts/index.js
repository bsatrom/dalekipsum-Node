(function($) {
	$('a').click(function() {
		$(this).addClass('clicked').delay(300).queue(function(next) {
			$(this).removeClass('clicked');
			next();
		});		
	});
})(jQuery);