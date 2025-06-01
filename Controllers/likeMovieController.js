import { connectDB } from "../Config/db.js";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;

export const getAllLikes = async (req, res) => {
  try {
    const db = await connectDB();

    // ✅ Requête SQL avec jointures pour enrichir les likes
    const [likes] = await db.query(`
      SELECT 
        l.id_movie,
        l.id_user,
        l.created_at,
        m.title,
        m.img_presentation,
        m.img_cover,
        m.trailer,
        m.video,
        u.name_user
      FROM like_movie l
      JOIN movie m ON l.id_movie = m.id_movie
      JOIN user u ON l.id_user = u.id_user
      ORDER BY l.created_at DESC
    `);

    // ✅ Formatage des URLs avec BASE_URL
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

    // ✅ Log utile pour debug
    console.log(`✅ ${formattedLikes.length} like(s) récupéré(s)`);

    // ✅ Réponse JSON
    res.status(200).json(formattedLikes);

  } catch (err) {
    console.error("❌ Erreur lors de la récupération des likes :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des likes." });
  }
};
/**
 * Ajoute un like pour un film donné par un utilisateur
 */
export const addLike = async (req, res) => {
  const { id_movie, id_user } = req.body;

  try {
    const db = await connectDB();

    // Vérifie si le like existe déjà
    const [existing] = await db.query(
      'SELECT 1 FROM like_movie WHERE id_movie = ? AND id_user = ?',
      [id_movie, id_user]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà aimé ce film." });
    }

    // Ajout du like
    await db.query(
      'INSERT INTO like_movie (id_movie, id_user) VALUES (?, ?)',
      [id_movie, id_user]
    );

    res.status(201).json({ message: "✅ Like ajouté avec succès !" });

  } catch (err) {
    console.error("❌ Erreur lors de l'ajout du like :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * Supprime un like pour un film par un utilisateur
 */
export const removeLike = async (req, res) => {
  const { id_movie, id_user } = req.params;

  try {
    const db = await connectDB();
    const [result] = await db.query(
      'DELETE FROM like_movie WHERE id_movie = ? AND id_user = ?',
      [id_movie, id_user]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Like non trouvé." });
    }

    res.status(200).json({ message: "✅ Like supprimé avec succès !" });

  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * Récupère tous les films likés par un utilisateur
 */
export const getLikesByUser = async (req, res) => {
  const { id_user } = req.params;

  try {
    const db = await connectDB();
    const [likes] = await db.query(`
      SELECT lm.id_movie
      FROM like_movie lm
      WHERE lm.id_user = ?
    `, [id_user]);

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

/**
 * Récupère le nombre de likes pour un film donné
 */
export const getLikesByMovie = async (req, res) => {
  const { id_movie } = req.params;

  try {
    const db = await connectDB();
    const [likes] = await db.query(`
      SELECT COUNT(*) AS totalLikes
      FROM like_movie
      WHERE id_movie = ?
    `, [id_movie]);

    res.status(200).json({
      id_movie,
      totalLikes: likes[0].totalLikes
    });

  } catch (err) {
    console.error("❌ Erreur lors du comptage des likes :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
