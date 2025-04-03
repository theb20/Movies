import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const folderMap = {
    'img_presentation': process.env.PRESENTATION,
    'img_cover': process.env.COVER,
    'video': process.env.CONTENT,
    'trailer': process.env.TRAILER
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = `Uploads/${folderMap[file.fieldname]}`;
        
        // Créer le répertoire s'il n'existe pas
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const folder = `Uploads/${folderMap[file.fieldname]}`;
        const files = fs.readdirSync(folder);
        const counter = files.length + 1;
        const uniqueFilename = `${counter}${path.extname(file.originalname)}`;
        
        req.filesPaths = req.filesPaths || {};
        req.filesPaths[file.fieldname] = `${folder}/${uniqueFilename}`;
        
        cb(null, uniqueFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['.jpg', '.jpeg', '.png'];
    const allowedVideoTypes = ['.mp4', '.mov', '.avi'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname.includes('img_') && allowedImageTypes.includes(ext)) {
        cb(null, true);
    } else if ((file.fieldname === 'video' || file.fieldname === 'trailer') && allowedVideoTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non valide'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 100 // 100MB limit
    }
}).fields([
    { name: 'img_presentation', maxCount: 1 },
    { name: 'img_cover', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'trailer', maxCount: 1 }
]);

export default upload;
