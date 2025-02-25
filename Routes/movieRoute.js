import express from "express"
import { getMovies, addMovie, getIdMovie, putMovie, deleteMovie } from "../Controllers/movieController.js"

const router = express.Router()
router.get('/:id', getIdMovie)
router.delete('/:id', deleteMovie)
router.put('/:id', putMovie)
router.get('/', getMovies)
router.post('/', addMovie)

export default router;