fs = require 'fs'
path = require 'path'
walk = require 'walk'
{exec} = require 'child_process'
CoffeeScript = require 'coffee-script'
wingrr = require 'wingrr'
uglify = require "uglify-js"
util = require 'util'
jsp = uglify.parser
pro = uglify.uglify
project = 'dalekIpsum'

imgBase = "https://github.com/bsatrom/Knockout.Unobtrusive/raw/master/build/img/"
coffeeImg = "#{imgBase}coffee.png"
successImg = "#{imgBase}coffee-success.png"
failImg = "#{imgBase}coffee-error.png"

#wingrr.debug = true
wingrr.registerApplication "Cake", {image:  coffeeImg}
  
clean = ->
  files = ['app.js', 'public/javascripts/index.js', 'public/javascripts/index.min.js', 'public/javascripts/submit.js', 'public/javascripts/submit.min.js', 'model/phrases.js', 'envHelper.js']
  directories = ['routes']
  
  fs.unlink file for file in files
  walkDir directory for directory in directories  
  
makeUgly = (err, str, file) ->
	if err 
		util.log err
	ast = jsp.parse str
	ast = pro.ast_mangle ast
	ast = pro.ast_squeeze ast
	code = pro.gen_code ast
	fs.writeFile (file.replace /\.js/, '.min.js'), code

walkDir = (directory) ->
	walker = walk.walk directory, {followLinks: false}
	walker.on 'file', (root, file, next) ->
		if file.name.match /\.js$/
			fs.unlink "{root}/#{file.name}"
		next()
		
task 'cleanup', 'cleans up the libs before a release', ->
	clean()
	
task 'build', "builds #{project}", ->
    util.log "building #{project} files from coffeescript"
    
    files = ["app.coffee", "routes/*.coffee", "public/javascripts/*.coffee", "model/*.coffee", "envHelper.coffee"]
    
    (exec "coffee --compile #{file}", (err, stdout, stderr) ->
      throw err if err
      if stderr
      	util.log stderr
      ) for file in files    
    util.log("Task 'build' complete")
		
task 'minify', "minifies #{project} files to a release build", ->
	invoke 'build'
	util.log "minifying #{project}"
	files = fs.readdirSync "public/javascripts/"
	files = ("public/javascripts/" + f for f in files when f.match(/\.js$/))
	(fs.readFile f, 'utf8', (err, data) -> makeUgly err, data, f) for f in files
	
task 'release', "creates a release of #{project}", ->
    invoke 'cleanup'
    invoke 'build'
    invoke 'tests'
    invoke 'minify'
    wingrr.notify 'Release created', {title: "#{project} Release", image: successImg}
    
task 'tests', "run tests for #{project}", ->
    util.log 'Time for some tests! '
    util = require 'util'
    colors = require 'colors'
    
    exec "node_modules/jasmine-node/bin/jasmine-node --coffee --verbose --color spec/", (err, stdout, stderr) ->
    	if stderr
      	msg = stdout + stderr
      	util.log msg.bold.red
      	wingrr.notify msg, {title: '#{project} Tests', image: failImg}  
      else
      	msg = stdout
      	util.log msg.green
      	wingrr.notify msg, {title: '#{project} Tests', image: successImg}

task 'watch', 'Watch prod source files and build changes', ->
	console.log "Searching for files in #{project}"
	
	walker = walk.walk '.', {followLinks: false}
	
	files = []
	
	walker.on 'directories', (root, dirs, next) ->
		(if dir?.name is "node_modules" or dir?.name is ".git"
			idx = dirs.indexOf dir
			newdir = dirs.splice idx, 1) for dir in dirs
		next()
	
	walker.on 'file', (root, file, next) ->
		if file.name.match /\.coffee$/ 
			if not (root.match /node_modules/ or root.match /.git/)
				f = "#{root}/#{file.name}"
				util.log(f)
				files.push f			
		next()
			
	walker.on 'end', ->
		msg = "watching #{files.length} files for changes"
		console.log(msg)
		wingrr.notify msg, {title: "#{project} Watch", image: successImg}
		
		(fs.watchFile file, (curr, prev) -> 
			if +curr.mtime isnt +prev.mtime
				console.log "A file has changed!"
				try
					invoke 'build'
					console.log 'build complete'
					invoke 'tests'
				catch e
		    	msg = 'Error with CoffeeScript build'
		    	wingrr.notify msg, {title: '#{project} Watch', image: failImg}
		    	console.log msg
		    	console.log e) for file in files