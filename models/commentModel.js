import { connectDB } from "../Config/db.js";

export const commentsById = async (id) => {
    try {
        const db = await connectDB();
        const [comments] = await db.query(`
            SELECT * FROM comment WHERE id_comment =?
          `, [id]);
        return comments
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des commentaires.");
    }
}

export const allComments = async () => {
    try {
        const db = await connectDB();
        const [comments] = await db.query(`
            SELECT 
                c.*,
                u.name_user,
                u.first_name,
                u.email,
                u.picture_user
            FROM comment c
            LEFT JOIN user u ON c.id_user = u.id_user
            ORDER BY c.comment_date DESC
        `);
        return comments
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des commentaires.");
    }
}

export const insertComment = async (content, id_movie, id_user) => {
    try {
        const db = await connectDB();
        const [result] = await db.query(
            'INSERT INTO comment (content, id_movie, id_user) VALUES (?,?,?)',
            [content, id_movie, id_user]
        );
        return result;
    }catch (error) {
        console.error(error);
        throw new Error("Erreur lors de l'ajout du commentaire.");
    }
}

export const deleteCommentById = async (id) => {
    try{
        const db = await connectDB();
        const [deleteResult] = await db.query("DELETE FROM comment WHERE id_comment = ?", [id]);
        return deleteResult
    }catch {
        console.error(error);
        throw new Error("Erreur lors de la suppression du commentaire.");
    }
}