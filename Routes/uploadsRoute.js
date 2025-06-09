// routes/uploadRoute.js

import express from 'express';
import { verifyToken, authorizeRole } from '../Middlewares/authMiddleware.js';
import upload from '../Config/uploadConfig.js';

const router = express.Router();

// Route accessible à l'admin et au modérateur
router.post(
  '/upload',
  verifyToken,
  authorizeRole('moderator', 'admin'),
  upload,
  (req, res) => {
    res.status(200).json({ message: 'Upload réussi', files: req.files });
  }
);

export default router;
