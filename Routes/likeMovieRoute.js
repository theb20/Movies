import express from 'express';
import { addLike, removeLike, getLikesByUser} from '../Controllers/likeMovieController.js'

const router = express.Router();

router.post('/likes/add', addLike);
router.delete('/likes/remove/:id_movie', removeLike);
router.get('/likes/user/:id_user', getLikesByUser);

export default router;