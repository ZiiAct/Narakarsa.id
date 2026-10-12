import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getUpdates, formatDriveImageUrl } from '../../firebase/firestore'
import './DUpdate.css'

export default function DUpdate() {
  const [updates, setUpdates]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [dismissedNotice, setDismissedNotice] = useState(false)
  const notice = dismissedNotice
    ? null
    : (location.state?.notice || (searchParams.get('from') === 'academic-bank' ? 'Halaman ini masih dalam proses pengembangan.' : null))

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const data = await getUpdates(20)
        setUpdates(data)
      } catch (err) {
        console.error('Gagal memuat updates:', err)
        setError('Gagal memuat konten. Coba lagi nanti.')
      } finally {
        setLoading(false)
      }
    }
    fetchUpdates()
  }, [])

  const formatDate = (createdAt, dateStr) => {
    if (dateStr) return dateStr
    if (!createdAt) return '—'
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  return (
    <div className="page-wrapper">
      <section className="section" id="dupdate-hero" style={{ paddingTop: 'calc(var(--space-3xl) + 1rem)' }}>
        <div className="container">

          {/* ── Notice Banner (Redirect / Pengembangan) ── */}
          {notice && (
            <div className="dupdate__notice-banner" role="status" aria-live="polite" id="academic-bank-notice">
              <div className="dupdate__notice-icon-box" aria-hidden="true">
                <span className="dupdate__notice-icon">🚧</span>
              </div>
              <div className="dupdate__notice-text-wrap">
                <div className="dupdate__notice-heading">Pengalihan Halaman</div>
                <p className="dupdate__notice-body">{notice}</p>
              </div>
              <button
                type="button"
                className="dupdate__notice-close-btn"
                onClick={() => setDismissedNotice(true)}
                aria-label="Tutup pemberitahuan"
                id="close-notice-btn"
              >
                ✕
              </button>
            </div>
          )}

          <span className="section-label">Terbaru</span>
          <h1 className="section-title">
            D-<span className="gradient-text">Update</span>
          </h1>
          <p className="section-subtitle">
            Pusat informasi, rilis publikasi, dan agenda resmi DEMA FST Kabinet Narakarsa.
          </p>

          {/* ── Loading State ── */}
          {loading && (
            <div className="dupdate__state" aria-live="polite" aria-busy="true">
              <div className="dupdate__spinner" aria-label="Memuat konten..." />
              <p>Memuat update...</p>
            </div>
          )}

          {/* ── Error State ── */}
          {error && (
            <div className="dupdate__state dupdate__state--error" role="alert">
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && !error && updates.length === 0 && (
            <div className="dupdate__state" role="status">
              <p style={{ color: 'var(--color-text-muted)' }}>
                Belum ada update. Cek lagi nanti!
              </p>
            </div>
          )}

          {/* ── Card Grid ── */}
          {!loading && !error && updates.length > 0 && (
            <div className="dupdate__grid" role="list">
              {updates.map((item, idx) => (
                <Link
                  key={item.id}
                  to={`/d-update/${item.id}`}
                  className="dupdate__card"
                  role="listitem"
                  aria-label={item.title}
                  id={`dupdate-card-${item.id}`}
                >
                  {/* Gambar Thumbnail */}
                  <img
                    src={formatDriveImageUrl(item.imageUrl, idx)}
                    alt={item.title}
                    className="dupdate__card-img"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `/images/berita-${(idx % 3) + 1}.jpg`
                    }}
                  />
                  <span className="dupdate__card-tag">{item.tag || 'Update'}</span>
                  <h2 className="dupdate__card-title">{item.title}</h2>
                  <p className="dupdate__card-desc">{item.desc}</p>
                  <p className="dupdate__card-date">
                    {formatDate(item.createdAt, item.dateStr)}
                  </p>
                  <span className="dupdate__card-read-more">Baca selengkapnya →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
