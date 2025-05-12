// Header.jsx

import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Input from "../Input-Form/Input.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { IoPersonCircle } from "react-icons/io5";
import logoD from "../../images/Logos/Logo_movies_ft.svg";
import logoM from "../../images/Logos/Logo_M.svg";
import logoU from "../../images/Icons/user.png";
import logoR from "../../images/Icons/rechercher.png";
import Button from "../Btn-generique/btn.jsx";
import useAuth from '../../../contexts/useAuth';
import "./Header.css";
import movieService from "../../../services/movieService.js";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
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
  const size = 20;
  useEffect(() =>{
    const fetchMovies = async () =>{
      try{
        const movies =await movieService.getAllMovies();
        setAllMovies(movies);
      }catch(error){
        console.error('Erreur lors de la récu. des films:', error);
      }
    }
    fetchMovies();
  }, [])
  
  const filteredMovies = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchValue.toLowerCase())
  )

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
      <div className="mobile d-md-none position-absolute fixed-bottom p-3">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-center">
            <nav className="col-4">
              <ul className="list-unstyled d-flex justify-content-between mb-0">
                <li>
                  <Link to="/catalogue" className="d-flex flex-column align-items-center text-light text-decoration-none">
                    <TbCategoryPlus size={size} />
                    <span className="small mt-1">Film</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="d-flex flex-column align-items-center text-light text-decoration-none">
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
                <li>
                  <Link to="/login" className="d-flex flex-column align-items-center text-light text-decoration-none">
                    <IoPersonCircle size={size} />
                    <span className="small mt-1">Connexion</span>
                  </Link>
                </li>
                <li>
                  <Button 
                    onClick={() => setShowSearch(!showSearch)}
                    className="d-flex flex-column align-items-center text-light text-decoration-none bg-transparent border-0"
                  >
                    <FaSearch size={size} />
                    <span className="small mt-1">Recherche</span>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>


      {showSearch && (
        <div className="search-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ zIndex: 9999 }}>
          <div className="search-container w-100 px-4 py-5 position-relative">
            <form onSubmit={(e) => e.preventDefault()}>
              <h1 className="text-center mb-4">
                Découvrez le film parfait
                <br />
                <span className="fs-5 text-secondary">Recherche intelligente</span>
              </h1>
              <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <Input 
                  type="text" 
                  classlabel="d-none"
                  className="form-control form-control-lg" 
                  placeholder="Rechercher un film..." 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </form>

            <div className="search-results mt-4 mx-auto" style={{ maxWidth: '600px', maxHeight: '50vh', overflowY: 'auto' }}>
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <div key={movie.id} className="p-2">
                    <Link to={`/catalogue/${movie.id}`} className="text-light text-decoration-none" onClick={() => setShowSearch(false)}>
                      {movie.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-light">Aucun résultat trouvé</p>
              )}
            </div>

            <Button className="position-absolute top-0 end-0 m-3 bg-transparent border-0" onClick={() => setShowSearch(false)}>
              <IoMdClose size={24} className="text-light" />
            </Button>
          </div>
        </div>
      )}

      
    </header>
  );
};

export default Header;
