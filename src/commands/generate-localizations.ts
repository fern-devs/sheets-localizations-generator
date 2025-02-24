import fs from 'node:fs';
import { google } from 'googleapis';
import { getAuth } from '../services/google';

interface Localization {
    [key: string]: string;
}

interface Localizations {
    [language: string]: {
        [namespace: string]: Localization;
    };
}

function parseLocalizations(headerRow: string[], rows: string[][]): Localizations {
    if (headerRow[0] !== 'Namespace' || headerRow[1] !== 'Key') {
        throw new Error("The first two headers must be 'Namespace' and 'Key' respectively");
    }

    const languages = headerRow.slice(2);
    const localizations: Localizations = {};

    for (const lang of languages) {
        localizations[lang] = {};
    }

    for (const row of rows) {
        const namespace = row[0];
        const key = row[1];
        if (!namespace) {
            throw new Error('A row is missing Namespace');
        }
        if (!key) {
            throw new Error('A row is missing key');
        }

        for (const [index, lang] of languages.entries()) {
            const translation = row[index + 2] ?? "";
            if (!localizations[lang][namespace]) {
                localizations[lang][namespace] = {};
            }
            localizations[lang][namespace][key] = translation;
        }
    }

    return localizations;
}

function writeLocalizationsToFiles(localizations: Localizations, outputPath: string): void {
    for (const [language, namespaces] of Object.entries(localizations)) {
        const folderPath = `${outputPath}/${language}`;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        for (const [namespace, translations] of Object.entries(namespaces)) {
            const filePath = `${folderPath}/${namespace}.json`;
            fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
        }
    }
}

export async function generateLocalizations(
    sheetId: string,
    sheetName: string,
    outputPath: string
): Promise<void> {
    const sheetsApi = google.sheets({ version: 'v4', auth: getAuth() });
    const range = `${sheetName}!A1:Z`;

    console.log('Reading spredsheet...');
    const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
        throw new Error('No data found in the sheet');
    }

    const headerRow = rows.shift() as string[];
    if (!headerRow || headerRow.length === 0) {
        throw new Error('No headers found in the sheet');
    }

    console.log('Parsing localizations...');
    const localizations = parseLocalizations(headerRow, rows as string[][]);

    console.log('Parsing completed successfully, cleaning up old files...');
    if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
    }
    console.log('Old files cleaned up successfully');

    console.log(`Writing localizations to files into "${outputPath}"...`);
    writeLocalizationsToFiles(localizations, outputPath);
    console.log('Writing completed successfully');
}