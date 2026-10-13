import mysql from 'mysql2/promise'

let mysqlPool

function databaseError(message, code) {
  const error = new Error(message)
  error.code = code
  return error
}

function getPool() {
  if (mysqlPool) return mysqlPool

  const requiredDatabaseVariables = ['DB_HOST', 'DB_USER', 'DB_NAME']
  const missingVariables = requiredDatabaseVariables.filter((name) => !process.env[name]?.trim())
  if (process.env.DB_PASSWORD === undefined) missingVariables.push('DB_PASSWORD')

  if (missingVariables.length > 0) {
    throw databaseError(
      `Environment database belum lengkap: ${missingVariables.join(', ')}.`,
      'DATABASE_CONFIG_ERROR',
    )
  }

  const port = Number(process.env.DB_PORT || 3306)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw databaseError('DB_PORT harus berupa nomor port yang valid.', 'DATABASE_CONFIG_ERROR')
  }

  const sslSetting = process.env.DB_SSL || 'false'
  if (!['true', 'false'].includes(sslSetting)) {
    throw databaseError('DB_SSL harus bernilai true atau false.', 'DATABASE_CONFIG_ERROR')
  }
  if (process.env.NODE_ENV === 'production' && sslSetting !== 'true') {
    throw databaseError(
      'DB_SSL=true wajib digunakan saat NODE_ENV=production.',
      'DATABASE_CONFIG_ERROR',
    )
  }

  const ssl = sslSetting === 'true'
    ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
        ...(process.env.DB_SSL_CA
          ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') }
          : {}),
      }
    : undefined

  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl,
  })

  return mysqlPool
}

const pool = {
  execute(...args) {
    return getPool().execute(...args)
  },
  getConnection() {
    return getPool().getConnection()
  },
  query(...args) {
    return getPool().query(...args)
  },
  end() {
    return mysqlPool?.end() ?? Promise.resolve()
  },
}

export async function checkDatabaseConnection() {
  const database = getPool()
  await database.query('SELECT 1')

  const [rows] = await database.execute(
    `SELECT TABLE_NAME
     FROM information_schema.tables
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME IN ('users', 'password_reset_tokens')`,
  )
  const existingTables = new Set(rows.map((row) => row.TABLE_NAME))
  const missingTables = ['users', 'password_reset_tokens']
    .filter((table) => !existingTables.has(table))

  if (missingTables.length > 0) {
    throw databaseError(
      `Tabel database belum tersedia: ${missingTables.join(', ')}. Jalankan backend/sql/setup.sql.`,
      'DATABASE_SCHEMA_ERROR',
    )
  }
}

export default pool
