import { useEffect, useState } from 'react'
import { brand, navLinks } from '../../data/content'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import ThemeToggle from './ThemeToggle'
import useAuth from '../../auth/useAuth'
import './Navbar.css'

export default function Navbar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // Tutup menu mobile dengan tombol Escape
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#home" className="navbar__logo" onClick={closeMenu}>
          <img src={brand.logo} alt={brand.name} className="navbar__logo-img" />
        </a>

        <nav
          id="primary-nav"
          className={`navbar__menu ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navigasi utama"
        >
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>{link.label}</a>
              </li>
            ))}
          </ul>
          {/* CTA di dalam menu hanya tampil di mobile */}
          <Button href={user ? '/dashboard' : '/login'} icon="arrow-up-right" size="sm" className="navbar__cta navbar__cta--mobile" onClick={closeMenu}>
            {user ? 'Dashboard' : 'Login'}
          </Button>
        </nav>

        <div className="navbar__actions">
          <ThemeToggle />
          {user && (
            <span className="navbar__session" title={`Login sebagai ${user.name}`}>
              <span className="navbar__session-avatar" aria-hidden="true">{user.name?.trim().charAt(0).toUpperCase() || 'M'}</span>
              <span className="navbar__session-copy">
                <span className="navbar__session-label">Login sebagai</span>
                <strong>{user.name}</strong>
              </span>
            </span>
          )}
          <Button href={user ? '/dashboard' : '/login'} icon="arrow-up-right" size="sm" className="navbar__cta navbar__cta--desktop">
            {user ? 'Dashboard' : 'Login'}
          </Button>
          <button
            type="button"
            className="navbar__burger"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}
