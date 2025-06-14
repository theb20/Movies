import express from "express"
import {
  getAllUser,
  createUser,
  login,
  getMe,
  logout,
  deleteUser,
  updateUser,
  sendResetCode,
  verifyResetCode,
  resetPassword
} from "../Controllers/userController.js"
import { verifyToken, authorizeRole } from '../Middlewares/authMiddleware.js'

const router = express.Router()

// Routes protégées
router.get('/user', verifyToken, getAllUser)
router.get('/user/me', verifyToken, getMe)
router.put('/user/:id', verifyToken,authorizeRole('admin'), updateUser)
router.delete('/user/:id', verifyToken,authorizeRole('admin'), deleteUser)
router.get('/auth/logout', verifyToken, logout)

// Routes publiques
router.post('/auth/register', createUser)
router.post('/auth/login', login)
router.post('/auth/reset-code', sendResetCode)
router.post('/auth/verify-code', verifyResetCode)
router.post('/auth/reset-password', resetPassword)

export default router
