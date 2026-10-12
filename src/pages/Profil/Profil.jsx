import { useState, useMemo } from 'react'
import './Profil.css'

// ── 1. VISI & MISI DEMA FST (ORGANISASI) ───────────────────
const VISI_ORGANISASI =
  'Terwujudnya DEMA FST sebagai poros integrasi informasi dan komunikasi yang responsif, transparan, dan inovatif guna mendukung restorasi ekosistem intelektual, spiritual, dan kolektif bagi masyarakat Fakultas Sains dan Teknologi.'

const MISI_ORGANISASI = [
  'Mengelola arus informasi secara profesional, akurat, dan terpercaya sebagai corong utama DEMA FST.',
  'Membangun ekosistem komunikasi sinergis antar-elemen kemahasiswaan dan fakultas melalui media digital independen.',
  'Mengawal literasi digital, menangkal disinformasi, serta merespons isu strategis melalui publikasi edukatif berbasis data.',
  'Mewadahi kreativitas dan inovasi media mahasiswa FST sebagai bentuk pengabdian dan penyatuan aspirasi.',
]

// ── 2. VISI & MISI KETUA UMUM (IKHSAN NUR ALAM) ────────────
const VISI_KETUM =
  'Restorasi Marwah DEMA F Sebagai Poros Intelektual, Spiritual, dan Kolektif Bagi Masyarakat Saintek dan Indonesia.'

const MISI_KETUM = [
  {
    title: 'Rekonstruksi Kultur Intelektual',
    desc: 'Membangun tradisi kaum intelektual seperti riset, kajian kebijakan, dan diskusi ilmiah sebagai basis dari setiap gerakan dan pengambilan sikap organisasi.',
  },
  {
    title: 'Institusionalisasi Etika Spiritual',
    desc: 'Mengintegrasikan nilai-nilai Islam ke dalam operasional prosedur dan etika standar berperilaku seluruh pengurus DEMA FST.',
  },
  {
    title: 'Akselerasi Transformasi Digital',
    desc: 'Mengimplementasikan sistem manajemen organisasi modern yang lincah (agile) berbasis teknologi informasi untuk efisiensi birokrasi internal.',
  },
  {
    title: 'Penguatan Advokasi Strategis',
    desc: 'Menjadi saluran aspirasi mahasiswa yang responsif, cerdas, dan berbasis data dalam berdialog dengan pihak dekanat maupun universitas (LAPOR 1 PINTU).',
  },
  {
    title: 'Pemberdayaan Kolektifitas FST',
    desc: 'Mengoptimaliasi fungsi komunikatif dan direktif kepada setiap HMJ serta memperkuat sinergi kolaboratif dengan BSO dan Fakultas.',
  },
]

// ── 3. STRUKTUR KEPENGURUSAN (ORGANOGRAM) 2025/2026 ───────
const EX_OFFICIO = [
  { jabatan: 'Ketua Umum', nama: 'Ikhsan Nur Alam', role: 'leader' },
  { jabatan: 'Sekretaris Umum', nama: 'Tessa Rahayu', role: 'sekretaris' },
  { jabatan: 'Wakil Sekretaris Umum', nama: 'Shana Aliya Pradita', role: 'sekretaris' },
  { jabatan: 'Bendahara Umum', nama: 'Syahrul Adriansyah', role: 'bendahara' },
  { jabatan: 'Wakil Bendahara Umum', nama: 'Alissya Nur Alfara', role: 'bendahara' },
]

