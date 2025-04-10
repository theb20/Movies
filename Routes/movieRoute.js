import express from 'express';
import { addMovie, putMovie, deleteMovie, getAllMovies, getMovieById } from '../Controllers/movieController.js';

const router = express.Router();

// Route pour ajouter un film
router.post('/movies', addMovie);

// Route pour modifier un film
router.put('/movies/:id', putMovie);

// Route pour supprimer un film
router.delete('/movies/:id', deleteMovie);

// Route pour récupérer tous les films
router.get('/movies', getAllMovies);

// Route pour récupérer un film par ID
router.get('/movies/:id', getMovieById);

export default router;
