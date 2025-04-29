import '../Footer/Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const lCustom = "text-secondary";
  const rxCustom = "rx-link";
  const size = 25;

  return (
    <footer className='d-flex flex-column align-items-center vw-100 p-5'>
      <div className="f-top d-flex align-items-center gap-3 pb-3">
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={rxCustom}><FaYoutube size={size} /></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={rxCustom}><FaTwitter size={size} /></a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={rxCustom}><FaFacebook size={size} /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={rxCustom}><FaInstagram size={size} /></a>
      </div>

      <div className="f-center">
        <p className='text-center text-secondary'>
          Copyright 2024 © Movies . Tous droits réservés
        </p>
        <div className="f-center-list gap-3 d-flex flex-row justify-content-center">
          <Link to='/terms' className={lCustom}>Confidentialité</Link>
          <Link to='/terms' className={lCustom}>Politique</Link>
        </div>
      </div>

      <div className="f-bottom gap-5 mb-5 d-flex">
        <Link to='/terms' className={lCustom}>Blog</Link>
        <Link to='/contact' className={lCustom}>Contact</Link>
        <Link to='/profile' className={lCustom}>Profil</Link>
        <Link to='/galerie' className={lCustom}>Galerie</Link>
      </div>
    </footer>
  );
};

export default Footer;
