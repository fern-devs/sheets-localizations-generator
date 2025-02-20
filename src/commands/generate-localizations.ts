import fs from 'fs';
import { google } from 'googleapis';
import { getAuth } from '../services/google';

interface Localization {
    [key: string]: string;
}

interface Localizations {
    [key: string]: Localization[];
}
export async function generateLocalizations(SHEET_ID: string, SHEET_NAME: string, OUTPUT_PATH: string) {

    const sheetsApi = google.sheets({ version: 'v4', auth: getAuth() });

    const spreadsheetId = SHEET_ID;
    const range = SHEET_NAME + "!A1:Z";

    const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    const rows = response.data.values
    if (!rows || rows.length < 1) {
        throw new Error('No values found');
    }


    const headers = rows.shift()!
    const localizations: Localizations = Object.fromEntries(headers.filter(header => header !== 'Key').map(header => [header, []]))

    for (const row of rows) {
        const key = row[0]
        for (let i = 1; i < headers.length; i++) {
            localizations[headers[i]].push({
                [key]: row[i]
            })
        }
    }

    for (const [key, localization] of Object.entries(localizations)) {
        const folderPath = `${OUTPUT_PATH}/${key}`
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }

        const filePath = `${folderPath}/translation.json`
        fs.writeFileSync(filePath, JSON.stringify(localization, null, 2))
    }


}