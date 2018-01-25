var fs = require('fs');
var google = require('googleapis');

module.exports.generateStringsLocalizations = function (auth, spreadsheetId, range, path) {
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

        if (langCode == "en") {
          langCode = undefined;
        }

        for (var j = 1; j < rows.length; j++) {
          var row = rows[j];
          var key = row[0];
          var string = row[i];

          if (key == null) {
            key = "";
          }

          if (key.startsWith("//")) {
            content += '\n\t<!--' + key.replace(/\/\//g, "") + '-->\n';
          } else if (key.length > 0 && string != null && string.length > 0) {
            string = string.replace(/%@/g, "%s");
            string = string.replace(/\\r/g, "");
            string = string.replace(/→/g, "\u2192");
            string = string.replace(/→/g, "\u2192");
            string = string.replace(/\.\.\./g, "&#8230;");
            string = string.replace(/'/g, "\\'");

            content += '\t<string name="' + key + '">' + string + '</string>\n';
          }

          console.log('[%s] %s = %s', langCode, key, string);
        }

        var directory = path + "values" + (langCode != undefined ? "-" + langCode : "") + '/';
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory);
        }

        fs.writeFileSync(directory + 'strings.xml', "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n" + content + "</resources>\n");
      }
    }
  });
};

module.exports.generatePluralsLocalizations = function (auth, spreadsheetId, range, path) {
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
    <resources>
       <plurals name="battles_uncounted">
          <item quantity="zero">battles</item>
          <item quantity="one">battle</item>
          <item quantity="two">battles</item>
          <item quantity="few">battles</item>
          <item quantity="many">battles</item>
          <item quantity="other">battles</item>
      </plurals>
    </resources>
     */
    var result = '<?xml version="1.0" encoding="utf-8"?>\n';
    result += '<resources>\n';

    for (var key in dictionary) {
      var item = dictionary[key];

      item["few"] = item["many"];
      item["two"] = item["other"];

      result += '  <plurals name="' + key + '">\n';
      for (var plural in item) {
        result += '    <item quantity="' + plural + '">' + item[plural] + '</item>\n';
      }
      result += '  </plurals>\n';
    }

    result += '</resources>';

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

        if (langCode == "en") {
          langCode = undefined;
        }

        for (var j = 1; j < rows.length; j++) {
          var row = rows[j];
          var key = row[0];
          var plural = row[1];
          var string = row[i];

          if (key != null && key.length > 0) {
            appendDataToDict(content, key, plural, string);
          }

          console.log('[%s] %s-%s = %s', langCode, key, plural, string);
        }


        var directory = path + "values" + (langCode != undefined ? "-" + langCode : "") + '/';
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory);
        }

        fs.writeFileSync(directory + 'plurals.xml', fileContentFromDictionary(content));
      }
    }
  });
};
