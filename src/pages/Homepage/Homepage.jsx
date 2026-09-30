import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import imgSaintek  from '../../assets/saintek.webp'
import imgWA0074   from '../../assets/IMG-20260802-WA0074.jpg'
import { getUpdates } from '../../firebase/firestore'
import './Homepage.css'

// ── Data ────────────────────────────────────────────────────
const layanan = [
  {
    id: 1, icon: '♡',
    title: 'Aspirasi & Aduan',
    desc:  'Sampaikan masalah akademik, fasilitas, atau administrasi — bisa secara anonim.',
  },
  {
    id: 2, icon: '◇',
    title: 'Beasiswa & Kompetisi',
    desc:  'Kurasi beasiswa, lomba, magang, dan peluang volunteer terbaru untuk mahasiswa.',
  },
  {
    id: 3, icon: '✦',
    title: 'Kemitraan',
    desc:  'Ajukan kerja sama, sponsorship, atau media partner bersama DEMA FST.',
  },
  { id: 4, icon: '◈',
    title: 'Academic Bank',
    desc:  'Akses jurnal, buku, bahan ajar, dan artikel pengetahuan pilihan untuk mahasiswa FST.',
  },
  {
    id: 5, icon: '✉',
    title: 'Kotak Anonim',
    desc:  'Sampaikan kritik & saran tanpa identitas — aman, langsung, dan ditindaklanjuti.',
  },
  {
    id: 6, icon: '◷',
    title: 'Kalender Kegiatan',
    desc:  'Agenda kabinet dan kegiatan mahasiswa FST — selalu terkini.',
  },
]

const misiItems = [
  'Mengoptimalkan tata kelola internal DEMA FST Kabinet Narakarsa',
  'Membangun ekosistem informasi yang transparan dan terbuka',
  'Merekatkan elemen internal dan eksternal mahasiswa FST',
  'Memastikan kesejahteraan mahasiswa yang inklusif dan merata',
]


