import express from "express"
import { getIdComment, getComment, addComment, deleteComment } from "../Controllers/commentController.js"

const router = express.Router()
router.get('/comment/:id', getIdComment)
router.delete('/comment/:id', deleteComment)
router.get('/comment', getComment)
router.post('/comment', addComment)

export default router;