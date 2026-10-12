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
// D-UPDATE — artikel/berita & draft resmi
// ════════════════════════════════════════════════════════════

export const DRAFT_UPDATES = [
  {
    id: 'DxnsS3f6ZWTcBf5qLuhiL',
    title: 'Sosialisasi Program Kerja Semester Ganjil 2026/2027',
    tag: 'Pengumuman',
    dateStr: '3 Agustus 2026',
    desc: 'DEMA FST Kabinet Narakarsa menyelenggarakan sosialisasi program kerja kepada mahasiswa FST agar seluruh sivitas akademika mengetahui agenda dan rencana kegiatan kabinet.',
    content: 'DEMA FST Kabinet NARAKARSA secara resmi menggelar sosialisasi program kerja untuk Semester Ganjil Tahun Akademik 2026/2027. Kegiatan ini bertujuan untuk memaparkan arah gerak, program unggulan, serta kalender kegiatan selama satu semester ke depan kepada seluruh elemen mahasiswa Fakultas Sains dan Teknologi. Diharapkan melalui transparansi ini, kolaborasi antara DEMA, HMJ, BSO, dan mahasiswa umum dapat terjalin lebih erat demi mewujudkan ekosistem kampus yang intelektual, spiritual, dan kolektif.',
    imageUrl: '/images/berita-1.jpg',
    driveUrl: 'https://drive.google.com/file/d/1uhxb5_lLV8RaxGPEaoqy0VgovxkXdOl1/view?usp=drive_link',
  },
  {
    id: 'rvMA8EZ5elxL7KH2chIt',
    title: 'Rapat Koordinasi Perdana Pengurus Kabinet Narakarsa',
    tag: 'Berita',
    dateStr: '3 Agustus 2026',
    desc: 'Seluruh pengurus Kabinet Narakarsa mengikuti rapat koordinasi perdana guna menyamakan visi, membagi tugas departemen, dan merancang program kerja semester ganjil 2026/2027.',
    content: 'Usai resmi dilantik, DEMA FST langsung bergerak cepat dengan mengadakan Rapat Koordinasi (Rakor) Perdana bagi seluruh jajaran pengurus Kabinet NARAKARSA. Rapat yang dihadiri oleh pengurus harian dan seluruh anggota bidang ini berfokus pada penyamaan frekuensi, pemantapan Standar Operasional Prosedur (SOP) internal, serta pembahasan teknis pelaksanaan program kerja terdekat. Momen ini juga menjadi langkah awal untuk membangun soliditas tim dalam menghadapi tantangan organisasi selama satu periode kepengurusan.',
    imageUrl: '/images/berita-2.jpg',
    driveUrl: 'https://drive.google.com/file/d/1nkB71_j-leQm2kV9NTY88uU4r2BJLow-/view?usp=drive_link',
  },
  {
    id: 'jFTcnAYe0rQRClWgXg6v',
    title: 'Pelantikan Resmi Kabinet Narakarsa DEMA FST',
    tag: 'Kegiatan',
    dateStr: '2 Agustus 2026',
    desc: 'Kabinet Narakarsa secara resmi dilantik pada 2 Agustus 2026 dalam sebuah upacara khidmat yang dihadiri oleh jajaran dekanat, dosen, dan mahasiswa FST.',
    content: 'Babak baru kepemimpinan mahasiswa FST resmi dimulai. Pada 2 Agustus 2026, pengurus DEMA FST Kabinet NARAKARSA periode 2025/2026 resmi dilantik dalam sebuah seremoni yang khidmat. Acara ini dihadiri oleh jajaran Pimpinan Dekanat Fakultas Sains dan Teknologi, perwakilan dosen, SEMA FST, serta ketua dari masing-masing Himpunan Mahasiswa Jurusan (HMJ). Dalam sambutannya, Ketua Umum Ikhsan Nur Alam menegaskan komitmen kabinet untuk merestorasi marwah DEMA FST dan mengawal setiap kebijakan serta aspirasi mahasiswa secara independen dan profesional.',
    imageUrl: '/images/berita-3.jpg',
    driveUrl: 'https://drive.google.com/file/d/1vleeZBYiH93Z_Hd7-dYpVF5sFnBQaCEt/view?usp=drive_link',
  },
]

/**
 * Format link Google Drive menjadi URL gambar yang dijamin bisa dirender di browser
 * Menggunakan asset gambar lokal yang diunduh dari link Google Drive resmi.
 * @param {string} url
 * @param {number} fallbackIndex
 */
