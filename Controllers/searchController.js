import {getAllSearch, deleteSearchById, searchQuerryByMovies, insertSearch, getMoviesPopularSearch} from "../models/searchModel.js"
import dotenv from "dotenv";
dotenv.config();


export const getSearches = async (req, res) => {
    try {
        const searches = await getAllSearch();
        res.json(searches);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des recherches:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
export const deleteSearch = async (req, res) =>{
    try {
        const { id_search } = req.params;
        console.log(id_search)
        const result = await deleteSearchById(id_search);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Recherche non trouvée" });
        }
        res.status(200).json({ message: "Recherche supprimée"})
    }catch (error) {
        console.error('❌ Erreur lors de la suppression de la recherche:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
export const getPopularSearch = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis." });
    }

    const popularSearches = await getMoviesPopularSearch(userId);

    res.json(popularSearches);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des recherches populaires:', error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
export const searchMovies = async (req, res) => {
    try {
        const { q, userId } = req.query;

        if (!q) {
            return res.status(400).json({ message: "Le mot-clé est requis." });
        }

        if (!userId) {
            return res.status(400).json({ message: "ID utilisateur requis." });
        }

        const movies = await searchQuerryByMovies(q);

        if (movies.length === 0) {
            return res.status(404).json({ message: "Aucun film trouvé." });
        }

        const BASE_URL = process.env.BASE_URL;

        const movieWithUrls = movies.map(movie => ({
            ...movie,
            img_presentation: `${BASE_URL}/${movie.img_presentation}`,
            img_cover: `${BASE_URL}/${movie.img_cover}`,
            trailer: `${BASE_URL}/${movie.trailer}`,
            video: `${BASE_URL}/${movie.video}`
        }));

        await insertSearch(q, userId)

        res.status(200).json(movieWithUrls);
    } catch (error) {
        console.error('❌ Erreur de recherche:', error);
        res.status(500).json({ message: "Erreur lors de la recherche." });
    }
};


  
  
