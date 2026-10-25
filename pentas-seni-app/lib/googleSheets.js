import { google } from "googleapis";

function getAuth() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    privateKey,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
}

function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Ambil semua baris dari sebuah tab (sheet). Baris pertama dianggap header.
export async function getRows(tabName) {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:Z`,
  });
  const values = res.data.values || [];
  if (values.length === 0) return { headers: [], rows: [] };
  const headers = values[0];
  const rows = values.slice(1).map((r, idx) => {
    const obj = { _row: idx + 2 }; // nomor baris asli di spreadsheet (buat update/delete)
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? "";
    });
    return obj;
  });
  return { headers, rows };
}

// Tambah baris baru di akhir tab
export async function appendRow(tabName, headers, data) {
  const sheets = getSheetsClient();
  const values = [headers.map((h) => data[h] ?? "")];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

// Update satu baris (berdasarkan nomor baris asli _row) di tab
export async function updateRow(tabName, rowNumber, headers, data) {
  const sheets = getSheetsClient();
  const values = [headers.map((h) => data[h] ?? "")];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A${rowNumber}:Z${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

// Hapus satu baris (dengan cara mengosongkan nilainya; sederhana & aman untuk Vercel)
export async function clearRow(tabName, rowNumber, headers) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A${rowNumber}:Z${rowNumber}`,
  });
}
