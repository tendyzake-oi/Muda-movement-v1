import mysql from 'mysql2/promise'

let pool

function getPool() {
  if (pool) return pool

  const requiredDatabaseVariables = ['DB_HOST', 'DB_USER', 'DB_NAME']
  const missingVariables = requiredDatabaseVariables.filter((name) => !process.env[name])
  if (process.env.DB_PASSWORD === undefined) missingVariables.push('DB_PASSWORD')

  if (missingVariables.length > 0) {
    const error = new Error(`Environment database belum lengkap: ${missingVariables.join(', ')}.`)
    error.code = 'DB_CONFIGURATION'
    throw error
  }

  const port = Number(process.env.DB_PORT || 3306)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    const error = new Error('DB_PORT harus berupa nomor port yang valid.')
    error.code = 'DB_CONFIGURATION'
    throw error
  }

  const sslSetting = process.env.DB_SSL || 'true'
  if (!['true', 'false'].includes(sslSetting)) {
    const error = new Error('DB_SSL harus bernilai true atau false.')
    error.code = 'DB_CONFIGURATION'
    throw error
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
    ssl: sslSetting === 'true' ? { rejectUnauthorized: true } : undefined,
  })

  return pool
}

const database = {
  execute(...args) {
    return getPool().execute(...args)
  },
  query(...args) {
    return getPool().query(...args)
  },
  end() {
    return pool ? pool.end() : Promise.resolve()
  },
}

export default database
