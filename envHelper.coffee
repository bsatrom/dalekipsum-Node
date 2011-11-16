fs = require 'fs'
util = require 'util'

setVar = (line) ->
	aLine = line.split '='
	
	if aLine.length < 2 then return
	
	key = aLine[0]
	value = aLine[1]
		
	process.env[key] = value

getVar = (lines, key) ->
	envVar = null
	(aLine = line.split '='
	if aLine[0] is key
		envVar = aLine[1]		
	) for line in lines
	return envVar

loadEnv = (callback) ->
	fs.readFile '.env', (err, data) ->
		if err then util.log err.message
		
		lines = data.toString().split '\n'
		callback(lines)

exports.getEnvVar = (key) ->
	data = fs.readFileSync '.env'
	lines = data.toString().split '\n'
	return getVar lines, key

exports.processEnv = ->
	loadEnv (lines) ->
		setVar line for line in lines		
		util.log '.env values loaded'	