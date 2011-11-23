(function() {
  var pg, util;
  pg = require('pg');
  util = require('util');
  exports.getPhrases = function(client, callback) {
    var phrases;
    phrases = [];
    if (client) {
      return client.query('SELECT * FROM phrase WHERE approved = true', function(err, result) {
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
  exports.addPhrase = function(client, phrase) {
    if (client) {
      return client.query("SELECT * FROM phrase WHERE value = '" + phrase + "'", function(err, result) {
        if (result.rows.length === 0) {
          return client.query("INSERT INTO phrase(value, \"createdDate\", approved) VALUES ('" + phrase + "', now(), false)", function(err, result) {
            if (err) {
              return util.log(err.message);
            }
          });
        }
      });
    } else {
      return util.log('Client not connected.');
    }
  };
  exports.approvePhrase = function(client, phraseId) {
    if (client) {
      return client.query("UPDATE phrase SET approved = true WHERE id = " + phraseId, function(err, result) {
        if (err) {
          return util.log(err.message);
        }
      });
    } else {
      return util.log('Client not connected.');
    }
  };
}).call(this);
