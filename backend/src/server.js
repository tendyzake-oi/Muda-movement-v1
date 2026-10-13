import 'dotenv/config'
import app from './app.js'
import pool from './config/database.js'

const port = Number(process.env.PORT || 3001)
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET wajib diisi dengan minimal 32 karakter.')
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT harus berupa nomor port yang valid.')
}

try {
  await pool.query('SELECT 1')
} catch (error) {
  console.error(`Koneksi database gagal (${error.code || 'UNKNOWN'}): ${error.message}`)
  await pool.end()
  process.exit(1)
}

const server = app.listen(port, () => {
  console.info(`Backend MUDA Movement berjalan pada port ${port}.`)
})

async function shutdown(signal) {
  console.info(`Menerima ${signal}; menutup server...`)
  server.close(async (error) => {
    if (error) {
      console.error('Gagal menutup server dengan baik:', error)
      process.exitCode = 1
    }
    await pool.end()
  })
}

process.on('SIGINT', () => { void shutdown('SIGINT') })
process.on('SIGTERM', () => { void shutdown('SIGTERM') })
