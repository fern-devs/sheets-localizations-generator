const fs = require("fs");
const google = require("googleapis");

module.exports.generateStringsLocalizations = function (auth, spreadsheetId, range, path) {
    const sheets = google.sheets("v4");
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: range
    }, function (err, response) {
        if (err) {
            console.log("The API returned an error: " + err);
            return;
        }
        const rows = response.values;
        if (rows.length == 0) {
            console.log("No data found.");
        } else {
            const columns = rows[0];

            for (let i = 2; i < columns.length; i++) {

                let langCode = columns[i];

                if (langCode == "Base") {
                    langCode = "en";
                }

                let categoryData = {};

                for (let j = 1; j < rows.length; j++) {
                    const row = rows[j];
                    let category = row[0];
                    let key = row[1];
                    let string = row[i];

                    if (key == null) {
                        key = "";
                    }
                    if(category == undefined) continue;

                    let categoryKeys = categoryData[category];
                    if (categoryKeys == undefined) {
                        categoryKeys = {};
                        categoryData[category] = categoryKeys;
                    }

                    if (string != undefined) {
                        string = string.replace(/\n/g, "\\n");
                    }
                    if (string == undefined) {
                        string = "";
                    }

                    if (key.startsWith("//")) {
                        // skip
                    } else if (key.length > 0) {
                        categoryKeys[key] = string;
                    }

                    console.log("[%s] %s = %s", langCode, key, string);
                }

                const directory = path + langCode;
                if (!fs.existsSync(directory)) fs.mkdirSync(directory);
                Object.keys(categoryData).forEach(key => {
                    let category = categoryData[key];
                    fs.writeFileSync(directory + "/" + key + ".json", JSON.stringify(category, null, 2));
                })
            }
        }
    });
};
