import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FaTable,
  FaFilm,
  FaHeart,
  FaHistory,
  FaMailBulk,
  FaUserShield,
  FaWpforms
} from 'react-icons/fa';
import { HiLogout } from 'react-icons/hi';

import logoM from '../../../../images/Logos/Logo_M.svg';
import logoD from '../../../../images/Logos/Logo_movies_ft.svg';
import userIcon from '../../../../images/Icons/user.png';
import Button from '../../../../components/Btn-generique/btn.jsx';

import './Sidebar.css';

const Sidebar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sizeIcon = 20;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (err) {
        localStorage.removeItem('token');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { to: '/backoffice', icon: <FaTable size={sizeIcon} />, label: "Vue d'ensemble" },
    { to: '/backoffice/movies', icon: <FaFilm size={sizeIcon} />, label: 'Films' },
    { to: '/backoffice/favorites', icon: <FaHeart size={sizeIcon} />, label: 'Mentions' },

    { to: '/backoffice/users', icon: <FaUserShield size={sizeIcon} />, label: 'Utilisateurs' },
    { to: '/backoffice/forms', icon: <FaWpforms size={sizeIcon} />, label: 'Documentation' }
  ];

  return (
    <div
      className="sidebar h-100 rounded-3 position-relative z-3 overflow-y-hidden"
      style={{ backgroundColor: 'var(--background-admin)' }}>
      {/* Logo */}
      <div
        className="logo d-flex align-items-center justify-content-center w-100"
        style={{ width: '100px', height: '80px' }}>
        <img src={logoM} className="activation w-100 px-3" alt="Logo_movie" />
        <img src={logoD} className="desactivated" height={50} alt="Logo_movie" />
      </div>
      <hr />

      {/* Menu */}
      <div style={{ height: '83%' }} className="d-flex justify-content-between flex-column">
        <div className="overflow-auto">
          <ul className="menu d-flex gap-3 list-unstyled mb-0 flex-column w-100 px-2">
            {menuItems.map((item, idx) => (
              <li key={idx} className={location.pathname === item.to ? 'act' : ''}>
                <Link
                  to={item.to}
                  className="d-flex link align-items-center justify-content-center gap-2">
                  {item.icon}
                  <span className="desactivated ">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Profil utilisateur */}
        {userInfo && (
          <div className="profil bg-dark bg-opacity-25 d-flex align-items-center justify-content-center flex-column p-3 rounded-3 border gap-2 m-3">
            <div className="d-flex flex-row gap-2 align-items-center">
              <img
                src={userInfo.picture || userIcon}
                width={50}
                alt="Profil"
                className="rounded-circle"
              />
              <div className="desactivated flex-column">
                <p className="text-black fs-5 fw-lighter mb-0">
                  <span>{userInfo.first_name}</span> <span>{userInfo.name_user}</span>
                </p>
                <p className="text-black fw-lighter mb-0">{userInfo.email}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/catalogue')}
              className="desactivated rounded-1 bg-danger border-0 t-btn justify-content-between w-100">
              Retour Catalogue <HiLogout size={sizeIcon} />
            </Button>
            <Button
              onClick={handleLogout}
              className="desactivated s-btn rounded-1 justify-content-between w-100">
              Déconnexion <HiLogout size={sizeIcon} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
