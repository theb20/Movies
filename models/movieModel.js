import { connectDB } from "../Config/db.js ";

export const insertMovie = async (
    title,
    description,
    release_date,
    director,
    rating,
    video,
    trailer,
    img_presentation,
    img_cover,
    id_category
  ) => {
    try {
      const db = await connectDB();
      const [result] = await db.execute(
        `INSERT INTO movie 
          (title, description, release_date, director, rating, video, trailer, img_presentation, img_cover, id_category) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          release_date,
          director,
          rating,
          video,
          trailer,
          img_presentation,
          img_cover,
          id_category,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("❌ insertMovie:", error);
      throw new Error("Erreur interne, veuillez réessayer plus tard.");
    }
  };
export const deleteMovieById = async (id) => {
    try {
      const db = await connectDB();
      const [result] = await db.query('DELETE FROM movie WHERE id_movie =?', [id]);
      return result;
    } catch (error) {
      console.error('❌ deleteMovie:', error);
      throw new Error("Erreur interne lors de la suppression du film");
    }
}
export const AllMovies = async () => {
    try {
      const db = await connectDB();
      const [movies] = await db.query('SELECT * FROM movie');
      return movies;
    } catch (error) {
      console.error('❌ getAllMovies:', error);
      throw new Error("Erreur interne lors de la récupération des films");
    }
}
export const movieById = async (id) =>{
    try{
        const db = await connectDB();
        const [movie] = await db.query('SELECT * FROM movie WHERE id_movie =?', [id]);
       
        return movie[0];
    }catch(error){
        console.error('❌ movieById:', error);
        throw new Error("Erreur interne lors de la récupération du film");  
    }
}
export const updateMovie = async (id, newData) => {
  try {
    const db = await connectDB();

    const fields = [];
    const values = [];

    if (newData.title !== undefined && newData.title !== '') {
      fields.push('title = ?');
      values.push(newData.title);
    }
    if (newData.description !== undefined && newData.description !== '') {
      fields.push('description = ?');
      values.push(newData.description);
    }
    if (newData.release_date !== undefined && newData.release_date !== '') {
      fields.push('release_date = ?');
      values.push(newData.release_date);
    }
    if (newData.director !== undefined && newData.director !== '') {
      fields.push('director = ?');
      values.push(newData.director);
    }
    if (newData.rating !== undefined && newData.rating !== '') {
      fields.push('rating = ?');
      values.push(newData.rating);
    }
    if (newData.video !== undefined && newData.video !== '') {
      fields.push('video = ?');
      values.push(newData.video);
    }
    if (newData.trailer !== undefined && newData.trailer !== '') {
      fields.push('trailer = ?');
      values.push(newData.trailer);
    }
    if (newData.img_presentation !== undefined && newData.img_presentation !== '') {
      fields.push('img_presentation = ?');
      values.push(newData.img_presentation);
    }
    if (newData.img_cover !== undefined && newData.img_cover !== '') {
      fields.push('img_cover = ?');
      values.push(newData.img_cover);
    }
    if (newData.id_category !== undefined && newData.id_category !== '') {
      fields.push('id_category = ?');
      values.push(newData.id_category);
    }

    if (fields.length === 0) {
      throw new Error("Aucune donnée à mettre à jour.");
    }

    const sql = `UPDATE movie SET ${fields.join(', ')} WHERE id_movie = ?`;
    values.push(id);

    const [result] = await db.query(sql, values);
    return result;

  } catch (error) {
    console.error('❌ updateMovie:', error);
    throw new Error("Erreur interne lors de la mise à jour du film");
  }
}
