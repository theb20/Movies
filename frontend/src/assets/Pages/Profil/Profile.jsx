import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import icondefault from "../../images/Icons/user.png";
import Button from "../../components/Btn-generique/btn.jsx";
import Input from "../../components/Input-Form/Input.jsx";
import useAuth from "../../../contexts/useAuth";
import "./Profile.css";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    creationDate: "",
  });

  const [tempProfile, setTempProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.first_name || "No name",
        email: user.email || "No email",
        birthday: user.birthday || "Not set",
        creationDate: user.inscription_date || "Unknown",
        role: user.role || "Unknown",
      };
      setProfile(userData);
      setTempProfile(userData);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    if (isEditing) {
      setTempProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await updateUser(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="bg-dark profile-container p-4 rounded">
        <div className="wallpaper"></div>

        {/* ✅ Mode édition : Formulaire */}
        {isEditing ? (
          <form className="d-flex flex-row justify-content-around align-items-center w-100 ">
            <div className="mb-3">
              <Input label="Nom :" type="text" name="name" value={tempProfile.name} onChange={handleChange}  />
            </div>
            <div className="mb-3">
              <Input label="Email :" type="email" name="email" value={tempProfile.email} onChange={handleChange} classinput="form-control" />
            </div>
            
            <Button type="button" className="btn btn-success w-25" onClick={handleSave}>Sauvegarder</Button>
          </form>
        ) : (
          // ✅ Mode affichage
          <div className="profile-content d-flex flex-wrap gap-4 p-5 ">
            {/* ✅ Colonne gauche : Photo + Nom + Email */}
            <div className="profile-info d-flex align-items-center flex-column w-25 text-light mt-5 p-2 position-relative">
              <img src={icondefault} alt="User Icon" className="profile-img position-absolute" width="190" />
              <h4>{profile.name}</h4>
              <p>{profile.email}</p>
            </div>

            {/* ✅ Informations détaillées */}
            <div className="">
              <div className="px-2 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Historique</h6>
                <Link to="/history" className="fs-2">Voir plus</Link>
              </div>
              <p><strong>E-mail</strong></p>
              <p className="p-2 border border-1 rounded text-light">{profile.email}</p>
            </div>

            <div className="">
              <div className="px-2 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Date de création du compte</h6>
                <p className="fs-5">{profile.creationDate}</p>
              </div>
              <p><strong>Date de naissance</strong></p>
              <p className="p-2 border border-1 rounded text-light">{profile.birthday}</p>
            </div>

            <div className="">
              <div className="px-2 py-4 bg-gray rounded mb-3 h-custom">
                <h6 className="text-light">Type d'abonnement</h6>
                <p className="fs-2">Gratuit</p>
              </div>
              <p><strong>Compte</strong></p>
              <p className="p-2 border border-1 rounded text-light">{profile.role}</p>
            </div>
          </div>
        )}

        {/* ✅ Boutons "Déconnexion" et "Modifier" */}
        {/* Update the logout button */}
        <div className="d-flex justify-content-between px-5 mt-4">
          <Button 
            className="p-btn px-5 py-2" 
            onClick={handleLogout}>
            Déconnexion
          </Button>

          <Button 
            className="p-btn px-5 py-2" 
            onClick={handleEdit}>
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;