import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
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
      'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 6',
      [result.insertId],
    )
    const user = rows[0]

    return res.status(201).json({ token: createToken(user.id), user: publicUser(user) })
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
    'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1',
    [normalizedEmail],
  )
  const user = rows[0]

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Email atau password salah.' })
  }

  return res.json({ token: createToken(user.id), user: publicUser(user) })
}

export async function me(req, res) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 6',
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
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, req.userId],
  )
  return res.json({ message: 'Password berhasil diperbarui.' })
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
