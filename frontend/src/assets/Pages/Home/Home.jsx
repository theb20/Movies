// React & Router
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

// Icons
import { FaAngleDoubleDown } from 'react-icons/fa';
import { SiInfiniti } from 'react-icons/si';
import { TbInfoHexagon } from 'react-icons/tb';
import { HiChevronDoubleRight } from 'react-icons/hi';
import { BiSupport, BiSolidMoviePlay } from 'react-icons/bi'; // BiSolidMoviePlay ajouté ici
import { MdOutlineNavigateNext } from 'react-icons/md';
import { RiAdvertisementLine, RiShoppingBag4Line } from 'react-icons/ri';

// Components
import Input from '../../components/Input-Form/Input.jsx';
import Button from '../../components/Btn-generique/btn.jsx';

import serviceMovie from '../../../services/movieService.js';

// Images & Logos
import IconPopcorn from '../../images/Icons/popcorn_time_macos_bigsur_icon_189462.ico';
import fichierErreur1 from '../../images/Background/b22d9b8e4948c66c00e3724f1d2ef9d5.jpg';
import netflixL from '../../images/Logos/netflix.webp';
import canalL from '../../images/Logos/canal.webp';
import disneyL from '../../images/Logos/disney.webp';
import plutottv from '../../images/Logos/plutottv.webp';
import primeL from '../../images/Logos/primevideo.webp';
import rakuL from '../../images/Logos/raku.webp';
import tubiL from '../../images/Logos/tubi.webp';

// Styles
import './Home.css';

