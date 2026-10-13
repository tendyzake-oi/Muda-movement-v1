import bcrypt from 'bcrypt'
import { createHash, randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import pool from '../config/database.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    role: row.role || 'user', // Gunakan row.role dari DB agar dinamis
    createdAt: row.created_at,
  }
}

function createToken(userId, sessionVersion = 0) {
  return jwt.sign({ sessionVersion }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: String(userId),
    issuer: 'muda-movement',
    expiresIn: '8h',
  })
}

function validateName(name) {
  return typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 120
}

function validateEmail(email) {
  return typeof email === 'string'
    && email.trim().length <= 254
    && emailPattern.test(email.trim().toLowerCase())
}

function validatePassword(password) {
  return typeof password === 'string'
    && password.length >= 8
    && Buffer.byteLength(password, 'utf8') <= 72
}

function isDuplicateEmail(error) {
  return error.code === 'ER_DUP_ENTRY'
}

function createMailTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD } = process.env
  const port = Number(SMTP_PORT)
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Konfigurasi SMTP belum lengkap atau tidak valid.')
  }
  if (SMTP_SECURE !== 'true' && SMTP_SECURE !== 'false') {
    throw new Error('SMTP_SECURE harus bernilai true atau false.')
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  })
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body ?? {}
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [normalizedEmail],
  )

  if (rows[0]) {
    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const frontendUrl = process.env.FRONTEND_URL
    if (!frontendUrl) throw new Error('FRONTEND_URL belum dikonfigurasi.')
    const resetUrl = new URL('/reset-password', frontendUrl)
    resetUrl.searchParams.set('token', token)

    await pool.execute(
      `INSERT INTO password_reset_tokens (token_hash, user_id, expires_at)
       VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))
       ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), expires_at = VALUES(expires_at)`,
      [tokenHash, rows[0].id],
    )

    try {
      await createMailTransport().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: normalizedEmail,
        subject: 'Atur ulang password MUDA Movement',
        text: `Gunakan tautan berikut untuk mengatur ulang password akun MUDA Movement Anda. Tautan berlaku selama 30 menit dan hanya dapat digunakan sekali:\n\n${resetUrl}\n\nJika Anda tidak meminta pengaturan ulang password, abaikan email ini.`,
      })
    } catch (error) {
      await pool.execute('DELETE FROM password_reset_tokens WHERE token_hash = ?', [tokenHash])
      throw error
    }
  }

  return res.json({
    message: 'Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim ke email tersebut.',
  })
}

export async function resetPassword(req, res) {
  const { token, password } = req.body ?? {}
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({ error: 'Tautan reset tidak valid atau sudah kedaluwarsa.' })
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password baru harus minimal 8 karakter dan maksimal 72 byte.' })
  }

  const tokenHash = createHash('sha256').update(token).digest('hex')
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [rows] = await connection.execute(
      'SELECT user_id FROM password_reset_tokens WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP() FOR UPDATE',
      [tokenHash],
    )
    if (!rows[0]) {
      await connection.rollback()
      return res.status(400).json({ error: 'Tautan reset tidak valid atau sudah kedaluwarsa.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await connection.execute(
      'UPDATE users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?',
      [passwordHash, rows[0].user_id],
    )
    await connection.execute('DELETE FROM password_reset_tokens WHERE user_id = ?', [rows[0].user_id])
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }

  return res.json({ message: 'Password berhasil diatur ulang. Silakan masuk dengan password baru.' })
}

export async function register(req, res) {
  const { name, email, password } = req.body ?? {}

  if (!validateName(name)) {
    return res.status(400).json({ error: 'Nama wajib diisi dan maksimal 120 karakter.' })
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' })
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password harus minimal 8 karakter dan maksimal 72 byte.' })
  }

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(password, 12)
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), normalizedEmail, passwordHash],
    )
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at, session_version FROM users WHERE id = ? LIMIT 1',
      [result.insertId],
    )
    const user = rows[0]

    return res.status(201).json({
      token: createToken(user.id, user.session_version),
      user: publicUser(user),
    })
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return res.status(409).json({ error: 'Email sudah terdaftar. Silakan masuk atau gunakan email lain.' })
    }
    throw error
  }
}

export async function login(req, res) {
  const { email, password } = req.body ?? {}

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Format email tidak valid.' })
  }
  if (!password || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password wajib diisi dan maksimal 72 byte.' })
  }

  const [rows] = await pool.execute(
    'SELECT id, name, email, password_hash, role, created_at, session_version FROM users WHERE email = ? LIMIT 1',
    [normalizedEmail],
  )
  const user = rows[0]

  if (!user) {
    return res.status(404).json({ error: 'Akun tidak ditemukan. Email ini belum terdaftar. Silakan daftar terlebih dahulu.' })
  }
  if (!(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Password salah. Silakan coba lagi atau gunakan fitur lupa password.' })
  }

  return res.json({
    token: createToken(user.id, user.session_version),
    user: publicUser(user),
  })
}

export async function me(req, res) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    [req.userId],
  )

  if (!rows[0]) {
    return res.status(401).json({ error: 'Sesi tidak lagi valid. Silakan masuk kembali.' })
  }

  return res.json({ user: publicUser(rows[0]) })
}

export async function updateProfile(req, res) {
  const { name, email } = req.body ?? {}
  if (!validateName(name)) {
    return res.status(400).json({ error: 'Nama wajib diisi dan maksimal 120 karakter.' })
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' })
  }

  try {
    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name.trim(), email.trim().toLowerCase(), req.userId],
    )
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return res.status(409).json({ error: 'Email sudah digunakan akun lain.' })
    }
    throw error
  }

  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    [req.userId],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Akun tidak ditemukan.' })
  return res.json({ user: publicUser(rows[0]) })
}

export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body ?? {}
  if (
    typeof currentPassword !== 'string'
    || !currentPassword
    || Buffer.byteLength(currentPassword, 'utf8') > 72
  ) {
    return res.status(400).json({ error: 'Password saat ini wajib diisi.' })
  }
  if (!validatePassword(newPassword)) {
    return res.status(400).json({ error: 'Password baru harus minimal 8 karakter dan maksimal 72 byte.' })
  }

  const [rows] = await pool.execute(
    'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
    [req.userId],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Akun tidak ditemukan.' })
  if (!(await bcrypt.compare(currentPassword, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Password saat ini salah.' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await pool.execute(
    'UPDATE users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?',
    [passwordHash, req.userId],
  )
  return res.json({ message: 'Password berhasil diperbarui. Silakan masuk kembali.' })
}

export async function deleteAccount(req, res) {
  const { password } = req.body ?? {}
  if (typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password wajib diisi untuk menghapus akun.' })
  }

  const [rows] = await pool.execute(
    'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
    [req.userId],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Akun tidak ditemukan.' })
  if (!(await bcrypt.compare(password, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Password salah. Akun tidak dihapus.' })
  }

  await pool.execute('DELETE FROM users WHERE id = ?', [req.userId])
  return res.status(204).end()
}
