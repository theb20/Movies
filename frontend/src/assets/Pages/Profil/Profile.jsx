import { useState } from "react";
import { Link } from "react-router-dom";
import icondefault from "../../images/Icons/user.png";
import Button from "../../components/Btn-generique/btn.jsx";
import Input from "../../components/Input-Form/Input.jsx";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "0123456789",
    birthday: "02/04/2020",
    creationDate: "10/20/30",
  });

  const [tempProfile, setTempProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setTempProfile((prevProfile) => ({
    ...prevProfile,
    [name]: value,
  }));
};

  const handleEdit = () => {
    if (isEditing) {
      setTempProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    console.log("Profil mis à jour :", tempProfile);
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
            <div className="mb-3">
              <Input label="Téléphone :" type="tel" name="phone" value={tempProfile.phone} onChange={handleChange} classinput="form-control" />
            </div>
            
            <Button type="button" className="btn btn-success w-25" onClick={handleSave}>Sauvegarder</Button>
          </form>
        ) : (
          // ✅ Mode affichage
          <div className="profile-content d-flex gap-4 p-5">
            {/* ✅ Colonne gauche : Photo + Nom + Email */}
            <div className="profile-info d-flex align-items-center flex-column w-25 text-light mt-5 p-2 position-relative">
              <img src={icondefault} alt="User Icon" className="profile-img position-absolute" width="190" />
              <h4>{profile.name}</h4>
              <p>{profile.email}</p>
            </div>

            {/* ✅ Informations détaillées */}
            <div className="w-100">
              <div className="px-2 py-4 bg-gray rounded mb-3">
                <h6 className="text-light">Historique</h6>
                <Link to="/history" className="fs-2">Voir plus</Link>
              </div>
              <p><strong>E-mail</strong></p>
              <p className="p-2 border border-1 rounded text-light">{profile.email}</p>
            </div>

            <div className="w-100">
              <div className="px-2 py-4 bg-gray rounded mb-3">
                <h6 className="text-light">Date de création du compte</h6>
                <p className="fs-2">{profile.creationDate}</p>
              </div>
              <p><strong>Date de naissance</strong></p>
              <p className="p-2 border border-1 rounded text-light">{profile.birthday}</p>
            </div>

            <div className="w-100">
              <div className="px-2 py-4 bg-gray rounded mb-3">
                <h6 className="text-light">Type d'abonnement</h6>
                <p className="fs-2">Gratuit</p>
              </div>
              <p><strong>Numéro de téléphone</strong></p>
              <p className="p-2 border border-1 rounded text-light">{profile.phone}</p>
            </div>
          </div>
        )}

        {/* ✅ Boutons "Déconnexion" et "Modifier" */}
        <div className="d-flex justify-content-between px-5 mt-4">
          <Button 
          className="p-btn px-5 py-2" 
          onClick={() => console.log("Déconnexion")}>Déconnexion</Button>

          <Button className="p-btn px-5 py-2" onClick={handleEdit}>{isEditing ? "Annuler" : "Modifier"}</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
