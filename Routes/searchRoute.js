import express from 'express';
import { deleteSearch, getSearches, getPopularSearch, searchMovies } from '../Controllers/searchController.js';

const router = express.Router();

router.delete('/search/:id_search', deleteSearch);
router.get('/search', getSearches);
router.get('/search/popular', getPopularSearch);//categorie limit(10)
router.get('/search/movies', searchMovies);

export default router;