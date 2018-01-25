/**
 * Created by alekseymikhailovwork on 16.05.17.
 */

const connector = require('./gsheets-connector');
const iosGenerator = require('./ios-strings-generator');
const androidGenerator = require('./android-strings-generator');
const yii2Generator = require('./yii2-strings-generator');

var platform = process.argv[2];
var type = process.argv[3];
var spreadsheetId = process.argv[4];
var range = process.argv[5];
var path = process.argv[6];

var behaviors = {
  ios: {
    strings: function(auth) {
      return iosGenerator.generateStringsLocalizations(auth, spreadsheetId, range, path);
    },
    plurals: function(auth) {
      return iosGenerator.generatePluralsLocalizations(auth, spreadsheetId, range, path);
    },
    info: function(auth) {
      return iosGenerator.generateInfoLocalizations(auth, spreadsheetId, range, path);
    }
  },
  android: {
    strings: function(auth) {
      return androidGenerator.generateStringsLocalizations(auth, spreadsheetId, range, path);
    },
    plurals: function(auth) {
      return androidGenerator.generatePluralsLocalizations(auth, spreadsheetId, range, path);
    }
  },
  yii2: {
    strings: function(auth) {
      return yii2Generator.generateStringsLocalizations(auth, spreadsheetId, range, path);
    }
  }
};

connector.connect(function(auth) {
  var behavior = behaviors[platform];
  if(behavior === undefined) {
    console.log('Unknown platform: ' + platform + ". Available:\n");
    Object.keys(behaviors).forEach(function (item) {
      console.log(item);
    });
    return;
  }

  var action = behavior[type];
  if(action === undefined) {
    console.log('Unknown type: ' + type + ". Available:\n");
    Object.keys(behavior).forEach(function (item) {
      console.log(item);
    });
    return;
  }

  action(auth);
});

