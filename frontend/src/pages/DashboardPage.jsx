import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import ThemeToggle from '../components/layout/ThemeToggle'
import PasswordInput from '../components/ui/PasswordInput'
import {
  deleteAccount as deleteAccountRequest,
  fetchPublicConfig,
  requestPasswordReset,
  updateProfile as updateProfileRequest,
} from '../services/auth'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user, token, logout, setCurrentUser } = useAuth()
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [configError, setConfigError] = useState('')
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [deletePassword, setDeletePassword] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    let active = true
    fetchPublicConfig()
      .then((config) => {
        if (active) setWhatsappUrl(config.whatsappGroupUrl || 'https://chat.whatsapp.com/LVdBfFZW3l24FqJSHHOtzb')
      })
      .catch((error) => {
        if (active) setConfigError(error.message)
      })
    return () => { active = false }
  }, [])

  const joinedAt = user.createdAt
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(user.createdAt))
    : '—'
  const initial = user.name?.trim().charAt(0).toUpperCase() || 'M'

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileError('')
    setProfileMessage('')
    setSavingProfile(true)
    try {
      const result = await updateProfileRequest(token, name.trim(), email.trim())
      setCurrentUser(result.user)
      setName(result.user.name)
      setEmail(result.user.email)
      setProfileMessage('Profil berhasil diperbarui.')
    } catch (error) {
      setProfileError(error.message)
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    setSavingPassword(true)
    try {
      const result = await requestPasswordReset(user.email)
      setPasswordMessage(result.message)
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleDeleteSubmit(event) {
    event.preventDefault()
    setDeleteError('')
    setDeletingAccount(true)
    try {
      await deleteAccountRequest(token, deletePassword)
      logout()
      window.location.replace('/')
    } catch (error) {
      setDeleteError(error.message)
      setDeletingAccount(false)
    }
  }

  return (
    <main className="member-dashboard">
      <aside className="member-sidebar">
        <Link to="/" className="member-brand" aria-label="MUDA Movement, beranda">
          <span className="member-brand__mark">M</span>
          <span>MUDA<br />Movement</span>
        </Link>

        <div className="member-menu">
          <p className="member-menu__label">Menu</p>
          <a className="member-menu__item is-active" href="#profile">◉ <span>Profil Saya</span></a>
          <p className="member-menu__label member-menu__label--home">Beranda</p>
          <Link className="member-menu__item" to="/">↗ <span>Landing Page</span></Link>
        </div>

        <div className="member-sidebar__bottom">
          <div className="member-mini-profile">
            <span className="member-avatar">{initial}</span>
            <span className="member-mini-profile__identity" title={user.name}>
              <strong>{user.name}</strong><small>Member</small>
            </span>
          </div>
          <button type="button" className="member-logout" onClick={logout}>↪ <span>Keluar</span></button>
        </div>
      </aside>

      <section className="member-main">
        <header className="member-topbar">
          <strong>Dashboard</strong>
          <ThemeToggle />
        </header>

        <div className="member-content">
          <p className="member-eyebrow">Dashboard</p>
          <h1>Profil Saya</h1>
          <p className="member-lead">Selamat datang di ruang member MUDA Movement.</p>

          <div className="member-cards" id="profile">
            <section className="member-card member-card--profile">
              <div className="member-card__heading">
                <span className="member-avatar member-avatar--large">{initial}</span>
                <div className="member-card__identity">
                  <p className="member-eyebrow">Informasi akun</p>
                  <h2 title={user.name}>{user.name}</h2>
                </div>
              </div>
              <p className="member-joined">Member sejak {joinedAt}</p>
              <form className="member-form" onSubmit={handleProfileSubmit}>
                <label htmlFor="profile-name">Nama lengkap</label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={120}
                  required
                />
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  required
                />
                {profileError && <p className="member-form-message is-error" role="alert">{profileError}</p>}
                {profileMessage && <p className="member-form-message is-success" role="status">{profileMessage}</p>}
                <button className="member-action-button" type="submit" disabled={savingProfile}>
                  {savingProfile ? 'Menyimpan...' : 'Simpan profil'}
                </button>
              </form>
            </section>

            <section className="member-card member-card--password">
              <p className="member-eyebrow">Keamanan</p>
              <h2>Ubah password</h2>
              <p className="member-security-help">
                Kami akan mengirim tautan reset sekali pakai ke <strong>{user.email}</strong>. Anda tidak perlu mengingat password lama.
              </p>
              <form className="member-form" onSubmit={handlePasswordSubmit}>
                {passwordError && <p className="member-form-message is-error" role="alert">{passwordError}</p>}
                {passwordMessage && <p className="member-form-message is-success" role="status">{passwordMessage}</p>}
                <button className="member-action-button" type="submit" disabled={savingPassword}>
                  {savingPassword ? 'Mengirim tautan...' : 'Kirim tautan reset'}
                </button>
              </form>
            </section>

            <section className="member-card member-card--about">
              <p className="member-eyebrow">Learning · Developing · Empowering</p>
              <h2>Bertumbuh dan berdampak bersama.</h2>
              <p>
                MUDA Movement adalah ruang bagi anak muda untuk belajar, mengembangkan potensi,
                dan berkolaborasi menciptakan dampak positif.
              </p>
              <Link className="member-text-link" to="/">Kenali program kami <span aria-hidden="true">→</span></Link>
            </section>

            <section className="member-card member-card--about">
              <p className="member-eyebrow">Tentang Kami</p>
              <h2>Mengenal Muda Movement lebih dekat</h2>
              <p>
                Muda Movement adalah platform inovasi pemuda Indonesia yang membantu anak muda menemukan versi terbaik dirinya.
              </p>
              <Link className="member-text-link" to="/">Kenali lebih dalam <span aria-hidden="true">→</span></Link>
            </section>

            <section className="member-card member-card--whatsapp">
              <div>
                <p className="member-eyebrow">Terhubung dengan komunitas</p>
                <h2>Gabung grup WhatsApp</h2>
                <p>Dapatkan kabar program, kesempatan belajar, dan informasi komunitas MUDA Movement.</p>
              </div>
              {whatsappUrl
                ? <a className="member-whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Join WhatsApp Group <span aria-hidden="true">↗</span></a>
                : <p className="member-config-message">{configError || 'Tautan grup belum tersedia. Silakan hubungi admin MUDA Movement.'}</p>}
            </section>

            <section className="member-card member-card--danger">
              <div>
                <p className="member-eyebrow">Zona berbahaya</p>
                <h2>Hapus akun</h2>
                <p>Penghapusan akun bersifat permanen dan Anda akan keluar dari dashboard.</p>
              </div>
              <form className="member-form" onSubmit={handleDeleteSubmit}>
                <label htmlFor="delete-password">Konfirmasi dengan password Anda</label>
                <PasswordInput
                  id="delete-password"
                  autoComplete="current-password"
                  aria-label="Konfirmasi password Anda"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  maxLength={72}
                  required
                />
                {deleteError && <p className="member-form-message is-error" role="alert">{deleteError}</p>}
                <button className="member-delete-button" type="submit" disabled={deletingAccount}>
                  {deletingAccount ? 'Menghapus akun...' : 'Hapus akun saya'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
