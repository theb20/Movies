import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try{
    const connection =await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    })
    console.log('✅ Connexion à la base de données réussie!');
    return connection;
  } catch (error){
    console.error('❌ Erreur de connexion à la base de données:', error);
    throw error; // Lancer l'erreur pour la gérer ailleurs
  }
}