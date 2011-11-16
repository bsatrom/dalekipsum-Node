fs = require 'fs'
util = require 'util'

setVar = (line) ->
	util.log line

exports.processEnv = ->
	fs.readFile '.env', (err, data) ->
		if err then util.log err.message
		lines = data.split '\n'
		
		util.log lines
		
		setVar line for line in lines