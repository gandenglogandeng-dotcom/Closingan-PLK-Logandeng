import { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import { formatRupiah } from "../lib/constants";

const fields = [
  { name: "Tanggal", label: "Tanggal", type: "date", required: true },
  { name: "Keterangan", label: "Keterangan", required: true },
  { name: "Jenis", label: "Jenis", type: "select", options: ["Masuk", "Keluar"], required: true },
  { name: "Jumlah", label: "Jumlah (Rp)", type: "number", required: true },
  { name: "PJ", label: "Dicatat oleh" },
];

export default function Kas() {
  const [saldo, setSaldo] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/sheet?tab=Kas").then((r) => r.json());
      let masuk = 0;
      let keluar = 0;
      (res.rows || []).forEach((r) => {
        const j = Number(r.Jumlah) || 0;
        if ((r.Jenis || "").toLowerCase() === "masuk") masuk += j;
        else if ((r.Jenis || "").toLowerCase() === "keluar") keluar += j;
      });
      setSaldo({ masuk, keluar, saldo: masuk - keluar });
    }
    load();
  }, []);

  return (
    <div>
      {saldo && (
        <div className="grid" style={{ marginBottom: 16 }}>
          <div className="stat" style={{ borderLeftColor: "#0F766E" }}>
            <div className="label">Kas Masuk</div>
            <div className="value">{formatRupiah(saldo.masuk)}</div>
          </div>
          <div className="stat" style={{ borderLeftColor: "#dc2626" }}>
            <div className="label">Kas Keluar</div>
            <div className="value">{formatRupiah(saldo.keluar)}</div>
          </div>
          <div className="stat" style={{ borderLeftColor: "#3454D1" }}>
            <div className="label">Saldo Kas Riil</div>
            <div className="value">{formatRupiah(saldo.saldo)}</div>
          </div>
        </div>
      )}
      <SimpleTable
        tab="Kas"
        fields={fields}
        title="💰 Kas Bendahara (Real-time)"
        description="Catat pemasukan & pengeluaran kas riil (bukan dana sponsor). Saldo otomatis terhitung di atas."
      />
    </div>
  );
}
