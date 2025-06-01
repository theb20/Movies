import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
})
export const connectDB = async () => {
  try{
    console.log('✅ Connexion à la base de données réussie!');
    return pool;
  } catch (error){
    console.error('Erreur de connexion à la base de données:', error);
    throw error; // Lancer l'erreur pour la gérer ailleurs dans l'application si nécessaire 
  }
}