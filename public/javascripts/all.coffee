(($) ->
	$('a').click ->
		$(@).addClass('clicked').delay(300).queue (next) ->
			$(@).removeClass 'clicked'
			next()			
)(jQuery)