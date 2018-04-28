var fs = require('fs');
var mkdirp = require('mkdirp');
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

            for (var i = 2; i < columns.length; i++) {

                var langCode = columns[i];
                var categories = {};

                for (var j = 1; j < rows.length; j++) {
                    var row = rows[j];
                    var category = row[0];
                    var key = row[1];
                    var translation = row[i];

                    if (
                        key == null ||
                        category == null ||
                        key.length == 0 ||
                        category.length == 0 ||
                        translation === undefined ||
                        translation === ''
                    ) {
                        continue;
                    }

                    var categoryString = categories[category];
                    if (categoryString == null) {
                        categoryString = "";
                    }

                    if (key.length > 0) {
                        categoryString += "    '" + key + "' => '" + translation + "',\n";
                    }

                    categories[category] = categoryString;

                    console.log('[%s] %s-%s = %s', langCode, category, key, translation);
                }

                Object.keys(categories).forEach(function (category) {
                    var content = categories[category];
                    var dir = path + langCode + '/';
                    content = "<?php\nreturn [\n" + content + "];\n";

                    mkdirp(dir, function (err) {
                        if (err) throw err;
                        fs.writeFile(dir + category + ".php", content, {flag: 'w'});
                    });
                });
            }
        }
    });
};
