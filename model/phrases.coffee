pg = require 'pg'
util = require 'util'

exports.getPhrases = (client, callback) ->
	phrases = []
	if client
		client.query 'SELECT * FROM phrase WHERE approved = true', (err, result) -> 
			if err 
				util.log err.message
			else
				phrases = result.rows
			if callback then callback(phrases) else phrases
	else
		util.log 'Client not connected.'
		return []	
		
exports.addPhrase = (client, phrase)	->
	if client
		client.query "SELECT * FROM phrase WHERE value = '#{phrase}'", (err, result) ->
			if result.rows.length is 0
				client.query "INSERT INTO phrase(value, \"createdDate\", approved) VALUES ('#{phrase}', now(), false)", (err, result) ->
					if err then util.log err.message			
	else
		util.log 'Client not connected.'
		
exports.approvePhrase = (client, phraseId) ->
	if client
		client.query "UPDATE phrase SET approved = true WHERE id = #{phraseId}", (err, result) ->
			if err then util.log err.message
	else
		util.log 'Client not connected.'