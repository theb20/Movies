import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import icondefault from '../../images/Icons/user.png';
import Button from '../../components/Btn-generique/btn.jsx';
import Input from '../../components/Input-Form/Input.jsx';
import useAuth from '../../../contexts/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    birthday: '',
    creationDate: '',
    role: ''
  });

  const [tempProfile, setTempProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: `${user.first_name} ${user.name_user}`.trim() || 'No name',
        email: user.email || 'No email',
        birthday: user.birthday || '',
        creationDate: user.inscription_date || '',
        role: user.role || 'Utilisateur'
      };
      setProfile(userData);
      setTempProfile(userData);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    if (isEditing) {
      setTempProfile(profile); // reset changes
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await updateUser(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil :', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion :', error);
    }
  };

  const formatDate = (dateStr, formatStr = "d MMMM yyyy 'à' HH:mm") => {
    try {
      if (!dateStr) return 'Non défini';
      return format(new Date(dateStr), formatStr, { locale: fr });
    } catch (err) {
      return 'Format invalide';
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="bg-dark profile-container p-3 p-lg-4 rounded">
        <div className="wallpaper"></div>

        {/* Mode édition */}
        {isEditing ? (
          <form className="d-flex flex-column flex-lg-row justify-content-around align-items-center gap-3 w-100 p-3">
            <div className="mb-3 w-100 w-lg-auto">
              <Input
                label="Nom :"
                type="text"
                name="name"
                value={tempProfile.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 w-100 w-lg-auto">
              <Input
                label="Email :"
                type="email"
                name="email"
                value={tempProfile.email}
                onChange={handleChange}
              />
            </div>
            <Button type="button" className="btn btn-success w-100 w-lg-25" onClick={handleSave}>
              Sauvegarder
            </Button>
          </form>
        ) : (
          <div className="profile-content d-flex flex-column flex-lg-row gap-4 p-3 p-lg-5">
            <div className="profile-info d-flex align-items-center flex-column w-100 w-lg-25 text-light mt-5 p-2 position-relative">
              <img
                src={icondefault}
                alt="User Icon"
                className="profile-img position-absolute"
                width="150"
              />
              <h4 className="pt-lg-3">{profile.name}</h4>
              <p>{profile.email}</p>
            </div>

            <div className="w-100 w-lg-auto">
              <div className="px-3 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Historique</h6>
                <Link to="/history" className="fs-4 fs-lg-2">
                  Voir plus
                </Link>
              </div>
              <p>
                <strong>Email</strong>
              </p>
              <p className="p-2 border border-1 rounded text-light">{profile.email}</p>
            </div>

            <div className="w-100 w-lg-auto">
              <div className="px-3 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Date de création du compte</h6>
                <p className="fs-5">{formatDate(profile.creationDate)}</p>
              </div>
              <p>
                <strong>Date de naissance</strong>
              </p>
              <p className="p-2 border border-1 rounded text-light">
                {formatDate(profile.birthday, 'dd MMMM yyyy')}
              </p>
            </div>

            <div className="w-100 w-lg-auto">
              <div className="px-3 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Type d'abonnement</h6>
                <p className="fs-4 fs-lg-2">Gratuit</p>
              </div>
              <p>
                <strong>Rôle</strong>
              </p>
              <p className="p-2 border border-1 rounded text-light">{profile.role}</p>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 px-3 px-lg-5 mt-4">
          <Button className="p-btn px-4 py-2 w-100 w-lg-auto" onClick={handleEdit}>
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>

          <Button className="p-btn px-4 py-2 w-100 w-lg-auto" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
