import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./Config/db.js";
import authMiddleware from './Middlewares/authMiddleware.js';
import movieRoute from "./Routes/movieRoute.js";
import catalogRoute from "./Routes/catalogRoute.js";
import userRoute from "./Routes/userRoute.js";
import commentRoute from "./Routes/commentRoute.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT ; 
const IP = process.env.IP ;

// Permet de récupérer le chemin du dossier actuel
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
// Middleware
// helmet permet de sécuriser l'application en ajoutant des en-têtes HTTP
// morgan permet de logger les requêtes HTTP
// cors permet de gérer les requêtes cross-origin, c'est à dire les requêtes qui ne viennent pas du même domaine que le serveur.
// cookieParser permet de parser les cookies en format json au front-end
//express.json() permet de créer des objets json à partir des requêtes HTTP
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', authMiddleware, movieRoute, userRoute, catalogRoute, commentRoute);
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));// permet de reccupérer les fichier dans le dossier uploads

// Démarrage du serveur avec gestion d'erreurs
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, IP, () => {
            console.log(`🚀 Serveur en ligne sur http://${IP}:${PORT}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use. Trying another port...`);
                process.exit(1);
            } else {
                console.error('❌ Server error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

startServer();