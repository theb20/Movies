import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from '../src/assets/components/Header/Header';
import Footer from './assets/components/Footer/Footer';
import VideoPlayer from './assets/components/VideoPlayer/VideoPLayer.jsx';

function App() {

  return (
    <>
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={'hello'}/>
        </Routes>
        <Footer />
    </Router>
    </>
  )
}

export default App
