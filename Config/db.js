import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// function de connexion à la base de données
// la propriété mysql.createConnection() renvoie une promesse
// qui est résolue avec l'objet de connexion à la base de données
// une promesse est un objet qui représente une valeur qui peut etre résolue ou rejeter dans le futur
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
    throw error; // Lancer l'erreur pour la gérer ailleurs dans l'application si nécessaire 
  }
}