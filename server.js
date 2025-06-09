// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./Config/db.js";

// Middlewares
import {verifyToken} from "./Middlewares/authMiddleware.js";

// Routes
import movieRoute from "./Routes/movieRoute.js";
import catalogRoute from "./Routes/catalogRoute.js";
import userRoute from "./Routes/userRoute.js";
import commentRoute from "./Routes/commentRoute.js";
import searchRoute from "./Routes/searchRoute.js";
import likeMovieRoute from "./Routes/likeMovieRoute.js";
import uploadRoute from "./Config/uploadConfig.js"; // ✅ Route d'upload sécurisée

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const IP = process.env.IP;

// Obtenir le chemin absolu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sécurité & middlewares globaux
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("dev"));
app.use(cors({
  origin: [process.env.BASE_URL_APP],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json());

// Accès statique sécurisé aux fichiers uploadés
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes publiques
app.use('/api', userRoute);

// Routes protégées par token JWT
app.use('/api', verifyToken, 
  movieRoute,
  catalogRoute,
  commentRoute,
  searchRoute,
  likeMovieRoute
);

// Route upload protégée par un middleware de rôle (dans uploadRoute)
app.use('/api', uploadRoute); // Le rôle "moderator" est contrôlé DANS uploadRoute.js

// Route inconnue (404)
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route non trouvée' });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, IP, () => {
      console.log(`🚀 Serveur lancé sur http://${IP}:${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé.`);
        process.exit(1);
      } else {
        console.error('❌ Erreur serveur :', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error);
    process.exit(1);
  }
};

startServer();
