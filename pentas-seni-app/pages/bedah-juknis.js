import SimpleTable from "../components/SimpleTable";

const fields = [
  { name: "Kegiatan", label: "Nama Kegiatan / Sesi", required: true },
  { name: "Kebutuhan", label: "Kebutuhan Teknis", required: true },
  { name: "Jumlah", label: "Jumlah" },
  { name: "PJ", label: "Penanggung Jawab" },
  { name: "Catatan", label: "Catatan Tambahan" },
];

export default function BedahJuknis() {
  return (
    <SimpleTable
      tab="BedahJuknis"
      fields={fields}
      title="🔍 Bedah Juknis"
      description="Bedah setiap kegiatan di rundown menjadi kebutuhan teknis detail (juknis) per sesi."
    />
  );
}
