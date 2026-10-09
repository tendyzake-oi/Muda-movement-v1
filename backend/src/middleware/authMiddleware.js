import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
  const authorization = req.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token autentikasi diperlukan.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'muda-movement',
    })
    if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
      return res.status(401).json({ error: 'Token autentikasi tidak valid.' })
    }
    req.userId = payload.sub
    return next()
  } catch {
    return res.status(401).json({ error: 'Sesi tidak valid atau sudah kedaluwarsa. Silakan masuk kembali.' })
  }
}
