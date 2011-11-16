(function() {
  var addExterminate, client, db, env, formatText, pg, util;
  pg = require('pg');
  util = require('util');
  env = require('../envHelper');
  client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar("DATABASE_URL"));
  client.connect();
  db = require('../model/phrases.js');
  formatText = function(array, numParagraphs) {
    var paragraphLengths, text, _results;
    paragraphLengths = [50, 100, 150];
    text = "";
    _results = [];
    while (numParagraphs -= 1) {
      _results.push(text += "\n\n");
    }
    return _results;
  };
  addExterminate = function(array, multiplier) {
    var ext, num, remainder;
    ext = {
      id: 0,
      value: "EXTERMINATE!"
    };
    remainder = ((multiplier + 1) * array.length) - array.length;
    num = remainder;
    while (remainder -= 1) {
      array.push(ext);
    }
    return array;
  };
  /*
   * GET home page.
  */
  exports.index = function(req, res) {
    return db.getPhrases(client, function(phrases) {
      phrases = addExterminate(phrases, 1);
      phrases.sort(function() {
        return 0.5 - Math.random();
      });
      return res.render('index', {
        title: 'Dalek Ipsum!',
        phrases: phrases
      });
    });
  };
  /*
   * GET phrases
  */
  exports.phrases = function(req, res) {
    return db.getPhrases(client, function(phrases) {
      var phrasesJson;
      phrasesJson = {
        "phrases": phrases
      };
      return res.send(JSON.stringify(phrasesJson));
    });
  };
  /*
   * GET placeholderText
  */
  exports.placeholderText = function(req, res) {
    return db.getPhrases(client, function(phrases) {
      var multiplier, paragraphs, phrase, phrasesArray, phrasesJson, phrasesText, _i, _len;
      multiplier = req.params.multiplier || 1;
      paragraphs = req.params.paragraphs || 1;
      phrases = addExterminate(phrases, multiplier);
      phrases.sort(function() {
        return 0.5 - Math.random();
      });
      phrasesArray = [];
      for (_i = 0, _len = phrases.length; _i < _len; _i++) {
        phrase = phrases[_i];
        phrasesArray.push(phrase.value);
      }
      phrasesText = phrasesArray.join(" ");
      phrasesJson = {
        "text": phrasesText
      };
      return res.send(JSON.stringify(phrasesJson));
    });
  };
}).call(this);