const DAFTAR_BIDANG = [
  {
    id: 1,
    nama: 'BIDANG PENGEMBANGAN APARATUR ORGANISASI',
    singkatan: 'PAO',
    icon: '🏛️',
    ketua: 'Dicky Ramadhan',
    sekretaris: 'Aif Suwanda',
    bendahara: 'Maulana Muhammad Ridwan',
    anggota: ['Ilham Fathurrahman'],
  },
  {
    id: 2,
    nama: 'BIDANG PENELITIAN DAN PENGEMBANGAN KEILMUAN',
    singkatan: 'PPK',
    icon: '🔬',
    ketua: 'Zefa Cannavaro Alfaruq',
    sekretaris: 'Bagas Anugrah',
    bendahara: 'Sulis Tiani Ahmad',
    anggota: ['Yusuf Ikhsan', 'Muhammad Hasbi Tsaqib'],
  },
  {
    id: 3,
    nama: 'BIDANG EKONOMI KREATIF',
    singkatan: 'ekotif',
    icon: '💡',
    ketua: 'Diaz Zakaria Permana',
    sekretaris: 'Rekan Suherman',
    bendahara: 'Indah Dwi Astuti',
    anggota: ['Novi Tri Lestari'],
  },
  {
    id: 4,
    nama: 'BIDANG KAJIAN, STRATEGI DAN ADVOKASI',
    singkatan: 'KASTRAD',
    icon: '⚖️',
    ketua: 'Deden Ahmad',
    sekretaris: 'Muhammad Alifiansyah Ikhsan',
    bendahara: 'Zifa Prianto',
    anggota: ['Hasbi Amalul Ahli'],
  },
  {
    id: 5,
    nama: 'BIDANG KEISLAMAN',
    singkatan: 'KEISLAMAN',
    icon: '🕌',
    ketua: 'Rifki Taufik',
    sekretaris: 'Safa Cinta Syahida',
    bendahara: 'Ina Sintia Dewi',
    anggota: [],
  },
  {
    id: 6,
    nama: 'BIDANG SENI DAN OLAHRAGA',
    singkatan: 'senior',
    icon: '🏆',
    ketua: 'Chiko Fauzan Abhipraya',
    sekretaris: 'Vina Aulia Atqia',
    bendahara: 'Diajeng Angel Chiquita',
    anggota: ['M Fahmi Akbar', 'Dafa Alim Pasha', 'Nayla Mahesha Yaspin'],
  },
  {
    id: 7,
    nama: 'BIDANG KOMUNIKASI MEDIA DAN INFORMASI',
    singkatan: 'KOMINFO',
    icon: '📡',
    ketua: 'Ziyadul Quwwah Ahmad Yasin',
    sekretaris: 'Putri Annisa Nurfadilla',
    bendahara: 'Hana Fitriana',
    anggota: ['Mia Julia Hartini'],
  },
  {
    id: 8,
    nama: 'BIDANG SOSIAL MASYARAKAT',
    singkatan: 'SOSMAS',
    icon: '🤝',
    ketua: 'Aldi Putra',
    sekretaris: 'Desti Fatkhurrohmah',
    bendahara: 'Fitria Salsabila Oktavia',
    anggota: ['Muhammad Faza Herturi Al Qurani', 'Muhammad Daffa Riansyah'],
  },
]

