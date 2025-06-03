import './Logout.css';
import { Link } from 'react-router-dom';

const GoodBye = () => {
  return (
    <div className="logout position-relative vh-100 w-100 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover">
        <source src="/goodbye.webm" type="video/webm" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      <div className="position-relative z-2 text-white text-center d-flex flex-column justify-content-center align-items-center h-100 px-4">
        <h1 className=" display-4 fw-bold mb-3">À bientôt</h1>
        <p className="lead mb-4">Votre session vient de se terminer.</p>
        <Link
          to="/login"
          className=" text-white px-4 py-2 rounded-pill shadow-sm"
          style={{ backgroundColor: 'var(--background-btn)', color: '#000' }}>
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default GoodBye;
