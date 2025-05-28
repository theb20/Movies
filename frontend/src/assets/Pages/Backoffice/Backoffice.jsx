// Imports des composants et librairies externes
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Icons
import {
  FaTable,
  FaFilm,
  FaHeart,
  FaHistory,
  FaMailBulk,
  FaUserShield,
  FaDoorOpen,
  FaWpforms,
  FaRegHeart,
  FaRegUser
} from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { FaRegUserCircle } from 'react-icons/fa';
import { GiBestialFangs } from 'react-icons/gi';
import { CiCircleCheck, CiTimer } from 'react-icons/ci';
import { SiInteractiondesignfoundation } from 'react-icons/si';

// Composants et Services internes
import movie from '../../../services/movieService.js';
import user from '../../../services/authService.js';

// Graphiques
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Composants personnalisés
import Button from '../../components/Btn-generique/btn.jsx';
import Input from '../../components/Input-Form/Input.jsx';

// Styles
import './Backoffice.css';
import logo from '../../images/Logos/Logo_movies_ft.svg';

const Backoffice = () => {
  const sizeIcon = 18;

  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);

  const onClick = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movie.getAllMovies();
        setMovies(response);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const response = await movie.getAllSearch();
        setMovies(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchSearch();
  }, []);
  const numberThisWeek = movies.filter(
    (movie) => movie.created_at && new Date(movie.created_at) > subDays(new Date(), 7)
  ).length;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await movie.getCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await user.getAllUsers();
        setUsers(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const numberThisWeekUser = users.filter(
    (user) => user.created_at && new Date(user.created_at) > subDays(new Date(), 7)
  ).length;

  const dataMovie = movies.slice(0, 12).map((movie) => ({
    name: movie.id_movie,
    value: movie.rating * 20
  }));
  const dataUser = users.map((user) => ({
    name: user.id_user,
    // Convert birthday to number of days since epoch for visualization
    value: format(new Date(user.inscription_date), 'MM')
  }));

  return (
    <div
      style={{ backgroundColor: 'var(--background-admin)', fontSize: '13px', height: '100vh' }}
      className="d-flex position-relative z-3 p-2">
      <div
        style={{ minWidth: '290px', height: '97%' }}
        className=" rounded-2 z-3 m-2 text-black bg-white p-3 border">
        <div>
          <Link to="" target="_blank">
            <img src={logo} width="156" height="36" alt="logo_movie" />
          </Link>
        </div>
        <hr />
        <div
          style={{ height: '94%' }}
          className="d-flex flex-column justify-content-between  position-relative">
          <ul className="menu d-flex flex-column px-3 mt-4 gap-4">
            <li className="p-0 ">
              <Link className="active" to="/dashboard">
                <FaTable size={sizeIcon} />
                <span>Vue d'ensemble</span>
              </Link>
            </li>
            <li>
              <Link to="/tables">
                <FaFilm size={sizeIcon} />
                <span>Films</span>
              </Link>
            </li>
            <li>
              <Link to="/billing">
                <FaHeart size={sizeIcon} />
                <span>Mentions</span>
              </Link>
            </li>
            <li>
              <Link to="/virtual-reality">
                <FaHistory size={sizeIcon} />
                <span>Historique</span>
              </Link>
            </li>
            <li>
              <Link to="/rtl">
                <FaMailBulk size={sizeIcon} />
                <span>Boite de reception</span>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <span>Notifications</span>
              </Link>
            </li>
            <li>
              <h6 className="mt-3 ps-2 text-black text-opacity-25">COMPTE</h6>
            </li>
            <li>
              <Link to="/profile">
                <FaUserShield size={sizeIcon} />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/sign-in">
                <FaDoorOpen size={sizeIcon} />
                <span>Connexion</span>
              </Link>
            </li>
            <li>
              <Link to="/sign-up">
                <FaWpforms size={sizeIcon} />
                <span>Inscription</span>
              </Link>
            </li>
          </ul>

          <div className="d-flex gap-3 flex-column ">
            <Button
              className="text-light border-black border-opacity-50 text-black text-opacity-50 rounded-2 t-btn"
              type="button">
              Documentation
            </Button>
            <Button className="text-light rounded-2 s-btn" type="button">
              Upgrade to pro
            </Button>
          </div>
        </div>
      </div>
      <div style={{ width: '100%' }} className="end-0">
        <div className="vh-100">
          <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none ">
            <div className="container-fluid py-1 px-3 w-100 rounded bg-white border">
              <nav className="d-flex align-items-center justify-content-between w-100">
                <ul className="bg-transparent d-flex mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                  <li className="breadcrumb-item text-sm">
                    <Link className="opacity-5 text-dark">Pages / </Link>
                  </li>
                  <li className="text-sm active-nav-main"> Dashboard</li>
                </ul>
                <ul className="navbar-nav align-items-center justify-content-between">
                  <li className="nav-item py-2 px-3 d-flex align-items-center">
                    {format(new Date(), 'yyyy', { locale: fr })}
                  </li>
                  <li className="nav-item p-1 bg-white d-flex align-items-center position-relative">
                    <IoMdMail size={sizeIcon} />
                    <span
                      style={{ width: '10px', height: '10px' }}
                      className=" bg-danger rounded-5 position-absolute top-0 end-0"></span>
                  </li>
                  <li className="nav-item p-2 bg-white d-flex align-items-center">
                    <FaRegUserCircle size={sizeIcon} />
                  </li>
                </ul>
              </nav>
            </div>
          </nav>

          <div className="container-fluid w-100 py-2">
            <div className="row ">
              <div className="ms-3">
                <h3 className="mb-0 h4 font-weight-bolder">Vue d'ensemble</h3>
                <p className="mb-4 text-dark">
                  Analyse rapide des films les plus populaires et des préférences du public.
                </p>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-header p-2 ps-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-sm mb-0 text-dark text-capitalize fs-5">Films</p>
                        <h2 className="mb-0">{movies.length}</h2>
                      </div>
                      <div className="bg-dark p-3 rounded-3 shadow shadow-dark">
                        <FaFilm className="text-white" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 ps-3">
                    <p className="mb-0 text-dark text-opacity-50 text-sm">
                      <span className="text-success font-weight-bolder">+{numberThisWeek}</span>{' '}
                      films ajoutés.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-header p-2 ps-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-sm mb-0 text-dark text-capitalize fs-5">Tarifs</p>
                        <h2 className="mb-0">0</h2>
                      </div>
                      <div className="bg-dark p-3 rounded-3 shadow shadow-dark">
                        <FaMoneyCheck className="text-white" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 ps-3">
                    <p className="mb-0 text-dark text-opacity-50 text-sm">
                      <span className="text-success font-weight-bolder">Lancement beta</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-header p-2 ps-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-sm mb-0 text-dark text-capitalize fs-5">Top</p>
                        <h2 className="mb-0">
                          {movies.filter((movie) => movie.rating >= 4).length}
                        </h2>
                      </div>
                      <div className="bg-dark p-3 rounded-3 shadow shadow-dark">
                        <GiBestialFangs className="text-white" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 ps-3">
                    <p className="mb-0 text-dark text-opacity-50 text-sm">
                      <span className="text-success font-weight-bolder">+55% </span>than last week
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-header p-2 ps-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-sm mb-0 text-dark text-capitalize fs-5">Utilisateurs</p>
                        <h2 className="mb-0">{users.length}</h2>
                      </div>
                      <div className="bg-dark p-3 rounded-3 shadow shadow-dark">
                        <FaRegUser className="text-white" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 ps-3">
                    <p className="mb-0 text-dark text-opacity-50 text-sm">
                      <span className="text-success font-weight-bolder">+{numberThisWeekUser}</span>{' '}
                      cette semaine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 mt-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="mb-0">Statistiques (Films)</h6>
                    <p className="text-sm text-dark">Performances récentes des films</p>

                    <div className="pe-5">
                      <div className="p-0 m-0">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={dataMovie}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <hr className="dark horizontal" />
                    <div className="d-flex gap-2">
                      <CiTimer size={sizeIcon} />
                      <p className="mb-0 text-dark text-sm">
                        <Link className="text-dark">Voir plus en detail </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mt-4 mb-4">
                <div className="card ">
                  <div className="card-body">
                    <h6 className="mb-0 ">Statistique (Utilisateurs)</h6>
                    <p className="text-dark text-sm ">
                      {' '}
                      <span className=" font-weight-bolder">
                        Performance récente des utilisateurs %
                      </span>
                    </p>
                    <div className="pe-5">
                      <div className="chart">
                        <ResponsiveContainer width="100%" height={290}>
                          <AreaChart data={dataUser}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <hr className="dark horizontal" />
                    <div className="d-flex gap-2">
                      <CiTimer size={sizeIcon} />
                      <p className="mb-0 text-dark text-sm">
                        <Link className="text-dark">Voir plus en detail </Link>{' '}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
                <div className="card">
                  <div className="card-header pb-0">
                    <div className="row">
                      <div className="d-flex justify-content-between w-100 col-lg-6 col-7">
                        <h6>Catalogue de films</h6>
                        <p className="text-dark text-sm mb-0">
                          <CiCircleCheck size={sizeIcon} />
                          <span className="text-dark font-weight-bold ms-1">
                            {movies.length}
                          </span>{' '}
                          films
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-body px-0 pb-2">
                    <div className="table-responsive">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Titre
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                              Date de sortie
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Date de création
                            </th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Note
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {movies
                            .filter((movie) => movie.id === movie.id)
                            .slice(0, 10)
                            .map((movie) => (
                              <tr>
                                <td>
                                  <div className="d-flex px-2 py-1">
                                    <div>
                                      <img
                                        src={movie.img_cover}
                                        className="avatar rounded-5 avatar-sm me-3"
                                        alt={movie.title}
                                        style={{ width: '40px', height: '40px' }}
                                      />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                      <h6 className="mb-0 text-sm">{movie.title}</h6>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="avatar-group mt-2">
                                    {format(new Date(movie.release_date), 'dd/MM/yyyy')}
                                  </div>
                                </td>
                                <td className="align-middle text-center text-sm">
                                  <span className="text-xs font-weight-bold">
                                    {' '}
                                    {format(new Date(movie.created_at), 'dd/MM/yyyy')}
                                  </span>
                                </td>
                                <td className="align-middle">
                                  <div className="progress-wrapper w-75 mx-auto">
                                    <div className="progress-info">
                                      <div className="progress-percentage">
                                        <span className="text-xs font-weight-bold">
                                          {(movie.rating * 20).toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="progress bg-transparent">
                                      <progress
                                        value={movie.rating}
                                        className="h-100"
                                        max="5"
                                        role="progressbar"
                                        aria-valuenow="60"
                                        aria-valuemin="0"
                                        aria-valuemax="100"></progress>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between pb-0">
                    <h6>Catégories</h6>
                    <p className="text-dark text-sm">
                      <i className="fa fa-arrow-up text-success" aria-hidden="true"></i>
                      <span className="font-weight-bold">{categories.length}</span> Désignations
                    </p>
                  </div>
                  <div className="card-body p-3">
                    {categories.slice(0, 12).map((category) => (
                      <div className="timeline timeline-one-side">
                        <div className="timeline-block d-flex align-items-center gap-2 mb-3">
                          <span className="timeline-step">
                            <SiInteractiondesignfoundation scale={1.5} />
                          </span>
                          <div className="timeline-content">
                            <h6 className="text-dark text-sm font-weight-bold mb-0">
                              {category.category_name}
                            </h6>
                            <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                              slug : {category.slug}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="timeline-block d-flex align-items-center gap-2 mb-3">
                      <span className="timeline-step">
                        <SiInteractiondesignfoundation scale={1.5} />
                      </span>
                      <div className="timeline-content">
                        <h6 className="text-dark text-sm font-weight-bold mb-0">
                          <Link className="text-black" to="/">
                            ...
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="py-3 rounded-5 mb-5 text-black text-center text-opacity-25 w-100">
            © {format(new Date(), 'yyyy')} Movie. Tous droits réservés.
          </footer>
        </div>
      </div>
    </div>
  );
};
export default Backoffice;
