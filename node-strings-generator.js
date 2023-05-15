const fs = require("fs");
const google = require("googleapis");

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
        let content = "module.exports = {\n";

        for (let j = 1; j < rows.length; j++) {
          const row = rows[j];
          let key = row[0];
          let string = row[i];

          if (key == null) {
            key = "";
          }

          if (string != undefined) {
            string = string.replace(/\n/g, "\\n")
              .replace(/'/g, "\\'");
          }
          if (string == undefined) {
            string = "";
          }

          if (key.startsWith("//")) {
            content += "  " + key;
          } else if (key.length > 0) {
            content += "  " + key + ": '" + string + "',";
          }

          content += "\n";

          console.log("[%s] %s = %s", langCode, key, string);
        }

        content += "};\n"

        fs.writeFileSync(path + langCode + ".js", content);
      }
    }
  });
};
