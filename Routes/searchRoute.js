import express from 'express';
import { deleteSearch, getPopularSearch, searchMovies } from '../Controllers/searchController.js';

const router = express.Router();

router.delete('/search/:id_search', deleteSearch);
router.get('/search/popular', getPopularSearch);
router.get('/search/movies', searchMovies);

export default router;