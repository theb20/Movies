import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar.jsx';
import Overviews from './components/Overviews/Overviews.jsx';
import Footer from './components/Footer/Footer.jsx';
import Users from './components/Users/Users.jsx';
import Header from './components/Header/Header.jsx';

const Backoffice = () => {
  return (
    <div className="backoffice-container bg-white p-3 vh-100 d-flex">
      <Sidebar />

      <div className="main-content px-3 w-100 d-flex flex-column gap-3">
        <Header />
        <Routes>
          <Route path="/" element={<Overviews />} />
          <Route path="users" element={<Users />} />
          {/* Ajoute d'autres routes ici */}
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default Backoffice;