const Home = () => {
  const [showText, setShowText] = useState(false);
  const [movie, setMovie] = useState([]);
  const [email, setEmail] = useState('');
  const [userConnect, setUserConnect] = useState(false); // Initialiser à false pour permettre un deroullement normal
  const sectionTwoRef = useRef(null);

  //meilleur film
  useEffect(() => {
    const dataMovie = async () => {
      try {
        const response = await serviceMovie.getBest();
        setMovie(response);
      } catch (error) {
        console.log(error);
      }
    };
    dataMovie();
  }, []);
  // Utilisation de useEffect pour vérifier le token au chargement du composant
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserConnect(true);
    } else {
      setUserConnect(false);
    }
  }, []); // Le tableau vide [] assure que cet effet ne s'exécute qu'une fois au montage

  // Assurez-vous que currentTrends est bien généré avec des IDs uniques

  const navigate = useNavigate();

  const size = 60;
  const popcorn = { width: '70px', height: '70px' };

  const styles = {
    mainHome: 'mainHome text-light vw-100 h-100 ',
    homeOne:
      'homeOne vh-100 d-flex align-items-center justify-content-center pt-lg-0 pt-5 align-items-lg-center justify-content-center text-center',
    homeTwo: 'homeTwo d-flex px-5 py-3 justify-content-center text-left',
    homeThree: 'vh-custom',
    homeFour: 'px-5',
    homeFive:
      'homeFive d-flex flex-row flex-column-md align-items-center justify-content-between p-custom bg-danger mx-2 my-4 mx-md-5',
    homeSix: 'd-flex align-items-center justify-content-center flex-column px-4 gap-4',
    homeSeven: 'px-5',
    contentR: 'd-flex align-items-center justify-center gap-3',
    iconFour: 'bg-danger-custom py-1 px-3 rounded-5',
    card_price_content:
      'card-price-content d-flex flex-column justify-content-center bg-dark rounded-4 p-3',
    price: 'fs-2 py-1 px-3 rounded-5 price',
    label: 'label py-1 px-3 rounded-5 label'
  };

  const partnerLogos = [netflixL, canalL, disneyL, plutottv, primeL, rakuL, tubiL];

  const features = [
    {
      Icon: SiInfiniti,
      title: 'Accès illimité',
      description:
        'Profitez de milliers de contenus sans aucune restriction, disponibles 24h/24 et 7j/7.'
    },
    {
      Icon: BiSupport,
      title: 'Support premium',
      description: 'Accédez à une assistance rapide et dédiée pour résoudre tous vos problèmes.'
    },
    {
      Icon: RiAdvertisementLine,
      title: 'Sans publicité',
      description:
        'Savourez vos contenus sans interruptions, pour une expérience fluide et agréable.'
    },
    {
      Icon: RiShoppingBag4Line,
      title: 'Offre exclusive',
      description: "Bénéficiez d'offres et de réductions réservées uniquement aux abonnés."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/signup', { state: { email } });
  };
  const handleClick = () => {
    if (sectionTwoRef.current)
      return sectionTwoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <main className={styles.mainHome}>
      <section className={styles.homeOne}>
        <div
          style={{ height: '350px' }}
          className="container-one d-flex align-items-center flex-column justify-content-center w-75 p-3 text-center z-2">
          <h1 className="display-3 ">Films en illimité, à tout moment et où que vous soyez</h1>
          <p>
            À partir de 5 €. Annulable à tout moment. Découvrez une vaste sélection de films
            disponibles à tout moment. Profitez de l'expérience cinématographique ultime, où que
            vous soyez.
          </p>
          {userConnect ? (
            <Button onClick={handleClick} className="text-white mt-5 btn-smooth">
              <FaAngleDoubleDown size={40} />
            </Button>
          ) : (
            <form
              className="d-flex mt-5 align-items-center gap-2 justify-content-center"
              onSubmit={handleSubmit}>
              <Input
                classlabel="d-none"
                classinput="bg-dark bg-opacity-50 text-white w-100 p-2 rounded-2"
                placeholder={'Entrez votre mail'}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" status="primary-btn">
                s'inscrire
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Section Two */}
      <section ref={sectionTwoRef} className={styles.homeTwo}>
        <div className="container-two d-flex align-items-center">
          <img src={IconPopcorn} alt="icon popcorn" style={popcorn} />
          <div className="container-two-right lh-0 m-0 px-2 py-1 rounded">
            <h5 className="mb-0">Vos films préférés pour seulement 5 €.</h5>
            <p className="mb-0">Découvrez notre offre sans publicité, la plus avantageuse.</p>

            <Link
              className="border-bottom border-1 mb-0"
              onClick={(e) => {
                e.preventDefault();
                setShowText(!showText);
              }}
              to={'#'}>
              En savoir plus <TbInfoHexagon />
            </Link>

            {showText && (
              <p className="info-container-two position-absolute bg-white text-black p-2 rounded">
                Cette offre sera disponible après la version beta, veuillez profiter de l'offre
                gratuite.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section Three */}
      <section className={styles.homeThree}>
        <div className="container-three overflow-visible">
          <div className="container-three-title px-5 d-flex justify-content-between align-items-center">
            <h5 className="fs-bold lh-1 m-0">Top 10</h5>
            <Button onClick={() => navigate('/catalogue')} status="primary-btn">
              Tout voir
            </Button>
          </div>
          <div className="container-card bg-custom p-5 d-flex gap-3 position-absolute z-2 overflow-auto flex-nowrap w-100">
            {movie.map((movie, i) => (
              <Link key={movie.id_movie} to={`/detail/${movie.id_movie}`}>
                <div
                  className="card custom-card bg-transparent align-items-center justify-content-center position-relative"
                  style={{
                    width: '200px',
                    minWidth: '200px'
                  }}>
                  <span className="text-light fs-custom position-absolute bottom-custom text-white-50 fw-bold z-1 start-0">
                    {i + 1}
                  </span>
                  <img
                    src={movie.img_presentation || 'placeholder-image.jpg'}
                    alt={movie.title}
                    className="card-img"
                    style={{
                      height: '300px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'placeholder-image.jpg';
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Four */}
      <section className={styles.homeFour}>
        <div className="container-four">
          <div className="container-four-title d-flex justify-content-between align-items-center mb-5">
            <h5 className="fs-bold lh-1 m-0">Encore plus de raisons de vous abonner</h5>
          </div>
          <div className="container-four-content d-flex flex-wrap justify-content-around gap-3">
            {movie && (
              <div
                className="container-four-content-left overflow-auto rounded-5"
                style={{ height: '400px', width: '400px' }}>
                <span className="position-absolute bg-danger-custom rounded-custom px-3">
                  En ce moment
                </span>
                <img
                  src={
                    (Array.isArray(movie) && movie.length > 0 ? movie[movie.length - 3] : movie)
                      ?.img_presentation
                  }
                  className="w-100 h-100 object-fit-cover rounded-5"
                  alt="film du moment"
                />
              </div>
            )}

            <div className="container-four-content-right d-flex flex-column gap-4 justify-content-center">
              {features.map(({ Icon, title, description }, i) => (
                <div className={styles.contentR} key={i}>
                  {' '}
                  {/* Utilisation de l'index i comme clé pour une liste statique */}
                  <Icon size={size} className={styles.iconFour} />
                  <div className="c-r-right">
                    <h6>{title}</h6>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center justify-content-center w-lg-50 w-100">
            <div className="d-flex flex-column col-12 col-lg-6">
              <h5 className="fw-bold fs-custom text-center col-12 col-lg-6 text-lg-start">
                Plan Tarifaire
              </h5>

              <div className="col-12 col-lg-5">
                <p className="descriptionPlan text-center text-lg-start">
                  Choisissez l'abonnement qui vous correspond et profitez d'un accès illimité à
                  notre catalogue de films. Nos formules sont simples, flexibles et sans engagement,
                  pour une expérience cinéma sur mesure à prix doux.
                </p>
              </div>
            </div>
            <div className="ticket-container mt-4 ticket-one d-flex align-items-center ">
              <div className="ticket">
                <div
                  className="ticket-top p-3 p-lg-5 rounded-top-4"
                  style={{
                    background:
                      'linear-gradient(77.59deg, var(--color-darkred) 18%, var(--color-black) 100%)',
                    height: '190px'
                  }}>
                  <h6 className="text-uppercase mb-3 text-center">Abonnement decouverte</h6>
                  <div className="position-relative">
                    <div className="d-flex align-items-center mt-2">
                      <HiChevronDoubleRight className="position-absolute start-0" />
                      <span
                        className="price position-absolute"
                        style={{ fontSize: '7em', height: '90px' }}>
                        0
                      </span>
                    </div>
                    <div className="position-absolute top-0 end-0 text-start">
                      <BiSolidMoviePlay size={30} />
                      <p className="mb-1 small fw-bold">/ Mois x1</p>
                      <p className="small fw-bold">/ Ans x12</p>
                    </div>
                  </div>
                </div>

                <div className="ticket-bottom bg-white rounded-bottom-4">
                  <div className="flight-details px-3 px-lg-5 py-3">
                    <div className="d-flex flex-column flex-lg-row justify-content-between mb-4">
                      <p className="mb-2 mb-lg-0 text-black text-center text-lg-start">
                        <span className="d-block">Qualité incluse</span>
                        Standard (SD)
                      </p>
                      <p className="mb-0 text-black text-center text-lg-start">
                        <span className="d-block">Engagement</span>
                        None
                      </p>
                    </div>

                    <div className="d-flex flex-column flex-lg-row justify-content-between mb-4">
                      <p className="mb-2 mb-lg-0 text-black text-center text-lg-start">
                        <span className="d-block">Interface Intuitive</span>
                        Selection rapide
                      </p>
                      <p className="mb-0 text-black text-center text-lg-start">
                        <span className="d-block">Exclusivité</span>1 fois / mois
                      </p>
                    </div>

                    <div className="d-flex flex-column flex-lg-row justify-content-between mb-4">
                      <Link
                        to="/terms#section6"
                        className="mb-2 mb-lg-0 text-black text-center text-lg-start">
                        <span className="d-block">Confidentialité</span>
                        continuer vers <MdOutlineNavigateNext />
                      </Link>
                      <Link
                        to="/terms#section7"
                        className="mb-0 text-black text-center text-lg-start">
                        <span className="d-block">Contact</span>
                        <i className="text-">Infos</i> <MdOutlineNavigateNext />
                      </Link>
                    </div>
                  </div>
                  <div className="coupure">
                    <div className="dashed-line"></div>
                  </div>
                  <div className="p-3 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
                    <div className="barcode m-2"></div>
                    <Button
                      children={'Choisir ce plan'}
                      onClick={() => navigate('/signup')}
                      className="p-btn w-100 w-lg-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Five */}
      <section className={styles.homeFive}>
        <h5 className="fw-bold fs-1 z-2">FAQ</h5>
        <Button onClick={() => navigate('/terms')} className="p-btn px-5 z-2 rounded-5">
          voir+
        </Button>
      </section>

      {/* Section Six */}
      <section className={styles.homeSix}>
        <p className="text-center">
          Prêt à regarder Movies ? Saisissez votre adresse e-mail pour vous abonner ou réactiver
          votre abonnement.
        </p>
        <form
          className="d-flex align-items-center gap-2 justify-content-center"
          onSubmit={handleSubmit}>
          <Input
            classlabel="d-none"
            classinput="bg-dark bg-opacity-50 text-white w-100 p-2 rounded-2"
            placeholder={'Entrez votre mail'}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" status="primary-btn">
            s'inscrire
          </Button>
        </form>
      </section>

      {/* Section Seven */}
      <section className={styles.homeSeven}>
        <h5 className="text-center mb-5 mt-5">Nos partenaires</h5>
        <div className="container-logos d-flex flex-wrap justify-content-between mb-5">
          {partnerLogos.map((logo, i) => (
            <img src={logo} key={i} className="size-img-custom" alt="partenaire" /> // Utilisation de l'index i comme clé pour une liste statique
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
