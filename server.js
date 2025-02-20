import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import ngrok from "ngrok";
import { connectDB } from "./Config/db.js";

import userRoute from "./Routes/userRoute.js";
import movieRoute from "./Routes/movieRoute.js";
import loginRoute from "./Routes/loginRoute.js";
import signUpRoute from "./Routes/signUpRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT ; 
const IP = process.env.IP ; 

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use('/api/user', userRoute)
app.use('/api/movie', movieRoute)
app.use('/api/login', loginRoute)
app.use('/api/signUp', signUpRoute)


app.listen(PORT, IP, async () => {
    console.log(`🚀 Serveur en ligne sur http://${IP}:${PORT}`);
        try{
            connectDB();
                console.log("✅ Connexion à la base de données réussie !");
        }catch(err){
            console.error("❌ Erreur de connexion à la base de données : ", err);
        }
});
