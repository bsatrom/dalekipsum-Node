(($) ->
	$('#makeSuggestion').click ->
		form = $('#suggestionForm')
		phrase = $('#phrase').val()
		response = $('#response')
				
		if phrase is ''
			response.addClass 'error'
			response.html 'Enter a suggestion, or prepare for EXTERMINATION!'
		else
			response.addClass 'success'
			$.post "#{form.attr('action')}", { phrase: phrase }, (data) ->
				response.html data		
				response.addClass('successEm').delay(2000).queue (next) ->
					response.removeClass 'successEm'
			next()
)(jQuery)