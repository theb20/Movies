import { connectDB } from "../Config/db.js";

export const sendAllLikes = async () => {
    try {
    const db = await connectDB();
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
    return likes
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des likes.");   
    }
}
export const verificationLike = async (id_movie, id_user) => {
    try {
        const db = await connectDB();
        const [result] = await db.query(
            'SELECT * FROM like_movie WHERE id_movie =? AND id_user =?',
            [id_movie, id_user]
        );
        return result;
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des likes.");
    }
}
export const insertLike = async (id_movie, id_user) => {
    try {
        const db = await connectDB();
        const [result] = await db.query(
            'INSERT INTO like_movie (id_movie, id_user) VALUES (?,?)',
            [id_movie, id_user]
        );
        return result;
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de l'ajout du like.");
    }
}
export const deleteLike = async (id_movie, id_user) => {
    try {
        const db = await connectDB();
        const [result] = await db.query(
            'DELETE FROM like_movie WHERE id_movie =? AND id_user =?',
            [id_movie, id_user]
        );
        return result;
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la suppression du like.");
    }
}
export const LikesByUser = async (id_user) => {
    try {
        const db = await connectDB();
        const [likes] = await db.query(`
            SELECT lm.id_movie
            FROM like_movie lm
            WHERE lm.id_user = ?
          `, [id_user]);
        return likes
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des likes.");
    }
}
export const LikesByMovie = async (id_movie) => {
    try {
        const db = await connectDB();
        const [likes] = await db.query(`
            SELECT COUNT(*) AS totalLikes
            FROM like_movie
            WHERE id_movie = ?
          `, [id_movie]);
        return likes
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des likes.");
    }
}