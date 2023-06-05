const fs = require('fs');
const mkdirp = require('mkdirp');
const google = require('googleapis');
const utils = require("./utils");

const snakeToCamel = str => str.toLowerCase().replace(/([_][a-z])/g, group =>
  group
    .toUpperCase()
    .replace('_', '')
);

module.exports.generateStringsLocalizations = function (auth, spreadsheetId, range, path) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: range,
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      const columns = rows[0];

      for (let i = 1; i < columns.length; i++) {

        const langCode = columns[i];
        let content = "";
        let kotlinContent = "package com.icerockdev.i18n\n\n" +
          "object LK {\n";

        for (let j = 1; j < rows.length; j++) {
          const row = rows[j];
          let key = row[0];
          let string = row[i];

          if (key == null) {
            key = "";
          }

          if (string != undefined) {
            string = string.replace(/\r\n/g, "\\n");
            string = string.replace(/\n/g, "\\n");
            string = string.replace(/"/g, "\\\"");
          }
          if (string == undefined) {
            string = "";
          }

          if (key.startsWith("//")) {
            const line = "\n" + key.replace("//", "#") + "\n";
            content += line;
            kotlinContent += "\n    " + key + "\n";
          } else if (key.length > 0) {
            content += `${key}=${string}`
            kotlinContent += "    const val " + snakeToCamel(key) + " = \"" + key + "\"\n";
          }

          content += "\n";

          console.log('[%s] %s = %s', langCode, key, string);
        }

        kotlinContent += "}\n"

        const directory = path + 'application/src/main/resources/i18n';
        if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
        fs.writeFileSync(directory + '/messages_' + langCode + '.properties', content);

        const sourceDirectory = path + 'common/src/main/kotlin/com/icerockdev/i18n/';
        if (!fs.existsSync(sourceDirectory)) fs.mkdirSync(sourceDirectory, { recursive: true })
        fs.writeFileSync(sourceDirectory + '/LK.kt', kotlinContent);
      }
    }
  });
};
