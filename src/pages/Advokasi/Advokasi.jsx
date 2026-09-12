import './Advokasi.css'

// Placeholder data — ganti dengan isu advokasi yang sebenarnya
const issues = [
  { id: 1, icon: '⚖️', title: 'Isu Advokasi 1', desc: 'Deskripsi singkat tentang isu advokasi pertama yang sedang diperjuangkan.' },
  { id: 2, icon: '📋', title: 'Isu Advokasi 2', desc: 'Deskripsi singkat tentang isu advokasi kedua yang sedang diperjuangkan.' },
  { id: 3, icon: '🤝', title: 'Isu Advokasi 3', desc: 'Deskripsi singkat tentang isu advokasi ketiga yang sedang diperjuangkan.' },
]

export default function Advokasi() {
  return (
    <div className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="section" id="advokasi-hero" style={{ paddingTop: 'calc(var(--space-3xl) + 1rem)' }}>
        <div className="container">
          <span className="section-label">Perjuangan Kami</span>
          <h1 className="section-title">
            <span className="gradient-text">Advokasi</span>
          </h1>
          <p className="section-subtitle">
            Isu-isu yang kami perjuangkan dan langkah-langkah yang kami ambil untuk membuat perubahan nyata.
          </p>

          {/* Isu Cards */}
          <div className="advokasi__issues" role="list">
            {issues.map(issue => (
              <div key={issue.id} className="advokasi__issue-card" role="listitem" aria-label={issue.title}>
                <div className="advokasi__issue-icon" aria-hidden="true">{issue.icon}</div>
                <h2 className="advokasi__issue-title">{issue.title}</h2>
                <p className="advokasi__issue-desc">{issue.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detail / Dokumen ── */}
      <section className="section section--alt" id="advokasi-dokumen" aria-label="Dokumen Advokasi">
        <div className="container">
          <span className="section-label">Dokumen</span>
          <h2 className="section-title">Dokumen &amp; Laporan</h2>
          <p className="section-subtitle">
            Dokumen, laporan, dan sumber daya terkait advokasi akan ditampilkan di sini.
          </p>
        </div>
      </section>

    </div>
  )
}
