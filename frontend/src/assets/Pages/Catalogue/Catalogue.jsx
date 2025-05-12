import { useEffect, useState } from 'react';
import { FaStar, FaPlay, FaPlus } from "react-icons/fa6";
import Carousel from 'react-bootstrap/Carousel';
import movieService from '../../../services/movieService.js';
import Button from '../../components/Btn-generique/btn.jsx';
import { useNavigate } from 'react-router-dom';

import './Catalogue.css';

const Catalogue = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState({}); 
  const [currentIndex, setCurrentIndex] = useState(0);

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
        categoriesData.forEach(cat => {
          categoryMap[cat.id_category] = cat.category_name;
        });

        setMovies(moviesData);
        setCategories(categoryMap); 
      } catch (error) {
        console.error("Erreur lors de la récupération des films ou catégories :", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="catalogue-container">
      <Carousel controls={false} activeIndex={currentIndex} indicators={false} onSelect={handleSelect}>
        {movies.map((movie) => (
          <Carousel.Item  key={movie.id} className='position-relative' style={{width: '100%', height: '73vh' }}>
            <div className="img_carousel w-100 h-100">
              <img
                className='w-100 h-100 object-fit-cover'
                src={movie.img_cover}
                alt={movie.title}
              />
            </div>
            <Carousel.Caption className='position-absolute text-start d-flex flex-column gap-4 bottom-0 start-0' style={{ paddingLeft:'04%', zIndex:'10'}}>
              <h3 className=' fs-title-carousel'>{movie.title}</h3>

              <div className="d-flex align-itmes-center justify-content-start gap-3">
                <p className="m-0 d-flex align-items-center">
                  {Array.from({ length: Math.floor(movie.rating) }).map((_, index) => (
                    <span key={index} style={{ color: 'red' }}>
                      <FaStar size={20} />
                    </span>
                  ))}
                </p>
                <p className='fs-5'>{movie.release_date}</p>
                <p className='fs-5'>{categories[movie.id_category]}</p>
              </div>

              <p className='fs-4' style={{width:'55%'}}>{movie.description}</p>
              <div className="btns d-flex gap-3">
                  <Button className='s-btn rounded-5 d-flex gap-2 align-items-center justify-content-center' style={{width:'130px'}}children={<>Play <FaPlay/></>} onClick={''}/>
                  <Button className='t-btn rounded-5 d-flex gap-2 align-items-center justify-content-center' style={{width:'130px'}} children={<><FaPlus/>Infos</>} onClick={()=>navigate('/')}/>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
        <div className="container-movies " style={{padding:'0 4%'}}>
          <div id='cat' className="Tendance_actuelle">
            <h2 className="title fs-1 text-white mt-5 mb-5">Tendance actuelle</h2>

            <div className="carousel d-flex gap-4 overflow-x-scroll">
              {movies
              .map((movie) => (
                <div className="movie-card position-relative"  key={movie.id}>
                  <img src={movie.img_cover} className='h-100 rounded-2 object-fit-cover' style={{width:'350px'}} alt={movie.title} />
                  <span className='position-absolute z-2 fs-2 text-light' style={{bottom:'20px', left:'30px'}}>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="Comedie">
            <h2 className="title fs-1 text-white mt-5 mb-5">Comedie</h2>

            <div className="carousel d-flex gap-4 overflow-x-scroll">
              {movies
              .filter((movie) => movie.id_category === 1)
              .map((movie) => (
                <div className="movie-card position-relative"  key={movie.id}>
                  <img src={movie.img_cover} className='h-100 rounded-2 object-fit-cover' style={{width:'350px'}} alt={movie.title} />
                  <span className='position-absolute z-2 fs-2 text-light' style={{bottom:'20px', left:'30px'}}>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="Action">
            <h2 className="title fs-1 text-white mt-5 mb-5">Action</h2>

            <div className="carousel d-flex gap-4 overflow-x-scroll">
              {movies
              .filter((movie) => movie.id_category === 5)
              .map((movie) => (
                <div className="movie-card position-relative" key={movie.id}>
                  <img src={movie.img_cover} className='h-100 rounded-2 object-fit-cover' style={{width:'350px'}} alt={movie.title} />
                  <span className='position-absolute z-2 fs-2 text-light' style={{bottom:'20px', left:'30px'}}>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="scienceFiction">
            <h2 className="title fs-1 text-white mt-5 mb-5">Science-Fiction</h2>

            <div className="carousel d-flex gap-4 overflow-x-scroll">
              {movies
              .filter((movie) => movie.id_category === 4)
              .map((movie) => (
                <div className="movie-card position-relative" key={movie.id}>
                 <img src={movie.img_cover} className='h-100 rounded-2 object-fit-cover' style={{width:'350px'}} alt={movie.title} />
                 <span className='position-absolute z-2 fs-2 text-light' style={{bottom:'20px', left:'30px'}}>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="horreur">
            <h2 className="title fs-1 text-white mt-5 mb-5">Horreur</h2>

            <div className="carousel d-flex gap-4 overflow-x-scroll">
              {movies
              .filter((movie) => movie.id_category === 3)
              .map((movie) => (
                <div className="movie-card position-relative" key={movie.id}>
                  <img src={movie.img_cover} className='h-100 rounded-2 object-fit-cover' style={{width:'350px'}} alt={movie.title} />
                  <span className='position-absolute z-2 fs-2 text-light' style={{bottom:'20px', left:'30px'}}>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="Top10">
            <h2 className="title fs-1 text-white mt-5 mb-5">Top 10</h2>

            <div className="carousel d-flex gap-4 overflow-x-scroll py-5">
              {movies
              .filter((movie) => movie.rating >= 4)
              .slice(0, 10)
              .map((movie, index) => (
                <div className="movie-card position-relative p-5" style={{height:'600px'}} key={movie.id}>
                  <span className="position-absolute z-3 start-0 fw-bold text-dark" 
                    style={{fontSize:'100px', top:'-84px'}}>
                    {index + 1}
                  </span>
                  <img src={movie.img_presentation} className='h-100' style={{width:'350px'}} alt={movie.title} />
                </div>
              ))}
            </div>
          </div>
          
        </div>
    </div>
  );
};

export default Catalogue;
