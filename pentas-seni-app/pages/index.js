import { useEffect, useState } from "react";
import { KATEGORI, STRUKTUR, formatRupiah } from "../lib/constants";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totalKebutuhan, setTotalKebutuhan] = useState(0);
  const [sponsorCair, setSponsorCair] = useState(0);
  const [sponsorDeal, setSponsorDeal] = useState(0);
  const [kasMasuk, setKasMasuk] = useState(0);
  const [kasKeluar, setKasKeluar] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [kebutuhanRes, sponsorRes, kasRes] = await Promise.all([
          fetch("/api/sheet?tab=Kebutuhan").then((r) => r.json()),
          fetch("/api/sheet?tab=Sponsor").then((r) => r.json()),
          fetch("/api/sheet?tab=Kas").then((r) => r.json()),
        ]);

        const totalK = (kebutuhanRes.rows || []).reduce(
          (sum, r) => sum + (Number(r.Total) || 0),
          0
        );
        setTotalKebutuhan(totalK);

        let cair = 0;
        let deal = 0;
        (sponsorRes.rows || []).forEach((r) => {
          const nominal = Number(r.Nominal) || 0;
          if ((r.Status || "").toLowerCase().includes("approve")) {
            deal += nominal;
            if ((r.TglCair || "").trim() !== "") cair += nominal;
          }
        });
        setSponsorDeal(deal);
        setSponsorCair(cair);

        let masuk = 0;
        let keluar = 0;
        (kasRes.rows || []).forEach((r) => {
          const jumlah = Number(r.Jumlah) || 0;
          if ((r.Jenis || "").toLowerCase().startsWith("masuk")) masuk += jumlah;
          else if ((r.Jenis || "").toLowerCase().startsWith("keluar")) keluar += jumlah;
        });
        setKasMasuk(masuk);
        setKasKeluar(keluar);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1>🎭 Dashboard Panitia Pentas Seni</h1>

      {loading ? (
        <p>Memuat data dari spreadsheet...</p>
      ) : (
        <div className="grid" style={{ marginBottom: 20 }}>
          <div className="stat">
            <div className="label">Total Kebutuhan (RAB)</div>
            <div className="value">{formatRupiah(totalKebutuhan)}</div>
          </div>
          <div className="stat" style={{ background: "linear-gradient(135deg,#4ECDC4,#1A9CB7)" }}>
            <div className="label">Sponsor Deal (Approve)</div>
            <div className="value">{formatRupiah(sponsorDeal)}</div>
          </div>
          <div className="stat" style={{ background: "linear-gradient(135deg,#A66CFF,#5C6BC0)" }}>
            <div className="label">Sponsor Sudah Cair</div>
            <div className="value">{formatRupiah(sponsorCair)}</div>
          </div>
          <div className="stat" style={{ background: "linear-gradient(135deg,#26A69A,#1e7b34)" }}>
            <div className="label">Saldo Kas Riil</div>
            <div className="value">{formatRupiah(kasMasuk - kasKeluar)}</div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Struktur Kepanitiaan</h2>
        <div className="struktur-grid">
          {STRUKTUR.map((s, i) => (
            <div className="struktur-item" key={i}>
              <div className="jabatan">{s.jabatan}</div>
              <div className="nama">{s.nama}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Kategori Kebutuhan Acara</h2>
        <p style={{ color: "var(--muted)", marginTop: -8 }}>
          Klik menu "Kebutuhan Acara" untuk mengisi detail item per kategori.
        </p>
        <div className="kategori-list">
          {KATEGORI.map((k) => (
            <div className="kategori-chip" key={k.nama} style={{ background: k.warna }}>
              <div>{k.nama}</div>
              <div className="divisi">Diisi: {k.divisi}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