export default function Profil() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter bidang berdasarkan tab & pencarian
  const filteredBidang = useMemo(() => {
    return DAFTAR_BIDANG.filter(b => {
      const matchTab = activeFilter === 'all' || activeFilter === String(b.id)
      if (!matchTab) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()

      const inNamaBidang = b.nama.toLowerCase().includes(q)
      const inKetua = b.ketua.toLowerCase().includes(q)
      const inSekre = b.sekretaris.toLowerCase().includes(q)
      const inBenda = b.bendahara.toLowerCase().includes(q)
      const inAnggota = b.anggota.some(a => a.toLowerCase().includes(q))

      return inNamaBidang || inKetua || inSekre || inBenda || inAnggota
    })
  }, [activeFilter, searchQuery])

  // Filter ex-officio jika sedang melakukan pencarian
  const filteredExOfficio = useMemo(() => {
    if (!searchQuery.trim()) return EX_OFFICIO
    const q = searchQuery.toLowerCase()
    return EX_OFFICIO.filter(
      p => p.nama.toLowerCase().includes(q) || p.jabatan.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="page-wrapper" id="profil-page">

      {/* ── Page Hero ── */}
      <section className="page-hero" id="profil-hero" aria-label="Profil header">
        <div className="container page-hero__inner">
          <div className="hero__eyebrow" style={{ color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
            <span className="hero__eyebrow-dot" style={{ background: 'var(--color-gold)' }} />
            Kabinet Narakarsa Periode 2025/2026
          </div>
          <h1 className="page-hero__title">
            Profil &amp; Struktur<br />
            <span style={{ color: '#EECF88' }}>Kabinet Narakarsa</span>
          </h1>
          <p className="page-hero__desc">
            Landasan Visi, Misi Organisasi, Visi Misi Ketua Umum, serta Struktur Kepengurusan
            Dewan Eksekutif Mahasiswa Fakultas Sains dan Teknologi UIN Sunan Gunung Djati Bandung.
          </p>
        </div>
      </section>

      {/* ── 1. VISI & MISI DEMA FST (ORGANISASI) ── */}
      <section className="section section--alt" id="profil-visi-organisasi" aria-label="Visi Misi Organisasi">
        <div className="container">
          <div className="section-head">
            <span className="section-label">Landasan Organisasi</span>
            <h2 className="section-title">Visi &amp; Misi DEMA FST</h2>
            <p className="section-subtitle">
              Arah haluan utama pergerakan Dewan Eksekutif Mahasiswa Fakultas Sains dan Teknologi.
            </p>
          </div>

          {/* Card Visi */}
          <div className="profil-visi" id="profil-visi-org">
            <div className="profil-visi__header">
              <span className="profil-visi__badge">VISI UTAMA</span>
              <span className="profil-visi__tagline">Poros Integrasi Informasi &amp; Komunikasi</span>
            </div>
            <p className="profil-visi__text">
              "{VISI_ORGANISASI}"
            </p>
          </div>

          {/* Cards Misi */}
          <h3 className="profil-misi__label">4 Misi Strategis DEMA FST</h3>
          <div className="profil-misi-grid" role="list">
            {MISI_ORGANISASI.map((item, i) => (
              <div className="profil-misi-card" key={i} role="listitem">
                <div className="profil-misi-card__top">
                  <span className="profil-misi-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="profil-misi-card__pill">MISI {i + 1}</div>
                </div>
                <p className="profil-misi-card__text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. VISI & MISI KETUA UMUM (IKHSAN NUR ALAM) ── */}
      <section className="section" id="profil-visi-ketum" aria-label="Visi Misi Ketua Umum">
        <div className="container">
          <div className="section-head">
            <span className="section-label">Arah Gerak Kepemimpinan</span>
            <h2 className="section-title">Visi &amp; Misi Ketua Umum</h2>
            <p className="section-subtitle">
              Prakarsa kepemimpinan Ketua Umum Ikhsan Nur Alam untuk 1 periode kepengurusan DEMA FST.
            </p>
          </div>

          {/* Leader Spotlight Banner */}
          <div className="ketum-banner">
            <div className="ketum-banner__profile">
              <span className="ketum-banner__role-pill">Ketua Umum DEMA FST 2025/2026</span>
              <h3 className="ketum-banner__name">Ikhsan Nur Alam</h3>
              <p className="ketum-banner__sub">Kabinet Narakarsa — UIN Sunan Gunung Djati Bandung</p>
            </div>

            <div className="ketum-banner__quote">
              <div className="ketum-banner__quote-label">VISI KETUA UMUM</div>
              <p className="ketum-banner__quote-text">
                "{VISI_KETUM}"
              </p>
            </div>
          </div>

          {/* 5 Misi 1 Periode Ketum */}
          <h3 className="profil-misi__label" style={{ marginTop: 'var(--space-2xl)' }}>
            5 Misi Aksi (1 Periode)
          </h3>
          <div className="ketum-misi-grid" role="list">
            {MISI_KETUM.map((item, i) => (
              <div className="ketum-misi-card" key={i} role="listitem">
                <div className="ketum-misi-card__num-badge">{i + 1}</div>
                <div className="ketum-misi-card__content">
                  <h4 className="ketum-misi-card__title">{item.title}</h4>
                  <p className="ketum-misi-card__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. STRUKTUR KEPENGURUSAN (ORGANOGRAM) 2025/2026 ── */}
      <section className="section section--alt" id="profil-organogram" aria-label="Organogram Kabinet">
        <div className="container">
          <div className="section-head">
            <span className="section-label">Organogram</span>
            <h2 className="section-title">Struktur Kabinet Narakarsa 2025/2026</h2>
            <p className="section-subtitle">
              Susunan Pengurus Dewan Eksekutif Mahasiswa FST Periode 2025/2026 berdasarkan SK Dekan No. B-1772/Un.05/III.7/PP.00.9/07/2026.
            </p>
          </div>

          {/* Filter & Search Controls */}
          <div className="organogram-controls">
            <div className="organogram-search">
              <input
                type="search"
                placeholder="Cari nama pengurus atau jabatan..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="organogram-search__input"
                id="organogram-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="organogram-search__clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Bersihkan pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="organogram-tabs" role="tablist">
              <button
                type="button"
                className={`organogram-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
                role="tab"
                aria-selected={activeFilter === 'all'}
              >
                Semua Bidang
              </button>
              {DAFTAR_BIDANG.map(b => (
                <button
                  key={b.id}
                  type="button"
                  className={`organogram-tab ${activeFilter === String(b.id) ? 'active' : ''}`}
                  onClick={() => setActiveFilter(String(b.id))}
                  role="tab"
                  aria-selected={activeFilter === String(b.id)}
                >
                  {b.singkatan}
                </button>
              ))}
            </div>
          </div>

          {/* A. PENGURUS (EX-OFFICIO) */}
          {(activeFilter === 'all' || activeFilter === 'exofficio') && filteredExOfficio.length > 0 && (
            <div className="organogram-section" id="organogram-exofficio">
              <div className="organogram-section__title-wrap">
                <span className="organogram-section__tag">EX-OFFICIO</span>
                <h3 className="organogram-section__title">Pengurus</h3>
              </div>

              {/* Leader (Ketua Umum) Highlight */}
              {filteredExOfficio.find(p => p.role === 'leader') && (
                <div className="organogram-leader-row">
                  <div className="organogram-card organogram-card--leader">
                    <div className="organogram-card__badge">KETUA UMUM</div>
                    <h4 className="organogram-card__name">Ikhsan Nur Alam</h4>
                    <p className="organogram-card__title">Ketua Umum DEMA FST 2025/2026</p>
                  </div>
                </div>
              )}

              {/* Sub-leaders (Sekretaris & Bendahara) */}
              <div className="organogram-exofficio-grid">
                {filteredExOfficio
                  .filter(p => p.role !== 'leader')
                  .map(p => (
                    <div key={p.jabatan} className="organogram-card organogram-card--exofficio">
                      <div className="organogram-card__badge-sub">{p.jabatan}</div>
                      <h4 className="organogram-card__name">{p.nama}</h4>
                      <p className="organogram-card__title">Pengurus</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* B. DAFTAR 8 BIDANG */}
          <div className="organogram-bidang-wrap" id="organogram-bidang-list">
            {filteredBidang.length === 0 ? (
              <div className="organogram-empty">
                <span className="organogram-empty__icon">🔍</span>
                <p>Tidak ditemukan pengurus dengan kata kunci "{searchQuery}".</p>
              </div>
            ) : (
              filteredBidang.map(bidang => (
                <div key={bidang.id} className="bidang-card" id={`bidang-${bidang.id}`}>
                  {/* Header Bidang */}
                  <div className="bidang-card__header">
                    <div className="bidang-card__title-row">
                      <span className="bidang-card__num">{bidang.id}</span>
                      <div>
                        <span className="bidang-card__badge">{bidang.singkatan}</span>
                        <h4 className="bidang-card__name">{bidang.nama}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Body Bidang */}
                  <div className="bidang-card__body">
                    {/* Pimpinan Bidang */}
                    <div className="bidang-pimpinan-grid">
                      <div className="member-item member-item--ketua">
                        <span className="member-item__role">Ketua Bidang</span>
                        <span className="member-item__name">{bidang.ketua}</span>
                      </div>
                      <div className="member-item">
                        <span className="member-item__role">Sekretaris Bidang</span>
                        <span className="member-item__name">{bidang.sekretaris}</span>
                      </div>
                      <div className="member-item">
                        <span className="member-item__role">Bendahara Bidang</span>
                        <span className="member-item__name">{bidang.bendahara}</span>
                      </div>
                    </div>

                    {/* Anggota Bidang */}
                    <div className="bidang-anggota-block">
                      <span className="bidang-anggota-title">
                        Anggota Bidang ({bidang.anggota.length})
                      </span>
                      {bidang.anggota.length > 0 ? (
                        <div className="bidang-anggota-chips">
                          {bidang.anggota.map((nama, idx) => (
                            <span key={idx} className="anggota-chip">
                              <span className="anggota-chip__bullet">•</span>
                              {nama}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="bidang-anggota-empty">—</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
