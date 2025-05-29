// App.jsx

import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider.jsx';
import ProtectedRoute from './seccure_route/ProtectedRoute.jsx';

// Layout Components
import Header from './assets/components/Header/Header';
import Footer from './assets/components/Footer/Footer';
import Search from './assets/components/Search/Search.jsx';
import Newsletter from './assets/components/Newsletter/Newsletter.jsx'; // Assure-toi que c'est bien une fonction exportée
import Cookies from './assets/components/Cookie/cookie.jsx';
// Pages
import Home from './assets/Pages/Home/Home';
import Terms from './assets/Pages/Termes-Conditions/Terms.jsx';
import NotFound from './assets/Pages/NotFound/NotFound.jsx';
import Contact from './assets/Pages/Contact/Contact.jsx';
import Galerie from './assets/Pages/Galerie/Galerie.jsx';
import Login from './assets/Pages/Login/Login.jsx';
import Register from './assets/Pages/SignUp/Sign_up.jsx';
import Reset from './assets/components/Forget-password/ResetPassword.jsx';
import Profile from './assets/Pages/Profil/Profile.jsx';
import Detail from './assets/Pages/Detail/Detail.jsx';
import Catalogue from './assets/Pages/Catalogue/Catalogue.jsx';
import Stream from '../src/assets/components/VideoPlayer/VideoPLayer.jsx';
import Backoffice from '../src/assets/Pages/Backoffice/index.jsx';
import userBackoffice from '../src/assets/Pages/Backoffice/components/Users/Users.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="position-relative">
        <Header />

        <Routes>
          {/* Routes publiques */}
          <Route
            index
            element={
              <>
                <Home />
                <div className="newsletter position-fixed z-2 top-0">
                  <Newsletter />
                </div>
              </>
            }
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route
            path="/backoffice/*"
            element={
              <ProtectedRoute>
                <Backoffice />
              </ProtectedRoute>
            }
          />

          {/* Routes protégées */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <ProtectedRoute>
                <Detail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/galerie"
            element={
              <ProtectedRoute>
                <Galerie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <Catalogue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stream/:id"
            element={
              <ProtectedRoute>
                <Stream />
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
