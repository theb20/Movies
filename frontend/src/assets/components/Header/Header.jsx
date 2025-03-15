import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiMovie2Line } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { SiSteelseries } from "react-icons/si";
import { BsClockHistory } from "react-icons/bs";

import logoD from "../../images/Logos/Logo_movies_ft.svg";
import logoM from "../../images/Logos/Logo_M.svg";
import logoU from "../../images/Icons/user.png";
import logoR from "../../images/Icons/rechercher.png";
import Button from "../Btn-generique/btn.jsx";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();
    const redirection = () =>{
      navigate("/profile");
    }
    const logo_D = {width:"130px"}
    const logo_M = {width:"60px", backgroundColor: 'var(--background-gray'}
    const navUl = "d-flex gap-2 p-0 m-0 align-items-center "
    const navLinkMobile = 'd-flex align-items-center flex-column'
    const size = 20
    
  return (
    <header className="d-flex justify-content-between flex-column align-items-center z-3 py-3 px-5 text-light">
      <div className="desktop d-none d-md-flex justify-content-between w-100">
          <div className="h-left d-flex align-items-center">
            <div className="logos">
              <Link to={'/'}><img style={logo_D} className='logoD' src={logoD} alt="logo desktop"  /></Link>
            </div>

            <nav>
              <ul className="nav">
                <li className="nav-item"><Link className="nav-link text-light" to="/*">Tous les films</Link></li>
                <li className="nav-item"><Link className="nav-link text-light" to="/categories">Catégorie</Link></li>
                <li className="nav-item"><Link className="nav-link text-light" to="/series">Séries</Link></li>
                <li className="nav-item"><Link className="nav-link text-light" to="/top-rated">Mieux Notés</Link></li>
                <li className="nav-item"><Link className="nav-link text-light" to="/historique">Historique</Link></li>
              </ul>
            </nav>
          </div>
          <div className="btnPlusProfil w-0 d-flex align-items-center">
            <Button className="bg-transparent border-0 p-0" onClick={() => alert("Action bouton")}>
                <img src={logoR} alt="recherche"/>
            </Button>

            <Button className="bg-transparent border-0 p-0">
              <select
                defaultValue="fr"
                id="langue"
                className="form-select text-light bg-transparent border-0 w-auto"
                style={{ fontSize:"1em" }}
              >
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </Button>

            <Button onClick={redirection} className="bg-transparent text-light border-0 p-0">
              Name User <img src={logoU} alt="user logo" className="ms-2" width="30" />
            </Button>
          </div>
      </div>
      <div className="mobile d-flex gap-3 justify-content-between align-items-center d-md-none px-3">
  
  {/* Navigation gauche */}
  <nav className="navbar p-0">
    <ul className={`${navUl} list-unstyled d-flex gap-3 align-items-center`}>
      <li><Link className={`${navLinkMobile} text-center d-flex flex-column align-items-center`}>
        <RiMovie2Line size={size} /><span>Films</span>
      </Link></li>
      <li><Link className={`${navLinkMobile} text-center d-flex flex-column align-items-center`}>
        <TbCategoryPlus size={size} /><span>Catégorie</span>
      </Link></li>
    </ul>
  </nav>

  {/* Logo au centre */}
  <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
    <img style={logo_M} className="logoM rounded-5 p-2" src={logoM} alt="logo mobile" />
  </div>

  {/* Navigation droite */}
  <nav className="navbar p-0">
    <ul className={`${navUl} list-unstyled d-flex gap-3 align-items-center`}>
      <li><Link className={`${navLinkMobile} text-center d-flex flex-column align-items-center`}>
        <SiSteelseries size={size} /><span>Séries</span>
      </Link></li>
      <li><Link className={`${navLinkMobile} text-center d-flex flex-column align-items-center`}>
        <BsClockHistory size={size} /><span>Historique</span>
      </Link></li>
    </ul>
  </nav>

      </div>
    </header>
  );
};

export default Header;
