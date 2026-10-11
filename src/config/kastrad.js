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
  'akupedede123@admin.com',
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
 * Tahapan progres advokasi (urut). `key` dipakai sebagai field di `riwayat`
 * pada dokumen tiket publik untuk mencatat waktu tiap tahapan.
 */
export const TAHAPAN_ADVOKASI = [
  {
    key: 'diterima',
    label: 'Diterima',
    desc: 'Laporan telah masuk dan tercatat di sistem KASTRAD DEMA FST.',
  },
  {
    key: 'diproses',
    label: 'Diproses',
    desc: 'Laporan sedang diverifikasi dan dikaji oleh tim KASTRAD.',
  },
  {
    key: 'diadvokasikan',
    label: 'Sudah Diadvokasikan',
    desc: 'Permasalahan telah disampaikan dan dikawal ke pihak terkait.',
  },
  {
    key: 'hasil',
    label: 'Hasil',
    desc: 'Proses advokasi selesai dan hasilnya telah tersedia.',
  },
]

/**
 * Opsi status pengaduan (label tahapan)
 */
export const STATUS_PENGADUAN = TAHAPAN_ADVOKASI.map(t => t.label)

/** Status awal setiap laporan baru */
export const STATUS_AWAL = TAHAPAN_ADVOKASI[0].label

/** Cari objek tahapan berdasarkan label status */
export function getTahapan(label) {
  return TAHAPAN_ADVOKASI.find(t => t.label === label) || TAHAPAN_ADVOKASI[0]
}
