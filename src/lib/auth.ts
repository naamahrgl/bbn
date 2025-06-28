// src/lib/auth.ts
import { GoogleAuth } from 'google-auth-library';

export const auth = new GoogleAuth({
  keyFile: './google-service-account.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
