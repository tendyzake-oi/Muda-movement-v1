import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/auth'
import PasswordInput from '../components/ui/PasswordInput'
import './LoginPage.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.')
      return
    }

    setSubmitting(true)
    try {
      const result = await resetPassword(token, password)
      setMessage(result.message)
    } catch (resetError) {
      setError(resetError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro" aria-label="Tentang MUDA Movement">
        <Link to="/" className="login-brand">MUDA <span>Movement</span></Link>
        <div className="login-intro__content">
          <p className="login-eyebrow">Keamanan akun</p>
          <blockquote>
            Atur password baru melalui tautan aman yang dikirim ke email akun Anda.
          </blockquote>
        </div>
        <span className="login-intro__ring" aria-hidden="true" />
      </section>

      <section className="login-panel">
        <Link to="/login" className="login-back">← Kembali ke login</Link>
        <div className="login-form-wrap">
          <p className="login-eyebrow login-eyebrow--blue">Dashboard member</p>
          <h1>Password Baru</h1>
          <p className="login-subtitle">
            Tautan reset berlaku selama 30 menit dan hanya dapat digunakan sekali.
          </p>

          {message ? (
            <div className="login-form">
              <p className="login-success" role="status">{message}</p>
              <Link className="login-submit login-submit--link" to="/login">
                Masuk ke akun <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : token ? (
            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="reset-password">Password baru</label>
              <PasswordInput
                id="reset-password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                maxLength={72}
                required
              />
              <label htmlFor="confirm-reset-password">Konfirmasi password baru</label>
              <PasswordInput
                id="confirm-reset-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                maxLength={72}
                required
              />
              {error && <p className="login-error" role="alert">{error}</p>}
              <button className="login-submit" type="submit" disabled={submitting}>
                {submitting ? 'Memproses...' : 'Simpan password baru'}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <div className="login-form">
              <p className="login-error" role="alert">
                Token reset tidak ditemukan. Minta tautan baru dari halaman login.
              </p>
              <Link className="login-submit login-submit--link" to="/login">
                Minta tautan baru <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
