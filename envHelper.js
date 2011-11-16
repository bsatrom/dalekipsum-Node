(function() {
  var fs, getVar, loadEnv, setVar, util;
  fs = require('fs');
  util = require('util');
  setVar = function(line) {
    var aLine, key, value;
    aLine = line.split('=');
    if (aLine.length < 2) {
      return;
    }
    key = aLine[0];
    value = aLine[1];
    return process.env[key] = value;
  };
  getVar = function(lines, key) {
    var aLine, envVar, line, _i, _len;
    envVar = null;
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      aLine = line.split('=');
      if (aLine[0] === key) {
        envVar = aLine[1];
      }
    }
    return envVar;
  };
  loadEnv = function(callback) {
    return fs.readFile('.env', function(err, data) {
      var lines;
      if (err) {
        util.log(err.message);
      }
      lines = data.toString().split('\n');
      return callback(lines);
    });
  };
  exports.getEnvVar = function(key) {
    var data, lines;
    data = fs.readFileSync('.env');
    lines = data.toString().split('\n');
    return getVar(lines, key);
  };
  exports.processEnv = function() {
    return loadEnv(function(lines) {
      var line, _i, _len;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        setVar(line);
      }
      return util.log('.env values loaded');
    });
  };
}).call(this);
