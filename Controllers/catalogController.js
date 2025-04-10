import { connectDB } from "../Config/db.js";

export const getIdCatalog = async (req, res) => {
    try {
         const db = await connectDB();
        const {id } = req.params
        const [categorie] = await db.query ("SELECT * FROM categorie WHERE id_category = ?", [id]);
        if(!categorie.length){
            return res.status(404).json({message: '❌ Categorie impossible a trouver'})
        }
        console.log("+1 req save !⏺️");
        res.status(200).json(categorie[0])
    }catch (error){
        console.log('❌', error)
        res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
    }
}

export const getCatalog = async (req, res) => {
    try{
        const db = await connectDB();
        const [categorie] = await db.query("SELECT * FROM categorie");
        res.status(200).json(categorie);
        console.log("+1 req save !⏺️")
    }catch(err){
        console.error('❌ Erreur de reccuperation',err.message)
        res.status(500).json({error: "Erreur interne"})
    }

}

export const addCategorie = async (req, res) => {
    try {
        console.log("📩 Données reçues :", req.body);

        const { category_name, slug } = req.body;

        if (!category_name || !slug) {
            return res.status(400).json({ error: "champs requi" });
        }

        const db = await connectDB();
        const [result] = await db.query(
            "INSERT INTO categorie (category_name, slug) VALUES (?, ?)",
            [category_name, slug]
        );

        console.log("✅ Categorie ajouté avec à la table :", result.insertId);
        res.status(201).json({ message: "Catégorie ajouté avec succès" });
    } catch (err) {
        console.error("❌ Erreur de création :", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

export const putCategorie = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params; 
        const newData = req.body;

        const [existingCategorie] = await db.query("SELECT * FROM categorie WHERE id_category = ?", [id]);

        if (existingCategorie.length === 0) {
            console.log("❌ Cette categorie n'existe pas.");
            return res.status(404).json({ error: "❌ Categorie non trouvé" });
        }
        const [updateResult] = await db.query(
            "UPDATE categorie SET category_name = ?, slug = ? WHERE id_category = ?"
,
            [
                newData.category_name,
                newData.slug,
                id
            ]
        );

        if (updateResult.affectedRows === 0) {
            console.log("⚠️ Aucune mise à jour effectuée (données inchangées).");
            return res.status(400).json({ error: "⚠️ Aucune mise à jour effectuée." });
        }

        console.log("✅ Film mis à jour avec succès !");
        res.status(200).json({ message: "✅ Film modifié avec succès !" });

    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour :", err.message);
        res.status(500).json({ error: "❌ Erreur interne, veuillez réessayer plus tard." });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;

        // Exécute la suppression
        const [deleteResult] = await db.query("DELETE FROM categorie WHERE id_category = ?", [id]);

        // Vérifie si une ligne a été affectée
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Catégorie non trouvée" });
        }

        res.status(200).json({ message: "✅ Catégorie supprimée avec succès !" });
    } catch (err) {
        console.error("❌ Erreur :", err.message);
        res.status(500).json({ error: "❌ Erreur interne du serveur" });
    }
};

