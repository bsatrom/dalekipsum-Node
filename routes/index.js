(function() {
  var addExterminate, client, createParagraph, db, env, formatText, pg, processPhrases, util;
  pg = require('pg');
  util = require('util');
  env = require('../envHelper');
  client = new pg.Client(process.env.DATABASE_URL || env.getEnvVar("DATABASE_URL"));
  client.connect();
  db = require('../model/phrases.js');
  processPhrases = function(array, multiplier, numParagraphs, pTag) {
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
    return formatText(phrasesArray, numParagraphs, pTag);
  };
  formatText = function(array, numParagraphs, pTag) {
    var index, paragraphLength, paragraphLengths, text;
    paragraphLengths = [50, 100, 150];
    text = "";
    numParagraphs++;
    while (numParagraphs -= 1) {
      paragraphLength = paragraphLengths[Math.floor(Math.random() * 3)];
      if (pTag === 'true') {
        text += "<p>";
      }
      for (index = 0; 0 <= paragraphLength ? index <= paragraphLength : index >= paragraphLength; 0 <= paragraphLength ? index++ : index--) {
        text += createParagraph(array, index);
      }
      if (pTag === 'true') {
        text += "<p>";
      }
      if (numParagraphs !== 1) {
        text += "\n\n";
      }
    }
    return text.replace(/^\s+|\s+$/g, "");
  };
  createParagraph = function(array, index) {
    var length;
    array.sort(function() {
      return 0.5 - Math.random();
    });
    length = array.length;
    return "" + array[index % length] + " ";
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
      var phrasesText;
      phrasesText = processPhrases(phrases, 1, 2, 'true');
      return res.render('index', {
        title: 'Dalek Ipsum!',
        subtitle: 'Placeholder text, mercilessly crafted by the children of Skaro.',
        phrases: phrasesText
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
      var multiplier, pTags, paragraphs, phrasesJson, phrasesText;
      multiplier = req.params.multiplier || 1;
      paragraphs = req.params.paragraphs || 1;
      pTags = req.params.pTags || 'true';
      phrasesText = processPhrases(phrases, multiplier, paragraphs, pTags);
      phrasesJson = {
        "text": phrasesText
      };
      return res.send(JSON.stringify(phrasesJson));
    });
  };
  /*
  	* GET submitPhrase
  */
  exports.submitPhrase = function(req, res) {
    return res.render('submit', {
      title: 'Suggest Phrase!',
      subtitle: 'Fill in the box below, puny human!'
    });
  };
  /*
   * POST submitPhrase
  */
  exports.submitPhrase_post = function(req, res) {
    var phrase;
    phrase = req.body.phrase;
    if (!phrase) {
      return res.send('Enter a suggestion, or prepare for EXTERMINATION!');
    } else {
      db.addPhrase(client, phrase);
      return res.send('Thanks for your suggestion');
    }
  };
}).call(this);
