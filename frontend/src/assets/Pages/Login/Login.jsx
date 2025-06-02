import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiHide, BiShow } from 'react-icons/bi';
// Correction du chemin d'importation
import useAuth from '../../../contexts/useAuth';
import Input from '../../components/Input-Form/Input';
import Button from '../../components/Btn-generique/btn';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: location.state?.email || '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setChargement(true);

    try {
      const res = await login(formData);

      // Vérification plus détaillée de la réponse
      if (res && (res.token || res.id_user)) {
        console.log('Authentification réussie');
        navigate('/catalogue');
      } else {
        console.log('Réponse invalide:', res);
        throw new Error("Données d'authentification invalides");
      }
    } catch (err) {
      console.error('Erreur login détaillée:', err);
      setError(
        err.response?.data?.message || err.message || 'Identifiants incorrects. Veuillez réessayer.'
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="mainLogin d-flex justify-content-center align-items-center vh-100">
      <div className="container-login z-3 d-flex justify-content-center align-items-center flex-column text-light p-2">
        <h1 className="fs-1 text-center">Déverrouillez un monde de divertissement sans fin</h1>
        <p className="fs-5 text-center">
          Connectez-vous ou Inscrivez-vous pour découvrir, diffuser et profiter !
        </p>

        {error && <div className="alert alert-danger w-100 mt-2">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="form-login bg-custom-from text-light py-5 px-5 w-45 d-flex justify-content-center align-items-center flex-column gap-3 mt-2">
          <h2>Connexion</h2>

          <div className="bg-light rounded-1 w-100">
            <Input
              label="E-mail"
              classlabel="text-black px-2 fw-bold"
              classinput="border bg-transparent border-0 bg"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Entrez votre adresse e-mail"
              onChange={handleChange}
              required
            />
          </div>

          <div className="bg-light rounded-1 w-100 position-relative">
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              classlabel="text-black px-2 fw-bold"
              classinput="border bg-transparent border-0 bg"
              name="password"
              value={formData.password}
              placeholder="Entrez votre mot de passe"
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              className="position-absolute end-0 bottom-0 translate-middle-y me-2 p-0"
              onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <BiHide className="text-black" size={20} />
              ) : (
                <BiShow className="text-black" size={20} />
              )}
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center gap-2 w-100">
            <p className="fs-8">
              Nouveau sur Movies ?{' '}
              <Link to="/signup" className="text-decoration-underline">
                Inscrivez-vous maintenant
              </Link>
            </p>
            <Link to="/reset">
              <p className="fs-8">Mot de passe oublié ?</p>
            </Link>
          </div>

          <Button type="submit" className="s-btn w-100 rounded-1 py-2" disabled={chargement}>
            {chargement ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
