import {
  collection,
  addDoc,
<<<<<<< HEAD
  setDoc,
=======
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
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
<<<<<<< HEAD
=======
  Timestamp,
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
} from 'firebase/firestore'
import { db } from './config'

// ── Nama koleksi ────────────────────────────────────────────
export const COLLECTIONS = {
<<<<<<< HEAD
  UPDATES:   'updates',    // D-Update articles
  MESSAGES:  'messages',   // Kontak form submissions
  PENGADUAN: 'pengaduan',  // Form Pengaduan Advokasi KASTRAD
=======
  UPDATES:  'updates',   // D-Update articles
  MESSAGES: 'messages',  // Kontak form submissions
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
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
<<<<<<< HEAD

// ════════════════════════════════════════════════════════════
// PENGADUAN ADVOKASI KASTRAD
// ════════════════════════════════════════════════════════════

/**
 * Buat kode kasus unik acak format ADV-YYYYMMDD-XXXX (Pasal 54.3)
 * @returns {string}
 */
export function generateKodeKasus() {
  const d = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const dateStr = formatter.format(d).replace(/-/g, '')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `ADV-${dateStr}-${rand}`
}

/**
 * Simpan formulir pengaduan advokasi mahasiswa ke Firestore (UC-01)
 * ID dokumen adalah kodeKasus
 * @param {object} data
 * @returns {Promise<string>} kodeKasus
 */
export async function submitPengaduan(data) {
  const kodeKasus = generateKodeKasus()
  const docRef = doc(db, COLLECTIONS.PENGADUAN, kodeKasus)

  const docData = {
    kodeKasus,
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
    status: 'Baru',
    createdAt: serverTimestamp(),
  }

  await setDoc(docRef, docData)
  return kodeKasus
}

/**
 * Ambil daftar pengaduan advokasi (untuk admin KASTRAD) (UC-03)
 * @param {object} options
 * @param {string} [options.status] - filter status ('Baru', 'Sedang diproses', 'Selesai', atau 'Semua')
 * @param {number} [options.limitCount] - limit dokumen (default 50)
 */
export async function getPengaduanList({ status = 'Semua', limitCount = 50 } = {}) {
  let q
  if (status && status !== 'Semua') {
    q = query(
      collection(db, COLLECTIONS.PENGADUAN),
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  } else {
    q = query(
      collection(db, COLLECTIONS.PENGADUAN),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Ambil seluruh dokumen pengaduan untuk keperluan ekspor CSV (UC-04)
 * @returns {Promise<Array>}
 */
export async function getAllPengaduan() {
  const q = query(
    collection(db, COLLECTIONS.PENGADUAN),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Update status pengaduan advokasi (UC-03)
 * Hanya field status yang diperbarui
 * @param {string} kodeKasus
 * @param {'Baru' | 'Sedang diproses' | 'Selesai'} newStatus
 */
export async function updateStatusPengaduan(kodeKasus, newStatus) {
  const ref = doc(db, COLLECTIONS.PENGADUAN, kodeKasus)
  return await updateDoc(ref, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  })
}

=======
>>>>>>> a4dbfd84fe0ffd3baad267b62b365a22a1d50fd0
