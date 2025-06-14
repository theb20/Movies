import express from 'express';
import { addMovie, putMovie, deleteMovie, getAllMovies, getMovieById } from '../Controllers/movieController.js';
import { authorizeRole } from '../Middlewares/authMiddleware.js';
const router = express.Router();

// Route pour ajouter un film
router.post('/movies',authorizeRole('admin', 'moderator'), addMovie);

// Route pour modifier un film
router.put('/movies/:id',authorizeRole('admin'), putMovie);

// Route pour supprimer un film
router.delete('/movies/:id',authorizeRole('admin'), deleteMovie);

// Route pour récupérer tous les films
router.get('/movies', getAllMovies);

// Route pour récupérer un film par ID
router.get('/movies/:id', getMovieById);

export default router;
