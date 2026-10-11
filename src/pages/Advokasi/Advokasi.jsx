import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KATEGORI_ADVOKASI, STATUS_PELAPOR } from '../../config/kastrad'
import { submitPengaduan, generateKodeTiket } from '../../firebase/firestore'
import './Advokasi.css'

// Info alur advokasi sesuai SOP Kastrad
const alurLangkah = [
  { nomor: '01', judul: 'Pengaduan Masuk', desc: 'Mahasiswa mengisi form pengaduan tanpa login dan menerima kode kasus resmi.' },
  { nomor: '02', judul: 'Verifikasi & Klasifikasi', desc: 'KASTRAD memverifikasi kejelasan laporan, keabsahan data, dan bukti pendukung.' },
  { nomor: '03', judul: 'Kajian & Tindak Lanjut', desc: 'Penyusunan kajian masalah, koordinasi, audiensi, atau pendampingan ke pihak fakultas.' },
  { nomor: '04', judul: 'Penyelesaian & Arsip', desc: 'Penyampaian hasil advokasi kepada pelapor dan pengarsipan rekap kasus.' },
]

export default function Advokasi() {
  const formRef = useRef(null)
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    statusPelapor: '',
    kategori: '',
    pokok: '',
    kronologi: '',
    tanggalKejadian: '',
    tempat: '',
    pihakTerkait: '',
    jumlahTerdampak: '',
    dampak: '',
    harapan: '',
    linkBukti: '',
    pernyataan: false,
    honeypot: '', // Jebakan spam tersembunyi
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Tanggal hari ini format YYYY-MM-DD untuk batas maksimal input tanggal
  const todayStr = new Date().toISOString().split('T')[0]

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Hapus error spesifik saat user mulai mengetik
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
  }

  const validateForm = () => {
    const errs = {}

    // 1. Nama lengkap (Wajib, maks 100)
    const namaTrim = formData.nama.trim()
    if (!namaTrim) {
      errs.nama = 'Nama lengkap wajib diisi.'
    } else if (namaTrim.length > 100) {
      errs.nama = 'Nama lengkap maksimal 100 karakter.'
    }

    // 2. Email (Wajib, format valid)
    const emailTrim = formData.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailTrim) {
      errs.email = 'Email wajib diisi.'
    } else if (!emailRegex.test(emailTrim)) {
      errs.email = 'Format email tidak valid (contoh: nama@domain.com).'
    }

    // 3. Nomor telepon (Wajib, format Indonesia 9-15 digit)
    const rawTelepon = formData.telepon.trim().replace(/[\s-]/g, '')
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/
    if (!rawTelepon) {
      errs.telepon = 'Nomor telepon/WhatsApp wajib diisi.'
    } else if (!phoneRegex.test(rawTelepon)) {
      errs.telepon = 'Nomor telepon harus format Indonesia (08xx atau +62xx, 9–15 digit).'
    }

    // 4. Status pelapor (Wajib)
    if (!formData.statusPelapor) {
      errs.statusPelapor = 'Pilih status pelapor.'
    }

    // 5. Kategori masalah (Wajib)
    if (!formData.kategori) {
      errs.kategori = 'Pilih kategori masalah.'
    }

    // 6. Pokok permasalahan (Wajib, maks 150)
    const pokokTrim = formData.pokok.trim()
    if (!pokokTrim) {
      errs.pokok = 'Pokok permasalahan wajib diisi.'
    } else if (pokokTrim.length > 150) {
      errs.pokok = 'Pokok permasalahan maksimal 150 karakter.'
    }

    // 7. Kronologi (Wajib, min 50, maks 3000)
    const kronologiTrim = formData.kronologi.trim()
    if (!kronologiTrim) {
      errs.kronologi = 'Kronologi permasalahan wajib diisi.'
    } else if (kronologiTrim.length < 50) {
      errs.kronologi = `Kronologi permasalahan minimal 50 karakter (saat ini ${kronologiTrim.length} karakter).`
    } else if (kronologiTrim.length > 3000) {
      errs.kronologi = 'Kronologi permasalahan maksimal 3000 karakter.'
    }

    // 8. Tanggal kejadian (Opsional, tidak boleh di masa depan)
    if (formData.tanggalKejadian && formData.tanggalKejadian > todayStr) {
      errs.tanggalKejadian = 'Tanggal kejadian tidak boleh di masa depan.'
    }

    // 9. Tempat kejadian (Opsional, maks 150)
    if (formData.tempat && formData.tempat.length > 150) {
      errs.tempat = 'Tempat kejadian maksimal 150 karakter.'
    }

    // 10. Pihak yang berkaitan (Opsional, maks 300)
    if (formData.pihakTerkait && formData.pihakTerkait.length > 300) {
      errs.pihakTerkait = 'Pihak yang berkaitan maksimal 300 karakter.'
    }

    // 11. Jumlah mahasiswa terdampak (Opsional, bulat >= 1)
    if (formData.jumlahTerdampak) {
      const num = Number(formData.jumlahTerdampak)
      if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
        errs.jumlahTerdampak = 'Jumlah mahasiswa terdampak harus bilangan bulat minimal 1.'
      }
    }

    // 12. Dampak yang ditimbulkan (Opsional, maks 1000)
    if (formData.dampak && formData.dampak.length > 1000) {
      errs.dampak = 'Dampak maksimal 1000 karakter.'
    }

    // 13. Harapan penyelesaian (Opsional, maks 1000)
    if (formData.harapan && formData.harapan.length > 1000) {
      errs.harapan = 'Harapan penyelesaian maksimal 1000 karakter.'
    }

    // 14. Link bukti pendukung (Opsional, maks 5 link, http/https)
    if (formData.linkBukti.trim()) {
      const links = formData.linkBukti.split('\n').map(l => l.trim()).filter(Boolean)
      if (links.length > 5) {
        errs.linkBukti = 'Maksimal 5 link bukti pendukung.'
      } else {
        const urlRegex = /^https?:\/\/.+/i
        const invalid = links.find(l => !urlRegex.test(l))
        if (invalid) {
          errs.linkBukti = `Format link tidak valid: "${invalid}". Pastikan diawali http:// atau https://`
        }
      }
    }

    // 15. Pernyataan pelapor (Wajib dicentang)
    if (!formData.pernyataan) {
      errs.pernyataan = 'Anda wajib mencentang pernyataan kebenaran data ini.'
    }

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    // Honeypot check: jika terisi, pura-pura berhasil tanpa menyimpan ke server
    if (formData.honeypot) {
      navigate(`/advokasi/tiket/${generateKodeTiket()}`, { state: { baru: true } })
      return
    }

    const valErrors = validateForm()
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors)
      // Scroll ke error pertama
      const firstErrorKey = Object.keys(valErrors)[0]
      const el = document.getElementById(`field-${firstErrorKey}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const links = formData.linkBukti
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)

      const payload = {
        nama: formData.nama,
        email: formData.email,
        telepon: formData.telepon.trim().replace(/[\s-]/g, ''),
        statusPelapor: formData.statusPelapor,
        kategori: formData.kategori,
        pokok: formData.pokok,
        kronologi: formData.kronologi,
        tanggalKejadian: formData.tanggalKejadian,
        tempat: formData.tempat,
        pihakTerkait: formData.pihakTerkait,
        jumlahTerdampak: formData.jumlahTerdampak ? Number(formData.jumlahTerdampak) : null,
        dampak: formData.dampak,
        harapan: formData.harapan,
        linkBukti: links,
      }

      const generatedKode = await submitPengaduan(payload)
      navigate(`/advokasi/tiket/${generatedKode}`, { state: { baru: true } })
    } catch (err) {
      console.error('Gagal mengirim pengaduan:', err)
      setSubmitError('Gagal mengirim pengaduan. Pastikan koneksi internet aktif dan coba lagi.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">

      {/* ── Page Hero ── */}
      <section className="section" id="advokasi-hero" style={{ paddingTop: 'calc(var(--space-3xl) + 1rem)' }}>
        <div className="container">
          <span className="section-label">KASTRAD DEMA FST</span>
          <h1 className="section-title">
            Layanan <span className="gradient-text">Advokasi &amp; Aspirasi</span>
          </h1>
          <p className="section-subtitle">
            Kanal resmi penampungan aspirasi dan pengaduan permasalahan mahasiswa Fakultas Sains dan Teknologi.
            Didukung SOP Advokasi berlandaskan kerahasiaan, keobjektifan, dan akuntabilitas.
          </p>

          <div className="advokasi__hero-actions">
            <button onClick={scrollToForm} className="btn-primary" id="btn-ajukan-pengaduan">
              Ajukan Pengaduan Sekarang ✍️
            </button>
            <Link to="/advokasi/cek" className="btn-outline" id="btn-cek-progres">
              Cek Progres Advokasi 🔍
            </Link>
            <a href="#advokasi-alur" className="btn-outline">
              Alur Advokasi ↓
            </a>
          </div>

          {/* SOP Alur Cards */}
          <div className="advokasi__alur-grid" id="advokasi-alur">
            {alurLangkah.map(langkah => (
              <div key={langkah.nomor} className="advokasi__alur-card">
                <span className="advokasi__alur-num">{langkah.nomor}</span>
                <h3 className="advokasi__alur-title">{langkah.judul}</h3>
                <p className="advokasi__alur-desc">{langkah.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section Form Pengaduan ── */}
      <section className="section section--alt" id="form-pengaduan" ref={formRef}>
        <div className="container">
          <div className="advokasi__form-wrapper">
            {/* ── Formulir Pengaduan (UC-01) ── */}
            <div className="advokasi__form-box">
                <div className="advokasi__form-header">
                  <span className="section-label">Lampiran I SOP Advokasi</span>
                  <h2 className="advokasi__form-title">Formulir Pengaduan Mahasiswa FST</h2>
                  <p className="advokasi__form-subtitle">
                    Silakan isi formulir dengan kronologi yang jelas dan objektif. Data kontak Anda dilindungi kerahasiaannya oleh KASTRAD (Pasal 57) dan hanya digunakan untuk keperluan tindak lanjut kasus.
                  </p>
                </div>

                {submitError && (
                  <div className="advokasi__alert-error" role="alert">
                    ⚠️ {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate aria-label="Formulir Pengaduan Advokasi">

                  {/* Field Jebakan Spam (Honeypot) - Harus Kosong */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="field-honeypot">Jangan isi bidang ini</label>
                    <input
                      id="field-honeypot"
                      name="honeypot"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={handleChange}
                    />
                  </div>

                  {/* ── BAGIAN 1: IDENTITAS PELAPOR ── */}
                  <div className="advokasi__form-section-title">
                    <span>1</span> Identitas &amp; Kontak Pelapor
                  </div>

                  <div className="form-row">
                    <div className="form-group" id="field-nama">
                      <label htmlFor="adv-nama">
                        Nama Lengkap <span className="req">*</span>
                      </label>
                      <input
                        id="adv-nama"
                        name="nama"
                        type="text"
                        placeholder="Contoh: Ahmad Fauzi"
                        maxLength={100}
                        value={formData.nama}
                        onChange={handleChange}
                        className={errors.nama ? 'input-error' : ''}
                        required
                      />
                      {errors.nama && <span className="field-error-msg">{errors.nama}</span>}
                    </div>

                    <div className="form-group" id="field-email">
                      <label htmlFor="adv-email">
                        Email Aktif <span className="req">*</span>
                      </label>
                      <input
                        id="adv-email"
                        name="email"
                        type="email"
                        placeholder="nama@student.uinsgd.ac.id"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'input-error' : ''}
                        required
                      />
                      {errors.email && <span className="field-error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" id="field-telepon">
                      <label htmlFor="adv-telepon">
                        Nomor Telepon / WhatsApp <span className="req">*</span>
                      </label>
                      <input
                        id="adv-telepon"
                        name="telepon"
                        type="tel"
                        placeholder="Contoh: 081234567890 atau +628123456789"
                        value={formData.telepon}
                        onChange={handleChange}
                        className={errors.telepon ? 'input-error' : ''}
                        required
                      />
                      <span className="field-hint">Format Indonesia (08xx atau +62xx, 9–15 digit)</span>
                      {errors.telepon && <span className="field-error-msg">{errors.telepon}</span>}
                    </div>

                    <div className="form-group" id="field-statusPelapor">
                      <label htmlFor="adv-statusPelapor">
                        Status Pelapor <span className="req">*</span>
                      </label>
                      <select
                        id="adv-statusPelapor"
                        name="statusPelapor"
                        value={formData.statusPelapor}
                        onChange={handleChange}
                        className={errors.statusPelapor ? 'input-error' : ''}
                        required
                      >
                        <option value="">-- Pilih Status Pelapor --</option>
                        {STATUS_PELAPOR.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {errors.statusPelapor && <span className="field-error-msg">{errors.statusPelapor}</span>}
                    </div>
                  </div>

                  {/* ── BAGIAN 2: RINCIAN PERMASALAHAN ── */}
                  <div className="advokasi__form-section-title">
                    <span>2</span> Rincian Permasalahan
                  </div>

                  <div className="form-group" id="field-kategori">
                    <label htmlFor="adv-kategori">
                      Kategori Masalah (Pasal 3 SOP) <span className="req">*</span>
                    </label>
                    <select
                      id="adv-kategori"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleChange}
                      className={errors.kategori ? 'input-error' : ''}
                      required
                    >
                      <option value="">-- Pilih Kategori Masalah --</option>
                      {KATEGORI_ADVOKASI.map(kat => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                    {errors.kategori && <span className="field-error-msg">{errors.kategori}</span>}
                  </div>

                  <div className="form-group" id="field-pokok">
                    <div className="label-with-counter">
                      <label htmlFor="adv-pokok">
                        Pokok Permasalahan <span className="req">*</span>
                      </label>
                      <span className="char-counter">
                        {formData.pokok.length}/150
                      </span>
                    </div>
                    <input
                      id="adv-pokok"
                      name="pokok"
                      type="text"
                      placeholder="Satu kalimat ringkas tentang permasalahan yang dihadapi..."
                      maxLength={150}
                      value={formData.pokok}
                      onChange={handleChange}
                      className={errors.pokok ? 'input-error' : ''}
                      required
                    />
                    {errors.pokok && <span className="field-error-msg">{errors.pokok}</span>}
                  </div>

                  <div className="form-group" id="field-kronologi">
                    <div className="label-with-counter">
                      <label htmlFor="adv-kronologi">
                        Kronologi Permasalahan <span className="req">*</span>
                      </label>
                      <span className={`char-counter ${formData.kronologi.length < 50 ? 'counter-warning' : ''}`}>
                        {formData.kronologi.length}/3000 (min. 50)
                      </span>
                    </div>
                    <textarea
                      id="adv-kronologi"
                      name="kronologi"
                      placeholder="Uraikan alur kejadian secara runut, jelas, dan memuat fakta-fakta penting yang relevan..."
                      maxLength={3000}
                      value={formData.kronologi}
                      onChange={handleChange}
                      className={errors.kronologi ? 'input-error' : ''}
                      style={{ minHeight: 150 }}
                      required
                    />
                    {errors.kronologi && <span className="field-error-msg">{errors.kronologi}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group" id="field-tanggalKejadian">
                      <label htmlFor="adv-tanggalKejadian">
                        Tanggal Kejadian <span className="opt">(opsional)</span>
                      </label>
                      <input
                        id="adv-tanggalKejadian"
                        name="tanggalKejadian"
                        type="date"
                        max={todayStr}
                        value={formData.tanggalKejadian}
                        onChange={handleChange}
                        className={errors.tanggalKejadian ? 'input-error' : ''}
                      />
                      {errors.tanggalKejadian && <span className="field-error-msg">{errors.tanggalKejadian}</span>}
                    </div>

                    <div className="form-group" id="field-tempat">
                      <label htmlFor="adv-tempat">
                        Tempat Kejadian <span className="opt">(opsional)</span>
                      </label>
                      <input
                        id="adv-tempat"
                        name="tempat"
                        type="text"
                        placeholder="Contoh: Gedung FST Lantai 3 / Lab Komputer"
                        maxLength={150}
                        value={formData.tempat}
                        onChange={handleChange}
                        className={errors.tempat ? 'input-error' : ''}
                      />
                      {errors.tempat && <span className="field-error-msg">{errors.tempat}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" id="field-pihakTerkait">
                      <label htmlFor="adv-pihakTerkait">
                        Pihak yang Berkaitan <span className="opt">(opsional)</span>
                      </label>
                      <input
                        id="adv-pihakTerkait"
                        name="pihakTerkait"
                        type="text"
                        placeholder="Pihak dosen, staf, lembaga, atau unit kerja terkait"
                        maxLength={300}
                        value={formData.pihakTerkait}
                        onChange={handleChange}
                        className={errors.pihakTerkait ? 'input-error' : ''}
                      />
                      {errors.pihakTerkait && <span className="field-error-msg">{errors.pihakTerkait}</span>}
                    </div>

                    <div className="form-group" id="field-jumlahTerdampak">
                      <label htmlFor="adv-jumlahTerdampak">
                        Jumlah Mahasiswa Terdampak <span className="opt">(opsional)</span>
                      </label>
                      <input
                        id="adv-jumlahTerdampak"
                        name="jumlahTerdampak"
                        type="number"
                        min={1}
                        placeholder="Contoh: 1 (jika individu) atau estimasi jumlah"
                        value={formData.jumlahTerdampak}
                        onChange={handleChange}
                        className={errors.jumlahTerdampak ? 'input-error' : ''}
                      />
                      {errors.jumlahTerdampak && <span className="field-error-msg">{errors.jumlahTerdampak}</span>}
                    </div>
                  </div>

                  <div className="form-group" id="field-dampak">
                    <div className="label-with-counter">
                      <label htmlFor="adv-dampak">
                        Dampak yang Ditimbulkan <span className="opt">(opsional)</span>
                      </label>
                      <span className="char-counter">{formData.dampak.length}/1000</span>
                    </div>
                    <textarea
                      id="adv-dampak"
                      name="dampak"
                      placeholder="Jelaskan kerugian akademis, fasilitas, finansial, atau beban psikologis yang dirasakan..."
                      maxLength={1000}
                      value={formData.dampak}
                      onChange={handleChange}
                      className={errors.dampak ? 'input-error' : ''}
                      style={{ minHeight: 90 }}
                    />
                    {errors.dampak && <span className="field-error-msg">{errors.dampak}</span>}
                  </div>

                  <div className="form-group" id="field-harapan">
                    <div className="label-with-counter">
                      <label htmlFor="adv-harapan">
                        Harapan Penyelesaian <span className="opt">(opsional)</span>
                      </label>
                      <span className="char-counter">{formData.harapan.length}/1000</span>
                    </div>
                    <textarea
                      id="adv-harapan"
                      name="harapan"
                      placeholder="Solusi atau langkah konkrit yang diharapkan dari advokasi DEMA FST..."
                      maxLength={1000}
                      value={formData.harapan}
                      onChange={handleChange}
                      className={errors.harapan ? 'input-error' : ''}
                      style={{ minHeight: 90 }}
                    />
                    {errors.harapan && <span className="field-error-msg">{errors.harapan}</span>}
                  </div>

                  <div className="form-group" id="field-linkBukti">
                    <label htmlFor="adv-linkBukti">
                      Link Bukti Pendukung <span className="opt">(opsional, maks. 5 link)</span>
                    </label>
                    <textarea
                      id="adv-linkBukti"
                      name="linkBukti"
                      placeholder="Tempelkan link Google Drive, tautan dokumen, atau screenshot (satu link per baris)&#10;Contoh: https://drive.google.com/..."
                      value={formData.linkBukti}
                      onChange={handleChange}
                      className={errors.linkBukti ? 'input-error' : ''}
                      style={{ minHeight: 85 }}
                    />
                    <span className="field-hint">
                      Pastikan akses Google Drive / link dibuka menjadi &quot;Siapa saja yang memiliki link dapat melihat&quot;.
                    </span>
                    {errors.linkBukti && <span className="field-error-msg">{errors.linkBukti}</span>}
                  </div>

                  {/* ── BAGIAN 3: PERNYATAAN PELAPOR ── */}
                  <div className="form-group" id="field-pernyataan" style={{ marginTop: 'var(--space-xl)' }}>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        name="pernyataan"
                        checked={formData.pernyataan}
                        onChange={handleChange}
                        required
                      />
                      <span className="checkbox-custom" />
                      <span className="checkbox-label-text">
                        <strong>Pernyataan Pelapor (Lampiran I SOP Advokasi):</strong> Saya menyatakan
                        bahwa data dan kronologi yang saya sampaikan adalah benar dan dapat dipertanggungjawabkan
                        sesuai ketentuan yang berlaku, serta bersedia dihubungi oleh tim KASTRAD DEMA FST
                        untuk keperluan klarifikasi dan tindak lanjut advokasi.
                      </span>
                    </label>
                    {errors.pernyataan && <span className="field-error-msg">{errors.pernyataan}</span>}
                  </div>

                  {/* ── Tombol Kirim ── */}
                  <div className="advokasi__form-actions">
                    <button
                      type="submit"
                      className="btn-primary advokasi__submit-btn"
                      id="btn-kirim-pengaduan"
                      disabled={submitting}
                    >
                      {submitting ? 'Mengirimkan Pengaduan...' : 'Kirim Pengaduan Advokasi 🚀'}
                    </button>
                  </div>
                </form>
              </div>

          </div>
        </div>
      </section>

    </div>
  )
}
