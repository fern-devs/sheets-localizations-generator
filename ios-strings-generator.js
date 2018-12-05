var fs = require('fs');
var google = require('googleapis');
var utils = require('./utils');

module.exports.generateStringsLocalizations = function(auth, spreadsheetId, range, path) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: range,
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      var columns = rows[0];

      for (var i = 1; i < columns.length; i++) {

        var langCode = columns[i];
        var content = "";

        for (var j = 1; j < rows.length; j++) {
          var row = rows[j];
          var key = row[0];
          var string = row[i];

          if (key == null) {
            key = "";
          }

          key = utils.checkPlatformKey(key, "ios")

          if (key.startsWith("//")) {
            content += key;
          } else if (key.length > 0) {
            content += '"' + key + "\" = \"" + string + "\";";
          }

          content += "\n";

          console.log('[%s] %s = %s', langCode, key, string);
        }

        fs.writeFileSync(path + langCode + '.lproj/Localizable.strings', content);
      }
    }
  });
};

module.exports.generatePluralsLocalizations = function(auth, spreadsheetId, range, path) {
  var appendDataToDict = function (dictionary, key, plural, value) {
    var data = dictionary[key];
    if (data == null) {
      data = {};
      dictionary[key] = data;
    }
    data[plural] = value;
  };
  var fileContentFromDictionary = function (dictionary) {
    /*
     <?xml version="1.0" encoding="UTF-8"?>
     <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
     <plist version="1.0">
     <dict>
     <key>Comments.Tournaments.System.left</key>
     <dict>
     <key>one</key>
     <string>выбыл из батла</string>
     <key>zero</key>
     <string></string>
     <key>many</key>
     <string>выбыли из батла</string>
     <key>other</key>
     <string>выбыли из батла</string>
     </dict>
     </dict>
     </plist>
     */
    var result = '<?xml version="1.0" encoding="UTF-8"?>\n';
    result += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
    result += '<plist version="1.0">\n';
    result += '  <dict>\n';

    for (var key in dictionary) {
      var item = dictionary[key];

      result += '    <key>' + key + '</key>\n';
      result += '    <dict>\n';
      for (var plural in item) {
        result += '      <key>' + plural + '</key>\n';
        result += '      <string>' + item[plural] + '</string>\n';
      }
      result += '    </dict>\n';
    }

    result += '  </dict>\n';
    result += '</plist>';

    return result;
  };

  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: range,
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      var columns = rows[0];

      for (var i = 2; i < columns.length; i++) {

        var langCode = columns[i];
        var content = {};

        for (var j = 1; j < rows.length; j++) {
          var row = rows[j];
          var key = row[0];
          var plural = row[1];
          var string = row[i];

          key = utils.checkPlatformKey(key, "ios")

          appendDataToDict(content, key, plural, string);

          console.log('[%s] %s-%s = %s', langCode, key, plural, string);
        }

        fs.writeFileSync(path + langCode + '.lproj/Localizable.stringsdict.plist', fileContentFromDictionary(content));
      }
    }
  });
};

module.exports.generateInfoLocalizations = function(auth, spreadsheetId, range, path) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: range,
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      var columns = rows[0];

      for (var i = 1; i < columns.length; i++) {

        var langCode = columns[i];
        var content = "";

        for (var j = 1; j < rows.length; j++) {
          var row = rows[j];
          var key = row[0];
          var string = row[i];

          if (key == null) {
            key = "";
          }

          key = utils.checkPlatformKey(key, "ios")

          if (key.startsWith("//")) {
            content += key;
          } else if (key.length > 0) {
            content += '"' + key + "\" = \"" + string + "\";";
          }

          content += "\n";

          console.log('[%s] %s = %s', langCode, key, string);
        }

        fs.writeFileSync(path + langCode + '.lproj/InfoPlist.strings', content);
      }
    }
  });
};
