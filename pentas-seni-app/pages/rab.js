import { Fragment, useEffect, useState } from "react";
import { KATEGORI, formatRupiah } from "../lib/constants";

export default function RAB() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/sheet?tab=Kebutuhan").then((r) => r.json());
      setRows(res.rows || []);
      setLoading(false);
    }
    load();
  }, []);

  const kategoriUnik = [
    ...KATEGORI.map((k) => k.nama),
    ...new Set(
      rows
        .map((r) => r.Kategori)
        .filter((k) => !!k && k.trim() !== "" && !KATEGORI.some((kk) => kk.nama === k))
    ),
  ];

  const grandTotal = rows.reduce((s, r) => s + (Number(r.Total) || 0), 0);

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const data = [];
    kategoriUnik.forEach((kat) => {
      const items = rows.filter((r) => r.Kategori === kat);
      if (items.length === 0) return;
      data.push({ Kategori: kat.toUpperCase(), NamaItem: "", Satuan: "", Qty: "", HargaSatuan: "", Total: "", Keterangan: "" });
      items.forEach((r) => {
        data.push({
          Kategori: "",
          NamaItem: r.NamaItem,
          Satuan: r.Satuan,
          Qty: r.Qty,
          HargaSatuan: r.HargaSatuan,
          Total: r.Total,
          Keterangan: r.Keterangan,
        });
      });
      const sub = items.reduce((s, r) => s + (Number(r.Total) || 0), 0);
      data.push({ Kategori: "", NamaItem: "SUBTOTAL", Total: sub });
      data.push({});
    });
    data.push({ NamaItem: "GRAND TOTAL", Total: grandTotal });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RAB");
    XLSX.writeFile(wb, "RAB-Pentas-Seni.xlsx");
  }

  return (
    <div>
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h1>🧾 Rencana Anggaran Biaya (RAB)</h1>
        <div>
          <button className="btn" onClick={() => window.print()}>
            🖨️ Cetak / Simpan PDF
          </button>{" "}
          <button className="btn secondary" onClick={exportExcel}>
            📊 Export Excel
          </button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ textAlign: "center" }}>RENCANA ANGGARAN BIAYA</h2>
        <p style={{ textAlign: "center", color: "var(--muted)", marginTop: -10 }}>
          Acara Pentas Seni / Closingan
        </p>

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
                </tr>
              </thead>
              <tbody>
                {kategoriUnik.map((kat) => {
                  const items = rows.filter((r) => r.Kategori === kat);
                  if (items.length === 0) return null;
                  const sub = items.reduce((s, r) => s + (Number(r.Total) || 0), 0);
                  return (
                    <Fragment key={kat}>
                      <tr style={{ background: "var(--table-head-bg)" }}>
                        <td colSpan={6} style={{ fontWeight: 700 }}>
                          {kat.toUpperCase()}
                        </td>
                      </tr>
                      {items.map((r) => (
                        <tr key={r._row}>
                          <td>{r.NamaItem}</td>
                          <td>{r.Satuan}</td>
                          <td>{r.Qty}</td>
                          <td>{formatRupiah(r.HargaSatuan)}</td>
                          <td>{formatRupiah(r.Total)}</td>
                          <td>{r.Keterangan}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} style={{ textAlign: "right", fontWeight: 700 }}>
                          Subtotal {kat}
                        </td>
                        <td style={{ fontWeight: 700 }}>{formatRupiah(sub)}</td>
                        <td></td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ textAlign: "right", fontWeight: 800, fontSize: "1rem" }}>
                    GRAND TOTAL
                  </td>
                  <td style={{ fontWeight: 800, fontSize: "1rem" }}>{formatRupiah(grandTotal)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
