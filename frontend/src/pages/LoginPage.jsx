import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import './LoginPage.css'

const benefits = [
  'Terhubung dengan ekosistem pemuda Indonesia',
  'Ruang belajar dan pengembangan diri',
  'Kolaborasi untuk menciptakan dampak',
]

export default function LoginPage() {
  const { user, loading, login, register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isRegistering = mode === 'register'

  if (loading) return <main className="auth-state" role="status">Memeriksa sesi Anda...</main>
  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isRegistering) {
        await register(name.trim(), email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const destination = location.state?.from?.pathname === '/dashboard'
    ? location.state.from.pathname
    : '/dashboard'

  return (
    <main className="login-page">
      <section className="login-intro" aria-label="Tentang MUDA Movement">
        <Link to="/" className="login-brand">MUDA <span>Movement</span></Link>
        <div className="login-intro__content">
          <p className="login-eyebrow">Learning · Developing · Empowering</p>
          <blockquote>
            Muda Movement membantu anak muda menemukan versi terbaiknya melalui ruang belajar,
            pengembangan diri, dan kolaborasi yang berdampak.
          </blockquote>
          <ul>
            {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </div>
        <span className="login-intro__ring" aria-hidden="true" />
      </section>

      <section className="login-panel">
        <Link to="/" className="login-back">← Kembali ke beranda</Link>
        <div className="login-form-wrap">
          <p className="login-eyebrow login-eyebrow--blue">Dashboard member</p>
          <h1>{isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}</h1>
          <p className="login-subtitle">
            {isRegistering
              ? 'Buat akun member MUDA Movement dan langsung masuk ke dashboard.'
              : 'Masuk untuk mengelola akun Anda di Muda Movement.'}
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <label htmlFor="register-name">Nama lengkap</label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={120}
                  required
                />
              </>
            )}
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              placeholder={isRegistering ? 'Minimal 8 karakter' : 'Masukkan password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={isRegistering ? 8 : undefined}
              maxLength={72}
              required
            />

            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit" disabled={submitting}>
              {submitting
                ? 'Memproses...'
                : isRegistering ? 'Daftar dan masuk' : 'Masuk ke dashboard'}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          {/* Ganti bagian pesan help & toggle mode dengan ini */}
          <p className="login-help">
            {isRegistering ? (
            <>
              Sudah punya akun?{' '}
                <button
                  className="login-mode-toggle"
                  type="button"
                  onClick={() => {
                  setMode('login')
                  setError('')
                  }}
                >
                Masuk di sini
                </button>
              </>
              ) : (
              <>
              Belum punya akun?{' '}
                <button
                className="login-mode-toggle"
                type="button"
                onClick={() => {
                setMode('register')
                setError('')
                }}
                >
                Daftar di sini
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  )
}
