import { connectDB } from "../Config/db.js";

export const getIdComment = async (req, res) => {
    try {
        const db = await connectDB();
        const {id } = req.params
        const [comment] = await db.query ("SELECT * FROM comment WHERE id_comment = ?", [id]);
        if(!comment.length){
            return res.status(404).json({message: '❌ Commentaire impossible a trouver'})
        }
        console.log("+1 req save !⏺️");
        res.status(200).json(comment[0])
    }catch (error){
        console.log('❌', error)
        res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
    }
}

export const getComment = async (req, res) => {
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
        
        // Formater les données pour éviter les valeurs null
        const formattedComments = comments.map(comment => ({
            ...comment,
            name_user: comment.name_user || 'Utilisateur supprimé',
            first_name: comment.first_name || '',
            email: comment.email || '',
            picture_user: comment.picture_user 
        }));
        
        res.status(200).json(formattedComments);
        console.log("✅ Commentaires récupérés avec succès");
    } catch(err) {
        console.error('❌ Erreur de récupération', err.message);
        res.status(500).json({error: "Erreur interne du serveur"});
    }
}

export const addComment = async (req, res) => {
    try {
        console.log("📩 Données reçues :", req.body);
        const db = await connectDB();
        const { content, id_movie, id_user } = req.body;
        if (!content || !id_movie || !id_user) {
            return res.status(400).json({ error: "champs requi" });
        }
        
        const [result] = await db.query(
            "INSERT INTO comment (content, id_movie, id_user) VALUES (?, ?, ?)",
            [content, id_movie, id_user]
        );

        console.log("✅ Commentaire ajouté avec à la table :", result.insertId);
        res.status(201).json({ message: "Commentaire ajouté !" });
    } catch (err) {
        console.error("❌ Erreur de création :", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

export const putComment = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        const { content, comment_date, id_movie, id_user } = req.body;
        if (!content ||!comment_date ||!id_movie ||!id_user) {
            return res.status(400).json({ error: "champs requi" });
        }
        const [updateResult] = await db.query(
            "UPDATE comment SET content =?, comment_date =?, id_movie =?, id_user =? WHERE id_comment =?",
            [content, comment_date, id_movie, id_user, id]
        )
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Commentaire non trouvé" });
        }
        res.status(200).json({ message: "✅ Commentaire modifié avec succès!" });
    } catch (err) {
        console.error("❌ Erreur de modification :", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
}
export const deleteComment = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        const [deleteResult] = await db.query("DELETE FROM comment WHERE id_comment = ?", [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Commentaire non trouvé" });
        }

        res.status(200).json({ message: "✅ Commentaire supprimé." });
    } catch (err) {
        console.error("❌ Erreur :", err.message);
        res.status(500).json({ error: "❌ Erreur interne du serveur" });
    }
};

