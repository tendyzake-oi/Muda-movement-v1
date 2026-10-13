import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import { requestPasswordReset } from '../services/auth'
import PasswordInput from '../components/ui/PasswordInput'
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
  const [resetNotice, setResetNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isRegistering = mode === 'register'
  const isForgotPassword = mode === 'forgot'

  if (loading) return <main className="auth-state" role="status">Memeriksa sesi Anda...</main>
  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isForgotPassword) {
        const result = await requestPasswordReset(email.trim())
        setResetNotice(result.message)
      } else if (isRegistering) {
        await register(name.trim(), email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      if (!isForgotPassword) navigate(destination, { replace: true })
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
          <h1>
            {isForgotPassword
              ? 'Lupa Password?'
              : isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}
          </h1>
          <p className="login-subtitle">
            {isForgotPassword
              ? 'Masukkan email akun Anda. Kami akan mengirim tautan untuk mengatur ulang password.'
              : isRegistering
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

            {!isForgotPassword && (
              <>
                <label htmlFor="login-password">Password</label>
                <PasswordInput
                  id="login-password"
                  name="password"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  placeholder={isRegistering ? 'Minimal 8 karakter' : 'Masukkan password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={isRegistering ? 8 : undefined}
                  maxLength={72}
                  required
                />
              </>
            )}

            {error && <p className="login-error" role="alert">{error}</p>}
            {resetNotice && <p className="login-success" role="status">{resetNotice}</p>}
            <button className="login-submit" type="submit" disabled={submitting}>
              {submitting ? 'Memproses...' : isForgotPassword
                ? 'Kirim tautan reset'
                : isRegistering ? 'Daftar dan masuk' : 'Masuk ke dashboard'}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-help">
            {isForgotPassword ? (
              <>
                Ingat password?{' '}
                <button
                  className="login-mode-toggle"
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setResetNotice('')
                  }}
                >
                  Kembali ke login
                </button>
              </>
            ) : isRegistering ? (
              <>
                Sudah punya akun?{' '}
                <button
                  className="login-mode-toggle"
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setResetNotice('')
                  }}
                >
                  Masuk di sini
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-mode-toggle"
                  type="button"
                  onClick={() => {
                    setMode('forgot')
                    setError('')
                    setResetNotice('')
                  }}
                >
                  Lupa password?
                </button>
                <span aria-hidden="true"> · </span>
                Belum punya akun?{' '}
                <button
                  className="login-mode-toggle"
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError('')
                    setResetNotice('')
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
