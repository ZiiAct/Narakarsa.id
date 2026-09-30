import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getUpdateById } from '../../firebase/firestore'
import './ArticleDetail.css'

export default function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getUpdateById(id)
        if (!data) {
          setError('Artikel tidak ditemukan.')
        } else {
          setArticle(data)
        }
      } catch (err) {
        console.error('Gagal memuat artikel:', err)
        setError('Gagal memuat artikel. Coba lagi nanti.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  const formatDate = (createdAt) => {
    if (!createdAt) return '—'
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="article-detail__loading" aria-live="polite" aria-busy="true">
        <div className="article-detail__spinner" aria-label="Memuat artikel..." />
        <p>Memuat artikel...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="article-detail__error-page">
        <div className="container">
          <span className="section-label">Error</span>
          <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
            {error || 'Artikel tidak ditemukan.'}
          </h1>
          <button className="btn-primary" onClick={() => navigate('/d-update')} style={{ marginTop: '2rem' }}>
            ← Kembali ke D-Update
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper" id="article-detail-page">
      {/* ── Hero Banner ── */}
      <div className="article-detail__hero">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="article-detail__hero-img"
          />
        )}
        <div className="article-detail__hero-overlay" aria-hidden="true" />
        <div className="article-detail__hero-content container">
          <Link to="/d-update" className="article-detail__back-link" id="article-back-btn">
            ← Semua Berita
          </Link>
          <span className="article-detail__tag">{article.tag || 'Update'}</span>
          <h1 className="article-detail__title">{article.title}</h1>
          <p className="article-detail__date">{formatDate(article.createdAt)}</p>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="article-detail__body container">
        {article.desc && (
          <p className="article-detail__lead">{article.desc}</p>
        )}
        <div className="article-detail__divider" />
        {article.content ? (
          <div className="article-detail__content">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="article-detail__content" style={{ color: 'var(--color-text-muted)' }}>
            Konten artikel belum tersedia.
          </p>
        )}

        {/* ── Footer Navigation ── */}
        <div className="article-detail__footer">
          <Link to="/d-update" className="btn-outline" id="article-footer-back">
            ← Kembali ke D-Update
          </Link>
        </div>
      </div>
    </div>
  )
}
