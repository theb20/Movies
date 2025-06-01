import { connectDB } from "../Config/db.js";
import upload from "../Config/uploadConfig.js";
import dotenv from "dotenv";

dotenv.config();


const BASE_URL = process.env.BASE_URL;

// Fonction pour ajouter un film
export const addMovie = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("❌ Erreur multer :", err.message);
        return res.status(400).json({ error: `Erreur multer : ${err.message}` });
      }
  
      // 🧪 Debug complet
      console.log("✅ Requête reçue");
      console.log("📥 Champs texte :", req.body);
      console.log("🗂️ Fichiers reçus :", req.files);
  
      const missingFiles = [];
      if (!req.files?.video?.[0]) missingFiles.push('video');
      if (!req.files?.trailer?.[0]) missingFiles.push('trailer');
      if (!req.files?.img_presentation?.[0]) missingFiles.push('img_presentation');
      if (!req.files?.img_cover?.[0]) missingFiles.push('img_cover');
  
      if (missingFiles.length > 0) {
        console.log("❌ Fichiers manquants :", missingFiles);
        return res.status(400).json({
          error: `Fichiers manquants : ${missingFiles.join(', ')}`,
        });
      }
  
      try {
        const toNull = (val) =>
          typeof val === 'undefined' || val === '' ? null : val;
  
        const db = await connectDB();
  
        const movieData = {
          title: toNull(req.body.title),
          description: toNull(req.body.description),
          release_date: toNull(req.body.release_date),
          director: toNull(req.body.director),
          rating: toNull(req.body.rating),
          video: req.files.video[0].path,
          trailer: req.files.trailer[0].path,
          img_presentation: req.files.img_presentation[0].path,
          img_cover: req.files.img_cover[0].path,
          id_category: toNull(req.body.id_category),
        };
  
        const [result] = await db.execute(
          `INSERT INTO movie 
            (title, description, release_date, director, rating, video, trailer, img_presentation, img_cover, id_category) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          Object.values(movieData)
        );
  
        res.status(201).json({
          message: "✅ Film ajouté avec succès !",
          movieId: result.insertId,
          movie: movieData
        });
      } catch (err) {
        console.error('❌ Erreur lors de l\'ajout du film:', err);
        res.status(500).json({ error: "Erreur interne lors de l'ajout du film" });
      }
    });
};
  
// Fonction pour modifier un film
export const putMovie = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        const newData = req.body;

        const [existingMovie] = await db.query("SELECT * FROM movie WHERE id_movie = ?", [id]);
        if (existingMovie.length === 0) return res.status(404).json({ error: "❌ Film non trouvé" });

        const [updateResult] = await db.query(
            `UPDATE movie 
             SET title = ?, description = ?, release_date = ?, director = ?, rating = ?, video = ?, trailer = ?, img_presentation = ?, img_cover = ?, id_category = ? 
             WHERE id_movie = ?`,
            [...Object.values(newData), id]
        );

        if (updateResult.affectedRows === 0) return res.status(400).json({ error: "⚠️ Aucune mise à jour effectuée." });

        res.status(200).json({ message: "✅ Film modifié avec succès !" });

    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour :", err.message);
        res.status(500).json({ error: "❌ Erreur interne, veuillez réessayer plus tard." });
    }
};

// Fonction pour supprimer un film
export const deleteMovie = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM movie WHERE id_movie = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "❌ Film non trouvé" });

        res.status(200).json({ message: "✅ Film supprimé avec succès !" });

    } catch (err) {
        console.error("❌ Erreur :", err.message);
        res.status(500).json({ error: "❌ Erreur interne" });
    }
};

// Fonction pour récupérer tous les films
export const getAllMovies = async (req, res) => {
    try {
        const db = await connectDB();
        const [movies] = await db.query('SELECT * FROM movie');

        const moviesWithUrls = movies.map(movie => ({
            ...movie,
            img_presentation: `${BASE_URL}/${movie.img_presentation}`,
            img_cover: `${BASE_URL}/${movie.img_cover}`,
            trailer: `${BASE_URL}/${movie.trailer}`,
            video: `${BASE_URL}/${movie.video}`
        }));

        res.json(moviesWithUrls);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Error fetching movies' });
    }
};

// Fonction pour récupérer un film par son ID
export const getMovieById = async (req, res) => {
    try {
        const db = await connectDB();
        const [movie] = await db.query('SELECT * FROM movie WHERE id_movie = ?', [req.params.id]);

        if (movie.length === 0) return res.status(404).json({ message: 'Movie not found' });

        const movieWithUrls = {
            ...movie[0],
            img_presentation: `${BASE_URL}/${movie[0].img_presentation}`,
            img_cover: `${BASE_URL}/${movie[0].img_cover}`,
            trailer: `${BASE_URL}/${movie[0].trailer}`,
            video: `${BASE_URL}/${movie[0].video}`
        };

        res.json(movieWithUrls);
    } catch (error) {
        console.error('❌ Erreur server:', error);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};
