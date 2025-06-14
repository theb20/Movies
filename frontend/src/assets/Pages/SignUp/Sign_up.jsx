import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHide, BiShow } from 'react-icons/bi';
import { GrValidate } from 'react-icons/gr';
import { RiPoliceBadgeLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider.jsx';

import Input from '../../components/Input-Form/Input.jsx';
import Button from '../../components/Btn-generique/btn.jsx';
import './Sign_up.css';

const SignUp = () => {
  const LabelForm = 'text-black px-2 fw-bold';
  const classcontainer = 'bg-light rounded w-100';
  const InputFrom = 'border bg-white  border-0';
  const location = useLocation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: location.state?.email || '',
    password: '',
    birthDate: '',
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setChargement(true);
    if (!formData.terms) {
      setError("Vous devez accepter les conditions d'utilisation pour vous inscrire.");
      setChargement(false);
      return;
    }

    // Créer un objet avec seulement les champs attendus par l'API
    const userToSend = {
      name_user: formData.lastName,
      first_name: formData.firstName,
      birthday: formData.birthDate,
      email: formData.email,
      password: formData.password,
      role: 'user' // Fixé ici côté frontend
    };

    try {
      const res = await register(userToSend);
      console.log('Réponse register:', res);
      if (res && res.message === 'Utilisateur créé') {
        console.log('Inscription réussie');
        navigate('/login');
      } else {
        console.log('Réponse invalide:', res);
        throw new Error("Données d'inscription invalides");
      }
    } catch (err) {
      console.error('Erreur register détaillée:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard."
      );
    } finally {
      setChargement(false);
    }
  };

  const sizeLi = 20;

  return (
    <main className="mainSignUp d-flex p-3 justify-content-center align-items-center">
      <div className="container-register z-2 d-flex justify-content-center align-items-center flex-column text-light">
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="form-register bg-custom-from text-light py-3 px-5 d-flex justify-content-center align-items-center flex-column gap-3 mt-2 w-100">
          <h2>Inscription</h2>

          {/* Nom et Prénom */}
          <div className="d-flex flex-column flex-lg-row gap-2 rounded-1 w-100">
            <Input
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              classcontainer={classcontainer}
              classlabel={LabelForm}
              classinput={InputFrom}
              type="text"
              placeholder="Entrez votre nom"
              required
            />
            <Input
              label="Prénom(s)"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              classcontainer={classcontainer}
              classlabel={LabelForm}
              classinput={InputFrom}
              type="text"
              placeholder="Entrez votre/vos prénom(s)"
              required
            />
          </div>

          {/* Forfait Basique */}
          <div className="d-flex  w-100">
            <div className="w-100 d-none d-lg-block">
              <div className="d-flex w-100">
                <div className="w-75">
                  <p>Basic | Usage personnel</p>
                  <span className="spanform position-relative fs-1 fw-bold">Gratuit</span>
                </div>
                <RiPoliceBadgeLine size={60} />
              </div>

              <ul>
                <li className="d-flex gap-3 align-items-center">
                  <GrValidate className="text-light" size={sizeLi} /> Accès immédiat sans carte
                  bancaire.
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <GrValidate className="text-light" size={sizeLi} /> Accessible partout.
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <GrValidate className="text-light" size={sizeLi} /> Accès limité aux films.
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <GrValidate className="text-light" size={sizeLi} /> Qualité max 720p.
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <GrValidate className="text-light" size={sizeLi} /> Notifications pour les
                  nouvelles sorties.
                </li>
              </ul>
            </div>

            {/* Colonne droite : infos utilisateurs */}
            <div className="w-100 gap-3 d-flex flex-column">
              <div className="rounded-1 w-100 gap-3 d-flex flex-column">
                <div className={classcontainer}>
                  <Input
                    label="Date de naissance"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    classlabel={LabelForm}
                    onChange={handleChange}
                    classinput={InputFrom}
                    required
                    max={new Date().toISOString().split('T')[0]} // empêche la sélection d'une date future
                  />
                </div>

                <Input
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  classcontainer={classcontainer}
                  classlabel={LabelForm}
                  classinput={InputFrom}
                  placeholder="exemple.email@gmail.com"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="rounded-1 w-100 position-relative">
                <Input
                  label="Crée un mot de passe"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  classcontainer={classcontainer}
                  classlabel={LabelForm}
                  classinput={InputFrom}
                  placeholder="+8 Caractères min"
                  minLength={8}
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
            </div>
          </div>

          {/* Checkbox conditions */}
          <div className="d-flex align-items-center w-100">
            <Input
              classcontainer="bg-none d-flex align-items-center gap-2"
              classinput="form-check-input"
              label={
                "En vous inscrivant, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité."
              }
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
              labelClassName="form-check-label text-light"
            />
          </div>
          <Link to="/login" style={{ fontSize: '10px' }} className="text-decoration-underline">
            Vous avez déja un compte ? Connectez-vous
          </Link>

          {/* Bouton Inscription */}
          <Button
            type="submit"
            children={chargement ? 'Veuillez patienter...' : "S'inscrire"}
            className="s-btn w-100 rounded-1 py-2"
            disabled={chargement}
          />
        </form>
      </div>
    </main>
  );
};

export default SignUp;
