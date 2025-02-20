import { google } from 'googleapis';
import fs from 'fs';

export function getAuth() {
    const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.key.json';
    if (!fs.existsSync(keyFile)) {
        throw new Error('Service account key file not found. Please set the GOOGLE_APPLICATION_CREDENTIALS environment variable or provide a key file path in the root of the project with the name service-account.key.json.');
    }
    return new google.auth.GoogleAuth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

