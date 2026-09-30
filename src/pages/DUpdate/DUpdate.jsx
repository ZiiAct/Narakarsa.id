import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUpdates } from '../../firebase/firestore'
import './DUpdate.css'

export default function DUpdate() {
  const [updates, setUpdates]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

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

  const formatDate = (createdAt) => {
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
          <span className="section-label">Terbaru</span>
          <h1 className="section-title">
            D-<span className="gradient-text">Update</span>
          </h1>
          <p className="section-subtitle">
            Ikuti perkembangan terbaru dari kegiatan, berita, dan pengumuman kami.
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
              {updates.map(item => (
                <Link
                  key={item.id}
                  to={`/d-update/${item.id}`}
                  className="dupdate__card"
                  role="listitem"
                  aria-label={item.title}
                  id={`dupdate-card-${item.id}`}
                >
                  {/* Gambar (opsional) */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="dupdate__card-img"
                      loading="lazy"
                    />
                  )}
                  <span className="dupdate__card-tag">{item.tag || 'Update'}</span>
                  <h2 className="dupdate__card-title">{item.title}</h2>
                  <p className="dupdate__card-desc">{item.desc}</p>
                  <p className="dupdate__card-date">
                    {formatDate(item.createdAt)}
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
