// Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { SiGooglemessages } from 'react-icons/si';
import { TbCategoryPlus } from 'react-icons/tb';
import { IoPersonCircle } from 'react-icons/io5';
import logoD from '../../images/Logos/Logo_movies_ft.svg';
import logoM from '../../images/Logos/Logo_M.svg';
import logoU from '../../images/Icons/user.png';
import logoR from '../../images/Icons/rechercher.png';
import Button from '../Btn-generique/btn.jsx';
import useAuth from '../../../contexts/useAuth';

import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHome = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/signup';
  const isStream = location.pathname === '/stream/:id';
  const isTerms = location.pathname === '/terms';
  const isDashboard = location.pathname.startsWith('/backoffice');
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/signup');

  const logo_D = { width: '130px' };
  const logo_M = { width: '60px', backgroundColor: 'var(--background-gray)' };
  const size = 20;

  return (
    <>
      {!isDashboard && (
        <header className="d-flex justify-content-between flex-column align-items-center z-3 py-3 px-5 text-light">
          <>
            {/* === DESKTOP === */}
            <div className="desktop d-none d-md-flex justify-content-between w-100">
              <div className="h-left d-flex gap-2 align-items-center">
                <div className="logos">
                  <Link to={'/'}>
                    <img style={logo_D} className="logoD" src={logoD} alt="logo desktop" />
                  </Link>
                </div>
                {!isHome && !isStream && !isTerms && !isLogin && !isRegister && (
                  <nav>
                    <ul className="nav fs-6 d-flex gap-3">
                      <li>
                        <Link className="nav-link text-light" to="/catalogue">
                          Catalogue
                        </Link>
                      </li>
                      <li>
                        <Link className="nav-link text-light" to="/terms#section8">
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link className="nav-link text-light" to="/galerie">
                          Galerie
                        </Link>
                      </li>
                      <li>
                        <Link className="nav-link text-light" to="/terms#section6">
                          Conditions
                        </Link>
                      </li>
                      <li>
                        <Link className="nav-link text-light" to="/contact">
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>

              <div className="btnPlusProfil d-flex align-items-center">
                <Link to="/search">
                  <img src={logoR} alt="recherche" style={{ width: '24px' }} />
                </Link>

                <Button className="bg-transparent border-0 p-0">
                  <select
                    className="form-select text-light bg-transparent border-0 w-auto"
                    style={{ fontSize: '1em' }}>
                    <option value="fr">Français</option>
                  </select>
                </Button>

                {user ? (
                  <div className="dropdown text-center">
                    <Button
                      className="bg-transparent text-light d-flex align-items-center justify-content-center w-100"
                      type="button"
                      data-bs-toggle="dropdown">
                      <span className="me-2">{user.first_name}</span>
                      <img src={user.picture_user || logoU} alt="user" width="30" />
                    </Button>
                    <ul
                      className="dropdown-menu dropdown-menu-dark p-3 text-center"
                      style={{ minWidth: '200px' }}>
                      <li>
                        <Link className="dropdown-item text-center" to="/profile">
                          Voir le profil
                        </Link>
                      </li>
                      <li>
                        <Button onClick={logout} className="s-btn dropdown-item text-center w-100">
                          Déconnexion
                        </Button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Button onClick={handleLogin} className="t-btn" type="button">
                      Se connecter
                    </Button>
                    <Button onClick={handleRegister} className="p-btn" type="button">
                      S'inscrire
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* === MOBILE === */}
            <div className="mobile d-md-none position-absolute fixed-bottom p-3">
              <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                  <nav className="col-4">
                    <ul className="list-unstyled d-flex justify-content-between mb-0">
                      <li>
                        <Link
                          to="/catalogue"
                          className="d-flex flex-column align-items-center text-light text-decoration-none">
                          <TbCategoryPlus size={size} />
                          <span className="small mt-1">Film</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          className="d-flex flex-column align-items-center text-light text-decoration-none">
                          <SiGooglemessages size={size} />
                          <span className="small mt-1">Contact</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>

                  <div className="col-4 text-center">
                    <Link to="/" className="d-inline-block">
                      <img style={logo_M} className="rounded-5 p-2" src={logoM} alt="logo mobile" />
                    </Link>
                  </div>

                  <nav className="col-4">
                    <ul className="list-unstyled d-flex justify-content-between mb-0">
                      {user ? (
                        <li>
                          <Link
                            to="/profile"
                            className="d-flex flex-column align-items-center text-light text-decoration-none">
                            <IoPersonCircle size={size} />
                            <span className="small mt-1">Profil</span>
                          </Link>
                        </li>
                      ) : (
                        <li>
                          <Link
                            to="/login"
                            className="d-flex flex-column align-items-center text-light text-decoration-none">
                            <IoPersonCircle size={size} />
                            <span className="small mt-1">Connexion</span>
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/search"
                          className="d-flex px-3 flex-column align-items-center text-light text-decoration-none bg-transparent border-0">
                          <FaSearch size={size} />
                          <span className="small mt-1">Recherche</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </>
        </header>
      )}
    </>
  );
};

export default Header;
