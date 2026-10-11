import './Profil.css'

const MISI = [
  'Mengelola arus informasi secara profesional, akurat, dan terpercaya sebagai corong utama DEMA FST.',
  'Membangun ekosistem komunikasi sinergis antar-elemen kemahasiswaan dan fakultas melalui media digital independen.',
  'Mengawal literasi digital, menangkal disinformasi, serta merespons isu strategis melalui publikasi edukatif berbasis data.',
  'Mewadahi kreativitas dan inovasi media mahasiswa FST sebagai bentuk pengabdian dan penyatuan aspirasi.',
]

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
            Informasi lengkap tentang visi, misi, dan susunan pengurus
            DEMA FST Kabinet Narakarsa 2026/2027.
          </p>
        </div>
      </section>

      {/* ── Visi & Misi ── */}
      <section className="section section--alt" id="profil-visi-misi" aria-label="Visi dan Misi">
        <div className="container">
          <span className="section-label">Visi &amp; Misi</span>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-xl)' }}>
            Visi &amp; Misi Kami
          </h2>

          <div className="profil-visi" id="profil-visi">
            <h3 className="profil-visi__label">Visi</h3>
            <p className="profil-visi__text">
              Terwujudnya DEMA FST sebagai poros integrasi informasi dan komunikasi yang responsif,
              transparan, dan inovatif guna mendukung restorasi ekosistem intelektual, spiritual,
              dan kolektif bagi masyarakat Fakultas Sains dan Teknologi.
            </p>
          </div>

          <h3 className="profil-misi__label">Misi</h3>
          <ol className="profil-misi" id="profil-misi">
            {MISI.map((item, i) => (
              <li className="profil-misi__item" key={i}>
                <span className="profil-misi__num">{String(i + 1).padStart(2, '0')}</span>
                <p className="profil-misi__text">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Struktur / Tim ── */}
      <section className="section" id="profil-tim" aria-label="Struktur Kabinet">
        <div className="container">
          <span className="section-label">Pengurus</span>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
            Struktur Kabinet Narakarsa
          </h2>
          <div className="profil-wip" id="profil-tim-wip">
            <span className="profil-wip__icon" aria-hidden="true">===</span>
            <p className="profil-wip__text">Bagian ini akan segera hadir.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
