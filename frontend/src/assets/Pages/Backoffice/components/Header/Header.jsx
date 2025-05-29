import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IoMdMail } from 'react-icons/io';
import { FaRegUserCircle } from 'react-icons/fa';

const Header = () => {
  const sizeIcon = 20;
  return (
    <nav className="d-flex align-items-center justify-content-between w-100">
      <ul className="bg-transparent d-flex mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
        <li className="breadcrumb-item text-sm">
          <Link className="opacity-5 text-dark">Pages / </Link>
        </li>
        <li className="text-sm active-nav-main"> Dashboard</li>
      </ul>
      <ul className="navbar-nav d-flex flex-row align-items-center justify-content-between">
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
  );
};
export default Header;
