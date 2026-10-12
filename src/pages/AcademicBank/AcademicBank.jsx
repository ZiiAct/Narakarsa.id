import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Aturan Navigasi:
 * Akses ke halaman utama Academic Resource Bank dinonaktifkan.
 * Pengguna dialihkan (redirect) ke halaman alternatif yang serupa (D-Update)
 * dengan pesan pemberitahuan: "Halaman ini masih dalam proses pengembangan."
 */
export default function AcademicBank() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/d-update?from=academic-bank', {
      replace: true,
      state: { notice: 'Halaman ini masih dalam proses pengembangan.' },
    })
  }, [navigate])

  return (
    <div className="page-wrapper" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Halaman ini masih dalam proses pengembangan. Mengalihkan ke D-Update...
        </p>
      </div>
    </div>
  )
}
