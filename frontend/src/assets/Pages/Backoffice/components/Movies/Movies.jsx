import './Movies.css';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Button from '../../../../components/Btn-generique/btn.jsx';
import Input from '../../../../components/Input-Form/Input.jsx';
import wallpaper from '../../../../images/Background/bg-popup.jpeg';
import movieService from '../../../../../services/movieService.js';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const Movies = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    setVisible(!visible);
  };
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    release_date: '',
    img_cover: null,
    img_presentation: null,
    trailer: null,
    video: null,
    rating: 0,
    id_category: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'title',
      'director',
      'release_date',
      'img_cover',
      'img_presentation',
      'trailer',
      'video',
      'rating',
      'id_category',
      'description'
    ];

    // Validation des champs requis
    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === 'string' && formData[field].trim() === '')
      ) {
        alert(`Le champ "${field}" est requis.`);
        return;
      }
    }

    // Validation spécifique pour la note
    if (formData.rating < 0 || formData.rating > 5) {
      alert('La note doit être comprise entre 0 et 5.');
      return;
    }

    // Debug visuel
    console.log('📦 Données à envoyer :');
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value);
      }
    });

    try {
      await movieService.addMovie(formData);

      // Reset du formulaire
      setFormData({
        title: '',
        director: '',
        release_date: '',
        img_cover: null,
        img_presentation: null,
        trailer: null,
        video: null,
        rating: 0,
        id_category: '',
        description: ''
      });

      // Reset des inputs file
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = '';
      });

      await fetchMovies();
      setVisible(false);
      console.log('✅ Film ajouté avec succès !');
      alert('Film ajouté avec succès !');
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du film :", error);

      // Affichage d'un message d'erreur plus détaillé
      let errorMessage = "Une erreur est survenue lors de l'ajout du film.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      alert(errorMessage);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      try {
        await movieService.deleteMovie(movieId);
        await fetchMovies();
        console.log('✅ Film supprimé avec succès !');
      } catch (error) {
        console.error('❌ Erreur lors de la suppression du film:', error);
        alert('Erreur lors de la suppression du film.');
      }
    }
  };

  const fetchMovies = async () => {
    try {
      const [moviesData, categoriesData] = await Promise.all([
        movieService.getAllMovies(),
        movieService.getCategories()
      ]);

      const categoryMap = {};
      categoriesData.forEach((cat) => {
        categoryMap[cat.id_category] = cat.category_name;
      });

      setMovies(moviesData);
      setCategories(categoryMap);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des films :', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="movies p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="py-4">Movies ({movies.length})</h3>
        <Button onClick={toggleVisible} children={'Ajouter'} className="p-btn" />
      </div>

      <div className="table-wrapper" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <table className="table overflow-y-scroll align-items-center mb-0">
          <thead className="table-light sticky-top bg-white" style={{ top: 0, zIndex: 1 }}>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Couverture</th>
              <th className="text-start">Titre</th>
              <th className="text-center">Date de sortie</th>
              <th className="text-center">Date de création</th>
              <th className="text-center">Note</th>
              <th className="text-center">Catégorie</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {movies.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <p className="mb-0 text-muted">Aucun film trouvé</p>
                </td>
              </tr>
            ) : (
              movies.map((movie) => (
                <tr key={movie.id_movie}>
                  <td className="text-center">
                    <p className="mb-0 py-2 text-dark text-sm">{movie.id_movie}</p>
                  </td>
                  <td className="text-center">
                    <img
                      src={movie.img_cover}
                      alt={movie.title}
                      className="avatar rounded-5 avatar-sm me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = wallpaper; // Image de fallback
                      }}
                    />
                  </td>
                  <td className="w-25">
                    <p className="mb-0 py-2 text-dark text-sm">{movie.title}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-dark">
                      {movie.release_date
                        ? format(new Date(movie.release_date), 'dd/MM/yyyy')
                        : 'N/A'}
                    </p>
                  </td>
                  <td className="text-center">
                    <p className="text-xs text-dark font-weight-bold">
                      {movie.created_at ? format(new Date(movie.created_at), 'dd/MM/yyyy') : 'N/A'}
                    </p>
                  </td>
                  <td className="text-center">
                    <div className="progress-wrapper w-75 mx-auto">
                      <div className="progress-info d-flex justify-content-between">
                        <span className="text-xs text-dark font-weight-bold">
                          {(movie.rating * 20).toFixed(0)}%
                        </span>
                      </div>
                      <div className="progress bg-transparent">
                        <progress
                          value={movie.rating}
                          max="5"
                          className="w-100"
                          style={{ height: '10px' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <p className="text-dark">{categories[movie.id_category] || 'N/A'}</p>
                  </td>
                  <td className="text-center">
                    <Button
                      onClick={() => handleDelete(movie.id_movie)}
                      children={'Supprimer'}
                      className="s-btn"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {visible && (
        <div className="overlay position-fixed d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3 top-0 bottom-0 end-0 start-0">
          <div
            className="movie-form-container position-relative p-4 rounded"
            style={{ width: '80%', maxHeight: '90vh', overflowY: 'auto' }}>
            <Button
              onClick={toggleVisible}
              className="btn border-0 text-danger text-opacity-75 end-0 position-absolute">
              <IoMdCloseCircleOutline size={25} />
            </Button>
            <h2 className="text-light text-center fs-lg-1 mb-4">Ajouter un film</h2>
            <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white rounded-4 shadow-sm">
              <div className="d-flex flex-wrap gap-4">
                <div className="flex-grow-1" style={{}}>
                  <div className="d-flex gap-3 mb-3">
                    <div className="w-100">
                      <label className="form-label text-dark">Titre *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control bg-primary bg-opacity-10"
                        placeholder="Ex: Black Panther"
                        required
                      />
                    </div>
                    <div className="w-100">
                      <label className="form-label text-dark">Réalisateur *</label>
                      <input
                        type="text"
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        className="form-control bg-primary bg-opacity-10"
                        placeholder="Ex: John Kennedy"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Date de sortie *</label>
                    <input
                      type="date"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleChange}
                      className="form-control bg-primary bg-opacity-10"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Couverture * (Image)</label>
                    <input
                      type="file"
                      name="img_cover"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-control bg-primary bg-opacity-10"
                      required
                    />
                    {formData.img_cover && (
                      <small className="text-muted">
                        Fichier sélectionné: {formData.img_cover.name}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Image de présentation * (Image)</label>
                    <input
                      type="file"
                      name="img_presentation"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-control bg-primary bg-opacity-10"
                      required
                    />
                    {formData.img_presentation && (
                      <small className="text-muted">
                        Fichier sélectionné: {formData.img_presentation.name}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Bande annonce * (Vidéo)</label>
                    <input
                      type="file"
                      name="trailer"
                      onChange={handleChange}
                      accept="video/*"
                      className="form-control bg-primary bg-opacity-10"
                      required
                    />
                    {formData.trailer && (
                      <small className="text-muted">
                        Fichier sélectionné: {formData.trailer.name} (
                        {(formData.trailer.size / 1024 / 1024).toFixed(2)} MB)
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Film complet * (Vidéo)</label>
                    <input
                      type="file"
                      name="video"
                      onChange={handleChange}
                      accept="video/*"
                      className="form-control bg-primary bg-opacity-10"
                      required
                    />
                    {formData.video && (
                      <small className="text-muted">
                        Fichier sélectionné: {formData.video.name} (
                        {(formData.video.size / 1024 / 1024).toFixed(2)} MB)
                      </small>
                    )}
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div className="w-100">
                      <label htmlFor="rating" className="form-label text-dark">
                        Note * (0-5)
                      </label>
                      <input
                        type="number"
                        value={formData.rating}
                        onChange={handleChange}
                        id="rating"
                        name="rating"
                        className="form-control bg-primary bg-opacity-10"
                        min="0"
                        max="5"
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="w-100">
                      <label className="form-label text-dark">Catégorie *</label>
                      <select
                        name="id_category"
                        value={formData.id_category}
                        onChange={handleChange}
                        className="form-control bg-primary bg-opacity-10"
                        required>
                        <option value="">-- Sélectionner une catégorie --</option>
                        {Object.entries(categories).map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-dark">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="form-control bg-primary bg-opacity-10"
                      placeholder="Description du film..."
                      required
                    />
                  </div>
                </div>

                <div className="w-100 w-md-50" style={{ maxWidth: '50%' }}>
                  <img
                    src={wallpaper}
                    className="w-100 h-100 rounded-4"
                    alt="Movie form background"
                    style={{ objectFit: 'cover', minHeight: '400px' }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  children={'Ajouter le film'}
                  className="p-btn opacity-75 w-100"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
