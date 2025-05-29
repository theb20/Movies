import './Users.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Button from '../../../../components/Btn-generique/btn.jsx';
import Input from '../../../../components/Input-Form/Input.jsx';
import userService from '../../../../../services/authService.js';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const Users = () => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name_user: '',
    first_name: '',
    email: '',
    password: '',
    password_confirm: '',
    birthday: '',
    role: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = () => {
    setVisible(!visible);
    setError('');
    // reset form
    setFormData({
      name_user: '',
      first_name: '',
      email: '',
      password: '',
      password_confirm: '',
      birthday: '',
      role: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cet utilisateur ?')) return;

    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id_user !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const handleSubmit = async (e) => {
    window.location.reload();

    const { name_user, first_name, email, password, password_confirm, birthday, role } = formData;

    if (
      !name_user ||
      !first_name ||
      !email ||
      !password ||
      !password_confirm ||
      !birthday ||
      !role
    ) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== password_confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const newUser = await userService.register(formData);
      setUsers([...users, newUser]);
      toggleVisibility();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="users-container p-4">
      <h3 className="mb-4">Utilisateurs</h3>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Date d’inscription</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user}>
              <td>{user.id_user}</td>
              <td>{user.name_user}</td>
              <td>{user.first_name}</td>
              <td>{format(new Date(user.birthday), 'dd-MM-yyyy')}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{format(new Date(user.inscription_date), 'dd-MM-yyyy')}</td>
              <td>
                <Button onClick={() => handleDelete(user.id_user)} className="s-btn">
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={toggleVisibility} className="s-btn mt-3">
        Ajouter
      </Button>

      {visible && (
        <div className="form-container d-flex align-items-center justify-content-center flex-column bg-opacity-75 bg-dark position-absolute top-0 bottom-0 start-0 end-0 z-3">
          <IoMdCloseCircleOutline
            onClick={toggleVisibility}
            size={45}
            className="text-white bg-danger rounded-circle p-2 close-button"
          />

          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-4 w-25 bg-light bg-opacity-50 p-4 mt-5 custom-form">
            {error && <div className="alert alert-danger">{error}</div>}

            <Input
              label="Nom"
              name="name_user"
              classlabel="text-dark"
              classinput="bg-light"
              type="text"
              placeholder="Entrez votre nom"
              value={formData.name_user}
              onChange={handleChange}
              required
            />
            <Input
              label="Prénom"
              classlabel="text-dark"
              name="first_name"
              classinput="bg-light"
              type="text"
              placeholder="Entrez votre prénom"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              classlabel="text-dark"
              name="email"
              type="email"
              classinput="bg-light"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Mot de passe"
              name="password"
              classlabel="text-dark"
              type="password"
              classinput="bg-light"
              placeholder="Crée votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirmer le mot de passe"
              name="password_confirm"
              classlabel="text-dark"
              type="password"
              classinput="bg-light"
              placeholder="Confirmez votre mot de passe"
              value={formData.password_confirm}
              onChange={handleChange}
              required
            />
            <Input
              label="Date de naissance"
              name="birthday"
              classlabel="text-dark"
              type="date"
              classinput="bg-light"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
            <div className="">
              <label className="">Rôle</label>
              <select
                className="form-select mb-3"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required>
                <option value="">Sélectionner un rôle</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Admin</option>
                <option value="moderator">Modérateur</option>
              </select>
            </div>
            <Button type="submit" className="s-btn w-100">
              Ajouter
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
