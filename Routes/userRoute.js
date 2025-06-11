import express from "express"
import { getAllUser, createUser, login, getMe, logout, deleteUser, updateUser, sendResetCode, verifyResetCode, resetPassword } from "../Controllers/userController.js"
import {verifyToken} from '../Middlewares/authMiddleware.js'

const router = express.Router()
router.get('/user', getAllUser)
router.put('/user/:id', updateUser)
router.post('/auth/register', createUser)
router.post('/auth/login', login)
router.get('/user/me', verifyToken, getMe)  
router.get('/auth/logout', logout)
router.delete('/user/:id', deleteUser)
router.post('/auth/reset-code', sendResetCode)
router.post('/auth/verify-code', verifyResetCode)
router.post('/auth/reset-password', resetPassword)

export default router;