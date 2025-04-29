// Header.jsx

import { Link, useNavigate } from "react-router-dom";
import Input from "../Input-Form/Input.jsx";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { RiMovie2Line } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { SiSteelseries } from "react-icons/si";
import { BsClockHistory } from "react-icons/bs";
import logoD from "../../images/Logos/Logo_movies_ft.svg";
import logoM from "../../images/Logos/Logo_M.svg";
import logoU from "../../images/Icons/user.png";
import logoR from "../../images/Icons/rechercher.png";
import Button from "../Btn-generique/btn.jsx";
import useAuth from '../../../contexts/useAuth';
import "./Header.css";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();


  const isHome = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/signup';
  const isTerms = location.pathname === '/terms';
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/signup');
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const logo_D = { width: "130px" };
  const logo_M = { width: "60px", backgroundColor: 'var(--background-gray)' };
  const navUl = "d-flex gap-2 p-0 m-0 align-items-center";
  const navLinkMobile = 'd-flex align-items-center flex-column';
  const size = 20;


  return (
    <header className="d-flex justify-content-between flex-column align-items-center z-3 py-3 px-5 text-light">
      
      {/* === DESKTOP === */}
      <div className="desktop d-none d-md-flex justify-content-between w-100">
        <div className="h-left d-flex gap-2 align-items-center">
          <div className="logos">
            <Link to={'/'}><img style={logo_D} className='logoD' src={logoD} alt="logo desktop" /></Link>
          </div>
            {!isHome && !isTerms && !isLogin &&!isRegister &&( 
              <nav>
                <ul className="nav d-flex gap-3">
                  <li><Link className="nav-link text-light" to="/catalogue">Tous les films</Link></li>
                  <li><Link className="nav-link text-light" to="/catalogue">Catégorie</Link></li>
                  <li><Link className="nav-link text-light" to="/catalogue">Séries</Link></li>
                  <li><Link className="nav-link text-light" to="/catalogue">Mieux Notés</Link></li>
                  <li><Link className="nav-link text-light" to="/historique">Historique</Link></li>
                </ul>
              </nav>
            )}
          
        </div>

        <div className="btnPlusProfil d-flex align-items-center">

         
              <Button 
                variant="link" 
                className="p-0 border-0" 
                onClick={() => setShowSearch(!showSearch)}
              >
                <img src={logoR} alt="recherche" style={{ width: '24px' }} />
              </Button>

              {showSearch && (
                <div 
                  className="position-absolute top-0 start-50 translate-middle-x mt-2 p-2 bg-danger"
                  style={{ width: '100%', height: '550px' }}
                >
                  <Input 
                    type="text" 
                    className="form-control" 
                    placeholder="Rechercher un film..." 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              )}
          

          <Button className="bg-transparent border-0 p-0">
        <select 
          className="form-select text-light bg-transparent border-0 w-auto" 
          style={{ fontSize: "1em" }}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </Button>

          {user ? (
            <div className="dropdown text-center">
              <Button className="bg-transparent text-light d-flex align-items-center justify-content-center w-100" type="button" data-bs-toggle="dropdown">
                <span className="me-2">{user.first_name}</span>
                <img src={user.picture_user || logoU} alt="user" width="30" />
              </Button>
              <ul className="dropdown-menu dropdown-menu-dark p-3 text-center" style={{ minWidth: '200px' }}>
                <li><Link className="dropdown-item text-center" to="/profile">Voir le profil</Link></li>
                <li><Button onClick={handleLogout} className="s-btn dropdown-item text-center w-100">Déconnexion</Button></li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Button onClick={handleLogin} className="t-btn" type="button">Se connecter</Button>
              <Button onClick={handleRegister} className="p-btn" type="button">S'inscrire</Button>
            </div>
          )}
        </div>
      </div>

      {/* === MOBILE === */}
        <div className="mobile d-flex gap-3 justify-content-between align-items-center d-md-none px-3">
          <nav className="navbar p-0">
            <ul className={`${navUl} list-unstyled d-flex gap-3 align-items-center`}>
              <li>
                <Link className={`${navLinkMobile} text-center`} to="/films">
                  <RiMovie2Line size={size} /><span>Films</span>
                </Link>
              </li>
              <li>
                <Link className={`${navLinkMobile} text-center`} to="/categories">
                  <TbCategoryPlus size={size} /><span>Catégorie</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="d-flex flex-column gap-2 align-items-center">
            <img style={logo_M} className="logoM rounded-5 p-2" src={logoM} alt="logo mobile" />
          </div>

          <nav className="navbar p-0">
            <ul className={`${navUl} list-unstyled d-flex gap-3 align-items-center`}>
              <li><Link className={`${navLinkMobile} text-center`} to="/series">
                <SiSteelseries size={size} /><span>Séries</span>
              </Link></li>
              <li><Link className={`${navLinkMobile} text-center`} to="/historique">
                <BsClockHistory size={size} /><span>Historique</span>
              </Link></li>
            </ul>
          </nav>
        </div>
      
    </header>
  );
};

export default Header;
