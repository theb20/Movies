import '../Footer/Footer.css';
import { Link } from 'react-router-dom';
import useAuth from '../../../contexts/useAuth';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

const Footer = () => {
  const lCustom = 'text-secondary';
  const rxCustom = 'rx-link';
  const size = 25;
  const { user } = useAuth();

  const location = useLocation();

  const isSearchPage = location.pathname === '/search';
  const isStreamPage = location.pathname === '/stream/:id';
  const isDashPage = location.pathname === '/dashboard';

  return (
    <footer>
      {!isDashPage && !isSearchPage && !isStreamPage && (
        <div className="d-flex flex-column align-items-center vw-100 p-5">
          <div className="f-top d-flex align-items-center gap-3 pb-3">
            <Link
              to={'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={rxCustom}>
              <FaYoutube size={size} />
            </Link>
            <Link
              to={'https://twitter.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={rxCustom}>
              <FaTwitter size={size} />
            </Link>
            <Link
              to={'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={rxCustom}>
              <FaFacebook size={size} />
            </Link>
            <Link
              to={'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={rxCustom}>
              <FaInstagram size={size} />
            </Link>
          </div>
          <div className="f-center">
            <p className="text-center text-secondary">
              Copyright 2024 © Movies . Tous droits réservés
            </p>
            <div className="f-center-list gap-3 d-flex flex-row justify-content-center">
              <Link to="/terms" className={lCustom}>
                Confidentialité
              </Link>
              <Link to="/terms" className={lCustom}>
                Politique
              </Link>
            </div>
          </div>
          <div className="f-bottom gap-5 mb-5 d-flex">
            <Link to="/terms" className={lCustom}>
              Blog
            </Link>
            <Link to="/contact" className={lCustom}>
              Contact
            </Link>
            {user ? (
              <>
                <Link to="/profile" className={lCustom}>
                  Profil
                </Link>
                <Link to="/galerie" className={lCustom}>
                  Galerie
                </Link>
              </>
            ) : (
              <Link to="/login" className={lCustom}>
                Se connecter
              </Link>
            )}
          </div>
          © {format(new Date(), 'yyyy')} Movie. Tous droits réservés.
        </div>
      )}
    </footer>
  );
};

export default Footer;
