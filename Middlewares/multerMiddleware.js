// uploadConfig.js
import multer from 'multer'; // pour gérer les fichiers
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // pour générer des noms uniques

dotenv.config();

const folderPath = {
  img_presentation: process.env.PRESENTATION,
  img_cover: process.env.COVER,
  video: process.env.CONTENT,
  trailer: process.env.TRAILER
};

// Vérifie que le dossier existe et qu’il est dans les dossiers autorisés
const validateDestination = (fieldname) => {
  if (!Object.keys(folderPath).includes(fieldname)) {
    throw new Error('Champ non autorisé');
  }//return une erreur si l'auth du champ === 0 et arrete l'execution du programme

  const folder = folderPath[fieldname];
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });// crée le dossier si il n'existe pas sinon retourne le dossier
  return folder; 
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const folder = validateDestination(file.fieldname);
      cb(null, folder);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname).toLowerCase(); // req l'extension du fichier

    const safeFilename = uuidv4() + ext; // évite les collisions et les injections
    cb(null, safeFilename);
  }
});

// Filtrage des types de fichiers
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Champs pour les images
  const imageFields = ['img_cover', 'img_presentation'];
  // Champs  pour les vidéos
  const videoFields = ['video', 'trailer'];

  const allowedImages = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedVideos = ['.mp4', '.mkv', '.mov'];

  if (imageFields.includes(file.fieldname)) {
    if (allowedImages.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`❌ Fichier non image accepté pour ${file.fieldname}`));
    }
  } else if (videoFields.includes(file.fieldname)) {
    if (allowedVideos.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`❌ Fichier non vidéo accepté pour ${file.fieldname}`));
    }
  } else {
    cb(new Error(`❌ Champ fichier non reconnu: ${file.fieldname}`));
  }
};


// Limite de taille (optionnelle : 200 Mo pour vidéo, 5 Mo pour images)
const limits = {
  fileSize: 200 * 1024 * 1024, // 200MB max
};

const upload = multer({ storage, fileFilter, limits }).fields([
  { name: 'img_presentation', maxCount: 1 },
  { name: 'img_cover', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]);

export default upload;
