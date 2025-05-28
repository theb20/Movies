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
  const [categories, setCategories] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  useEffect(() => {
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
        console.error('Erreur lors de la récupération des films ou catégories :', error);
      }
    };

    fetchMovies();
  }, []);

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

  return (
    <div className="catalogue-container">
      <Carousel
        controls={false}
        activeIndex={currentIndex}
        indicators={false}
        onSelect={handleSelect}>
        {movies.map((movie) => (
          <Carousel.Item
            key={movie.id}
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
              style={{ paddingLeft: '04%', zIndex: '10' }}>
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
                <p className="fs-6 fs-lg-5">{categories[movie.id_category]}</p>
              </div>

              <p
                className={`${isMobile ? 'fs-6 description-mobile' : 'fs-5'} 
                ${isMobile ? 'line-clamp-2' : ''}`}>
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
                  onClick={''}
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

      <div className="container-movies" style={{ padding: '0 4%' }}>
        {[
          { title: 'Tendance actuelle', filter: (m) => true },
          { title: 'Comédie', filter: (m) => m.id_category === 1 },
          { title: 'Action', filter: (m) => m.id_category === 5 },
          { title: 'Science-Fiction', filter: (m) => m.id_category === 4 },
          { title: 'Horreur', filter: (m) => m.id_category === 3 }
        ].map((section) => (
          <div key={section.title} className={section.title.replace(/\s+/g, '')}>
            <h2 className="title fs-2 fs-lg-1 text-white mt-4 mt-lg-5 mb-3 mb-lg-5">
              {section.title}
            </h2>
            <div className="carousel d-flex gap-3 gap-lg-4 overflow-x-scroll py-2">
              {movies.filter(section.filter).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ))}

        <div className="Top10">
          <h2 className="title fs-2 fs-lg-1 text-white mt-4 mt-lg-5 mb-3 mb-lg-5">Top 10</h2>
          <div className="carousel d-flex gap-3 gap-lg-4 overflow-x-scroll py-3 py-lg-5">
            {movies
              .filter((movie) => movie.rating >= 4)
              .slice(0, 10)
              .map((movie, index) => (
                <div
                  key={movie.id}
                  className="movie-card position-relative p-3 p-lg-5"
                  style={{ height: isMobile ? '400px' : '600px' }}>
                  <Link to={`/detail/${movie.id_movie}`}>
                    <span
                      className="position-absolute fw-bold "
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