export function formatDriveImageUrl(url, fallbackIndex = 0) {
  if (!url) {
    const idx = (fallbackIndex % 3) + 1
    return `/images/berita-${idx}.jpg`
  }
  if (url.includes('1uhxb5_lLV8RaxGPEaoqy0VgovxkXdOl1') || url.includes('berita-1')) {
    return '/images/berita-1.jpg'
  }
  if (url.includes('1nkB71_j-leQm2kV9NTY88uU4r2BJLow-') || url.includes('berita-2')) {
    return '/images/berita-2.jpg'
  }
  if (url.includes('1vleeZBYiH93Z_Hd7-dYpVF5sFnBQaCEt') || url.includes('berita-3')) {
    return '/images/berita-3.jpg'
  }
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    const id = driveMatch[1]
    if (id === '1uhxb5_lLV8RaxGPEaoqy0VgovxkXdOl1') return '/images/berita-1.jpg'
    if (id === '1nkB71_j-leQm2kV9NTY88uU4r2BJLow-') return '/images/berita-2.jpg'
    if (id === '1vleeZBYiH93Z_Hd7-dYpVF5sFnBQaCEt') return '/images/berita-3.jpg'
    return `https://lh3.googleusercontent.com/d/${id}`
  }
  return url
}

/**
 * Memperkaya data artikel dengan draf resmi dan gambar Google Drive
 * Mengutamakan pencocokan berdasarkan docId kemudian judul & indeks urutan.
 */
export function enrichUpdate(docData, index = 0) {
  if (!docData) return null
  const docId = docData.id || ''
  const title = (docData.title || '').trim().toLowerCase()

  let match = null
  // 1. Cocokkan ID dokumen terlebih dahulu
  if (docId === 'DxnsS3f6ZWTcBf5qLuhiL') {
    match = DRAFT_UPDATES[0]
  } else if (docId === 'rvMA8EZ5elxL7KH2chIt') {
    match = DRAFT_UPDATES[1]
  } else if (docId === 'jFTcnAYe0rQRClWgXg6v') {
    match = DRAFT_UPDATES[2]
  }
  // 2. Cocokkan judul jika ID tidak terdaftar
  else if (title.includes('sosialisasi')) {
    match = DRAFT_UPDATES[0]
  } else if (title.includes('pelantikan')) {
    match = DRAFT_UPDATES[2]
  } else if (title.includes('rapat koordinasi') || title.includes('rakor')) {
    match = DRAFT_UPDATES[1]
  } else {
    // 3. Fallback berdasarkan indeks urutan berita yang ada
    match = DRAFT_UPDATES[index % 3]
  }

  const hasLorem = (str) => typeof str === 'string' && /lorem\s+ipsum/i.test(str)

  const finalImage = formatDriveImageUrl(docData.imageUrl || match.imageUrl, index)

  return {
    ...docData,
    title: match ? match.title : docData.title,
    tag: match ? match.tag : (docData.tag || 'Update'),
    dateStr: match ? match.dateStr : (docData.dateStr || ''),
    desc: (!docData.desc || hasLorem(docData.desc)) ? (match ? match.desc : docData.desc) : docData.desc,
    content: (!docData.content || hasLorem(docData.content)) ? (match ? match.content : docData.content) : docData.content,
    imageUrl: finalImage,
  }
}

/**
 * Ambil semua artikel dari Firestore (updates collection)
 * Memperbaiki seluruh artikel yang ada agar memiliki gambar dan konten lengkap,
 * tanpa menambahkan berita baru duplikat.
 * @param {number} limitCount - maksimal jumlah dokumen (default: 20)
 */
export async function getUpdates(limitCount = 20) {
  try {
    const q = query(
      collection(db, COLLECTIONS.UPDATES),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      // Memperkaya setiap berita yang ada dari Firestore tanpa menambah berita baru
      return snapshot.docs.map((d, idx) => enrichUpdate({ id: d.id, ...d.data() }, idx)).slice(0, limitCount)
    }
  } catch (err) {
    console.warn('Menggunakan draft updates resmi:', err)
  }
  return DRAFT_UPDATES.slice(0, limitCount)
}

/**
 * Ambil satu artikel berdasarkan ID dari Firestore
 * Diperkaya dengan draf resmi dan gambar yang valid.
 * @param {string} id
 */
export async function getUpdateById(id) {
  const predefined = DRAFT_UPDATES.find(u => u.id === id)
  try {
    const ref  = doc(db, COLLECTIONS.UPDATES, id)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return enrichUpdate({ id: snap.id, ...snap.data() }, 0)
    }
  } catch (err) {
    console.warn('Pencarian ID pada draft updates resmi:', err)
  }
  if (predefined) {
    return predefined
  }
  return null
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

