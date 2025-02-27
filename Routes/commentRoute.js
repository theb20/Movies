import express from "express"
import { getIdComment, getComment, addComment, deleteComment } from "../Controllers/commentController.js"

const router = express.Router()
router.get('/:id', getIdComment)
router.delete('/:id', deleteComment)
router.get('/', getComment)
router.post('/', addComment)

export default router;