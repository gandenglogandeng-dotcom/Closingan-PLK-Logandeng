export const KATEGORI = [
  { nama: "Panggung", divisi: "Perlengkapan", warna: "#FF6B6B" },
  { nama: "Teater", divisi: "Acara", warna: "#4ECDC4" },
  { nama: "Eco Percussion", divisi: "Acara", warna: "#1A9CB7" },
  { nama: "Penampilan PLK", divisi: "Perlengkapan", warna: "#FFA62B" },
  { nama: "Konsumsi", divisi: "Konsumsi", warna: "#F7B32B" },
  { nama: "Administrasi", divisi: "Humas & Sekretaris", warna: "#A66CFF" },
  { nama: "Dokumentasi", divisi: "PDD", warna: "#5C6BC0" },
  { nama: "Apresiasi / Kenang-kenangan", divisi: "Acara", warna: "#EC407A" },
  { nama: "Peralatan dan Perlengkapan", divisi: "Perlengkapan", warna: "#26A69A" },
  { nama: "Lainnya (di luar kategori)", divisi: "Bebas", warna: "#78909C" },
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
