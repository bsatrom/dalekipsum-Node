(($) ->
	$('#generate').click ->
		multiplier = $('#exterminateMultiplier option:selected').text()
		paragraphs = $('#numParagraphs option:selected').text()
		pTags = not $('#exterminatePTags').is(":checked")
		
		$('#ipsumText').val ''
		$.ajaxSetup { cache: false }
		$.getJSON "/text/#{multiplier}/#{paragraphs}/#{pTags}", (data) ->
			$('#ipsumText').val data.text
)(jQuery)