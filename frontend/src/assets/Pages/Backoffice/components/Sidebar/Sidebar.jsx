import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTable,
  FaFilm,
  FaHeart,
  FaHistory,
  FaMailBulk,
  FaUserShield,
  FaDoorOpen,
  FaWpforms
} from 'react-icons/fa';
import { HiLogout } from 'react-icons/hi';

import logoM from '../../../../images/Logos/Logo_M.svg';
import logoD from '../../../../images/Logos/Logo_movies_ft.svg';
import userIcon from '../../../../images/Icons/user.png';
import Button from '../../../../components/Btn-generique/btn.jsx';

import './Sidebar.css';

const sizeIcon = 25;

const Sidebar = () => {
  return (
    <div
      className="sidebar h-100 rounded-3 position-relative z-3 overflow-y-hidden"
      style={{ backgroundColor: 'var(--background-admin)' }}>
      <div
        className="logo d-flex align-items-center justify-content-center w-100"
        style={{ width: '100px', height: '80px' }}>
        <img src={logoM} className="activation w-100 px-3" alt="Logo_movie" />
        <img src={logoD} className="desactivated" height={50} alt="Logo_movie" />
      </div>
      <hr />
      <div style={{ height: '93%' }} className="d-flex justify-content-between flex-column">
        <div className="overflow-auto">
          <ul className="menu d-flex gap-3 list-unstyled mb-0">
            <li>
              <Link to="/backoffice">
                <FaTable className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Vue d'ensemble</span>
              </Link>
            </li>
            <li>
              <Link to="/backoffice/movies">
                <FaFilm className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Films</span>
              </Link>
            </li>
            <li>
              <Link to="/backoffice/favorites">
                <FaHeart className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Mentions</span>
              </Link>
            </li>
            <li>
              <Link to="/backoffice/history">
                <FaHistory className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Historique</span>
              </Link>
            </li>
            <li>
              <Link to="/backoffice/newsletter">
                <FaMailBulk className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Boite de reception</span>
              </Link>
            </li>
            <li>
              <Link to="/backoffice/users">
                <FaUserShield className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Utilisateurs</span>
              </Link>
            </li>
            <li>
              <Link to="/backoffice/forms">
                <FaWpforms className="icon-sidebar" size={sizeIcon} />
                <span className="desactivated">Documentation</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="profil bg-dark bg-opacity-25 d-flex align-items-center justify-content-center flex-column p-3 rounded-3 border gap-2 m-3">
          <div className="flex-row gap-2 d-flex">
            <img src={userIcon} width={50} alt="Profil" />
            <span className="desactivated flex-column">
              <p className="text-black fs-5 fw-lighter mb-0">John Doe</p>
              <p className="text-black fw-lighter mb-0">emailuser@gmail.com</p>
            </span>
          </div>
          <Button className="desactivated s-btn d-flex justify-content-between w-100">
            Déconnexion <HiLogout size={sizeIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
