db = null
client = null
util = require 'util'
pg = require 'pg'
env = require '../envHelper'

# Load config variables from .env into the local environment for tests
beforeEach ->
	env.processEnv()
		
describe 'the phrases model', ->
###	it 'should return a list of all phrases in the database', ->
		waitsFor( ->
			client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar "DATABASE_URL")
			client.connect()
			return true
		, "Client connect timed out", 1000)		
		runs ->
			db = require '../model/phrases.js'		
			db.getPhrases client, (phrases) ->
				expect(phrases.length).toBeGreaterThan 0###