import { useState } from 'react'
import './AcademicBank.css'

// ── Collections (main navigation) ───────────────────────────
const COLLECTIONS = [
  {
    id: 'jurnal',
    icon: '◐',
    label: 'Jurnal & Artikel Ilmiah',
    desc: 'Kumpulan jurnal akademik, paper, dan artikel ilmiah bidang sains dan teknologi.',
    count: '120+',
    color: '#1B4F72',
  },
  {
    id: 'buku',
    icon: '◧',
    label: 'Buku & E-Book',
    desc: 'Referensi buku teks, e-book, dan literatur pendukung mata kuliah FST.',
    count: '85+',
    color: '#117A65',
  },
  {
    id: 'bahan-ajar',
    icon: '◈',
    label: 'Bahan Ajar & Modul',
    desc: 'Modul kuliah, slide presentasi, dan bahan ajar dari dosen FST.',
    count: '60+',
    color: '#E67E22',
  },
  {
    id: 'artikel',
    icon: '◇',
    label: 'Artikel & Pengetahuan',
    desc: 'Artikel populer, infografis, dan konten pengetahuan umum bidang sains-teknologi.',
    count: '200+',
    color: '#8E44AD',
  },
]

// ── Placeholder Resources ────────────────────────────────────
const ALL_RESOURCES = [
  {
    id: 1,
    collection: 'jurnal',
    tag: 'Jurnal Ilmiah',
    title: 'Penerapan Machine Learning dalam Analisis Data Biologis',
    authors: 'A. Rahman, B. Santoso, et al.',
    year: '2025',
    source: 'Journal of Bioinformatics UIN SGD',
    type: 'PDF',
    link: '#',
  },
  {
    id: 2,
    collection: 'jurnal',
    tag: 'Artikel Ilmiah',
    title: 'Optimasi Algoritma Graph untuk Pemetaan Jaringan Ekologi',
    authors: 'C. Nugraha, D. Wijaya',
    year: '2026',
    source: 'Indonesian Science Journal',
    type: 'PDF',
    link: '#',
  },
  {
    id: 3,
    collection: 'buku',
    tag: 'Buku Teks',
    title: 'Kalkulus: Teori dan Aplikasi (Edisi 5)',
    authors: 'Prof. Dr. E. Hakim',
    year: '2024',
    source: 'Penerbit Erlangga',
    type: 'E-Book',
    link: '#',
  },
  {
    id: 4,
    collection: 'buku',
    tag: 'E-Book',
    title: 'Kimia Organik untuk Mahasiswa Sains',
    authors: 'F. Prasetyo, G. Halim',
    year: '2025',
    source: 'UI Press',
    type: 'E-Book',
    link: '#',
  },
  {
    id: 5,
    collection: 'bahan-ajar',
    tag: 'Modul Kuliah',
    title: 'Modul Pemrograman Python untuk Analisis Data',
    authors: 'Tim Dosen Informatika FST',
    year: '2026',
    source: 'DEMA FST Academic Bank',
    type: 'PDF',
    link: '#',
  },
  {
    id: 6,
    collection: 'bahan-ajar',
    tag: 'Bahan Ajar',
    title: 'Slide Kuliah Fisika Kuantum — Semester Ganjil 2026',
    authors: 'Dr. H. Kurniawan',
    year: '2026',
    source: 'Prodi Fisika FST',
    type: 'PPT',
    link: '#',
  },
  {
    id: 7,
    collection: 'artikel',
    tag: 'Artikel',
    title: 'Mengenal Kecerdasan Buatan dan Dampaknya bagi Mahasiswa Sains',
    authors: 'Redaksi Academic Bank',
    year: '2026',
    source: 'Academic Bank FST',
    type: 'Artikel',
    link: '#',
  },
  {
    id: 8,
    collection: 'artikel',
    tag: 'Pengetahuan',
    title: '10 Jurnal Open Access Terbaik untuk Mahasiswa Teknik',
    authors: 'Tim Kurator DEMA FST',
    year: '2026',
    source: 'Academic Bank FST',
    type: 'Artikel',
    link: '#',
  },
]

const TYPE_COLOR = {
  PDF:     { bg: '#EEF5FF', color: '#1B4F72' },
  'E-Book':{ bg: '#EAFAF1', color: '#117A65' },
  PPT:     { bg: '#FEF9E7', color: '#E67E22' },
  Artikel: { bg: '#F5EEF8', color: '#8E44AD' },
}

