###
 * Module dependencies.
###

express = require 'express'
routes = require './routes'
util = require 'util'

app = module.exports = express.createServer();

# Configuration

app.configure ->
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static("#{__dirname}/public")

app.configure 'development', ->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })
  app.use express.logger()
  app.use express.bodyParser()

app.configure 'production', ->
  app.use express.errorHandler()

# Routes

app.get '/*', (req, res, next) ->
	util.inspect req.url	
	next()
	
app.get '/', routes.index
app.get '/phrases', routes.phrases
app.get '/text/:multiplier?/:paragraphs?', routes.placeholderText

app.listen process.env.PORT
util.log "Express server listening on port #{if app.address() then app.address().port else process.env.PORT} in #{app.settings.env} mode"