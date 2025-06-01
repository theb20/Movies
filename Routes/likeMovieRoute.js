import express from 'express';
import { addLike, removeLike, getLikesByUser, getLikesByMovie, getAllLikes} from '../Controllers/likeMovieController.js'

const router = express.Router();

router.post('/likes/add', addLike);
router.get('/likes', getAllLikes);
router.delete('/likes/remove/:id_movie/:id_user', removeLike);
router.get('/likes/user/:id_user', getLikesByUser);
router.get('/likes/movie/:id_movie', getLikesByMovie);

export default router;