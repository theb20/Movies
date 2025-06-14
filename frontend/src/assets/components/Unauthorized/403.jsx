import Button from '../Btn-generique/btn.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  });
  return (
    <div className="container vh-100  position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center gap-3 flex-column text-center mt-5">
      <h1 className="text-warning">🚫 Accès Refusé</h1>
      <p>Vous n’avez pas les permissions nécessaires pour accéder à cette page.</p>
      <div className="d-flex gap-2">
        <Button
          className="s-btn rounded-1"
          onClick={() => navigate('/login')}
          children={'Changer de rôle'}
        />
        <Button className="t-btn rounded-1" onClick={() => navigate('/')} children={'Accueil'} />
      </div>
    </div>
  );
};

export default Unauthorized;
