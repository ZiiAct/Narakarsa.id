import { useState } from 'react'
import { submitMessage } from '../../firebase/firestore'
import './Kontak.css'


export default function Kontak() {
  const [form, setForm] = useState({ nama: '', email: '', subjek: '', pesan: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      await submitMessage(form)
      setSubmitted(true)
      setForm({ nama: '', email: '', subjek: '', pesan: '' })
    } catch (err) {
      console.error('Gagal mengirim pesan:', err)
      setError('Gagal mengirim pesan. Pastikan koneksi internet kamu aktif dan coba lagi.')
    } finally {
      setSending(false)
    }
  }


  return (
    <div className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="section" id="kontak-hero" style={{ paddingTop: 'calc(var(--space-3xl) + 1rem)' }}>
        <div className="container">
          <span className="section-label">Hubungi Kami</span>
          <h1 className="section-title">
            <span className="gradient-text">Kontak</span>
          </h1>
          <p className="section-subtitle">
            Ada pertanyaan atau ingin berkolaborasi? Kami siap mendengar dari Anda.
          </p>

          <div className="kontak__layout">
            {/* ── Info Column ── */}
            <div>
              {[
                { icon: '📧', label: 'Email', value: 'demafst@uinsgd.ac.id' },
                { icon: '📞', label: 'Telepon', value: '+62878-2635-1728' },
                { icon: '📍', label: 'Alamat', value: 'Bandung, Indonesia' },
                { icon: '🕐', label: 'Jam Aktif', value: 'Senin–Jumat, 09.00–17.00 WIB' },
              ].map(item => (
                <div key={item.label} className="kontak__info-item">
                  <span className="kontak__info-icon" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="kontak__info-label">{item.label}</p>
                    <p className="kontak__info-value">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Contact Form ── */}
            <div className="kontak__form">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
                  <p style={{ fontSize: '3rem' }}>✅</p>
                  <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: 'var(--space-md)' }}>
                    Pesan Terkirim!
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                    Terima kasih, kami akan segera menghubungi Anda.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="kontak__form-title">Kirim Pesan</h2>
                  <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="kontak-nama">Nama Lengkap</label>
                        <input
                          id="kontak-nama"
                          name="nama"
                          type="text"
                          placeholder="Nama Anda"
                          value={form.nama}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="kontak-email">Email</label>
                        <input
                          id="kontak-email"
                          name="email"
                          type="email"
                          placeholder="email@contoh.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="kontak-subjek">Subjek</label>
                      <input
                        id="kontak-subjek"
                        name="subjek"
                        type="text"
                        placeholder="Subjek pesan Anda"
                        value={form.subjek}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="kontak-pesan">Pesan</label>
                      <textarea
                        id="kontak-pesan"
                        name="pesan"
                        placeholder="Tulis pesan Anda di sini..."
                        value={form.pesan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {error && (
                      <p role="alert" style={{ color: '#f87171', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                        ⚠️ {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="kontak__submit"
                      id="kontak-submit"
                      disabled={sending}
                      style={{ opacity: sending ? 0.7 : 1 }}
                    >
                      {sending ? 'Mengirim...' : 'Kirim Pesan →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
