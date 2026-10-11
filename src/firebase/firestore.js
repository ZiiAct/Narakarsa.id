import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from './config'
import { TAHAPAN_ADVOKASI } from '../config/kastrad'

// ── Nama koleksi ────────────────────────────────────────────
export const COLLECTIONS = {
  UPDATES:  'updates',   // D-Update articles
  MESSAGES: 'messages',  // Kontak form submissions
  LAPORAN:  'laporan',   // Data lengkap laporan advokasi (privat, KASTRAD)
  TIKET:    'tiket',     // Status progres per kode tiket (publik, read-by-id)
}

// ════════════════════════════════════════════════════════════
// D-UPDATE — artikel/berita
// ════════════════════════════════════════════════════════════

/**
 * Ambil semua artikel, diurutkan dari terbaru
 * @param {number} limitCount - maksimal jumlah dokumen (default: 20)
 */
export async function getUpdates(limitCount = 20) {
  const q = query(
    collection(db, COLLECTIONS.UPDATES),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Ambil satu artikel berdasarkan ID
 * @param {string} id
 */
export async function getUpdateById(id) {
  const ref  = doc(db, COLLECTIONS.UPDATES, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

/**
 * Tambah artikel baru
 * @param {{ tag: string, title: string, desc: string, content?: string, imageUrl?: string }} data
 */
export async function addUpdate(data) {
  return await addDoc(collection(db, COLLECTIONS.UPDATES), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Update artikel yang sudah ada
 * @param {string} id
 * @param {object} data - field yang ingin diubah
 */
export async function updateUpdate(id, data) {
  const ref = doc(db, COLLECTIONS.UPDATES, id)
  return await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

/**
 * Hapus artikel
 * @param {string} id
 */
export async function deleteUpdate(id) {
  return await deleteDoc(doc(db, COLLECTIONS.UPDATES, id))
}

// ════════════════════════════════════════════════════════════
// KONTAK — pesan masuk
// ════════════════════════════════════════════════════════════

/**
 * Simpan pesan dari form Kontak ke Firestore
 * @param {{ nama: string, email: string, subjek: string, pesan: string }} data
 */
export async function submitMessage(data) {
  return await addDoc(collection(db, COLLECTIONS.MESSAGES), {
    ...data,
    createdAt: serverTimestamp(),
    isRead: false,
  })
}

/**
 * Ambil semua pesan masuk (untuk admin)
 * @param {boolean} onlyUnread - filter hanya yang belum dibaca
 */
export async function getMessages(onlyUnread = false) {
  let q = query(
    collection(db, COLLECTIONS.MESSAGES),
    orderBy('createdAt', 'desc')
  )
  if (onlyUnread) {
    q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    )
  }
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Tandai pesan sebagai sudah dibaca
 * @param {string} id
 */
export async function markMessageRead(id) {
  const ref = doc(db, COLLECTIONS.MESSAGES, id)
  return await updateDoc(ref, { isRead: true })
}

// ════════════════════════════════════════════════════════════
// LAPORAN ADVOKASI KASTRAD + TIKET PROGRES
// ────────────────────────────────────────────────────────────
// • laporan/{kodeTiket} → data lengkap pelapor (privat, hanya KASTRAD)
// • tiket/{kodeTiket}   → status & riwayat progres (publik, bisa dicek
//                          siapa pun yang memegang kode tiket)
// ════════════════════════════════════════════════════════════

const TIKET_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // tanpa O/0, I/1 agar tidak tertukar
const TIKET_LENGTH = 6

/**
 * Buat kode tiket acak 6 karakter (huruf + angka)
 * @returns {string}
 */
export function generateKodeTiket() {
  const bytes = new Uint32Array(TIKET_LENGTH)
  crypto.getRandomValues(bytes)
  let code = ''
  for (let i = 0; i < TIKET_LENGTH; i++) {
    code += TIKET_CHARS[bytes[i] % TIKET_CHARS.length]
  }
  return code
}

/** Normalisasi input kode tiket dari user (uppercase, tanpa spasi) */
export function normalizeKodeTiket(raw) {
  return (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * Simpan formulir pengaduan ke koleksi `laporan` sekaligus membuat
 * dokumen `tiket` publik untuk cek progres (atomik via batch).
 * @param {object} data
 * @returns {Promise<string>} kodeTiket
 */
export async function submitPengaduan(data) {
  const statusAwal = TAHAPAN_ADVOKASI[0]

  for (let attempt = 0; attempt < 5; attempt++) {
    const kodeTiket = generateKodeTiket()
    const tiketRef   = doc(db, COLLECTIONS.TIKET, kodeTiket)
    const laporanRef = doc(db, COLLECTIONS.LAPORAN, kodeTiket)

    // Pastikan kode belum dipakai
    const existing = await getDoc(tiketRef)
    if (existing.exists()) continue

    const batch = writeBatch(db)
    batch.set(laporanRef, {
      kodeKasus: kodeTiket,
      nama: (data.nama || '').trim(),
      email: (data.email || '').trim(),
      telepon: (data.telepon || '').trim(),
      statusPelapor: data.statusPelapor || '',
      kategori: data.kategori || '',
      pokok: (data.pokok || '').trim(),
      kronologi: (data.kronologi || '').trim(),
      tanggalKejadian: data.tanggalKejadian || '',
      tempat: (data.tempat || '').trim(),
      pihakTerkait: (data.pihakTerkait || '').trim(),
      jumlahTerdampak: data.jumlahTerdampak ? Number(data.jumlahTerdampak) : null,
      dampak: (data.dampak || '').trim(),
      harapan: (data.harapan || '').trim(),
      linkBukti: Array.isArray(data.linkBukti) ? data.linkBukti.filter(Boolean) : [],
      status: statusAwal.label,
      catatan: '',
      createdAt: serverTimestamp(),
    })
    batch.set(tiketRef, {
      kodeTiket,
      status: statusAwal.label,
      kategori: data.kategori || '',
      catatan: '',
      riwayat: { [statusAwal.key]: serverTimestamp() },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    await batch.commit()
    return kodeTiket
  }

  throw new Error('Gagal membuat kode tiket unik. Silakan coba lagi.')
}

/**
 * Ambil data progres tiket (publik) berdasarkan kode tiket
 * @param {string} kodeTiket
 * @returns {Promise<object|null>}
 */
export async function getTiket(kodeTiket) {
  const kode = normalizeKodeTiket(kodeTiket)
  if (kode.length !== TIKET_LENGTH) return null
  const snap = await getDoc(doc(db, COLLECTIONS.TIKET, kode))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

/**
 * Ambil daftar laporan advokasi (untuk admin KASTRAD) (UC-03)
 * @param {object} options
 * @param {string} [options.status] - filter status (label tahapan atau 'Semua')
 * @param {number} [options.limitCount] - limit dokumen (default 50)
 */
export async function getPengaduanList({ status = 'Semua', limitCount = 50 } = {}) {
  let q
  if (status && status !== 'Semua') {
    q = query(
      collection(db, COLLECTIONS.LAPORAN),
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  } else {
    q = query(
      collection(db, COLLECTIONS.LAPORAN),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Ambil seluruh dokumen laporan untuk keperluan ekspor CSV (UC-04)
 * @returns {Promise<Array>}
 */
export async function getAllPengaduan() {
  const q = query(
    collection(db, COLLECTIONS.LAPORAN),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Update status progres advokasi (UC-03).
 * Memperbarui laporan (privat) dan tiket (publik) sekaligus, serta mencatat
 * waktu tahapan pada `riwayat` tiket.
 * @param {string} kodeTiket
 * @param {string} newStatus - label tahapan (lihat TAHAPAN_ADVOKASI)
 */
export async function updateStatusPengaduan(kodeTiket, newStatus) {
  const tahap = TAHAPAN_ADVOKASI.find(t => t.label === newStatus)
  if (!tahap) throw new Error(`Status tidak dikenal: ${newStatus}`)

  const batch = writeBatch(db)
  batch.update(doc(db, COLLECTIONS.LAPORAN, kodeTiket), {
    status: newStatus,
    updatedAt: serverTimestamp(),
  })
  batch.update(doc(db, COLLECTIONS.TIKET, kodeTiket), {
    status: newStatus,
    [`riwayat.${tahap.key}`]: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return await batch.commit()
}

/**
 * Simpan catatan/hasil advokasi yang dapat dilihat pelapor di halaman cek progres
 * @param {string} kodeTiket
 * @param {string} catatan
 */
export async function updateCatatanPengaduan(kodeTiket, catatan) {
  const text = (catatan || '').trim().slice(0, 2000)
  const batch = writeBatch(db)
  batch.update(doc(db, COLLECTIONS.LAPORAN, kodeTiket), {
    catatan: text,
    updatedAt: serverTimestamp(),
  })
  batch.update(doc(db, COLLECTIONS.TIKET, kodeTiket), {
    catatan: text,
    updatedAt: serverTimestamp(),
  })
  return await batch.commit()
}

