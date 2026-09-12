import { Link } from 'react-router-dom'
import logoDema      from '../../assets/DEMAFST.png'
import logoNarakarsa from '../../assets/Narakarsa.png'
import logoKominfo   from '../../assets/Kominfo.png'
import './Footer.css'

const navLinks = [
  { label: 'Home',          to: '/'              },
  { label: 'Profil',        to: '/profil'        },
  { label: 'D-Update',      to: '/d-update'      },
  { label: 'Advokasi',      to: '/advokasi'      },
  { label: 'Academic Bank', to: '/academic-bank' },
  { label: 'Hubungi Kami',  to: '/kontak'        },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brand-logos">
              <img src={logoDema}      alt="DEMA FST" className="footer__brand-logo-img" />
              <img src={logoNarakarsa} alt="Narakarsa" className="footer__brand-logo-img footer__brand-logo-img--kabinet" />
              <img src={logoKominfo}   alt="Kominfo" className="footer__brand-logo-img" />
            </div>
            <div className="footer__brand-name">
              <span className="footer__brand-line1">DEMA FST</span>
              <span className="footer__brand-line2">Kabinet Narakarsa 2026/2027</span>
            </div>
            <p className="footer__brand-desc">
              Pusat pelayanan, advokasi, dan pergerakan mahasiswa Fakultas Sains dan
              Teknologi yang responsif, transparan, dan berbasis data.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="footer__col-title">Navigasi</p>
            <ul className="footer__links" role="list">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="footer__col-title">Kontak</p>
            <ul className="footer__links" role="list">
              <li><span className="footer__link">demafst@kampus.ac.id</span></li>
              <li><span className="footer__link">@demafst_narakarsa</span></li>
              <li><span className="footer__link">Gedung FST, Kampus UIN SGD Bandung</span></li>
            </ul>
          </div>

        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} DEMA FST Kabinet Narakarsa. All rights reserved.
          </p>
          <p className="footer__copy">
            Fakultas Sains dan Teknologi — UIN SGD Bandung
          </p>
        </div>
      </div>
    </footer>
  )
}
