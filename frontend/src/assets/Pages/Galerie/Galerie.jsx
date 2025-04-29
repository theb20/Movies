import './Galerie.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moviesService from '../../../services/movieService.js';

import componentGalerie from '../../images/Background/component-bg-galerie.png';

const Galerie = () => {
  const [imgs, setImgs] = useState([]);

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

  const mainGalerie = 'text-white';
  const galerieOne = 'GalerieOne vh-75 px-5 d-flex justify-content-between align-items-center';
  const galerieTwo = 'd-flex flex-wrap gap-4 justify-content-center py-5 px-5';

  return (
    <main className={mainGalerie}>
      {/* ✅ Section Titre et Description */}
      <section className={galerieOne}>
        <div className="container-Galerie-left z-2">
          <h1>Galerie</h1>
          <p>
            Cette page décrit les règles d’utilisation de notre plateforme pour vous garantir une expérience sécurisée et de qualité. En l’acceptant, vous utilisez notre service en toute confiance.
          </p>
        </div>
        <div className="container-Galerie-right z-2">
          <img src={componentGalerie} alt="Illustration galerie" />
        </div>
      </section>

      {/* ✅ Section Cartes avec vraies données */}
      <section className={galerieTwo}>
        <div className="container-card justify-content-center d-flex flex-wrap gap-4">
          {imgs.map((movie) => (
            <Link to={``} key={movie.id} className="card-link">
              <div className="card custom-card bg-dark text-center" style={{ minWidth: "200px" }}>
                <img
                  src={movie.img_presentation}
                  alt={movie.title}
                  className="card-img-top rounded"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Galerie;
