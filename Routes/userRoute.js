import express from "express"
import { getUser, createUser, login } from "../Controllers/userController.js"

const router = express.Router()
router.get('/:id', getUser)
router.post('/auth/register', createUser)
router.post('/auth/login', login)

export default router;