import { Router } from 'express'
import {
  deleteAccount,
  login,
  me,
  register,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  updateProfile,
} from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { rateLimit } from 'express-rate-limit'

const router = Router()
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ error: 'Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.' }),
})

router.post('/register', register)
router.post('/login', login)
router.post('/password-reset/request', passwordResetLimiter, requestPasswordReset)
router.post('/password-reset/confirm', passwordResetLimiter, resetPassword)
router.get('/me', authMiddleware, me)
router.patch('/me', authMiddleware, updateProfile)
router.patch('/me/password', authMiddleware, updatePassword)
router.delete('/me', authMiddleware, deleteAccount)

export default router
