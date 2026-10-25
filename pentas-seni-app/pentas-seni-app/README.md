# 🎭 Sistem Panitia Pentas Seni

Website untuk kelola kebutuhan acara, RAB, rundown, bedah juknis, sponsor, dan kas bendahara.
Database: Google Spreadsheet. Hosting: Vercel (via GitHub). Tanpa login — siapa saja yang punya link bisa isi.

---

## BAGIAN 1 — Siapkan Google Spreadsheet

1. Buat Spreadsheet baru di Google Sheets, beri nama misalnya **"Database Pentas Seni"**.
2. Di bagian bawah, buat 5 **tab/sheet** dengan nama PERSIS seperti ini (huruf besar/kecil berpengaruh):
   - `Kebutuhan`
   - `Rundown`
   - `BedahJuknis`
   - `Sponsor`
   - `Kas`
3. Di baris pertama (header) tiap tab, isi kolom berikut PERSIS urutannya:

   **Tab `Kebutuhan`:**
   `ID | Kategori | Divisi | NamaItem | Satuan | Qty | HargaSatuan | Total | Keterangan`

   **Tab `Rundown`:**
   `No | Waktu | Durasi | Kegiatan | PJ | Keterangan`

   **Tab `BedahJuknis`:**
   `Kegiatan | Kebutuhan | Jumlah | PJ | Catatan`

   **Tab `Sponsor`:**
   `Mitra | Lokasi | NoHP | Nominal | Status | TglDeal | TglCair | Keterangan`

   **Tab `Kas`:**
   `Tanggal | Keterangan | Jenis | Jumlah | PJ`

4. Salin **ID Spreadsheet** dari URL-nya. Contoh URL:
   `https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOp/edit`
   ID-nya adalah bagian: `1AbCdEfGhIjKlMnOp`. Simpan dulu, nanti dipakai di langkah 3.

---

## BAGIAN 2 — Buat Service Account Google (supaya web bisa baca/tulis spreadsheet)

1. Buka https://console.cloud.google.com/ → buat **Project baru** (nama bebas, misal "pentas-seni").
2. Di menu pencarian atas, cari **"Google Sheets API"** → klik **Enable**.
3. Buka menu **"APIs & Services" → "Credentials"**.
4. Klik **"Create Credentials" → "Service Account"**. Beri nama bebas (misal "pentas-seni-bot") → Create and Continue → Done (boleh skip langkah role).
5. Klik service account yang baru dibuat → tab **"Keys"** → **"Add Key" → "Create new key"** → pilih **JSON** → akan ter-download file JSON. **Simpan file ini baik-baik, jangan dibagikan ke publik.**
6. Buka file JSON tersebut, cari dua nilai:
   - `client_email` → contoh: `pentas-seni-bot@pentas-seni.iam.gserviceaccount.com`
   - `private_key` → teks panjang diawali `-----BEGIN PRIVATE KEY-----`
7. **Kembali ke Google Spreadsheet** yang dibuat di Bagian 1 → klik tombol **Share/Bagikan** → tempel `client_email` tadi → beri akses **Editor** → Kirim/Share.
   (Ini WAJIB, kalau tidak di-share, web tidak akan bisa baca/tulis data.)

---

## BAGIAN 3 — Push ke GitHub

1. Ekstrak folder project ini (hasil download dari Claude).
2. Buat repository baru di GitHub (misal: `pentas-seni-app`), **jangan** centang "Add README" (biar tidak bentrok).
3. Di komputer, buka terminal di dalam folder project, lalu jalankan:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/pentas-seni-app.git
   git push -u origin main
   ```
   (Ganti USERNAME dan nama repo sesuai punya kamu. File `.env` TIDAK akan ikut ter-push karena sudah di `.gitignore`.)

---

## BAGIAN 4 — Deploy ke Vercel

1. Buka https://vercel.com/ → login pakai akun GitHub kamu.
2. Klik **"Add New..." → "Project"** → pilih repository `pentas-seni-app` yang baru di-push.
3. Pada bagian **Environment Variables**, tambahkan 3 variabel ini:
   | Key | Value |
   |---|---|
   | `GOOGLE_SHEET_ID` | ID spreadsheet dari Bagian 1 langkah 4 |
   | `GOOGLE_CLIENT_EMAIL` | `client_email` dari file JSON |
   | `GOOGLE_PRIVATE_KEY` | `private_key` dari file JSON (salin APA ADANYA termasuk `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`) |
4. Klik **Deploy**. Tunggu 1-2 menit sampai selesai.
5. Setelah selesai, Vercel akan kasih link seperti `https://pentas-seni-app.vercel.app` — ini link yang dibagikan ke semua panitia (bisa dibuka di HP maupun laptop, tanpa perlu login).

---

## Catatan Pemakaian

- **Kebutuhan Acara**: tiap divisi tinggal buka link → pilih kategori sesuai divisinya → isi item.
- **RAB**: otomatis merangkum semua kategori, bisa langsung "Cetak/Simpan PDF" (pakai fitur print browser, pilih "Save as PDF") atau "Export Excel".
- **Rundown & Bedah Juknis**: tabel bebas isi, tidak terikat kategori kebutuhan.
- **Sponsor**: status "Approve" otomatis dihitung sebagai dana terkumpul di Dashboard; jika kolom "Tanggal Cair" sudah diisi, otomatis masuk hitungan "Sudah Cair".
- **Kas Bendahara**: catatan uang riil yang benar-benar ada di tangan/rekening, terpisah dari status sponsor.
- Karena tanpa login, mohon ingatkan panitia untuk tidak menghapus data sembarangan. Semua histori tetap tersimpan juga di Google Spreadsheet aslinya sebagai cadangan.

Kalau ada error setelah deploy (misal data tidak muncul), hal paling sering adalah:
1. Spreadsheet belum di-share ke `client_email` service account, atau
2. Nama tab/header kolom di spreadsheet tidak persis sama dengan yang di atas.