// ── Component ────────────────────────────────────────────────
export default function Homepage() {
  const [newsItems, setNewsItems] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    getUpdates(3)
      .then(data => setNewsItems(data))
      .catch(err => console.error('Gagal memuat berita homepage:', err))
      .finally(() => setNewsLoading(false))
  }, [])

  const formatDate = (createdAt, fallback) => {
    if (!createdAt) return fallback || '—'
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="page-wrapper" style={{ paddingTop: 72 }}>

      {/* ════════ 1. HERO ════════ */}
      <section className="hero" id="hero" aria-label="Hero section">
        <div className="hero__bg-pattern" aria-hidden="true" />

        {/* Left — Text */}
        <div className="hero__left">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            Periode 2026/2027
          </div>

          <h1 className="hero__title">
            Narakarsa —<br />
            Bergerak Bersama,<br />
            Membangun <em style={{ color: '#EECF88' }}>FST</em>
          </h1>

          <p className="hero__desc">
            Kabinet Narakarsa adalah tekad mahasiswa Fakultas Sains dan Teknologi
            untuk tumbuh bersama — dalam ilmu, karya, dan semangat pengabdian.
            Satu kepengurusan, satu visi, satu langkah.
          </p>

          <div className="hero__actions">
            <Link to="/profil" className="btn-white" id="hero-cta-primary">
              Tentang Kabinet →
            </Link>
            <Link to="/d-update" className="btn-ghost-white" id="hero-cta-secondary">
              Lihat Update
            </Link>
          </div>

          <div className="hero__stats" aria-label="Statistik kabinet">
            {[
              { num: '5+',    label: 'Departemen Aktif'    },
              { num: '30+',   label: 'Pengurus Terpilih'   },
              { num: '1000+', label: 'Mahasiswa Terlayani' },
            ].map(s => (
              <div key={s.label}>
                <div className="hero__stat-num">{s.num}</div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Image */}
        <div className="hero__right" aria-hidden="true">
          <div className="hero__img-wrap">
            <img src={imgSaintek} alt="Gedung FST" />
            <div className="hero__img-overlay" />
          </div>
        </div>
      </section>

      {/* ════════ 2. ANNOUNCEMENT STRIP ════════ */}
      <div className="announce-strip" role="banner" aria-label="Pengumuman">
        <div className="announce-strip__inner">
          <span className="announce-strip__badge">Terbaru</span>
          <p className="announce-strip__text">
            Struktur Kabinet Narakarsa 2026/2027 telah resmi dilantik.
          </p>
          <Link to="/d-update" className="announce-strip__link">
            Selengkapnya →
          </Link>
        </div>
      </div>

      {/* ════════ 3. ABOUT / PRAKATA ════════ */}
      <section className="section-about" id="about" aria-label="Tentang Kabinet">
        <div className="container">
          <div className="about__grid">

            {/* Image Side */}
            <div className="about__img-wrap">
              <img src={imgWA0074} alt="Kegiatan Kabinet Narakarsa" loading="lazy" />
              <div className="about__img-badge">
                <div className="about__img-badge-title">Narakarsa</div>
                <div className="about__img-badge-sub">DEMA FST — Kabinet 2026/2027</div>
              </div>
            </div>

            {/* Content Side */}
            <div className="about__content">
              <span className="section-label">Prakata</span>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
                Merawat Nalar.<br />
                <span className="gradient-text">Menggerakkan Perubahan.</span>
              </h2>

              <blockquote className="about__visi">
                "Mewujudkan DEMA FST sebagai pusat pelayanan, advokasi, dan pergerakan
                mahasiswa yang responsif, transparan, dan berbasis data."
              </blockquote>

              <ul className="about__misi" aria-label="Misi kabinet">
                {misiItems.map((m, i) => (
                  <li key={i} className="about__misi-item">
                    <span className="about__misi-dot" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>

              <div className="about__actions">
                <Link to="/profil" className="btn-primary" id="about-cta">
                  Lihat Detail Visi Misi →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ 4. LAYANAN ════════ */}
      <section className="section-layanan" id="layanan" aria-label="Layanan Kabinet">
        <div className="container">
          <div className="layanan__header">
            <div>
              <span className="section-label">Layanan</span>
              <h2 className="section-title">Yang bisa kamu<br />urus di sini</h2>
            </div>
            <Link to="/advokasi" className="layanan__header-link" id="layanan-see-all">
              Semua layanan →
            </Link>
          </div>

          <div className="layanan__grid" role="list">
            {layanan.map(item => (
              <div key={item.id} className="layanan__card" role="listitem">
                <div className="layanan__card-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className="layanan__card-title">{item.title}</h3>
                <p className="layanan__card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 5. D-UPDATE PREVIEW ════════ */}
      <section className="section-updates" id="updates-preview" aria-label="Kabar Terbaru">
        <div className="container">
          <div className="updates__header">
            <div>
              <span className="section-label">Terkini</span>
              <h2 className="section-title">Kabar &amp; Agenda</h2>
            </div>
            <Link to="/d-update" className="updates__header-link" id="updates-see-all">
              Semua berita →
            </Link>
          </div>

          {/* ── News Grid ── */}
          <div className="updates__grid" role="list">
            {newsLoading ? (
              <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>Memuat berita...</p>
            ) : newsItems.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>Belum ada berita.</p>
            ) : (
              newsItems.map(item => (
                <Link
                  key={item.id}
                  to={`/d-update/${item.id}`}
                  className="updates__card"
                  role="listitem"
                  aria-label={item.title}
                  id={`home-news-${item.id}`}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="updates__card-img"
                      loading="lazy"
                    />
                  )}
                  <div className="updates__card-body">
                    <span className="updates__card-tag">{item.tag}</span>
                    <h3 className="updates__card-title">{item.title}</h3>
                    <p className="updates__card-date">
                      {formatDate(item.createdAt, item.dateStr)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ════════ 6. CTA BANNER ════════ */}
      <section className="section-cta" id="cta" aria-label="Call to Action">
        <div className="container">
          <div className="cta__inner">
            <div className="cta__text">
              <span className="section-label section-label--light">Aspirasi</span>
              <h2 className="section-title section-title--white" style={{ marginTop: 'var(--space-xs)' }}>
                Punya sesuatu untuk<br />disuarakan?
              </h2>
              <p className="section-subtitle section-subtitle--white" style={{ marginTop: 'var(--space-md)' }}>
                Setiap gagasan membutuhkan tempat untuk didengar. Sampaikan aspirasi,
                aduan, atau kolaborasimu — kami menindaklanjuti.
              </p>
            </div>
            <div className="cta__actions">
              <Link to="/advokasi" className="btn-white" id="cta-advokasi">
                Sampaikan Aspirasi
              </Link>
              <Link to="/kontak" className="btn-ghost-white" id="cta-kontak">
                Hubungi Kabinet
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
