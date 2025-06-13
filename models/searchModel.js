import { connectDB } from "../Config/db.js";

// Récupération de toutes les recherches
export const getAllSearch = async () => {
  try {
    const db = await connectDB();
    const [search] = await db.query("SELECT * FROM search");
    return search;
  } catch (error) {
    console.error("❌ getAllSearch:", error);
    throw new Error("Erreur lors de la récupération des recherches.");   
  }
}
// Supprimer une recherche
export const deleteSearchById = async (id_search) => {
  try {
    const db = await connectDB();
    const [result] = await db.execute(
      'DELETE FROM search WHERE id_search =?', [id_search]
    );  
    return result;
  }catch (error) {
    console.error("❌ deleteSearch:", error);
    throw new Error("Erreur lors de la suppression de la recherche.");   
  }
}
// recherche par film
export const searchQuerryByMovies = async (query) => {
  try {
    const db = await connectDB();
    const [movies] = await db.execute('SELECT * FROM movie WHERE title LIKE?', [`%${query}%`]);
    return movies;
  } catch (error) {
    console.error("❌ searchMovies:", error);
    throw new Error("Erreur lors de la recherche de films.");   
  }
}
// insertion de la recherche
export const insertSearch = async (keyword, userId) => {
  try {
    const db = await connectDB();
    const [result] = await db.execute(
      'INSERT INTO search (keyword, id_user) VALUES (?,?)',
      [keyword, userId]
    );
    return result.insertId;
  } catch (error) {
    console.error("❌ insertSearch:", error);
    throw new Error("Erreur lors de l'insertion de la recherche.");   
  }
}
export const getMoviesPopularSearch = async (userId) => {
    try {
      const db = await connectDB();
      const [popularSearches] = await db.execute(
        `SELECT keyword, COUNT(*) AS search_count
         FROM search
         WHERE id_user = ?
         GROUP BY keyword
         ORDER BY search_count DESC
         LIMIT 10`,
        [userId]
      );
      return popularSearches;
    } catch (error) {
      console.error("❌ getMoviesPopularSearch:", error);
      throw new Error("Erreur lors de la récupération des recherches populaires.");   
    }
  };
  