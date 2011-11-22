pg = require 'pg'
util = require 'util'
env = require '../envHelper'

client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar "DATABASE_URL")
client.connect()

db = require '../model/phrases.js'

# process array into phrases with paragraphs and an exterminate multiplier
processPhrases = (array, multiplier, numParagraphs) ->
	phrases = addExterminate array, multiplier
	phrases.sort -> 0.5 - Math.random()
	phrasesArray = []
	phrasesArray.push(phrase.value) for phrase in phrases
		
	formatText phrasesArray

# Create a function to format the text
formatText = (array, numParagraphs) ->
	paragraphLengths = [50, 100, 150]
	text = ""
	
	while numParagraphs -= 1
		text += "\n\n"
		
	array.join " "
	
# insert EXTERMINATE! text into the array, Given a multiplier
addExterminate = (array, multiplier) ->
	ext = {
			id: 0
			value: "EXTERMINATE!"
	}
	remainder = Math.round((multiplier*.1)*array.length)
	
	if remainder is 0 then return array
		
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
		
		phrasesText = processPhrases phrases, multiplier, paragraphs
		phrasesJson = {"text": phrasesText}				
		res.send JSON.stringify(phrasesJson)	