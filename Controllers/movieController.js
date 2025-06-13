import upload from "../Config/uploadConfig.js";
import dotenv from "dotenv";
import { insertMovie, updateMovie, deleteMovieById, AllMovies, movieById } from "../models/movieModel.js";

dotenv.config();


const BASE_URL = process.env.BASE_URL;

// Fonction pour ajouter un film
export const addMovie = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("❌ Erreur multer :", err.message);
        return res.status(400).json({ error: `Erreur multer : ${err.message}` });
      }
      // Vérification des fichiers uploadés
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
        // Transformation des valeurs vides en null
        const toNull = (val) =>
          typeof val === 'undefined' || val === '' ? null : val;
  
      
        // Construction des données du film
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
  // Ajout du film à la base de données
        const result = await insertMovie(
          movieData.title,
          movieData.description,
          movieData.release_date,
          movieData.director,
          movieData.rating,
          movieData.video,
          movieData.trailer,
          movieData.img_presentation,
          movieData.img_cover,
          movieData.id_category
        )
  
        res.status(201).json({
          message: "✅ Film ajouté avec succès !",
          movieId: result,
          movie: movieData
        });
      } catch (err) {
        console.error('❌ Erreur lors de l\'ajout du film:', err);
        res.status(500).json({ error: "Erreur interne lors de l'ajout du film" });
      }
    });
};
// Fonction pour mettre à jour un film
export const putMovie = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("❌ Erreur multer :", err.message);
      return res.status(400).json({ error: `Erreur multer : ${err.message}` });
    }

    try {
      // Transformation des valeurs vides en null
      const toNull = (val) =>
        typeof val === 'undefined' || val === '' ? null : val;

      // Construction des nouvelles données à mettre à jour
      const newData = {
        title: toNull(req.body.title),
        description: toNull(req.body.description),
        release_date: toNull(req.body.release_date),
        director: toNull(req.body.director),
        rating: toNull(req.body.rating),
        id_category: toNull(req.body.id_category),
      };

      // Remplacer par les chemins des fichiers uploadés s’ils existent
      if (req.files.video && req.files.video[0]) {
        newData.video = req.files.video[0].path; 
      }
      if (req.files.trailer && req.files.trailer[0]) {
        newData.trailer = req.files.trailer[0].path;
      }
      if (req.files.img_presentation && req.files.img_presentation[0]) {
        newData.img_presentation = req.files.img_presentation[0].path;
      }
      if (req.files.img_cover && req.files.img_cover[0]) {
        newData.img_cover = req.files.img_cover[0].path;
      }

      // Supprimer les clés dont la valeur est null 
      Object.keys(newData).forEach(
        (key) => newData[key] === null && delete newData[key]
      );
      // Vérifier si des données sont présentes à mettre à jour
      if (Object.keys(newData).length === 0) {
        return res.status(400).json({ error: "Aucune donnée à mettre à jour." });
      }

      const id = req.params.id;
      const result = await updateMovie(id, newData);

      res.status(200).json({
        message: "✅ Film mis à jour avec succès !",
        result,
        updatedData: newData,
      });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du film:', error);
      res.status(500).json({ error: "Erreur interne lors de la mise à jour du film" });
    }
  });
};
// Fonction pour supprimer un film
export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteMovieById(id);

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
        const movies = await AllMovies()

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
        const { id } = req.params;
        const movie = await movieById(id);

        if (!movie) return res.status(404).json({ message: 'Film non trouvé' });

        const movieWithUrls = {
            ...movie,
            img_presentation: `${BASE_URL}/${movie.img_presentation}`,
            img_cover: `${BASE_URL}/${movie.img_cover}`,
            trailer: `${BASE_URL}/${movie.trailer}`,
            video: `${BASE_URL}/${movie.video}`
        };

        res.json(movieWithUrls);
    } catch (error) {
        console.error('❌ Erreur server:', error);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};
