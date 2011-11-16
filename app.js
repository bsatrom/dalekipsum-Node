(function() {
  /*
   * Module dependencies.
  */
  var app, express, routes, util;
  express = require('express');
  routes = require('./routes');
  util = require('util');
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', "" + __dirname + "/views");
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static("" + __dirname + "/public"));
  });
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    app.use(express.logger());
    return app.use(express.bodyParser());
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/*', function(req, res, next) {
    util.inspect(req.url);
    return next();
  });
  app.get('/', routes.index);
  app.get('/phrases', routes.phrases);
  app.get('/text/:multiplier?/:paragraphs?', routes.placeholderText);
  app.listen(process.env.PORT);
  util.log("Express server listening on port " + (app.address() ? app.address().port : process.env.PORT) + " in " + app.settings.env + " mode");
}).call(this);
