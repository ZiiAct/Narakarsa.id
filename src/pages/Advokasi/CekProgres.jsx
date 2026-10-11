import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getTiket, normalizeKodeTiket } from '../../firebase/firestore'
import { TAHAPAN_ADVOKASI, getTahapan } from '../../config/kastrad'
import { formatJakartaDateTime } from '../../utils/csvExport'
import './AdvokasiTiket.css'

export default function CekProgres() {
  const [searchParams, setSearchParams] = useSearchParams()
  const kodeParam = normalizeKodeTiket(searchParams.get('tiket'))

  const [input, setInput]     = useState(kodeParam)
  const [state, setState]     = useState('idle') // idle | loading | found | notfound | error
  const [tiket, setTiket]     = useState(null)
  const [inputError, setInputError] = useState('')

  // Muat otomatis jika ada ?tiket= di URL
  useEffect(() => {
    if (kodeParam.length !== 6) return
    let ignore = false
    setState('loading')
    getTiket(kodeParam)
      .then(data => {
        if (ignore) return
        setTiket(data)
        setState(data ? 'found' : 'notfound')
      })
      .catch(err => {
        if (ignore) return
        console.error('Gagal memuat tiket:', err)
        setState('error')
      })
    return () => { ignore = true }
  }, [kodeParam])

  const handleSubmit = (e) => {
    e.preventDefault()
    const kode = normalizeKodeTiket(input)
    if (kode.length !== 6) {
      setInputError('Kode tiket terdiri dari 6 karakter huruf dan angka.')
      return
    }
    setInputError('')
    setSearchParams({ tiket: kode })
  }

  const currentIdx = tiket
    ? TAHAPAN_ADVOKASI.findIndex(t => t.label === getTahapan(tiket.status).label)
    : -1

  return (
    <div className="page-wrapper">
      <section className="section tiket-page" id="cek-progres">
        <div className="container">
          <div className="cek-header">
            <span className="section-label">KASTRAD DEMA FST</span>
            <h1 className="section-title">
              Cek Progres <span className="gradient-text">Advokasi</span>
            </h1>
            <p className="section-subtitle">
              Masukkan kode tiket 6 karakter yang Anda terima setelah mengirim laporan.
            </p>
          </div>

          {/* ── Form Cek ── */}
          <form className="cek-form" onSubmit={handleSubmit} noValidate aria-label="Cek progres tiket">
            <label htmlFor="input-kode-tiket" className="visually-hidden">Kode tiket</label>
            <input
              id="input-kode-tiket"
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              maxLength={6}
              placeholder="Contoh: A7K9Q2"
              value={input}
              onChange={e => {
                setInput(normalizeKodeTiket(e.target.value).slice(0, 6))
                if (inputError) setInputError('')
              }}
              className={`cek-form__input ${inputError ? 'input-error' : ''}`}
            />
            <button type="submit" className="btn-primary cek-form__btn" id="btn-cek-tiket" disabled={state === 'loading'}>
              {state === 'loading' ? 'Memeriksa...' : 'Cek Progres'}
            </button>
          </form>
          {inputError && <p className="cek-form__error" role="alert">{inputError}</p>}

          {/* ── Hasil ── */}
          <div className="cek-result" aria-live="polite">
            {state === 'notfound' && (
              <div className="cek-message cek-message--warn">
                <strong>Tiket tidak ditemukan.</strong> Periksa kembali kode tiket Anda
                (huruf <em>O</em>/<em>I</em> dan angka <em>0</em>/<em>1</em> tidak digunakan).
              </div>
            )}

            {state === 'error' && (
              <div className="cek-message cek-message--error">
                Gagal memuat data. Pastikan koneksi internet aktif lalu coba lagi.
              </div>
            )}

            {state === 'found' && tiket && (
              <div className="cek-card">
                <div className="cek-card__head">
                  <div>
                    <span className="cek-card__meta-label">Kode Tiket</span>
                    <p className="cek-card__kode">{tiket.kodeTiket || tiket.id}</p>
                  </div>
                  <div className="cek-card__meta">
                    <div>
                      <span className="cek-card__meta-label">Kategori</span>
                      <p className="cek-card__meta-val">{tiket.kategori || '—'}</p>
                    </div>
                    <div>
                      <span className="cek-card__meta-label">Terakhir diperbarui</span>
                      <p className="cek-card__meta-val">{formatJakartaDateTime(tiket.updatedAt || tiket.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Stepper progres */}
                <ol className="progress-steps" aria-label="Tahapan advokasi">
                  {TAHAPAN_ADVOKASI.map((tahap, i) => {
                    const stepState = i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'upcoming'
                    const waktu = i <= currentIdx ? tiket.riwayat?.[tahap.key] : null
                    return (
                      <li
                        key={tahap.key}
                        className={`progress-step progress-step--${stepState}`}
                        aria-current={stepState === 'current' ? 'step' : undefined}
                      >
                        <span className="progress-step__dot" aria-hidden="true">
                          {stepState === 'done' || (stepState === 'current' && i === TAHAPAN_ADVOKASI.length - 1) ? '✓' : i + 1}
                        </span>
                        <div className="progress-step__body">
                          <p className="progress-step__title">{tahap.label}</p>
                          <p className="progress-step__desc">{tahap.desc}</p>
                          {waktu && (
                            <p className="progress-step__time">{formatJakartaDateTime(waktu)}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>

                {tiket.catatan && (
                  <div className="cek-catatan">
                    <span className="cek-catatan__label">
                      {currentIdx === TAHAPAN_ADVOKASI.length - 1 ? 'Hasil Advokasi' : 'Catatan dari KASTRAD'}
                    </span>
                    <p className="cek-catatan__text">{tiket.catatan}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="cek-footer">
            <Link to="/advokasi" className="btn-outline" id="btn-cek-kembali">← Kembali ke Advokasi</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
