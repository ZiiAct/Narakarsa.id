import { useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { normalizeKodeTiket } from '../../firebase/firestore'
import './AdvokasiTiket.css'

export default function AdvokasiTiket() {
  const { kode } = useParams()
  const location = useLocation()
  const kodeTiket = normalizeKodeTiket(kode)
  const isBaru = Boolean(location.state?.baru)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(kodeTiket)
    } catch {
      // Fallback untuk browser lama / non-HTTPS
      const ta = document.createElement('textarea')
      ta.value = kodeTiket
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="page-wrapper">
      <section className="section tiket-page" id="advokasi-tiket">
        <div className="container">
          <div className="tiket-card" role="region" aria-label="Kode tiket advokasi">
            <div className="tiket-card__icon" aria-hidden="true">{isBaru ? '✅' : '🎫'}</div>
            <span className="section-label tiket-card__label">
              {isBaru ? 'Laporan Berhasil Terkirim' : 'Kode Tiket Advokasi'}
            </span>
            <h1 className="tiket-card__title">
              {isBaru ? 'Laporan Anda Telah Kami Terima' : 'Tiket Advokasi Anda'}
            </h1>
            <p className="tiket-card__desc">
              Simpan kode tiket di bawah ini. Gunakan kode ini untuk mengecek progres
              advokasi laporan Anda kapan saja.
            </p>

            <div className="tiket-code" id="tiket-code-display" aria-label={`Kode tiket ${kodeTiket.split('').join(' ')}`}>
              {kodeTiket.split('').map((ch, i) => (
                <span className="tiket-code__char" key={i} aria-hidden="true">{ch}</span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`tiket-copy-btn ${copied ? 'is-copied' : ''}`}
              id="btn-copy-tiket"
            >
              {copied ? '✓ Kode Tersalin' : '📋 Salin Kode Tiket'}
            </button>

            <div className="tiket-warning" role="note">
              <strong>Penting:</strong> Kode tiket tidak dapat dipulihkan jika hilang.
              Salin atau screenshot halaman ini sebelum menutupnya.
            </div>

            <div className="tiket-actions">
              <Link
                to={`/advokasi/cek?tiket=${kodeTiket}`}
                className="btn-primary"
                id="btn-tiket-cek-progres"
              >
                Cek Progres Sekarang
              </Link>
              <Link to="/advokasi" className="btn-outline" id="btn-tiket-kembali">
                ← Kembali ke Advokasi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
