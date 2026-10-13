import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const app = express()

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

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' })
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
    : 500
  if (status === 500) console.error('Kesalahan server:', error)
  res.status(status).json({
    error: status === 500 ? 'Terjadi kesalahan pada server.' : error.message,
  })
})

export default app
