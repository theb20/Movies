import './Galerie.css';
import { useEffect, useState } from 'react';
import Button from '../../components/Btn-generique/btn.jsx'
import { Link } from 'react-router-dom';
import moviesService from '../../../services/movieService.js';
import componentGalerie from '../../images/Background/component-bg-galerie.png';

const Galerie = () => {
  const [imgs, setImgs] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, categoriesData] = await Promise.all([
          moviesService.getAllMovies(),
          moviesService.getCategories()
        ]);

        const categoryMap = {};
        categoriesData.forEach(cat => {
          categoryMap[cat.id_category] = cat.category_name;
        });

        setImgs(moviesData);
        setCategories(categoryMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchImgs = async () => {
      try {
        const data = await moviesService.getAllMovies();
        setImgs(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      }
    };
    fetchImgs();
  }, []);

  const handleImageClick = (movie, e) => {
    e.preventDefault();
    setSelectedMovie(movie);
  };

  const closePopup = () => {
    setSelectedMovie(null);
  };

  return (
    <main className="text-white">
      {/* Section Titre et Description */}
      <section className={`vh-75 px-3 px-lg-5 py-4 d-flex ${isMobile ? 'flex-column gap-4' : 'justify-content-between'} align-items-center GalerieOne`}>
        <div className="container-Galerie-left z-2">
          <h1 className={isMobile ? 'fs-2 text-center' : ''}>Galerie</h1>
          <p className={isMobile ? 'text-center px-2' : 'w-50'}>
            Cette page décrit les règles d'utilisation de notre plateforme pour vous garantir une expérience sécurisée et de qualité. En l'acceptant, vous utilisez notre service en toute confiance.
          </p>
        </div>
        <div className="container-Galerie-right z-2">
          <img 
            src={componentGalerie} 
            alt="Illustration galerie" 
            style={{
              maxWidth: isMobile ? '250px' : '100%',
              height: 'auto'
            }}
          />
        </div>
      </section>

      {/* Section Cartes avec vraies données */}
      <section className="d-flex flex-wrap gap-3 gap-lg-4 justify-content-center py-4 py-lg-5 px-2 px-lg-5">
        <div className="container-card justify-content-center d-flex flex-wrap gap-3 gap-lg-4">
          {imgs.map((movie) => (
            <Link 
              to={`/detail/${movie.id_movie}`} 
              key={movie.id} 
              className="card-link"
              onClick={(e) => handleImageClick(movie, e)}
            >
              <div 
                className="card custom-card bg-dark text-center" 
                style={{ 
                  width: isMobile ? "150px" : "200px",
                  height: isMobile ? "225px" : "300px"
                }}
              >
                <img
                  src={movie.img_presentation}
                  alt={movie.title}
                  className="card-img-top rounded h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {selectedMovie && (
  <div className="modal fade show d-block" tabIndex="-1" onClick={closePopup} style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
    <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content bg-dark text-white border-0 rounded-4 shadow-lg overflow-hidden">

        {/* En-tête */}
        <div className="modal-header border-0">
          <h2 className="modal-title fw-bold">{selectedMovie.title}</h2>
          <button type="button" className="btn-close btn-close-white" onClick={closePopup}></button>
        </div>

        {/* Corps */}
        <div className="modal-body p-4">
          <div className="row g-4 align-items-center">
            {/* Affiche */}
            <div className="col-lg-5 text-center">
              <img
                src={selectedMovie.img_cover}
                alt={selectedMovie.title}
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>

            {/* Infos */}
            <div className="col-lg-7">
              <p className="lead">{selectedMovie.description}</p>
              <div className="d-flex flex-column gap-1 mt-3">
                <div><strong>Date de sortie :</strong> {selectedMovie.release_date}</div>
                <div><strong>Réalisateur :</strong> {selectedMovie.director}</div>
                <div><strong>Ajouté le :</strong> {selectedMovie.created_at}</div>
                <div><strong>Catégorie :</strong> {categories[selectedMovie.id_category]}</div>
                <div><strong>Note :</strong> {selectedMovie.rating}/5</div>
              </div>

              <Link to={`/detail/${selectedMovie.id_movie}`} className="btn btn-danger mt-4 px-4 py-2 fs-5 fw-semibold">
                ▶ Regarder maintenant
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
)}

    </main>
  );
};

export default Galerie;
