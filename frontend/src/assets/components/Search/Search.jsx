import './Search.css';
import Input from "../Input-Form/Input.jsx";
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import movieService from "../../../services/movieService.js";
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]); // Modifié pour utiliser un tableau

  // Récupération et décodage du token pour obtenir l'id_user
  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id_user : null;
  
  useEffect(() => {
    const fetchSearch = async () => {
      if (searchValue.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        if (!token || !userId) {
          console.error("Token ou userId manquant");
          return;
        }

        const response = await movieService.searchMovies(searchValue, userId);
        console.log('Réponse de la recherche:', response);
        // Modification ici : on utilise directement response car c'est déjà les données
        setSearchResults(response || []);
      } catch (error) {
        console.error("Erreur de recherche :", error.response?.status, error.message);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, userId, token]);

  // Ajout du useEffect pour charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await movieService.getCategories();
        setCategories(response); // Stockage direct du tableau de catégories
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
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
    e.preventDefault();
  };

  return (
    <div className="search-component position-relative">
      
      <div className="search-bar-container d-flex flex-column justify-content-center align-items-center text-light position-fixed top-0 w-100 z-2">
        <h1 className="fs-1 z-2 text-center">
        Découvrez le film parfait
        <br/>
        Avec une recherche et une sélection sans effort
        </h1>
        <form onSubmit={handleSubmit} className="p-4" style={{width:'920px'}}>
          <div className="position-relative">
            <Input
              classlabel="d-none"
              classinput="rounded-5 bg-white p-3 ps-5 pe-5 w-100"
              type="text"
              placeholder="Ex: Spider-Man 3"
              id="search-input"
              name="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setShowSearch(true)}
            />
            <FaSearch className="position-absolute" style={{ left: 15, top: '50%', transform: 'translateY(-50%)', color: '#000' }} />
            {searchValue && (
              <FaTimes
                className="position-absolute"
                style={{ right: 15, top: '50%', transform: 'translateY(-50%)', color: '#000', cursor: 'pointer' }}
                onClick={handleClear}
              />
            )}
          </div>
        </form>
        <div className="categories-container z-2 mb-5">
                <div className="flex-wrap gap-2 d-flex">
                  <>
                  {categories.slice(0,10).map((category) => (
                    <div key={category.id_category} className="">
                      <Link
                        to={`/catalogue?category=${category.id_category}`}
                        className="d-flex"
                      >
                        <p className="border rounded-5 text-center p-1">{category.category_name}</p>
                      </Link>
                      
                    </div>
                    
                  ))}<Link
                        to={'/catalogue'}
                        className="d-flex">
                          <p className="border rounded-5 text-center py-1 px-3">...</p>
                      </Link>
                    </>
                </div>
        </div>
      </div>

      <div className="search-content position-absolute p-5 z-1" style={{top:"420px"}}>
      {searchResults.length > 0 ? (
  <div className="search-results">
    <p className="position-fixed fs-5 p-2" style={{top:'480px'}}>
      Titres liés à : <strong>{searchValue}</strong>
    </p>

    <div className="d-flex flex-wrap justify-content-start mt-5">
      {searchResults.map((movie) => (
        <Link
          key={movie.id_movie}
          to={`${movie.id_movie}`}
          onClick={handleSearchClose}
          className=""
        >
          <img
            src={movie.img_cover}
            alt={movie.title}
            className="m-3"
            style={{
              width: '210px',
              height: '320px',
              objectFit: 'cover',
              borderRadius: '6px',
            }}
          />
        </Link>
      ))}
    </div>
  </div>
      ) : (
        <div className="categories-container d-flex align-items-center justify-content-center w-100 h-100 p-4 text-center ">
          <h1 className="m-0">Faites une recherche ...</h1>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default Search;
