import express from "express"
import { getUser, createUser, login, getMe, logout, deleteUser } from "../Controllers/userController.js"
import verifyToken from '../Middlewares/authMiddleware.js'

const router = express.Router()
router.get('/user', getUser)
router.post('/auth/register', createUser)
router.post('/auth/login', login)
router.get('/user/me', verifyToken, getMe)  
router.get('/auth/logout', logout)
router.delete('/user/:id', deleteUser)

export default router;