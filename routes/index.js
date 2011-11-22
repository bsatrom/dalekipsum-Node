(function() {
  var addExterminate, client, db, env, formatText, pg, processPhrases, util;
  pg = require('pg');
  util = require('util');
  env = require('../envHelper');
  client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar("DATABASE_URL"));
  client.connect();
  db = require('../model/phrases.js');
  processPhrases = function(array, multiplier, numParagraphs) {
    var phrase, phrases, phrasesArray, _i, _len;
    phrases = addExterminate(array, multiplier);
    phrases.sort(function() {
      return 0.5 - Math.random();
    });
    phrasesArray = [];
    for (_i = 0, _len = phrases.length; _i < _len; _i++) {
      phrase = phrases[_i];
      phrasesArray.push(phrase.value);
    }
    return formatText(phrasesArray);
  };
  formatText = function(array, numParagraphs) {
    var paragraphLengths, text;
    paragraphLengths = [50, 100, 150];
    text = "";
    while (numParagraphs -= 1) {
      text += "\n\n";
    }
    return array.join(" ");
  };
  addExterminate = function(array, multiplier) {
    var ext, remainder;
    ext = {
      id: 0,
      value: "EXTERMINATE!"
    };
    remainder = Math.round((multiplier * .1) * array.length);
    if (remainder === 0) {
      return array;
    }
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
      var multiplier, paragraphs, phrasesJson, phrasesText;
      multiplier = req.params.multiplier || 1;
      paragraphs = req.params.paragraphs || 1;
      phrasesText = processPhrases(phrases, multiplier, paragraphs);
      phrasesJson = {
        "text": phrasesText
      };
      return res.send(JSON.stringify(phrasesJson));
    });
  };
}).call(this);