// ── Component ────────────────────────────────────────────────
export default function AcademicBank() {
  const [activeCol, setActiveCol] = useState('all')
  const [search, setSearch]       = useState('')
  const [query, setQuery]         = useState('')

  const handleSearch = e => {
    e.preventDefault()
    setQuery(search.trim())
  }

  const filtered = ALL_RESOURCES.filter(r => {
    const matchCol = activeCol === 'all' || r.collection === activeCol
    const matchQ   = !query || r.title.toLowerCase().includes(query.toLowerCase())
    return matchCol && matchQ
  })

  return (
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <section className="acadbank-hero" id="acadbank-hero" aria-label="Academic Bank header">
        <div className="container acadbank-hero__inner">
          <span className="section-label section-label--light">Sumber Daya Akademik</span>
          <h1 className="acadbank-hero__title">
            Academic <span style={{ color: '#EECF88' }}>Bank</span>
          </h1>
          <p className="acadbank-hero__desc">
            Perpustakaan digital mahasiswa FST — jurnal ilmiah, buku referensi, bahan ajar,
            dan artikel pengetahuan dalam satu tempat.
          </p>

          {/* Stats */}
          <div className="acadbank-stats">
            {COLLECTIONS.map(c => (
              <div key={c.id} className="acadbank-stat">
                <span className="acadbank-stat-num">{c.count}</span>
                <span className="acadbank-stat-label">{c.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection Cards ── */}
      <section className="acadbank-collections" id="acadbank-collections" aria-label="Koleksi">
        <div className="container">
          <span className="section-label">Koleksi</span>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-xl)' }}>
            Jelajahi Perpustakaan Digital
          </h2>
          <div className="acadbank-col-grid" role="list">
            {COLLECTIONS.map(col => (
              <button
                key={col.id}
                className={`acadbank-col-card ${activeCol === col.id ? 'active' : ''}`}
                onClick={() => { setActiveCol(col.id); setQuery(''); setSearch(''); }}
                role="listitem"
                id={`acadbank-col-${col.id}`}
                aria-pressed={activeCol === col.id}
              >
                <span className="acadbank-col-icon" style={{ color: col.color }}>{col.icon}</span>
                <span className="acadbank-col-count" style={{ color: col.color }}>{col.count}</span>
                <span className="acadbank-col-title">{col.label}</span>
                <span className="acadbank-col-desc">{col.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resource List ── */}
      <section className="acadbank-resources" id="acadbank-resources" aria-label="Daftar resource">
        <div className="container">

          {/* Search + Filter bar */}
          <div className="acadbank-bar">
            <form className="acadbank-search" onSubmit={handleSearch} role="search">
              <input
                id="acadbank-search-input"
                type="search"
                placeholder="Cari judul, penulis, atau topik..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" id="acadbank-search-btn">Cari</button>
            </form>

            <div className="acadbank-filter-tabs" role="tablist">
              <button
                className={`acadbank-ftab ${activeCol === 'all' ? 'active' : ''}`}
                onClick={() => { setActiveCol('all'); setQuery(''); }}
                role="tab" aria-selected={activeCol === 'all'}
              >
                Semua
              </button>
              {COLLECTIONS.map(c => (
                <button
                  key={c.id}
                  className={`acadbank-ftab ${activeCol === c.id ? 'active' : ''}`}
                  onClick={() => { setActiveCol(c.id); setQuery(''); }}
                  role="tab" aria-selected={activeCol === c.id}
                  id={`acadbank-ftab-${c.id}`}
                >
                  {c.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="acadbank-results-count" aria-live="polite">
            {filtered.length} item ditemukan
            {query && <> untuk "<strong>{query}</strong>"</>}
          </p>

          {/* Resource list */}
          {filtered.length === 0 ? (
            <div className="acadbank-empty" role="status">
              <div className="acadbank-empty-icon">📂</div>
              <p>Belum ada resource yang cocok.</p>
            </div>
          ) : (
            <ul className="acadbank-list" role="list">
              {filtered.map(item => {
                const typeStyle = TYPE_COLOR[item.type] || TYPE_COLOR['Artikel']
                return (
                  <li key={item.id} className="acadbank-item" aria-label={item.title}>
                    <div className="acadbank-item-main">
                      <div className="acadbank-item-meta">
                        <span
                          className="acadbank-item-type"
                          style={{ background: typeStyle.bg, color: typeStyle.color }}
                        >
                          {item.type}
                        </span>
                        <span className="acadbank-item-tag">{item.tag}</span>
                        <span className="acadbank-item-year">{item.year}</span>
                      </div>
                      <h3 className="acadbank-item-title">{item.title}</h3>
                      <p className="acadbank-item-authors">{item.authors}</p>
                      <p className="acadbank-item-source">📌 {item.source}</p>
                    </div>
                    <a
                      href={item.link}
                      className="acadbank-item-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Akses ${item.title}`}
                    >
                      Akses →
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── Contribute CTA ── */}
      <section className="acadbank-contribute" id="acadbank-contribute" aria-label="Kontribusi">
        <div className="container">
          <div className="acadbank-contribute-inner">
            <div>
              <span className="section-label">Kontribusi</span>
              <h2 className="section-title" style={{ marginTop: '4px' }}>
                Punya referensi bagus?
              </h2>
              <p className="section-subtitle" style={{ marginTop: 'var(--space-sm)' }}>
                Bantu sesama mahasiswa FST dengan mengusulkan jurnal, buku, atau artikel
                yang bermanfaat untuk ditambahkan ke Academic Bank.
              </p>
            </div>
            <a
              href="mailto:demafst@kampus.ac.id?subject=Usulan%20Resource%20Academic%20Bank"
              className="btn-primary"
              id="acadbank-contribute-btn"
            >
              Usulkan Resource →
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
