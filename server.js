import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./Config/db.js";
import midlleware from './Middlewares/authMiddleware.js'

import movieRoute from "./Routes/movieRoute.js";
import catalogRoute from "./Routes/catalogRoute.js";
import userRoute from "./Routes/userRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT ; 
const IP = process.env.IP ; 

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use('/api/movie', movieRoute)
app.use('/api/user', userRoute)
app.use('/api/catalog', catalogRoute)


app.listen(PORT, IP, async () => {
    console.log(`🚀 Serveur en ligne sur http://${IP}:${PORT}`);
    await connectDB();
});