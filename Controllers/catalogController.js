import { getAllCatalog, getCategorieById, insertCategorie, deleteCategorieById} from "../models/calatogueModel.js";

export const getIdCatalog = async (req, res) => {
    try {
        const {id } = req.params
        const categorie = await getCategorieById(id)
        if(!categorie.length){
            return res.status(404).json({message: 'Categorie impossible a trouver'})
        }
        res.status(200).json(categorie)
    }catch (error){
        console.log('❌', error)
        res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
    }
}

export const getCatalog = async (req, res) => {
    try{
        const categorie = await getAllCatalog()
        res.status(200).json(categorie);
    }catch(err){
        console.error('❌ Erreur de reccuperation',err.message)
        res.status(500).json({error: "Erreur interne"})
    }

}

export const addCategorie = async (req, res) => {
    try {
        const { category_name, slug } = req.body;
        if (!category_name || !slug) {
            return res.status(400).json({ error: "champs requi" });
        }
        const result = await insertCategorie(category_name, slug);
        if (result.length > 0) {
            return res.status(409).json({ error: "❌ Categorie déjà existante" });
        }

        res.status(201).json({ message: "Catégorie ajouté avec succès" });
    } catch (err) {
        console.error("❌ Erreur de création :", err.message);
        res.status(500).json({ error: "Erreur interne" });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        // Exécute la suppression
        const deleteResult = await deleteCategorieById(id);
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

