import SimpleTable from "../components/SimpleTable";

const fields = [
  { name: "Mitra", label: "Nama Mitra / Sponsor", required: true },
  { name: "Lokasi", label: "Lokasi" },
  { name: "NoHP", label: "No HP / Kontak" },
  { name: "Nominal", label: "Nominal Deal (Rp)", type: "number" },
  {
    name: "Status",
    label: "Status",
    type: "select",
    options: ["Prospek", "Nego", "Approve", "Ditolak"],
  },
  { name: "TglDeal", label: "Tanggal Deal", type: "date" },
  { name: "TglCair", label: "Tanggal Cair (kosongkan jika belum)", type: "date" },
  { name: "Keterangan", label: "Keterangan" },
];

export default function Sponsor() {
  return (
    <SimpleTable
      tab="Sponsor"
      fields={fields}
      title="🤝 Penjadwalan Sponsor"
      description="Catat mitra sponsor, status deal, nominal, dan kapan dananya cair. Status 'Approve' akan masuk hitungan dashboard."
    />
  );
}
