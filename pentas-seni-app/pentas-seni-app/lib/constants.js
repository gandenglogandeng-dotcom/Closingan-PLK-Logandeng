export const KATEGORI = [
  { nama: "Panggung", divisi: "Perlengkapan", warna: "#3454D1" },
  { nama: "Teater", divisi: "Acara", warna: "#0E9488" },
  { nama: "Eco Percussion", divisi: "Acara", warna: "#0E7490" },
  { nama: "Penampilan PLK", divisi: "Perlengkapan", warna: "#B45309" },
  { nama: "Konsumsi", divisi: "Konsumsi", warna: "#A16207" },
  { nama: "Administrasi", divisi: "Humas & Sekretaris", warna: "#6D28D9" },
  { nama: "Dokumentasi", divisi: "PDD", warna: "#4338CA" },
  { nama: "Apresiasi / Kenang-kenangan", divisi: "Acara", warna: "#BE185D" },
  { nama: "Peralatan dan Perlengkapan", divisi: "Perlengkapan", warna: "#0F766E" },
  { nama: "Lainnya (di luar kategori)", divisi: "Bebas", warna: "#64748B" },
];

export const STRUKTUR = [
  { jabatan: "Ketua", nama: "Bagas" },
  { jabatan: "Sekretaris", nama: "Milka" },
  { jabatan: "Bendahara", nama: "Indy" },
  { jabatan: "PJ MC (Acara)", nama: "Indy" },
  { jabatan: "PJ Make Up & Kostum (Acara)", nama: "Milka" },
  { jabatan: "PJ Koorlap (Acara)", nama: "Pasha" },
  { jabatan: "Stage Manager (Perlengkapan)", nama: "Tera" },
  { jabatan: "Logistik & Dekorasi (Perlengkapan)", nama: "Zaki" },
  { jabatan: "Konsumsi", nama: "Zizi" },
  { jabatan: "Humas & LO (Runner)", nama: "Gyan" },
  { jabatan: "Sponsor (Runner)", nama: "Yos" },
  { jabatan: "Keamanan (Runner)", nama: "Bagas" },
  { jabatan: "PDD", nama: "Nesa" },
];

export function formatRupiah(angka) {
  const n = Number(angka) || 0;
  return "Rp " + n.toLocaleString("id-ID");
}
