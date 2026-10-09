// src/config/kastrad.js
// ─────────────────────────────────────────────────────────────
// Konfigurasi dan konstanta untuk modul Advokasi KASTRAD
// ─────────────────────────────────────────────────────────────

/**
 * Daftar email pengurus KASTRAD yang berhak mengakses data pengaduan advokasi.
 * Dapat ditambahkan melalui environment variable VITE_KASTRAD_EMAILS (dipisah koma)
 * tanpa perlu mengubah file ini.
 */
export const DEFAULT_KASTRAD_EMAILS = [
  'kastrad.demafst@uinsgd.ac.id',
  'hasbi@gmail.com',
  'admin@narakarsa.id',
  'demafst@uinsgd.ac.id',
]

/**
 * Mendapatkan seluruh daftar email KASTRAD yang diizinkan (default + env)
 * @returns {string[]}
 */
export function getKastradEmails() {
  const envEmails = import.meta.env.VITE_KASTRAD_EMAILS
    ? import.meta.env.VITE_KASTRAD_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : []

  const combined = [
    ...DEFAULT_KASTRAD_EMAILS.map(e => e.trim().toLowerCase()),
    ...envEmails,
  ]

  return [...new Set(combined.filter(Boolean))]
}

/**
 * Memeriksa apakah sebuah email terdaftar sebagai pengurus KASTRAD
 * @param {string} email
 * @returns {boolean}
 */
export function isKastradEmail(email) {
  if (!email) return false
  const list = getKastradEmails()
  return list.includes(email.trim().toLowerCase())
}

/**
 * Kategori masalah sesuai ruang lingkup Pasal 3 SOP Advokasi KASTRAD
 */
export const KATEGORI_ADVOKASI = [
  'Akademik dan pembelajaran',
  'Pelayanan dan administrasi',
  'Fasilitas dan sarana prasarana',
  'Kebijakan fakultas',
  'Hak dan kepentingan mahasiswa',
  'Kemahasiswaan dan kelembagaan',
  'Aspirasi peningkatan kualitas',
  'Lainnya',
]

/**
 * Opsi status pelapor
 */
export const STATUS_PELAPOR = [
  'Individu',
  'Perwakilan kelompok',
]

/**
 * Opsi status pengaduan
 */
export const STATUS_PENGADUAN = [
  'Baru',
  'Sedang diproses',
  'Selesai',
]
