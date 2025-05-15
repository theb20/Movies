import { connectDB } from "../Config/db.js";

export const addLike = async (req, res) => {
    const {id_movie, id_user} = req.body;
    const check = 'SELECT * FROM likes WHERE id_movie = ? AND id_user = ?';
    try {
        const db = await connectDB();
        const [result] = await db.query(check, [id_movie, id_user]);
        if (result.length > 0) {
            return res.status(400).json({ message: "Vous avez déjà aimé ce film." });
        }
        const query = 'INSERT INTO likes (id_movie, id_user) VALUES (?,?)';
        await db.query(query, [id_movie, id_user]);
        res.status(201).json({ message: "✅ Film ajouté avec succès!" });
    } catch (err) {
        console.error('❌ Erreur lors de l\'ajout du film:', err);
        res.status(500).json({ error: "Erreur interne lors de l'ajout du film" });
    }
}

export const removeLike = async (req, res) => {
    const { id_movie, id_user } = req.body;
    try {
      const db = await connectDB();
      const query = 'DELETE FROM likes WHERE id_movie = ? AND id_user = ?';
      const [result] = await db.query(query, [id_movie, id_user]);
  
      if (result.affectedRows === 0) {
        // Aucun like supprimé = like n'existait pas
        return res.status(404).json({ message: "Like non trouvé." });
      }
  
      res.status(200).json({ message: "✅ Like supprimé avec succès !" });
    } catch (err) {
      console.error("❌ Erreur :", err.message);
      res.status(500).json({ error: "❌ Erreur interne" });
    }
};

export const getLikesByUser = async (req, res) => {
    const { id_movie } = req.params;
    try {
      const db = await connectDB();
      const query = 'SELECT * FROM likes WHERE id_movie =?';
      const [result] = await db.query(query, [id_movie]);

      if (result.length === 0) {
        return res.status(404).json({ message: "Aucun like trouvé pour ce film." });
      }
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Erreur :", err.message);
      res.status(500).json({ error: "❌ Erreur interne" });
    }
}
  