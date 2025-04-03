import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./Config/db.js";
import authMiddleware from './Middlewares/authMiddleware.js'
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use('/api/movie', authMiddleware, movieRoute)
app.use('/api/user',authMiddleware, userRoute)
app.use('/api/catalog',authMiddleware, catalogRoute)
app.use('/api/comment',authMiddleware, commentRoute)
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.listen(PORT, IP, async () => {
    console.log(`🚀 Serveur en ligne sur http://${IP}:${PORT}`);
    await connectDB();
});