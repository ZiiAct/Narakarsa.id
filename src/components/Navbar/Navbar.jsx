import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logoDema       from '../../assets/DEMAFST.png'
import logoNarakarsa  from '../../assets/Narakarsa.png'
import logoKominfo    from '../../assets/Kominfo.png'
import './Navbar.css'

const navItems = [
  { label: 'Home',          to: '/'              },
  { label: 'Profil',        to: '/profil'        },
  { label: 'D-Update',      to: '/d-update'      },
  { label: 'Advokasi',      to: '/advokasi'      },
  { label: 'Academic Bank', to: '/academic-bank' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <div className="navbar__logo-images">
            <img src={logoDema}      alt="DEMA FST" className="navbar__logo-img" />
            <img src={logoNarakarsa} alt="Narakarsa" className="navbar__logo-img" />
            <img src={logoKominfo}   alt="Kominfo" className="navbar__logo-img" />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-line1">DEMA FST</span>
            <span className="navbar__logo-line2">KABINET NARAKARSA</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links" role="list">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link to="/kontak" className="navbar__cta" id="navbar-cta">
          Hubungi Kami
        </Link>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          id="navbar-hamburger"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <ul className={`navbar__mobile ${menuOpen ? 'open' : ''}`} role="list">
        {navItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
