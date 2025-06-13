import { connectDB } from "../Config/db.js";
import { sendAllLikes, verificationLike, insertLike, deleteLike, LikesByUser, LikesByMovie } from "../models/likeMovieModel.js"
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;

export const getAllLikes = async (req, res) => {
  try {
    const likes = await sendAllLikes()

    // Formatage des URLs avec BASE_URL
    const formattedLikes = likes.map((like) => ({
      id_movie: like.id_movie,
      id_user: like.id_user,
      created_at: like.created_at,
      title: like.title,
      name_user: like.name_user,
      img_presentation: like.img_presentation ? `${BASE_URL}/${like.img_presentation}` : null,
      img_cover: like.img_cover ? `${BASE_URL}/${like.img_cover}` : null,
      trailer: like.trailer ? `${BASE_URL}/${like.trailer}` : null,
      video: like.video ? `${BASE_URL}/${like.video}` : null
    }));
    res.status(200).json(formattedLikes);

  } catch (err) {
    console.error("❌ Erreur lors de la récupération des likes :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des likes." });
  }
};

export const addLike = async (req, res) => {
 try { 
  const { id_movie, id_user } = req.body;
    // Vérifie si le like existe déjà
    const existing = await verificationLike(id_movie, id_user);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà aimé ce film." });
    }
    // Ajout du like
    await insertLike(id_movie, id_user);

    res.status(201).json({ message: "✅ Like ajouté avec succès !" });

  } catch (err) {
    console.error("❌ Erreur lors de l'ajout du like :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const removeLike = async (req, res) => {
 try { 
    const { id_movie, id_user } = req.params;

    const result = await deleteLike(id_movie, id_user)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Like non trouvé." });
    }

    res.status(200).json({ message: "✅ Like supprimé avec succès !" });

  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getLikesByUser = async (req, res) => {
   try {
    const { id_user } = req.params;
    const likes = await LikesByUser(id_user);

    if (likes.length === 0) {
      return res.status(404).json({ message: "Aucun film liké trouvé." });
    }

    // Renvoie un tableau de tous les id_movie
    const movieIds = likes.map(like => like.id_movie);
    res.status(200).json({ movieIds });

  } catch (err) {
    console.error("❌ Erreur lors de la récupération des likes :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getLikesByMovie = async (req, res) => {
 try { 
    const { id_movie } = req.params;
    const [likes] = await LikesByMovie(id_movie);

    res.status(200).json({
      id_movie,
      totalLikes: likes[0].totalLikes
    });

  } catch (err) {
    console.error("❌ Erreur lors du comptage des likes :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
