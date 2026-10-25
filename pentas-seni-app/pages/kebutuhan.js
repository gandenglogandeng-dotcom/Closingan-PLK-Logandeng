import { useEffect, useState } from "react";
import { KATEGORI, formatRupiah } from "../lib/constants";

const EMPTY_FORM = {
  NamaItem: "",
  Satuan: "",
  Qty: "",
  HargaSatuan: "",
  Keterangan: "",
};

export default function Kebutuhan() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState(KATEGORI[0].nama);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingRow, setEditingRow] = useState(null);
  const [customKategoriNama, setCustomKategoriNama] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/sheet?tab=Kebutuhan").then((r) => r.json());
    setRows(res.rows || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const kategoriInfo = KATEGORI.find((k) => k.nama === activeKategori);
  const isLainnya = activeKategori === "Lainnya (di luar kategori)";

  const rowsKategori = rows.filter((r) => r.Kategori === activeKategori);
  const totalKategori = rowsKategori.reduce((s, r) => s + (Number(r.Total) || 0), 0);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const qty = Number(form.Qty) || 0;
    const harga = Number(form.HargaSatuan) || 0;
    const total = qty * harga;
    const kategoriNama = isLainnya && customKategoriNama ? customKategoriNama : activeKategori;

    const payload = {
      ID: editingRow ? editingRow.ID : "K" + Date.now(),
      Kategori: kategoriNama,
      Divisi: isLainnya ? "Bebas" : kategoriInfo.divisi,
      NamaItem: form.NamaItem,
      Satuan: form.Satuan,
      Qty: qty,
      HargaSatuan: harga,
      Total: total,
      Keterangan: form.Keterangan,
    };

    if (editingRow) {
      await fetch("/api/sheet?tab=Kebutuhan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _row: editingRow._row, ...payload }),
      });
    } else {
      await fetch("/api/sheet?tab=Kebutuhan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(EMPTY_FORM);
    setEditingRow(null);
    load();
  }

  function startEdit(row) {
    setEditingRow(row);
    setForm({
      NamaItem: row.NamaItem,
      Satuan: row.Satuan,
      Qty: row.Qty,
      HargaSatuan: row.HargaSatuan,
      Keterangan: row.Keterangan,
    });
  }

  async function handleDelete(row) {
    if (!confirm(`Hapus item "${row.NamaItem}"?`)) return;
    await fetch("/api/sheet?tab=Kebutuhan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _row: row._row }),
    });
    load();
  }

  return (
    <div>
      <h1>📋 Kebutuhan Acara</h1>
      <p style={{ color: "var(--muted)" }}>
        Pilih kategori, lalu isi rincian item kebutuhan beserta harganya. Data otomatis tersimpan ke spreadsheet.
      </p>

      <div className="kategori-list" style={{ marginBottom: 20 }}>
        {KATEGORI.map((k) => {
          const total = rows
            .filter((r) => r.Kategori === k.nama)
            .reduce((s, r) => s + (Number(r.Total) || 0), 0);
          return (
            <div
              key={k.nama}
              className={`kategori-chip${activeKategori === k.nama ? " active" : ""}`}
              style={{
                "--chip-color": k.warna,
                cursor: "pointer",
              }}
              onClick={() => {
                setActiveKategori(k.nama);
                setEditingRow(null);
                setForm(EMPTY_FORM);
              }}
            >
              <div>{k.nama}</div>
              <div className="divisi">Diisi: {k.divisi}</div>
              <div style={{ marginTop: 4, fontSize: "0.9rem" }}>{formatRupiah(total)}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2>
          {activeKategori}{" "}
          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)" }}>
            — diisi oleh divisi {kategoriInfo?.divisi}
          </span>
        </h2>

        <form onSubmit={handleSubmit}>
          {isLainnya && (
            <input
              style={{ marginBottom: 10 }}
              placeholder="Nama kategori baru (misal: Keamanan Tambahan)"
              value={customKategoriNama}
              onChange={(e) => setCustomKategoriNama(e.target.value)}
              required
            />
          )}
          <div className="form-grid">
            <input
              name="NamaItem"
              placeholder="Nama Item"
              value={form.NamaItem}
              onChange={handleChange}
              required
            />
            <input
              name="Satuan"
              placeholder="Satuan (pcs/unit/paket)"
              value={form.Satuan}
              onChange={handleChange}
              required
            />
            <input
              name="Qty"
              type="number"
              placeholder="Qty"
              value={form.Qty}
              onChange={handleChange}
              required
            />
            <input
              name="HargaSatuan"
              type="number"
              placeholder="Harga Satuan"
              value={form.HargaSatuan}
              onChange={handleChange}
              required
            />
            <input
              name="Keterangan"
              placeholder="Keterangan"
              value={form.Keterangan}
              onChange={handleChange}
            />
          </div>
          <button className="btn" type="submit">
            {editingRow ? "💾 Simpan Perubahan" : "➕ Tambah Item"}
          </button>
          {editingRow && (
            <button
              type="button"
              className="btn outline"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setEditingRow(null);
                setForm(EMPTY_FORM);
              }}
            >
              Batal
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Daftar Item — {activeKategori}</h3>
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama Item</th>
                  <th>Satuan</th>
                  <th>Qty</th>
                  <th>Harga Satuan</th>
                  <th>Total</th>
                  <th>Keterangan</th>
                  <th className="no-print">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rowsKategori.map((r) => (
                  <tr key={r._row}>
                    <td>{r.NamaItem}</td>
                    <td>{r.Satuan}</td>
                    <td>{r.Qty}</td>
                    <td>{formatRupiah(r.HargaSatuan)}</td>
                    <td>{formatRupiah(r.Total)}</td>
                    <td>{r.Keterangan}</td>
                    <td className="no-print">
                      <button className="btn small" onClick={() => startEdit(r)}>
                        Edit
                      </button>{" "}
                      <button className="btn small danger" onClick={() => handleDelete(r)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {rowsKategori.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)" }}>
                      Belum ada item.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ textAlign: "right", fontWeight: 700 }}>
                    Total Kategori
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatRupiah(totalKategori)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
