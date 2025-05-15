import { connectDB} from "../Config/db.js";

const BASE_URL = process.env.BASE_URL



export const deleteSearch = async (req, res) =>{
    try {
        const db = await connectDB();
        const { id_search } = req.params;
        const [result] = await db.execute(
            'DELETE FROM search WHERE id_search =?' [id_search]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Recherche non trouvée"})

        res.status(200).json({ message: "Recherche supprimée"})
    }catch (error) {
        console.error('❌ Erreur lors de la suppression de la recherche:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

export const getPopularSearch = async (req, res) => {
    try {
        const db = await connectDB();
        
        // Récupérer l'ID utilisateur depuis le token ou les paramètres de la requête
        const userId = req.query.userId || null;
        if (!userId) {
            return res.status(400).json({ message: "ID utilisateur requis." });
        }

        // Requête SQL filtrant par userId
        const [popularSearches] = await db.execute(
            'SELECT keyword, COUNT(*) as search_count FROM search WHERE id_user = ? GROUP BY keyword ORDER BY search_count DESC LIMIT 10',
            [userId]
        );
        
        res.json(popularSearches);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des recherches populaires:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}


export const searchMovies = async (req, res) => {
    try {
        const db = await connectDB();
        const { q } = req.query;
        const userId = req.query.userId; // Changé de id_user à userId pour correspondre au paramètre de la requête

        if (!q) {
            return res.status(400).json({ message: "Le mot-clé est requis." });
        }

        // Vérification de userId avant l'insertion
        if (!userId) {
            return res.status(400).json({ message: "ID utilisateur requis." });
        }

        // Recherche des films
        const [movies] = await db.execute(
            'SELECT * FROM movie WHERE title LIKE ?',
            [`%${q}%`]
        );

        // Si aucun film n'est trouvé
        if (movies.length === 0) {
            return res.status(404).json({ message: "Aucun film trouvé." });
        }

        const movieWithUrls = movies.map(movie => ({
            ...movie,
            img_presentation: `${BASE_URL}/${movie.img_presentation}`,
            img_cover: `${BASE_URL}/${movie.img_cover}`,
            trailer: `${BASE_URL}/${movie.trailer}`,
            video: `${BASE_URL}/${movie.video}`
        }));

        // Insertion de la recherche avec vérification
        await db.execute(
            'INSERT INTO search (keyword, id_user) VALUES (?, ?)',
            [q, userId]
        );

        res.json(movieWithUrls);
    } catch (error) {
        console.error('❌ Erreur de recherche:', error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
};

  
  
