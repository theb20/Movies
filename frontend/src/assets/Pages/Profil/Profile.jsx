import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import icondefault from '../../images/Icons/user.png';
import Button from '../../components/Btn-generique/btn.jsx';
import Input from '../../components/Input-Form/Input.jsx';
import useAuth from '../../../contexts/useAuth';
import { jwtDecode } from 'jwt-decode';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Mentions from '../../../services/movieService.js';
import './Profile.css';

const Profile = () => {
  const { user, logout, putUserById } = useAuth();
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id_user;
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const date = await Mentions.getSearch();
        const filteredHistory = date.filter((item) => item.id_user === userId);
        setHistory(filteredHistory);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'historique :", error);
      }
    };
    fetchHistory();
  }, []); // Added userId to dependency array

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
        name: user.name_user || 'No name',
        first_name: user.first_name || 'No first name',
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
      // Assurez-vous que les champs correspondent à ceux attendus par l'API
      const dataToUpdate = {
        name_user: tempProfile.name,
        first_name: tempProfile.first_name,
        email: tempProfile.email,
        birthday: tempProfile.birthday
      };
      const updatedUser = await putUserById(userId, dataToUpdate);
      setProfile({
        name: updatedUser.name_user || 'No name',
        first_name: updatedUser.first_name || 'No first name',
        email: updatedUser.email || 'No email',
        birthday: updatedUser.birthday || '',
        creationDate: updatedUser.inscription_date || '',
        role: updatedUser.role || 'Utilisateur'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/logout');
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
  const handleDelete = async (id) => {
    try {
      await Mentions.deleteSearch(id);
      const updatedHistory = history.filter((item) => item.id_search !== id);
      setHistory(updatedHistory);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'historique :", error);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center mt-5 pt-5">
      <div className="bg-dark w-100 profile-container p-3 p-lg-4 rounded">
        <div className="wallpaper"></div>

        {/* Mode édition */}
        {isEditing ? (
          <form className="d-flex flex-column flex-lg-row justify-content-around align-items-center gap-3 w-100 p-3">
            <div className="mb-3 w-100 w-lg-auto">
              <Input
                label="Nom :"
                type="text"
                name="name"
                classinput="bg-light"
                value={tempProfile.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 w-100 w-lg-auto">
              <Input
                label="Prénom(s) :"
                type="text"
                name="first_name"
                classinput="bg-light"
                value={tempProfile.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 w-100 w-lg-auto">
              <Input
                label="Email :"
                type="email"
                name="email"
                classinput="bg-light"
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
              <h4 className=" pt-lg-3">
                {profile.first_name} {profile.name}
              </h4>
              <p>{profile.email}</p>
            </div>

            <div className="w-100 w-lg-auto">
              <div className="px-3 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Historique</h6>
                <Link onClick={toggleVisibility} className="fs-4 fs-lg-2">
                  Voir plus
                </Link>
                {visible && (
                  <div className="bg-black bg-opacity-50 position-absolute z-3 d-flex align-items-center justify-content-center top-0 bottom-0 start-0 end-0">
                    <div className="bg-dark p-4 rounded">
                      <div className="d-flex gap-5 justify-content-center align-items-center">
                        <h6 className="text-white m-0 p-0">
                          Historique de visionnage{' '}
                          <span className="border rounded-5 py-1 px-2">{history.length}</span>
                        </h6>
                        <Button onClick={toggleVisibility} className="s-btn p-1">
                          Fermer
                        </Button>
                      </div>
                      {history.map((item) => (
                        <ul key={item.id_search} className="list-unstyled m-0">
                          <li className="d-flex align-items-center justify-content-between border-bottom border-white border-opacity-10 py-2 gap-2">
                            <span className="text-white">{item.keyword}</span>
                            <span style={{ fontSize: '12px' }} className="text-white">
                              {format(new Date(item.date_search), 'd MMMM yyyy', { locale: fr })}
                            </span>
                            <Button
                              variant="link"
                              className="text-white p-0"
                              onClick={() => handleDelete(item.id_search)}>
                              <IoIosCloseCircleOutline size={15} />
                            </Button>
                          </li>
                        </ul>
                      ))}
                      {!history.length && (
                        <p className="text-white text-center mt-5 mb-5">
                          Aucun historique de recherche trouvé.
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
