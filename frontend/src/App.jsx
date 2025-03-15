import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from '../src/assets/components/Header/Header';
import Footer from './assets/components/Footer/Footer.jsx';

import Home from './assets/Pages/Home/Home';
import Terms from './assets/Pages/Termes-Conditions/Terms.jsx';
import NotFound from './assets/Pages/NotFound/NotFound.jsx'
import Contact from './assets/Pages/Contact/Contact.jsx';
import Galerie from './assets/Pages/Galerie/Galerie.jsx';
import Login from './assets/Pages/Login/Login.jsx';
import Register from './assets/Pages/SignUp/Sign_up.jsx';
import Reset from './assets/components/Forget-password/ResetPassword.jsx'
import Profile from './assets/Pages/Profil/Profile.jsx';
import Catalogue from './assets/Pages/Catalogue/Catalogue.jsx';

function App() {

  return (
    <>
    <Router>
      <Header />
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/terms' element={<Terms/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='*' element={<NotFound/>}/>
          <Route path='/galerie' element={<Galerie/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Register/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/catalogue' element={<Catalogue/>}/>
        </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
