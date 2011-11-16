pg = require 'pg'
util = require 'util'

exports.getPhrases = (client, callback) ->
	phrases = []
	if client
		client.query 'SELECT * FROM phrase', (err, result) -> 
			if err 
				util.log err.message
			else
				phrases = result.rows
			if callback then callback(phrases) else phrases
	else
		util.log 'Client not connected.'
		return []	
	