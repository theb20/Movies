import React, { useEffect, useState } from 'react';
import user from '../../../../images/Icons/user.png';
import Button from '../../../../components/Btn-generique/btn.jsx';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IoMdMail, IoMdClose } from 'react-icons/io';
import { FaRegUserCircle } from 'react-icons/fa';
import useAuth from '../../../../../contexts/useAuth.js';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [dataToken, setDataToken] = useState({});

  const handleClick = () => {
    setVisible(!visible);
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDataToken(decodedToken);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        // Gérer l'erreur (redirection vers login, etc.)
      }
    }
  }, [token]);

  const sizeIcon = 20;

  return (
    <div className="">
      <nav className="d-flex align-items-center justify-content-between w-100">
        <ul className="navbar-nav ms-auto d-flex flex-row align-items-center justify-content-between">
          <li className="nav-item py-2 px-3 d-flex align-items-center">
            {format(new Date(), 'yyyy', { locale: fr })}
          </li>

          <li className="nav-item p-2 bg-white d-flex d-lg-none align-items-center rounded">
            <div className="d-block d-lg-none">
              <Button onClick={handleClick} className="p-0 border-0 bg-transparent">
                <img
                  className="picture-user rounded-circle"
                  style={{ width: '25px', height: '25px', objectFit: 'cover' }}
                  src={user}
                  alt={dataToken.name_user || 'User'}
                />
              </Button>
            </div>

            <div className="d-none d-lg-block">
              <Button
                onClick={handleClick}
                className="p-0 border-0 bg-transparent d-flex align-items-center">
                <span className="me-2 text-dark">
                  {dataToken.first_name} {dataToken.name_user}
                </span>
                <img
                  className="picture-user rounded-circle"
                  style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                  src={user}
                  alt={dataToken.name_user || 'User'}
                />
              </Button>
            </div>
          </li>
        </ul>
      </nav>

      {/* Modal/Menu utilisateur */}
      {visible && (
        <div className="position-fixed start-0 end-0 top-0 bottom-0 bg-black bg-opacity-75 z-3 d-flex align-items-start justify-content-center">
          <div
            className="position-relative bg-light rounded shadow-lg mt-5 mx-3"
            style={{ maxWidth: '400px', width: '100%' }}>
            {/* Bouton fermer */}
            <Button
              onClick={handleClick}
              className="position-absolute top-0 end-0 border-0 m-3 text-light bg-danger p-1 rounded-circle"
              style={{ width: '30px', height: '30px' }}
              aria-label="Fermer">
              x
            </Button>

            {/* Contenu du profil */}
            <div className="p-4 pt-5">
              <div className="d-flex align-items-center mb-4">
                <img
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  className="rounded-circle me-3 border"
                  src={user}
                  alt="Photo de profil"
                />
                <div className="flex-grow-1">
                  <h5 className="text-dark mb-1">
                    {dataToken.first_name} {dataToken.name_user}
                  </h5>
                  <p className="text-muted mb-0 small">{dataToken.role}</p>
                </div>
              </div>

              {/* Informations utilisateur */}
              <div className="border-top pt-3">
                <div className="mb-2">
                  <strong className="text-dark small">Email:</strong>
                  <p className="text-dark mb-0">{dataToken.email}</p>
                </div>

                <div className="mb-3">
                  <strong className="text-dark small">Rôle:</strong>
                  <span
                    className={`badge ${dataToken.role === 'admin' ? 'bg-danger' : 'bg-primary'} ms-2`}>
                    {dataToken.role}
                  </span>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <Button
                    onClick={() => navigate('/profile')}
                    className="btn btn-outline-primary btn-sm flex-grow-1">
                    Profil
                  </Button>
                  <Button className="btn btn-outline-secondary btn-sm flex-grow-1">
                    Paramètres
                  </Button>
                </div>

                <div className="mt-2">
                  <Button onClick={logout} className="btn btn-danger btn-sm w-100">
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
