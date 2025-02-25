import { connectDB } from "../Config/db.js";

export const getIdMovie = async (req, res) => {
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
        console.log("📩 Données reçues :", req.body);

        const { title, description, release_date, director, rating, video, trailer, img_presentation, img_cover, id_category } = req.body;

        if (!title || !description || !release_date || !director || !rating || !video || !trailer || !img_presentation || !img_cover || !id_category) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        const db = await connectDB();
        const [result] = await db.query(
            "INSERT INTO movie (title, description, release_date, director, rating, video, trailer, img_presentation, img_cover, id_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, description, release_date, director, rating, video, trailer, img_presentation, img_cover, id_category]
        );

        console.log("✅ Film ajouté avec ID :", result.insertId);
        res.status(201).json({ message: "Film ajouté avec succès" });
    } catch (err) {
        console.error("❌ Erreur de création :", err.message);
        res.status(500).json({ error: "Erreur interne" });
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
