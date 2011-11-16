(function() {
  var pg, util;
  pg = require('pg');
  util = require('util');
  exports.getPhrases = function(client, callback) {
    var phrases;
    phrases = [];
    if (client) {
      return client.query('SELECT * FROM phrase', function(err, result) {
        if (err) {
          util.log(err.message);
        } else {
          phrases = result.rows;
        }
        if (callback) {
          return callback(phrases);
        } else {
          return phrases;
        }
      });
    } else {
      util.log('Client not connected.');
      return [];
    }
  };
}).call(this);
