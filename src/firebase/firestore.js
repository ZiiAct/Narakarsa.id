import {
  collection,
  addDoc,
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
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

// ── Nama koleksi ────────────────────────────────────────────
export const COLLECTIONS = {
  UPDATES:  'updates',   // D-Update articles
  MESSAGES: 'messages',  // Kontak form submissions
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
