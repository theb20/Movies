import bdd from 'mysql2/promise'
import dotenv, { config } from 'dotenv'

dotenv.config();
export const connectDB = async() => {
    try{
        const db = bdd.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME 
        })
        console.log('✅ Connexion à la base de données réussie !')
        return db 
        }
        catch(err){
            console.log('❌ Erreur de connexion à la base de données :', err)
        }
    
    };