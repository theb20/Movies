import { commentsById, allComments, insertComment, deleteCommentById } from "../models/commentModel.js";

export const getIdComment = async (req, res) => {
    try {
        const {id } = req.params
        const comment = await commentsById(id)
        if(!comment.length){
            return res.status(404).json({message: '❌ Commentaire impossible a trouver'})
        }
        res.status(200).json(comment[0])
    }catch (error){
        console.log('❌', error)
        res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
    }
}

export const getComment = async (req, res) => {
    try {
        const comments = await allComments()
        
        // Formater les données pour éviter les valeurs null
        const formattedComments = comments.map(comment => ({
            ...comment,
            name_user: comment.name_user || 'Utilisateur supprimé',
            first_name: comment.first_name || '',
            email: comment.email || '',
            picture_user: comment.picture_user 
        }));
        
        res.status(200).json(formattedComments);
    } catch(err) {
        console.error('❌ Erreur de récupération', err.message);
        res.status(500).json({error: "Erreur interne du serveur"});
    }
}

export const addComment = async (req, res) => {
    try {
        const { content, id_movie, id_user } = req.body;
        if (!content || !id_movie || !id_user) {
            return res.status(400).json({ error: "champs requi" });
        }
        
        const result = await insertComment(content, id_movie, id_user);
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
        }
        res.status(201).json({ message: "Commentaire ajouté !" });
    } catch (err) {
        console.error("❌ Erreur de création :", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResult = await deleteCommentById(id);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Commentaire non trouvé" });
        }

        res.status(200).json({ message: "✅ Commentaire supprimé." });
    } catch (err) {
        console.error("❌ Erreur :", err.message);
        res.status(500).json({ error: "❌ Erreur interne du serveur" });
    }
};

