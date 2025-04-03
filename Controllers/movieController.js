import { connectDB } from "../Config/db.js";
import upload from "../Config/uploadConfig.js";


export const getIdMovie = async (req, res) => {é
    try {
        const db = await connectDB();
        const [movie] = await db.query ("SELECT * FROM movie WHERE id_movie = ?", [req.params.id]);
        if(!movie.length){
            return res.status(404).json({message: '❌ Film impossible a trouver'})
        }
        console.log("+1 req save !⏺️");
        res.status(200).json(movie[0])
    }catch (error){
        console.log('❌', error)
        res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
    }
}
export const getMovies = async (req, res) => {
    try{
        const db = await connectDB();
        const [movies] = await db.query("SELECT * FROM movie");
        res.status(200).json(movies);
        console.log("+1 req save !⏺️")
    }catch(err){
        console.error('❌ Erreur de reccuperation',err.message)
        res.status(500).json({error: "Erreur interne"})
    }

}
export const addMovie = async (req, res) => {
    try {
        // Gérer l'upload de fichier d'abord
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) {
                    console.error("Erreur d'upload:", err);
                    return reject(err);
                }
                resolve();
            });
        });

        console.log("Fichiers reçus:", req.files);
        
        const db = await connectDB();
        
        // Préparer les données du film
        const movieData = {
            title: req.body.title,
            description: req.body.description || null,
            release_date: req.body.release_date || null,
            director: req.body.director || null,
            rating: req.body.rating || null,
            // Utiliser les chemins stockés ou construire les chemins à partir des fichiers
            video: req.files?.["video"] ? 
                (req.filesPaths?.video || `uploads/${req.files["video"][0].destination}/${req.files["video"][0].filename}`) : null,
            trailer: req.files?.["trailer"] ? 
                (req.filesPaths?.trailer || `uploads/${req.files["trailer"][0].destination}/${req.files["trailer"][0].filename}`) : null,
            img_presentation: req.files?.["img_presentation"] ? 
                (req.filesPaths?.img_presentation || `uploads/${req.files["img_presentation"][0].destination}/${req.files["img_presentation"][0].filename}`) : null,
            img_cover: req.files?.["img_cover"] ? 
                (req.filesPaths?.img_cover || `uploads/${req.files["img_cover"][0].destination}/${req.files["img_cover"][0].filename}`) : null,
            id_category: req.body.id_category || null
        };

        console.log("Données à insérer:", movieData);

        // Insérer le nouveau film
        const [result] = await db.execute(
            `INSERT INTO movie (title, description, release_date, director, rating, video, trailer, img_presentation, img_cover, id_category) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [movieData.title, movieData.description, movieData.release_date, movieData.director, 
             movieData.rating, movieData.video, movieData.trailer, movieData.img_presentation, 
             movieData.img_cover, movieData.id_category]
        );

        res.status(201).json({
            message: "Film ajouté avec succès!",
            movieId: result.insertId,
            movie: movieData
        });

    } catch (err) {
        console.error('❌ Erreur détaillée lors de l\'ajout du film:', err);
        res.status(500).json({
            error: "Erreur interne lors de l'ajout du film",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
export const putMovie = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params; 
        const newData = req.body;

        const [existingMovie] = await db.query("SELECT * FROM movie WHERE id_movie = ?", [id]);

        if (existingMovie.length === 0) {
            console.log("❌ Ce film n'existe pas.");
            return res.status(404).json({ error: "❌ Film non trouvé" });
        }
        const [updateResult] = await db.query(
            "UPDATE movie SET title = ?, description = ?, release_date = ?, director = ?, rating = ?, video = ?, trailer = ?, img_presentation = ?, img_cover = ?, id_category = ? WHERE id_movie = ?",
            [
                newData.title,
                newData.description,
                newData.release_date,
                newData.director,
                newData.rating,
                newData.video,
                newData.trailer,
                newData.img_presentation,
                newData.img_cover,
                newData.id_category,
                id, 
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
export const deleteMovie = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        const [existingMovie] = await db.query("DELETE FROM movie WHERE id_movie = ?", [id]);
        if (existingMovie.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Film non trouvé" });
        }
        res.status(200).json({ message: "✅ Film supprimé avec succès !" });
    } catch (err) {
        console.error("❌ Erreur :", err.message);
        res.status(500).json({ error: "❌ Erreur interne" });
    }
};
