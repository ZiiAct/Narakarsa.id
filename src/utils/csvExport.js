// src/utils/csvExport.js
// ─────────────────────────────────────────────────────────────
// Generator & Exporter file CSV untuk data Pengaduan Advokasi KASTRAD
// Memenuhi aturan teknis UC-04: BOM UTF-8, pemisah titik koma (;),
// escaping kutip/enter, zona Asia/Jakarta, dan proteksi Excel formula injection.
// ─────────────────────────────────────────────────────────────

/**
 * Format tanggal ke string terbaca 'DD/MM/YYYY HH:mm' zona Asia/Jakarta
 * @param {any} timestamp - Firestore Timestamp, Date, atau string
 * @returns {string}
 */
export function formatJakartaDateTime(timestamp) {
  if (!timestamp) return '—'
  let d = null

  if (typeof timestamp?.toDate === 'function') {
    d = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    d = timestamp
  } else if (typeof timestamp === 'number' || typeof timestamp === 'string') {
    d = new Date(timestamp)
  }

  if (!d || isNaN(d.getTime())) return '—'

  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  // Format id-ID biasanya menghasilkan "DD/MM/YYYY, HH.mm" atau "DD/MM/YYYY HH:mm"
  // Standarisasikan menjadi DD/MM/YYYY HH:mm
  const parts = formatter.formatToParts(d)
  const map = {}
  parts.forEach(p => { map[p.type] = p.value })

  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}`
}

/**
 * Format tanggal kejadian (input dari HTML date YYYY-MM-DD atau teks)
 * @param {string} val
 * @returns {string}
 */
export function formatTanggalKejadian(val) {
  if (!val) return '—'
  // Jika format YYYY-MM-DD
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val)
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`
  }
  return val
}

/**
 * Format sel CSV:
 * 1. Proteksi formula injection: jika diawali =, +, -, @, tambahkan tanda petik tunggal '
 * 2. Escape jika mengandung titik koma (;), kutip ganda ("), atau baris baru (\n, \r)
 * @param {any} value
 * @returns {string}
 */
export function escapeCsvCell(value) {
  if (value === null || value === undefined) return '""'

  let text = String(value)

  // Proteksi Excel Formula Injection (Pasal/Aturan Teknis UC-04)
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text
  }

  // Jika terdapat kutip, titik koma, atau newline, bungkus dengan tanda kutip ganda
  if (text.includes('"') || text.includes(';') || text.includes('\n') || text.includes('\r')) {
    text = `"${text.replace(/"/g, '""')}"`
  } else {
    // Tetap bungkus dengan tanda kutip untuk keamanan konsistensi kolom teks
    text = `"${text}"`
  }

  return text
}

/**
 * Buat dan trigger unduhan file CSV pengaduan advokasi
 * @param {Array<object>} pengaduanList
 */
export function exportPengaduanToCsv(pengaduanList = []) {
  const headers = [
    'Kode Kasus',
    'Tanggal Kirim',
    'Status',
    'Nama',
    'Email',
    'No. Telepon',
    'Status Pelapor',
    'Kategori',
    'Pokok Permasalahan',
    'Kronologi',
    'Tanggal Kejadian',
    'Tempat Kejadian',
    'Pihak Terkait',
    'Jumlah Terdampak',
    'Dampak',
    'Harapan Penyelesaian',
    'Link Bukti',
  ]

  const headerRow = headers.map(escapeCsvCell).join(';')

  const rows = pengaduanList.map(item => {
    const linkBuktiStr = Array.isArray(item.linkBukti)
      ? item.linkBukti.join(' | ')
      : (item.linkBukti || '')

    const cells = [
      item.kodeKasus || item.id || '',
      formatJakartaDateTime(item.createdAt),
      item.status || 'Baru',
      item.nama || '',
      item.email || '',
      item.telepon || '',
      item.statusPelapor || '',
      item.kategori || '',
      item.pokok || '',
      item.kronologi || '',
      formatTanggalKejadian(item.tanggalKejadian),
      item.tempat || '',
      item.pihakTerkait || '',
      item.jumlahTerdampak ? String(item.jumlahTerdampak) : '',
      item.dampak || '',
      item.harapan || '',
      linkBuktiStr,
    ]

    return cells.map(escapeCsvCell).join(';')
  })

  // BOM UTF-8 (\uFEFF) di awal konten file
  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n')

  // Generate nama file dengan tanggal Asia/Jakarta YYYYMMDD
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const dateStr = formatter.format(now).replace(/-/g, '')
  const fileName = `pengaduan-advokasi-${dateStr}.csv`

  // Buat blob dan trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
