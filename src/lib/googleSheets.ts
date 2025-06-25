// src/lib/googleSheets.ts
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/lib/sheets-credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: SCOPES,
});


export async function appendOrderRow(rowData: any[]) {
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  const spreadsheetId = '1SRd9BYvt8bffS2VXYZgS73gfc7jy2WkTGlzvVT_uIdE'; // BreadbyNaama

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'orders!A1', // שם הטאב + תא התחלה
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [rowData],
    },
  });
}
