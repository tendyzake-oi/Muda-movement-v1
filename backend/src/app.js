import cors from 'cors'
import express from 'express'
import { checkDatabaseConnection } from './config/database.js'
import authRoutes from './routes/authRoutes.js'

const allowedOrigins = (
  process.env.CORS_ORIGIN
  || 'https://muda-movement-v1.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const app = express()

function logServerError(prefix, error) {
  const code = typeof error?.code === 'string' ? error.code : error?.name || 'UNKNOWN'
  let message = typeof error?.message === 'string' ? error.message : ''

  for (const name of ['DB_PASSWORD', 'JWT_SECRET', 'SMTP_PASSWORD']) {
    const secret = process.env[name]
    if (secret) message = message.replaceAll(secret, '[REDACTED]')
  }

  console.error(`${prefix} (${code})${message ? `: ${message}` : '.'}`)
}

function isDatabaseError(error) {
  const code = typeof error?.code === 'string' ? error.code : ''
  return code === 'DATABASE_CONFIG_ERROR'
    || code === 'DATABASE_SCHEMA_ERROR'
    || code === 'ER_ACCESS_DENIED_ERROR'
    || code === 'ER_BAD_DB_ERROR'
    || code === 'ER_NO_SUCH_TABLE'
    || code.startsWith('PROTOCOL_')
    || ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENETUNREACH', 'ENOTFOUND'].includes(code)
}

export function classifyDatabaseFailure(error) {
  const code = typeof error?.code === 'string' ? error.code : ''
  const message = typeof error?.message === 'string' ? error.message : ''

  if (code === 'DATABASE_CONFIG_ERROR') return 'configuration'
  if (code === 'DATABASE_SCHEMA_ERROR' || code === 'ER_NO_SUCH_TABLE') return 'schema'
  if (code === 'ER_ACCESS_DENIED_ERROR') return 'credentials'
  if (code === 'ER_BAD_DB_ERROR') return 'database-name'
  if (['ENOTFOUND', 'EAI_AGAIN'].includes(code)) return 'dns'
  if (['ETIMEDOUT', 'PROTOCOL_SEQUENCE_TIMEOUT'].includes(code)) return 'network-timeout'
  if (['ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH'].includes(code)) {
    return 'network-access'
  }
  if (/TLS|SSL|CERT/i.test(code) || /TLS|SSL|certificate/i.test(message)) return 'tls'
  if (code.startsWith('PROTOCOL_')) return 'protocol'
  return 'unknown'
}

app.disable('x-powered-by')
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    const error = new Error('Origin tidak diizinkan.')
    error.status = 403
    return callback(error)
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '10kb' }))

app.get(['/healthz', '/api/healthz'], (_req, res) => {
  res.json({ status: 'ok' })
})

app.get(['/healthz/database', '/api/healthz/database'], async (_req, res) => {
  try {
    await checkDatabaseConnection()
    return res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    logServerError('Pemeriksaan database gagal', error)
    return res.status(503).json({
      status: 'error',
      database: 'unavailable',
      reason: classifyDatabaseFailure(error),
    })
  }
})

app.get('/api/config', (_req, res) => {
  res.json({ whatsappGroupUrl: process.env.WHATSAPP_GROUP_URL?.trim() || null })
})

app.use('/api/auth', authRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' })
})

app.use((error, _req, res, _next) => {
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
    ? error.status
    : isDatabaseError(error) ? 503 : 500
  if (status === 500) logServerError('Kesalahan server', error)
  if (status === 503) logServerError('Database tidak tersedia', error)
  res.status(status).json({
    error: status === 503
      ? 'Database belum tersedia. Periksa konfigurasi dan koneksi database backend.'
      : status === 500 ? 'Terjadi kesalahan pada server.' : error.message,
  })
})

export default app
