import { connectDB } from "../Config/db.js";

export const getAllCatalog = async () => {
    try {
        const db = await connectDB();
        const [catalog] = await db.query("SELECT * FROM category");
        return catalog;
    } catch (error) {
        console.error("❌", error);
        throw new Error("Erreur lors de la récupération des catégories.");  
    }
}

export const getCategorieById = async (id) => {
    try {
        const db = await connectDB();
        const [categorie] = await db.query("SELECT * FROM category WHERE id_category = ?", [id]);
        return categorie[0];
    } catch (error) {
        console.error("❌", error);
        throw new Error("Erreur lors de la récupération de la catégorie.");
    }
}
export const insertCategorie = async (category_name, slug) => {
    try {
        const db = await connectDB();
        const [result] = await db.query(
            "INSERT INTO category (category_name, slug) VALUES (?,?)",
            [category_name, slug]
        );
        return result;
    } catch (error) {
        console.error("❌", error);
        throw new Error("Erreur lors de la création de la catégorie."); 
    }
}
export const deleteCategorieById = async (id_category) => {
    try {
        const db = await connectDB();
        const [result] = await db.query("DELETE FROM category WHERE id_category =?", [id_category]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la suppression de la catégorie.");
    }
}