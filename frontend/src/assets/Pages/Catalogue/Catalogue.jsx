import { useEffect, useState } from 'react';
import { FaStar, FaPlay, FaPlus } from 'react-icons/fa6';
import Carousel from 'react-bootstrap/Carousel';
import movieService from '../../../services/movieService.js';
import Button from '../../components/Btn-generique/btn.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import './Catalogue.css';

const Catalogue = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Gérer le responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (selectedIndex) => setCurrentIndex(selectedIndex);

  // Récupération des données
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [moviesData, categoriesData] = await Promise.all([
          movieService.getAllMovies(),
          movieService.getCategories()
        ]);
        setMovies(moviesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des films ou catégories :', error);
      }
    };

    fetchMovies();
  }, []);

  // Composant pour afficher une carte de film
  const MovieCard = ({ movie, showTitle = true }) => (
    <div className="movie-card position-relative">
      <Link to={`/detail/${movie.id_movie}`}>
        <img
          src={isMobile ? movie.img_presentation : movie.img_cover}
          className="h-100 rounded-2 object-fit-cover"
          style={{
            width: isMobile ? '200px' : '350px',
            height: isMobile ? '300px' : '100%'
          }}
          alt={movie.title}
        />
        {showTitle && !isMobile && (
          <span
            className="position-absolute z-2 fs-4 fs-lg-2 text-light"
            style={{ bottom: '20px', left: '30px' }}>
            {movie.title}
          </span>
        )}
      </Link>
    </div>
  );

  // Création des sections dynamiques
  const sections = [
    {
      id: 'tendance',
      title: 'Tendance actuelle',
      filter: () => true
    },
    ...categories.map((cat) => ({
      id: cat?.category_name?.toLowerCase().replace(/\s+/g, '-'),
      title: cat?.category_name,
      filter: (m) => m.id_category === cat.id_category
    }))
  ];

  return (
    <div className="catalogue-container">
      {/* Carrousel principal */}
      <Carousel
        controls={false}
        activeIndex={currentIndex}
        indicators={false}
        onSelect={handleSelect}>
        {movies.map((movie) => (
          <Carousel.Item
            key={movie.id_movie}
            className="position-relative"
            style={{ width: '100%', height: isMobile ? '50vh' : '73vh' }}>
            <div className="img_carousel w-100 h-100">
              <img
                className="w-100 h-100 object-fit-cover"
                src={movie.img_cover}
                alt={movie.title}
              />
            </div>
            <Carousel.Caption
              className={`position-absolute ${isMobile ? 'col-12' : 'col-lg-6'} 
                text-start d-flex flex-column gap-3 gap-lg-4 bottom-0 start-0`}
              style={{ paddingLeft: '4%', zIndex: '10' }}>
              <h3 className="fs-title-carousel">{movie.title}</h3>

              <div className="d-flex align-items-center justify-content-start gap-2 gap-lg-3">
                <p className="m-0 d-flex align-items-center">
                  {Array.from({ length: Math.floor(movie.rating) }).map((_, index) => (
                    <span key={index} style={{ color: 'red' }}>
                      <FaStar size={isMobile ? 15 : 20} />
                    </span>
                  ))}
                </p>
                <p className="fs-6 fs-lg-5">
                  {format(new Date(movie.release_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
                <p className="fs-6 fs-lg-5">
                  {categories.find((cat) => cat.id_category === movie.id_category)?.category_name}
                </p>
              </div>

              <p className={`${isMobile ? 'fs-6 description-mobile line-clamp-2' : 'fs-5'}`}>
                {movie.description}
              </p>

              <div className="btns d-flex gap-2 gap-lg-3">
                <Button
                  className="s-btn rounded-5 d-flex gap-2 align-items-center justify-content-center"
                  style={{ width: isMobile ? '100px' : '130px' }}
                  children={
                    <>
                      Play <FaPlay />
                    </>
                  }
                  onClick={() => navigate(`/stream/${movie.id_movie}`)}
                />
                <Button
                  className="t-btn rounded-5 d-flex gap-2 align-items-center justify-content-center"
                  style={{ width: isMobile ? '100px' : '130px' }}
                  children={
                    <>
                      <FaPlus />
                      Infos
                    </>
                  }
                  onClick={() => navigate(`/detail/${movie.id_movie}`)}
                />
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Sections par catégorie */}
      <div className="container-movies" style={{ padding: '0 4%' }}>
        {sections.map((section) => (
          <div key={section.title} id={section.id} className={section.id}>
            <h2 className="title fs-2 fs-lg-1 text-white mt-4 mt-lg-5 mb-3 mb-lg-5">
              {section.title}
            </h2>
            <div className="carousel d-flex gap-3 gap-lg-4 overflow-x-scroll py-2">
              {movies.filter(section.filter).map((movie) => (
                <MovieCard key={movie.id_movie} movie={movie} />
              ))}
            </div>
          </div>
        ))}

        {/* Top 10 */}
        <div className="Top10">
          <h2 className="title fs-2 fs-lg-1 text-white mt-4 mt-lg-5 mb-3 mb-lg-5">Top 10</h2>
          <div className="carousel d-flex gap-3 gap-lg-4 overflow-x-scroll py-3 py-lg-5">
            {movies
              .filter((movie) => movie.rating >= 4)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 10)
              .map((movie, index) => (
                <div
                  key={movie.id_movie}
                  className="movie-card position-relative p-3 p-lg-5"
                  style={{ height: isMobile ? '400px' : '600px' }}>
                  <Link to={`/detail/${movie.id_movie}`}>
                    <span
                      className="position-absolute fw-bold"
                      style={{
                        fontSize: isMobile ? '60px' : '100px',
                        top: isMobile ? '0px' : '-84px',
                        left: isMobile ? '23px' : '0px',
                        color: isMobile ? 'var(--color-white)' : 'var(--color-dark)'
                      }}>
                      {index + 1}
                    </span>
                    <img
                      src={movie.img_presentation}
                      style={{
                        width: isMobile ? '200px' : '350px',
                        height: isMobile ? '300px' : '100%'
                      }}
                      alt={movie.title}
                    />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
