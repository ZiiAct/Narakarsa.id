import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../../context/AuthContext'
import { getMessages, markMessageRead, addUpdate } from '../../firebase/firestore'
import { uploadImage }         from '../../firebase/storage'
import './AdminDashboard.css'

const TABS = ['Pesan Masuk', 'Tambah Update']

export default function AdminDashboard() {
  const { isAdmin, logout, user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab]   = useState(0)
  const [messages, setMessages]     = useState([])
  const [msgLoading, setMsgLoading] = useState(true)

  // Form state — Tambah Update
  const [form, setForm]         = useState({ tag: '', title: '', desc: '', content: '' })
  const [imageFile, setImageFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving]     = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Redirect jika tidak login
  useEffect(() => {
    if (!isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  // Load pesan masuk
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
    if (activeTab === 0) loadMessages()
  }, [activeTab])

  const handleMarkRead = async (id) => {
    await markMessageRead(id)
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, isRead: true } : m)
    )
  }

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
      setForm({ tag: '', title: '', desc: '' })
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

  return (
    <div className="admin-dash" id="admin-dashboard">
      {/* ── Header ── */}
      <div className="admin-dash__header">
        <div>
          <h1 className="admin-dash__title gradient-text">Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Login sebagai: {user?.email}
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
          </button>
        ))}
      </div>

      {/* ── Tab: Pesan Masuk ── */}
      {activeTab === 0 && (
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
                        {msg.createdAt?.toDate
                          ? msg.createdAt.toDate().toLocaleDateString('id-ID')
                          : '—'}
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

      {/* ── Tab: Tambah Update ── */}
      {activeTab === 1 && (
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
    </div>
  )
}
