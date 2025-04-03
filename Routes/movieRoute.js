import express from 'express';
import { getIdMovie, getMovies, addMovie, putMovie, deleteMovie } from '../Controllers/movieController.js';

const router = express.Router();

// Routes pour les films
router.get('/', getMovies);
router.get('/:id', getIdMovie);
router.post('/', addMovie);
router.put('/:id', putMovie);
router.delete('/:id', deleteMovie);

export default router;