import './Movies.css';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Button from '../../../../components/Btn-generique/btn.jsx';
import { jwtDecode } from 'jwt-decode';
import Input from '../../../../components/Input-Form/Input.jsx';
import wallpaper from '../../../../images/Background/bg-popup.jpeg';
import movieService from '../../../../../services/movieService.js';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const MoviesMobile = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  const [visible, setVisible] = useState(false);
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState({});

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

  const handleDelete = async (movieId) => {
    if (window.confirm('Supprimer ce film ?')) {
      try {
        await movieService.deleteMovie(movieId);
        fetchMovies();
      } catch (err) {
        console.error('Erreur suppression :', err);
      }
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="movies-mobile p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-primary">Films ({movies.length})</h4>
        <Button onClick={() => setVisible(!visible)} children="Ajouter" className="btn-sm" />
      </div>

      <div className="movie-list d-flex flex-column gap-3">
        {movies.length === 0 ? (
          <p className="text-muted text-center">Aucun film trouvé</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id_movie} className="card shadow-sm rounded p-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={movie.img_cover || wallpaper}
                  alt={movie.title}
                  className="rounded"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <h6 className="mb-1 text-dark">{movie.title}</h6>
                  <small className="text-muted">
                    {movie.release_date
                      ? format(new Date(movie.release_date), 'dd/MM/yyyy')
                      : 'N/A'}
                  </small>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="badge bg-secondary">
                  {categories[movie.id_category] || 'Catégorie inconnue'}
                </span>
                {userRole === 'admin' && (
                  <Button
                    onClick={() => handleDelete(movie.id_movie)}
                    children="Supprimer"
                    className="btn-sm bg-danger text-white"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {visible && (
        <div className="overlay position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center">
          <div
            className="p-4 bg-white rounded w-100 mx-3"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-end">
              <button onClick={() => setVisible(false)} className="btn btn-link text-danger p-0">
                <IoMdCloseCircleOutline size={24} />
              </button>
            </div>
            <h5 className="text-center mb-3">Ajouter un film</h5>
            {/* Mini version du formulaire ici */}
            <p className="text-muted text-center">
              Formulaire non inclus dans la version mobile démo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesMobile;
