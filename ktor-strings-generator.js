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
                let content = 'msgid ""\n' +
                    'msgstr ""\n' +
                    '"Language: ' + langCode + '\\n"\n' +
                    '"Content-Type: text/plain; charset=UTF-8\\n"\n\n';
                let templateContent = "";
                let kotlinContent = "package com.icerockdev.common.i18n\n\n" +
                    "object LK {\n";

                for (let j = 1; j < rows.length; j++) {
                    const row = rows[j];
                    let key = row[0];
                    let untranslated = row[1];
                    let string = row[i];

                    if (key == null) {
                        key = "";
                    }

                    if (string != undefined) {
                        string = string.replace(/\n/g, "\\n");
                        string = string.replace(/"/g, "\\\"");
                    }
                    if (string == undefined) {
                        string = "";
                    }
                    if (untranslated != undefined) {
                        untranslated = untranslated.replace(/\n/g, "\\n");
                        untranslated = untranslated.replace(/"/g, "\\\"");
                    }

                    if (key.startsWith("//")) {
                        const line = key.replace("//", "#") + "\n";
                        content += line;
                        templateContent += line;
                        kotlinContent += "\n    " + key + "\n";
                    } else if (key.length > 0) {
                        const keyLine = "msgid \"" + key + "\"\n";
                        content += keyLine;
                        content += "msgstr \"" + string + "\"\n";

                        templateContent += keyLine;
                        templateContent += "msgstr \"\"\n";

                        kotlinContent += "    const val " + snakeToCamel(key) + " = \"" + key + "\"\n";
                    }

                    content += "\n";
                    templateContent += "\n";

                    console.log('[%s] %s = %s', langCode, key, string);
                }

                kotlinContent += "}\n"

                const directory = path + 'resources';
                if (!fs.existsSync(directory)) fs.mkdirSync(directory)
                fs.writeFileSync(directory + '/messages.pot', templateContent);
                fs.writeFileSync(directory + '/messages_' + langCode + '.po', content);

                const sourceDirectory = path + 'kotlin/com/icerockdev/common/i18n';
                if (!fs.existsSync(sourceDirectory)) fs.mkdirSync(sourceDirectory)
                fs.writeFileSync(sourceDirectory + '/LK.kt', kotlinContent);
            }
        }
    });
};
