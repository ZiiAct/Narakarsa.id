import './Profil.css'

export default function Profil() {
  return (
    <div className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="page-hero" id="profil-hero" aria-label="Profil page header">
        <div className="container page-hero__inner">
          <span className="section-label section-label--light">Tentang Kami</span>
          <h1 className="page-hero__title">
            Profil Kabinet<br />
            <span style={{ color: '#EECF88' }}>Narakarsa</span>
          </h1>
          <p className="page-hero__desc">
            Informasi lengkap tentang organisasi, visi misi, sejarah, dan susunan pengurus
            DEMA FST Kabinet Narakarsa 2026/2027.
          </p>
        </div>
      </section>

      {/* ── Visi & Misi ── */}
      <section className="section section--alt" id="profil-visi-misi" aria-label="Visi dan Misi">
        <div className="container">
          <span className="section-label">Visi &amp; Misi</span>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
            Visi &amp; Misi Kami
          </h2>
          <p className="section-subtitle">
            Konten visi dan misi Kabinet Narakarsa akan ditambahkan di sini.
          </p>
        </div>
      </section>

      {/* ── Sejarah ── */}
      <section className="section" id="profil-sejarah" aria-label="Sejarah">
        <div className="container">
          <span className="section-label">Sejarah</span>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
            Sejarah Organisasi
          </h2>
          <p className="section-subtitle">
            Perjalanan dan sejarah DEMA FST akan ditampilkan di sini.
          </p>
        </div>
      </section>

      {/* ── Struktur / Tim ── */}
      <section className="section section--alt" id="profil-tim" aria-label="Struktur Kabinet">
        <div className="container">
          <span className="section-label">Pengurus</span>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
            Struktur Kabinet Narakarsa
          </h2>
          <p className="section-subtitle">
            Susunan resmi pimpinan dan pengurus Kabinet Narakarsa 2026/2027 akan ditampilkan di sini.
          </p>
        </div>
      </section>

    </div>
  )
}
