import { connectDB } from "../Config/db.js";

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
