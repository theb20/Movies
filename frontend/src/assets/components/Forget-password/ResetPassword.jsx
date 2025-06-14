import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrLinkNext } from 'react-icons/gr';
import resetSuccess from '../../../assets/images/Icons/reset2.gif';
import { BiHide, BiShow } from 'react-icons/bi';
import Input from '../Input-Form/Input';
import Button from '../Btn-generique/btn';
import resetPasswordService from '../../../services/authService.js'; // adapte le chemin
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // états pour formulaire
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // contrôle de l'affichage des étapes
  const [visibleOne, setVisibleOne] = useState(true);
  const [visibleTwo, setVisibleTwo] = useState(false);
  const [visibleThree, setVisibleThree] = useState(false);
  const [visibleFour, setVisibleFour] = useState(false);

  // états pour afficher messages d'erreur ou succès (optionnel)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Étape 1: demande de code par email
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await resetPasswordService.requestReset(email);
      setSuccess('Code envoyé à votre email');
      setVisibleOne(true);
      setVisibleTwo(true);
    } catch (err) {
      setError("Erreur lors de l'envoi du code. Vérifiez votre email.");
    }
  };

  // Étape 2: vérification du code
  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await resetPasswordService.verifyCode(email, resetCode);
      setSuccess('Code vérifié, vous pouvez changer votre mot de passe.');
      setVisibleTwo(true);
      setVisibleThree(true);
    } catch (err) {
      setError('Code invalide ou expiré.');
    }
  };

  // Étape 3: modification du mot de passe
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    try {
      await resetPasswordService.resetPassword(email, resetCode, newPassword);
      setSuccess('Mot de passe modifié avec succès !');
      setVisibleOne(false);
      setVisibleTwo(false);
      setVisibleThree(false);
      setVisibleFour(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Erreur lors du changement de mot de passe.');
    }
  };

  return (
    <div className="container-reset d-flex align-items-center w-100  flex-column bg-light p-lg-5 p-3">
      <div className="text-center text-lg-start w-100 pt-5 mb-5">
        <h1 className=" text-dark fw-bold">Renouvellement de mot de passe</h1>
        <p className="text-muted">
          Pour sécuriser votre compte, veuillez suivre les étapes ci-dessous :
        </p>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
      </div>
      <div className="card-reset d-flex flex-row align-items-center justify-content-center  w-100 gap-4 flex-wrap">
        {/* Étape 1 */}
        {visibleOne && (
          <div className="d-flex flex-row gap-5 align-items-center">
            <div style={{ minWidth: '300px', maxWidth: '350px', height: '300px' }}>
              <div className=" h-100  border-0">
                <form className="form-one card-body" onSubmit={handleSubmitEmail}>
                  <h2 className="card-title mb-4 fw-bold">Étape 1 </h2>
                  <h6 className="card-text text-bold text-dark">E-mail de récupperation </h6>
                  <p className="text-muted mb-4">
                    Entrez votre adresse e-mail de récupération. Un code de confirmation vous sera
                    envoyé.
                  </p>
                  <Input
                    type="email"
                    placeholder="Entrez votre email"
                    classlabel="d-none"
                    classinput="form-control bg-light border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="text-end mt-3">
                    <Button className="s-btn rounded-1 px-4" type="submit" children="Suivant" />
                  </div>
                </form>
              </div>
            </div>
            <div className="d-none d-lg-flex border rounded-5 p-3 align-items-center justify-content-center mt-3">
              <GrLinkNext size={36} />
            </div>
          </div>
        )}

        {/* Étape 2 */}
        {visibleTwo && (
          <div className="d-flex flex-row  gap-2 align-items-center">
            <div style={{ minWidth: '300px', maxWidth: '350px', height: '300px' }}>
              <div className=" h-100 px-4 border-0">
                <form className="form-two card-body" onSubmit={handleSubmitCode}>
                  <h2 className="card-title mb-4 fw-bold">Étape 2 </h2>
                  <h6 className="card-text text-bold text-dark">Code de confirmation</h6>
                  <p className="text-muted mb-4">
                    Saisissez le code de confirmation reçu par e-mail.
                  </p>
                  <Input
                    type="text"
                    placeholder="Code de confirmation"
                    classlabel="d-none"
                    classinput="form-control bg-light border"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                  <div className="text-end mt-3">
                    <Button className="s-btn rounded-1  px-4" type="submit" children="Suivant" />
                  </div>
                </form>
              </div>
            </div>
            <div className="d-none border rounded-5 p-3 d-lg-flex align-items-center justify-content-center mt-3">
              <GrLinkNext size={36} />
            </div>
          </div>
        )}

        {/* Étape 3 */}
        {visibleThree && (
          <div className="d-flex flex-column align-items-center">
            <div style={{ minWidth: '300px', maxWidth: '350px', height: '300px' }}>
              <div className=" h-100  border-0">
                <form className="form-three card-body" onSubmit={handleSubmitNewPassword}>
                  <h2 className="card-title mb-4 fw-bold">Étape 3 </h2>
                  <h6 className="card-text text-bold text-dark">Nouveau mot de passe</h6>
                  <p className="text-muted mb-4">
                    Choisissez un nouveau mot de passe sécurisé et confirmez-le.
                  </p>
                  <div className="position-relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nouveau mot de passe"
                      classlabel="d-none"
                      classinput="form-control border bg-light pe-5"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 bg-transparent border-0"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
                    </Button>
                  </div>
                  <div className="text-end mt-3">
                    <Button className="s-btn rounded-1 px-4" type="submit" children="Confirmer" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {visibleFour && (
          <div className=" card-success d-flex vh-100 w-100  flex-column align-items-center">
            <div className=" h-100  border-0">
              <div className="card-body d-flex align-items-center justify-content-center flex-column">
                <img
                  src={resetSuccess}
                  style={{ height: '30rem' }}
                  alt="reset-success"
                  className="img-fluid mb-3"
                />
                <p className="card-text text-center text-muted">
                  Votre mot de passe a été modifié avec succès. <br /> Redirection vers la page de
                  connexion...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>{' '}
    </div>
  );
};

export default ResetPassword;
