import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Btn-generique/btn.jsx';

const Cookie = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const handleAccept = () => {
    setVisible(false);
    localStorage.setItem('cookieAccepted', 'true');
  };

  return (
    <div 
      className="position-fixed d-flex align-items-end" 
      style={{
        bottom: '50px',
        left: '67px',
        height: '110px',
        overflow: 'hidden',  
        zIndex: '1050'
      }}
    >
      {/* Barre fixe */}
      <div 
        className="bg-danger"
        style={{ 
          width: '4px', 
          height: '100%',
          transform: visible ? 'translateY(0)' : 'translateY(100%)', ease: 'ease-in-out',
        transition: 'transform 0.6s ease-in-out'}}
      ></div>

      {/* Cookie qui sort */}
      <div
        className="d-flex align-items-center p-3 bg-danger bg-opacity-25 rounded-end"
        style={{
          height: '100%',
          maxWidth: '400px',
          transform: visible ? 'translateX(0)' : 'translateX(-110%)',
          transition: 'transform 2.5s ease-in-out',
          backgroundClip: 'padding-box'
        }}
      >
        <p className="mb-0 flex-grow-1 small text-white">
          Nous utilisons des cookies pour sécuriser votre session sur Movies.{' '}
          <Link to="/terms#section6" className="text-white text-decoration-underline">
            En savoir plus
          </Link>.
        </p>
        <Button onClick={handleAccept} className="p-btn w-75" children={"J'ai compris"}/>
      </div>
    </div>
  );
};

export default Cookie;
