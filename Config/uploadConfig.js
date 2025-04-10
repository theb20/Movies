// uploadConfig.js
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const folderPath = {
    img_presentation: process.env.PRESENTATION,
    img_cover: process.env.COVER,
    video: process.env.CONTENT,
    trailer: process.env.TRAILER
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = folderPath[file.fieldname];
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const folder = folderPath[file.fieldname];
        const filename = `${fs.readdirSync(folder).length + 1}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedImages = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedVideos = ['.mp4', '.mkv', '.mov'];

    if (
        (file.fieldname.startsWith('img_') && allowedImages.includes(ext)) ||
        (['video', 'trailer'].includes(file.fieldname) && allowedVideos.includes(ext))
    ) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'));
    }
};

const upload = multer({ storage, fileFilter }).fields([
    { name: 'img_presentation', maxCount: 1 },
    { name: 'img_cover', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'trailer', maxCount: 1 }
]);

export default upload;  // Exportation par défaut
