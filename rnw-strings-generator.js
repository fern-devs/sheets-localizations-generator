const fs = require("fs");
const mkdirp = require("mkdirp");
const google = require("googleapis");
const utils = require("./utils");

const snakeToCamel = str => str.toLowerCase().replace(/([_][a-z])/g, group =>
  group
    .toUpperCase()
    .replace("_", "")
);

module.exports.generateStringsLocalizations = function(auth, spreadsheetId, range, path) {
  const sheets = google.sheets("v4");
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: range
  }, function(err, response) {
    if (err) {
      console.log("The API returned an error: " + err);
      return;
    }
    const rows = response.values;
    if (rows.length == 0) {
      console.log("No data found.");
    } else {
      const columns = rows[0];

      for (let i = 1; i < columns.length; i++) {

        let langCode = columns[i];
        let content = "/* eslint-disable prettier/prettier */\n" +
          "import {Strings} from './index';\n\n" +
          "export const strings: Strings = {\n";
        let templateContent = "/* eslint-disable prettier/prettier */\n" +
          "export interface Strings {\n";

        if (langCode == "Base") {
          langCode = "en";
        }

        for (let j = 1; j < rows.length; j++) {
          const row = rows[j];
          let key = row[0];
          let string = row[i];

          if (key == null) {
            key = "";
          }

          if (string != undefined) {
            string = string.replace(/\n/g, "\\n");
          }
          if (string == undefined) {
            string = "";
          }

          if (key.startsWith("//")) {
            const line = key.replace("//", "#") + "\n";
            content += line;
            templateContent += line;
          } else if (key.length > 0) {
            content += "  " + key + ": '" + string + "',";
            templateContent += "  " + key + ": string;";
          }

          content += "\n";
          templateContent += "\n";

          console.log("[%s] %s = %s", langCode, key, string);
        }

        content += "};\n"
        templateContent += "}\n"

        const directory = path + "strings-generated";
        if (!fs.existsSync(directory)) fs.mkdirSync(directory);
        fs.writeFileSync(directory + "/index.ts", templateContent);
        fs.writeFileSync(directory + "/" + langCode + ".ts", content);
      }
    }
  });
};
