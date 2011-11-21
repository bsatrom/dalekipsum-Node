(($) ->
	$('a').click ->
		$(@).addClass('clicked').delay(300).queue (next) ->
			$(@).removeClass 'clicked'
			next()		
	$('#generate').click ->
		multiplier = $('#exterminateMultiplier option:selected').text()
		paragraphs = $('#numParagraphs option:selected').text()
		
		$.ajaxSetup { cache: false }
		$.getJSON "/text/#{multiplier}/#{paragraphs}", (data) ->
			$('#ipsumText').val(data.text)
)(jQuery)