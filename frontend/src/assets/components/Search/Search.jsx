import './Search.css';
import Input from '../Input-Form/Input.jsx';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import movieService from '../../../services/movieService.js';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Gérer le changement de taille d'écran (responsive)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Récupération et décodage du token pour obtenir l'id_user
  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id_user : null;

  // Recherche de films avec délai (debounce)
  useEffect(() => {
    const fetchSearch = async () => {
      if (searchValue.trim() === '') {
        setSearchResults([]);
        return;
      }

      if (!token || !userId) {
        console.error('Token ou userId manquant');
        setSearchResults([]);
        return;
      }

      try {
        const response = await movieService.searchMovies(searchValue, userId);
        setSearchResults(response || []);
      } catch (error) {
        console.error('Erreur de recherche :', error.response?.status, error.message);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, userId, token]);

  // Chargement des catégories une fois au montage du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await movieService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchValue('');
    setSearchResults([]);
  };

  const handleClear = () => {
    setSearchValue('');
    setSearchResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page au submit
  };

  // Fonction pour créer un slug à partir du nom de catégorie
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

  return (
    <div className="search-component position-relative">
      <div
        className="container-fluid search-bar-container mt-lg-0 mt-5 d-flex flex-column pt-1 pt-lg-5 justify-content-center align-items-center text-light position-fixed top-0 z-2"
        style={{ height: isMobile ? '330px' : '500px' }}>
        <h1 className={`display-4 text-center z-3 mb-4 ${isMobile ? 'fs-2' : ''}`}>
          Découvrez le film parfait
          <br />
          Avec une recherche et une sélection sans effort
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-100 px-3"
          style={{ maxWidth: isMobile ? '100%' : '920px' }}>
          <div className="position-relative">
            <Input
              classlabel="visually-hidden"
              classinput="form-control form-control-lg rounded-pill py-3 px-5"
              type="text"
              placeholder="Ex: Spider-Man 3"
              id="search-input"
              name="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setShowSearch(true)}
              autoComplete="off"
            />
            <FaSearch
              className="position-absolute"
              style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#000' }}
            />
            {searchValue && (
              <FaTimes
                className="position-absolute"
                style={{
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#000',
                  cursor: 'pointer'
                }}
                onClick={handleClear}
                aria-label="Effacer la recherche"
              />
            )}
          </div>
        </form>

        <div className="container z-3 categories-container py-4">
          <div className="row justify-content-center g-2">
            {categories.slice(0, isMobile ? 6 : 10).map((category) => (
              <div key={category.id_category} className="col-auto">
                <Link
                  to={`/catalogue#${slugify(category.category_name)}`}
                  className="text-decoration-none">
                  <span className="badge border border-light rounded-pill px-3 py-2">
                    {category.category_name}
                  </span>
                </Link>
              </div>
            ))}
            <div className="col-auto">
              <Link to="/catalogue" className="text-decoration-none">
                <span className="badge border border-light rounded-pill px-3 py-2">...</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-fluid search-content position-absolute py-4"
        style={{ top: isMobile ? '280px' : '420px' }}>
        {searchResults.length > 0 ? (
          <>
            <p
              className="position-fixed z-2 h6 text-white mb-4"
              style={{ top: isMobile ? '303px' : '450px', left: isMobile ? '1em' : '3em' }}>
              Titres liés à : <strong>{searchValue}</strong>
            </p>

            <div className="row g-lg-1 g-3 p-3" style={{ marginTop: isMobile ? '10px' : '50px' }}>
              {searchResults.map((movie) => (
                <div
                  key={movie.id_movie}
                  className={`col-12 ${isMobile ? '' : 'col-md-6 col-lg-2'}`}>
                  <Link
                    to={`/detail/${movie.id_movie}`}
                    onClick={handleSearchClose}
                    className="text-decoration-none text-light">
                    <div className="d-flex align-items-center justify-content-center pb-3">
                      <img
                        src={movie.img_presentation}
                        alt={movie.title}
                        style={{
                          width: isMobile ? '70px' : '150px',
                          height: isMobile ? '100px' : '220px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <div className="flex-grow-1 ms-3 d-lg-none">
                        <h5 className="mb-2">{movie.title}</h5>
                        <p className="mb-0 text-white text-opacity-25 small">
                          {format(new Date(movie.release_date), "d MMMM yyyy 'à' HH:mm", {
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="row justify-content-center align-items-center min-vh-50">
            <div className="col-12 text-center">
              <h2 className={isMobile ? 'h4' : 'h2'}>Faites une recherche ...</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
