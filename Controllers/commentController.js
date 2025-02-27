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
    try{
        const db = await connectDB();
        const [comment] = await db.query("SELECT * FROM comment");
        res.status(200).json(comment);
        console.log("+1 req save !⏺️")
    }catch(err){
        console.error('❌ Erreur de reccuperation',err.message)
        res.status(500).json({error: "Erreur interne"})
    }

}

export const addComment = async (req, res) => {
    try {
        console.log("📩 Données reçues :", req.body);
        const db = await connectDB();
        const { content, id_movie, comment_date, id_user } = req.body;
        if (!content || !id_movie || !comment_date || !id_user) {
            return res.status(400).json({ error: "champs requi" });
        }
        
        const [result] = await db.query(
            "INSERT INTO comment (content, comment_date, id_movie, id_user) VALUES (?, ?, ?, ?)",
            [content, comment_date, id_movie, id_user]
        );

        console.log("✅ Commentaire ajouté avec à la table :", result.insertId);
        res.status(201).json({ message: "Commentaire ajouté !" });
    } catch (err) {
        console.error("❌ Erreur de création :", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

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

