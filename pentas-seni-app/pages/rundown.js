import SimpleTable from "../components/SimpleTable";

const fields = [
  { name: "No", label: "No", type: "number" },
  { name: "Waktu", label: "Waktu (cth 18:30)", required: true },
  { name: "Durasi", label: "Durasi (cth 15 menit)" },
  { name: "Kegiatan", label: "Kegiatan", required: true },
  { name: "PJ", label: "Penanggung Jawab" },
  { name: "Keterangan", label: "Keterangan" },
];

export default function Rundown() {
  return (
    <SimpleTable
      tab="Rundown"
      fields={fields}
      title="⏱️ Rundown Acara"
      description="Susun jadwal acara dari awal sampai akhir, lengkap dengan PJ tiap sesi."
    />
  );
}
