import { useState, useEffect, useMemo } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../../context/AuthContext'
import {
  getMessages,
  markMessageRead,
  addUpdate,
  getPengaduanList,
  getAllPengaduan,
  updateStatusPengaduan,
  updateCatatanPengaduan,
} from '../../firebase/firestore'
import { uploadImage }         from '../../firebase/storage'
import {
  exportPengaduanToCsv,
  formatJakartaDateTime,
  formatTanggalKejadian,
} from '../../utils/csvExport'
import { STATUS_PENGADUAN }    from '../../config/kastrad'
import './AdminDashboard.css'

const TABS = ['Pengaduan Masuk', 'Pesan Masuk', 'Tambah Update']

export default function AdminDashboard() {
  const { isAdmin, logout, user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab]   = useState(0)

  // ── State: Pesan Masuk ──
  const [messages, setMessages]     = useState([])
  const [msgLoading, setMsgLoading] = useState(true)

  // ── State: Tambah Update ──
  const [form, setForm]                 = useState({ tag: '', title: '', desc: '', content: '' })
  const [imageFile, setImageFile]       = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving]             = useState(false)
  const [saveSuccess, setSaveSuccess]   = useState(false)

  // ── State: Pengaduan Masuk (UC-03 & UC-04) ──
  const [pengaduanList, setPengaduanList] = useState([])
  const [pengaduanLoading, setPengaduanLoading] = useState(true)
  const [pengaduanError, setPengaduanError]     = useState(null)
  const [filterStatus, setFilterStatus]         = useState('Semua')
  const [searchQuery, setSearchQuery]           = useState('')
  const [displayLimit, setDisplayLimit]         = useState(50)
  const [selectedPengaduan, setSelectedPengaduan] = useState(null)
  const [catatanInput, setCatatanInput]           = useState('')
  const [savingCatatan, setSavingCatatan]         = useState(false)
  const [updatingStatus, setUpdatingStatus]       = useState(false)
  const [downloadingCsv, setDownloadingCsv]     = useState(false)

  // Redirect jika tidak login
  useEffect(() => {
    if (!isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  // Load Pesan Masuk
  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getMessages()
        setMessages(data)
      } catch (err) {
        console.error('Gagal load pesan:', err)
      } finally {
        setMsgLoading(false)
      }
    }
    if (activeTab === 1) loadMessages()
  }, [activeTab])

  // Load Pengaduan Masuk (UC-03)
  useEffect(() => {
    let ignore = false
    async function fetchPengaduan() {
      setPengaduanLoading(true)
      setPengaduanError(null)
      try {
        const data = await getPengaduanList({ limitCount: displayLimit })
        if (!ignore) setPengaduanList(data)
      } catch (err) {
        if (!ignore) {
          console.error('Gagal memuat pengaduan:', err)
          setPengaduanError('Gagal memuat daftar pengaduan. Periksa koneksi atau izin database Anda.')
        }
      } finally {
        if (!ignore) setPengaduanLoading(false)
      }
    }

    if (activeTab === 0) {
      fetchPengaduan()
    }

    return () => {
      ignore = true
    }
  }, [activeTab, displayLimit])

  const reloadPengaduan = async () => {
    setPengaduanLoading(true)
    setPengaduanError(null)
    try {
      const data = await getPengaduanList({ limitCount: displayLimit })
      setPengaduanList(data)
    } catch (err) {
      console.error('Gagal memuat pengaduan:', err)
      setPengaduanError('Gagal memuat daftar pengaduan. Periksa koneksi atau izin database Anda.')
    } finally {
      setPengaduanLoading(false)
    }
  }

  // Filter & Search Pengaduan
  const filteredPengaduan = useMemo(() => {
    return pengaduanList.filter(item => {
      // Filter status
      const matchStatus = filterStatus === 'Semua' || item.status === filterStatus
      if (!matchStatus) return false

      // Search query
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const matchKode = (item.kodeKasus || item.id || '').toLowerCase().includes(q)
      const matchNama = (item.nama || '').toLowerCase().includes(q)
      const matchPokok = (item.pokok || '').toLowerCase().includes(q)
      return matchKode || matchNama || matchPokok
    })
  }, [pengaduanList, filterStatus, searchQuery])

  // Jumlah pengaduan baru / diterima
  const countBaru = useMemo(() => {
    return pengaduanList.filter(p => p.status === 'Diterima' || p.status === 'Baru').length
  }, [pengaduanList])

  const openPengaduan = (item) => {
    setSelectedPengaduan(item)
    setCatatanInput(item.catatan || '')
  }

  // Ubah status pengaduan (UC-03)
  const handleStatusChange = async (newStatus) => {
    if (!selectedPengaduan || selectedPengaduan.status === newStatus) return
    setUpdatingStatus(true)
    try {
      await updateStatusPengaduan(selectedPengaduan.id, newStatus)
      setPengaduanList(prev =>
        prev.map(p => p.id === selectedPengaduan.id ? { ...p, status: newStatus } : p)
      )
      setSelectedPengaduan(prev => ({ ...prev, status: newStatus }))
    } catch (err) {
      console.error('Gagal mengubah status pengaduan:', err)
      alert('Gagal mengubah status. Periksa hak akses Firestore Anda.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Simpan Catatan / Hasil Advokasi
  const handleSaveCatatan = async () => {
    if (!selectedPengaduan) return
    setSavingCatatan(true)
    try {
      await updateCatatanPengaduan(selectedPengaduan.id, catatanInput)
      setPengaduanList(prev =>
        prev.map(p => p.id === selectedPengaduan.id ? { ...p, catatan: catatanInput } : p)
      )
      setSelectedPengaduan(prev => ({ ...prev, catatan: catatanInput }))
      alert('Catatan berhasil disimpan dan kini dapat dilihat mahasiswa di Cek Progres.')
    } catch (err) {
      console.error('Gagal menyimpan catatan:', err)
      alert('Gagal menyimpan catatan. Periksa koneksi database Anda.')
    } finally {
      setSavingCatatan(false)
    }
  }

  // Unduh CSV (UC-04)
  const handleDownloadCsv = async () => {
    setDownloadingCsv(true)
    try {
      const allData = await getAllPengaduan()
      if (!allData || allData.length === 0) {
        alert('Belum ada data pengaduan untuk diunduh.')
        return
      }
      exportPengaduanToCsv(allData)
    } catch (err) {
      console.error('Gagal mengunduh CSV:', err)
      alert('Gagal mengunduh file CSV. Pastikan koneksi aktif dan coba lagi.')
    } finally {
      setDownloadingCsv(false)
    }
  }

  // Pesan masuk handler
  const handleMarkRead = async (id) => {
    await markMessageRead(id)
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, isRead: true } : m)
    )
  }

  // Tambah update form handler
  const handleFormChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAddUpdate = async e => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      let imageUrl = ''
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'updates', setUploadProgress)
      }
      await addUpdate({ ...form, imageUrl })
      setSaveSuccess(true)
      setForm({ tag: '', title: '', desc: '', content: '' })
      setImageFile(null)
      setUploadProgress(0)
    } catch (err) {
      console.error('Gagal menyimpan update:', err)
      alert('Gagal menyimpan. Cek koneksi dan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!isAdmin) return null

  // Helper WA & Email link
  const getWhatsAppLink = (phone, kodeKasus, nama) => {
    if (!phone) return '#'
    let clean = phone.replace(/[^\d+]/g, '')
    if (clean.startsWith('+')) clean = clean.slice(1)
    if (clean.startsWith('0')) clean = '62' + clean.slice(1)
    const msg = encodeURIComponent(
      `Halo ${nama}, kami dari tim Advokasi KASTRAD DEMA FST menindaklanjuti pengaduan Anda dengan kode kasus [${kodeKasus}].`
    )
    return `https://wa.me/${clean}?text=${msg}`
  }

  const getEmailLink = (email, kodeKasus, nama) => {
    if (!email) return '#'
    const subj = encodeURIComponent(`Tindak Lanjut Pengaduan Advokasi KASTRAD DEMA FST [${kodeKasus}]`)
    const body = encodeURIComponent(
      `Halo ${nama},\n\nTerima kasih telah menyampaikan pengaduan ke KASTRAD DEMA FST dengan kode kasus ${kodeKasus}.\n\nKami ingin mengklarifikasi beberapa hal terkait laporan Anda:\n\nSalam,\nTim Advokasi KASTRAD DEMA FST`
    )
    return `mailto:${email}?subject=${subj}&body=${body}`
  }

  return (
    <div className="admin-dash" id="admin-dashboard">
      {/* ── Header ── */}
      <div className="admin-dash__header">
        <div>
          <h1 className="admin-dash__title gradient-text">Dashboard KASTRAD</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Login sebagai: <strong>{user?.email}</strong>
          </p>
        </div>
        <button className="admin-dash__logout" onClick={handleLogout} id="admin-logout">
          Keluar
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="admin-dash__tabs" role="tablist">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`admin-dash__tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
            role="tab"
            aria-selected={activeTab === i}
            id={`admin-tab-${i}`}
          >
            {tab}
            {i === 0 && countBaru > 0 && (
              <span className="admin-dash__badge-count">{countBaru}</span>
            )}
            {i === 1 && messages.filter(m => !m.isRead).length > 0 && (
              <span className="admin-dash__badge-count">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════
          TAB 0: PENGADUAN MASUK (UC-03 & UC-04)
          ════════════════════════════════════════════════════════════ */}
      {activeTab === 0 && (
        <div className="admin-dash__panel" role="tabpanel">
          
          {/* Header Panel & Aksi CSV */}
          <div className="admin-pengaduan__header">
            <div>
              <h2 className="admin-dash__panel-title" style={{ marginBottom: '4px' }}>
                Pengaduan Advokasi Masuk
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Total {pengaduanList.length} pengaduan ({countBaru} status &quot;Baru&quot;)
              </p>
            </div>

            <button
              onClick={handleDownloadCsv}
              className="admin-btn-csv"
              id="btn-unduh-csv"
              disabled={downloadingCsv || pengaduanList.length === 0}
            >
              {downloadingCsv ? 'Menyiapkan CSV...' : '📥 Unduh CSV (Excel)'}
            </button>
          </div>

          {/* Baris Pencarian & Filter */}
          <div className="admin-pengaduan__toolbar">
            <div className="admin-pengaduan__search">
              <input
                type="text"
                placeholder="Cari kode kasus, nama pelapor, atau pokok masalah..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                id="search-pengaduan"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="admin-pengaduan__search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="admin-pengaduan__filter">
              <label htmlFor="filter-status-select">Status:</label>
              <select
                id="filter-status-select"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                {STATUS_PENGADUAN.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabel Pengaduan */}
          {pengaduanLoading ? (
            <div className="admin-pengaduan__empty">
              <p>Memuat daftar pengaduan advokasi...</p>
            </div>
          ) : pengaduanError ? (
            <div className="admin-pengaduan__error-box">
              <p>⚠️ {pengaduanError}</p>
              <button onClick={reloadPengaduan} className="btn-outline" style={{ marginTop: 'var(--space-md)' }}>
                Coba Lagi
              </button>
            </div>
          ) : filteredPengaduan.length === 0 ? (
            <div className="admin-pengaduan__empty">
              <p>
                {searchQuery || filterStatus !== 'Semua'
                  ? 'Tidak ada pengaduan yang sesuai dengan kriteria filter/pencarian.'
                  : 'Belum ada pengaduan masuk.'}
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table" aria-label="Tabel Pengaduan Masuk">
                <thead>
                  <tr>
                    <th>Kode Kasus</th>
                    <th>Tanggal Kirim</th>
                    <th>Nama Pelapor</th>
                    <th>Kategori</th>
                    <th>Pokok Permasalahan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPengaduan.map(item => (
                    <tr
                      key={item.id}
                      onClick={() => openPengaduan(item)}
                      className="admin-table__row"
                    >
                      <td>
                        <span className="admin-kode-badge">{item.kodeKasus || item.id}</span>
                      </td>
                      <td className="admin-td-date">
                        {formatJakartaDateTime(item.createdAt)}
                      </td>
                      <td className="admin-td-nama">
                        <strong>{item.nama}</strong>
                        <span className="admin-td-sub">{item.telepon}</span>
                      </td>
                      <td className="admin-td-kategori">
                        <span className="admin-kategori-pill">{item.kategori}</span>
                      </td>
                      <td className="admin-td-pokok" title={item.pokok}>
                        {item.pokok}
                      </td>
                      <td>
                        <span className={`admin-status-pill admin-status-pill--${(item.status || 'Diterima').toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.status || 'Diterima'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn-detail"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPengaduan(item)
                          }}
                        >
                          Lihat Detail →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pengaduanList.length >= displayLimit && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setDisplayLimit(prev => prev + 50)}
                  >
                    Muat Lebih Banyak...
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          TAB 1: PESAN MASUK (Fitur yang sudah ada)
          ════════════════════════════════════════════════════════════ */}
      {activeTab === 1 && (
        <div className="admin-dash__panel" role="tabpanel">
          <p className="admin-dash__panel-title">
            Pesan Masuk ({messages.filter(m => !m.isRead).length} belum dibaca)
          </p>
          {msgLoading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Memuat pesan...</p>
          ) : messages.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Belum ada pesan masuk.</p>
          ) : (
            <ul className="admin-msg-list" role="list">
              {messages.map(msg => (
                <li
                  key={msg.id}
                  className={`admin-msg-item ${!msg.isRead ? 'admin-msg-item--unread' : ''}`}
                >
                  <div className="admin-msg-meta">
                    <span className="admin-msg-name">{msg.nama}</span>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span className="admin-msg-date">
                        {formatJakartaDateTime(msg.createdAt)}
                      </span>
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkRead(msg.id)}
                          style={{
                            fontSize: '0.75rem', color: 'var(--color-primary-light)',
                            textDecoration: 'underline', cursor: 'pointer',
                          }}
                          aria-label={`Tandai pesan dari ${msg.nama} sudah dibaca`}
                        >
                          Tandai dibaca
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="admin-msg-email">📧 {msg.email}</p>
                  <p className="admin-msg-subj">Re: {msg.subjek}</p>
                  <p className="admin-msg-body">{msg.pesan}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          TAB 2: TAMBAH UPDATE (Fitur yang sudah ada)
          ════════════════════════════════════════════════════════════ */}
      {activeTab === 2 && (
        <div className="admin-dash__panel" role="tabpanel">
          <p className="admin-dash__panel-title">Tambah Artikel D-Update</p>

          {saveSuccess && (
            <p role="status" style={{
              color: '#4ade80', marginBottom: 'var(--space-lg)',
              background: 'rgba(74,222,128,0.1)', padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(74,222,128,0.2)'
            }}>
              ✅ Update berhasil ditambahkan!
            </p>
          )}

          <form className="admin-add-form" onSubmit={handleAddUpdate} noValidate>
            <div className="form-group">
              <label htmlFor="update-tag">Tag / Kategori</label>
              <input
                id="update-tag"
                name="tag"
                type="text"
                placeholder="cth: Berita, Kegiatan, Pengumuman"
                value={form.tag}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="update-title">Judul</label>
              <input
                id="update-title"
                name="title"
                type="text"
                placeholder="Judul artikel"
                value={form.title}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="update-desc">Deskripsi Singkat</label>
              <textarea
                id="update-desc"
                name="desc"
                placeholder="Deskripsi singkat artikel (tampil di card)..."
                value={form.desc}
                onChange={handleFormChange}
                required
                style={{ minHeight: 100 }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="update-content">Isi Artikel (Konten Penuh)</label>
              <textarea
                id="update-content"
                name="content"
                placeholder="Tulis isi artikel lengkap di sini. Pisahkan paragraf dengan baris kosong..."
                value={form.content}
                onChange={handleFormChange}
                style={{ minHeight: 260 }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="update-image">Gambar (opsional)</label>
              <input
                id="update-image"
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0] || null)}
                style={{ color: 'var(--color-text-muted)' }}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress" aria-label={`Upload ${uploadProgress}%`}>
                  <div className="upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="admin-add-submit"
              id="admin-add-update-submit"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : '+ Simpan Update'}
            </button>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL DETAIL PENGADUAN (UC-03)
          ════════════════════════════════════════════════════════════ */}
      {selectedPengaduan && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedPengaduan(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-modal-box"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-tag">Detail Pengaduan Advokasi</span>
                <h3 className="admin-modal-title">
                  {selectedPengaduan.kodeKasus || selectedPengaduan.id}
                </h3>
                <span className="admin-modal-date">
                  Diterima: {formatJakartaDateTime(selectedPengaduan.createdAt)}
                </span>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedPengaduan(null)}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="admin-modal-body">
              
              {/* Status Changer Bar */}
              <div className="admin-modal-status-bar">
                <div>
                  <span className="status-bar-label">Status Kasus Saat Ini:</span>
                  <span className={`admin-status-pill admin-status-pill--${(selectedPengaduan.status || 'Diterima').toLowerCase().replace(/\s+/g, '-')}`}>
                    {selectedPengaduan.status || 'Diterima'}
                  </span>
                </div>
                <div className="status-bar-select-wrap">
                  <label htmlFor="modal-status-select">Ubah Status:</label>
                  <select
                    id="modal-status-select"
                    value={selectedPengaduan.status || 'Diterima'}
                    onChange={e => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                  >
                    {STATUS_PENGADUAN.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  {updatingStatus && <span className="status-saving-spinner">Menyimpan...</span>}
                </div>
              </div>

              {/* Catatan / Hasil Advokasi (Publik di Cek Progres) */}
              <div className="admin-modal-section" style={{ background: '#f8fafc', padding: 'var(--space-md) var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <h4 className="admin-modal-section-title" style={{ margin: 0, fontSize: '0.875rem' }}>
                    Catatan / Hasil Advokasi (Tampil di Cek Progres)
                  </h4>
                  <button
                    type="button"
                    onClick={handleSaveCatatan}
                    className="admin-btn-detail"
                    style={{ background: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                    disabled={savingCatatan}
                  >
                    {savingCatatan ? 'Menyimpan...' : '💾 Simpan Catatan'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  maxLength={2000}
                  placeholder="Tuliskan catatan progres atau hasil advokasi yang dapat dibaca mahasiswa saat mengecek tiket..."
                  value={catatanInput}
                  onChange={e => setCatatanInput(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              {/* Quick Contact Buttons */}
              <div className="admin-modal-contact-row">
                <a
                  href={getWhatsAppLink(selectedPengaduan.telepon, selectedPengaduan.kodeKasus, selectedPengaduan.nama)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-wa"
                >
                  💬 Hubungi via WhatsApp ({selectedPengaduan.telepon})
                </a>
                <a
                  href={getEmailLink(selectedPengaduan.email, selectedPengaduan.kodeKasus, selectedPengaduan.nama)}
                  className="admin-btn-email"
                >
                  ✉️ Kirim Email ({selectedPengaduan.email})
                </a>
              </div>

              {/* Data Pelapor */}
              <div className="admin-modal-section">
                <h4 className="admin-modal-section-title">Data Pelapor</h4>
                <div className="admin-detail-grid">
                  <div>
                    <span className="detail-label">Nama Lengkap</span>
                    <p className="detail-val">{selectedPengaduan.nama}</p>
                  </div>
                  <div>
                    <span className="detail-label">Status Pelapor</span>
                    <p className="detail-val">{selectedPengaduan.statusPelapor || '—'}</p>
                  </div>
                  <div>
                    <span className="detail-label">Email</span>
                    <p className="detail-val">{selectedPengaduan.email}</p>
                  </div>
                  <div>
                    <span className="detail-label">Nomor Telepon</span>
                    <p className="detail-val">{selectedPengaduan.telepon}</p>
                  </div>
                </div>
              </div>

              {/* Rincian Kasus */}
              <div className="admin-modal-section">
                <h4 className="admin-modal-section-title">Rincian Permasalahan</h4>
                <div className="admin-detail-stack">
                  <div>
                    <span className="detail-label">Kategori Masalah</span>
                    <p className="detail-val">
                      <span className="admin-kategori-pill">{selectedPengaduan.kategori}</span>
                    </p>
                  </div>
                  <div>
                    <span className="detail-label">Pokok Permasalahan</span>
                    <p className="detail-val" style={{ fontWeight: 600 }}>{selectedPengaduan.pokok}</p>
                  </div>
                  <div>
                    <span className="detail-label">Kronologi Lengkap</span>
                    <div className="detail-kronologi-box">
                      {selectedPengaduan.kronologi}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="admin-modal-section">
                <h4 className="admin-modal-section-title">Informasi Tambahan Kejadian</h4>
                <div className="admin-detail-grid">
                  <div>
                    <span className="detail-label">Tanggal Kejadian</span>
                    <p className="detail-val">{formatTanggalKejadian(selectedPengaduan.tanggalKejadian)}</p>
                  </div>
                  <div>
                    <span className="detail-label">Tempat Kejadian</span>
                    <p className="detail-val">{selectedPengaduan.tempat || '—'}</p>
                  </div>
                  <div>
                    <span className="detail-label">Pihak yang Berkaitan</span>
                    <p className="detail-val">{selectedPengaduan.pihakTerkait || '—'}</p>
                  </div>
                  <div>
                    <span className="detail-label">Jumlah Mahasiswa Terdampak</span>
                    <p className="detail-val">{selectedPengaduan.jumlahTerdampak || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Dampak & Harapan */}
              <div className="admin-modal-section">
                <h4 className="admin-modal-section-title">Dampak &amp; Harapan Penyelesaian</h4>
                <div className="admin-detail-stack">
                  <div>
                    <span className="detail-label">Dampak yang Ditimbulkan</span>
                    <p className="detail-val">{selectedPengaduan.dampak || '—'}</p>
                  </div>
                  <div>
                    <span className="detail-label">Harapan Penyelesaian</span>
                    <p className="detail-val">{selectedPengaduan.harapan || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Bukti Pendukung */}
              <div className="admin-modal-section">
                <h4 className="admin-modal-section-title">Link Bukti Pendukung</h4>
                {Array.isArray(selectedPengaduan.linkBukti) && selectedPengaduan.linkBukti.length > 0 ? (
                  <ul className="admin-link-list">
                    {selectedPengaduan.linkBukti.map((link, idx) => (
                      <li key={idx}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="admin-link-item">
                          🔗 {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="detail-val" style={{ color: 'var(--color-text-subtle)' }}>
                    Tidak ada lampiran bukti pendukung.
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="admin-modal-footer">
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                Pasal 55.3: Dokumentasi advokasi tidak boleh diubah atau dimanipulasi.
              </span>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setSelectedPengaduan(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
