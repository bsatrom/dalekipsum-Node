pg = require 'pg'
util = require 'util'
env = require '../envHelper'

client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar "DATABASE_URL")
client.connect()

db = require '../model/phrases.js'

# process array into phrases with paragraphs and an exterminate multiplier
processPhrases = (array, multiplier, numParagraphs, pTag) ->
	phrases = addExterminate array, multiplier
	phrases.sort -> 0.5 - Math.random()
	phrasesArray = []
	phrasesArray.push(phrase.value) for phrase in phrases
		
	formatText phrasesArray, numParagraphs, pTag

# Create a function to format the text
formatText = (array, numParagraphs, pTag) ->
	paragraphLengths = [50, 100, 150]
	text = ""
	
	numParagraphs++
	while numParagraphs -= 1
		paragraphLength = paragraphLengths[Math.floor(Math.random()*3)]
		
		if pTag is 'true' then text += "<p>"
		text += createParagraph array, index for index in [0..paragraphLength]
		if pTag is 'true' then text += "<p>"
		text += "\n\n" unless numParagraphs is 1
	
	return text.replace /^\s+|\s+$/g, ""

createParagraph = (array, index)	->
	array.sort -> 0.5 - Math.random()
	length = array.length
	"#{array[index % length]} "
		
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
		phrasesText = processPhrases phrases, 1, 2, 'true'
		
		res.render 'index', { title: 'Dalek Ipsum!', subtitle: 'Placeholder text, mercilessly crafted by the children of Skaro.', phrases: phrasesText }

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
		pTags = req.params.pTags or 'true'
		
		phrasesText = processPhrases phrases, multiplier, paragraphs, pTags
		phrasesJson = {"text": phrasesText}				
		res.send JSON.stringify(phrasesJson)	
		
###
	* GET submitPhrase
###
exports.submitPhrase = (req, res) ->	
	res.render 'submit', { title: 'Suggest Phrase!', subtitle: 'Fill in the box below, puny human!' }
	
###
 * POST submitPhrase
###
exports.submitPhrase_post = (req, res) ->
	phrase = req.body.phrase
	
	if not phrase
		res.send 'Enter a suggestion, or prepare for EXTERMINATION!'
	else
		db.addPhrase client, phrase
		res.send 'Thanks for your suggestion'