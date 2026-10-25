import { getRows, appendRow, updateRow, clearRow } from "../../lib/googleSheets";

// Definisi header tetap per tab, supaya urutan kolom di spreadsheet konsisten
export const TAB_HEADERS = {
  Kebutuhan: [
    "ID",
    "Kategori",
    "Divisi",
    "NamaItem",
    "Satuan",
    "Qty",
    "HargaSatuan",
    "Total",
    "Keterangan",
  ],
  Rundown: ["No", "Waktu", "Durasi", "Kegiatan", "PJ", "Keterangan"],
  BedahJuknis: ["Kegiatan", "Kebutuhan", "Jumlah", "PJ", "Catatan"],
  Sponsor: [
    "Mitra",
    "Lokasi",
    "NoHP",
    "Nominal",
    "Status",
    "TglDeal",
    "TglCair",
    "Keterangan",
  ],
  Kas: ["Tanggal", "Keterangan", "Jenis", "Jumlah", "PJ"],
};

export default async function handler(req, res) {
  try {
    const { tab } = req.query;
    if (!tab || !TAB_HEADERS[tab]) {
      return res.status(400).json({ error: "Tab tidak valid" });
    }
    const headers = TAB_HEADERS[tab];

    if (req.method === "GET") {
      const data = await getRows(tab, headers);
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const data = req.body;
      await appendRow(tab, headers, data);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "PUT") {
      const { _row, ...data } = req.body;
      if (!_row) return res.status(400).json({ error: "_row wajib diisi" });
      await updateRow(tab, _row, headers, data);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { _row } = req.body;
      if (!_row) return res.status(400).json({ error: "_row wajib diisi" });
      await clearRow(tab, _row, headers);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Terjadi kesalahan" });
  }
}
