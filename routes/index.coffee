pg = require 'pg'
util = require 'util'
env = require '../envHelper'

client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar "DATABASE_URL")
client.connect()

db = require '../model/phrases.js'

# Create a function to format the text
formatText = (array, numParagraphs) ->
	paragraphLengths = [50, 100, 150]
	text = ""
	
	while numParagraphs -= 1
		text += "\n\n"
	
# insert EXTERMINATE! text into the array, Given a multiplier
addExterminate = (array, multiplier) ->
	ext = {
			id: 0
			value: "EXTERMINATE!"
	}
	remainder = ((multiplier+1)*array.length) - array.length
	
	num = remainder
	while remainder -= 1
		array.push(ext)
	
	return array

###
 * GET home page.
###
exports.index = (req, res) ->
	db.getPhrases client, (phrases) ->
		phrases = addExterminate phrases, 1
		phrases.sort -> 0.5 - Math.random()
		res.render 'index', { title: 'Dalek Ipsum!', phrases: phrases }

###
 * GET phrases
###
exports.phrases = (req, res) ->
	db.getPhrases client, (phrases) ->
		phrasesJson = {"phrases": phrases}				
		res.send JSON.stringify(phrasesJson)
		
###
 * GET placeholderText
###
exports.placeholderText = (req, res) ->
	db.getPhrases client, (phrases) ->
		multiplier = req.params.multiplier or 1
		paragraphs = req.params.paragraphs or 1
		
		phrases = addExterminate phrases, multiplier
		phrases.sort -> 0.5 - Math.random()
		phrasesArray = []
		phrasesArray.push(phrase.value) for phrase in phrases
		
		phrasesText = phrasesArray.join " "
		phrasesJson = {"text": phrasesText}				
		res.send JSON.stringify(phrasesJson)	