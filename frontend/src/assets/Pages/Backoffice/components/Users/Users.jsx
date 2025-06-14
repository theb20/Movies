import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Importer la locale française
import Button from '../../../../components/Btn-generique/btn.jsx';
import Input from '../../../../components/Input-Form/Input.jsx';
import userService from '../../../../../services/authService.js';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const Users = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  const [visible, setVisible] = useState(false);
  const [selectedUserIdForRoleEdit, setSelectedUserIdForRoleEdit] = useState(null);
  const [visibleAdmin, setVisibleAdmin] = useState(false);
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
  const toggleModifiedRole = (id) => {
    if (selectedUserIdForRoleEdit === id) {
      setSelectedUserIdForRoleEdit(null);
    } else {
      setSelectedUserIdForRoleEdit(id);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      setVisibleAdmin(true);
    }
  }, [userRole]);
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
    window.location.reload(e);
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
  const handleConfirmRole = async (userId) => {
    try {
      const user = users.find((u) => u.id_user === userId);
      await userService.putUserById(userId, { role: user.role });
      setUsers(users.map((u) => (u.id_user === userId ? { ...u, role: user.role } : u)));
    } catch (error) {
      console.log('Erreur :', error);
    }
  };

  return (
    <div className="container py-4">
      {' '}
      {/* Bootstrap container pour le padding et le centrage */}
      <h3 className="mb-4">Utilisateurs</h3>
      {/* table-responsive pour permettre le défilement horizontal de la table sur les petits écrans */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle text-center table-sm">
          <thead>
            <tr>
              {/* Suppression des espaces et retours à la ligne entre les <th> */}
              <th scope="col">ID</th>
              <th scope="col">Nom</th>
              <th scope="col">Prénom</th>
              <th scope="col" className="text-nowrap">
                Date de naissance
              </th>
              <th scope="col">Email</th>
              <th scope="col">Rôle</th>
              <th scope="col" className="text-nowrap">
                Date d’inscription
              </th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_user}>
                {/* Suppression des espaces et retours à la ligne entre les <td> */}
                <td>{user.id_user}</td>
                <td>{user.name_user}</td>
                <td>{user.first_name}</td>
                <td className="text-nowrap">
                  {format(new Date(user.birthday), 'dd-MM-yyyy', { locale: fr })}
                </td>
                <td>{user.email}</td>
                <td style={{ width: '200px' }}>
                  {!visibleAdmin ? (
                    <p className="text-muted">{user.role}</p>
                  ) : (
                    <>
                      {selectedUserIdForRoleEdit === user.id_user ? (
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <select
                            className="form-select w-100 form-select-sm"
                            value={user.role}
                            onChange={(e) =>
                              setUsers((prevUsers) =>
                                prevUsers.map((u) =>
                                  u.id_user === user.id_user ? { ...u, role: e.target.value } : u
                                )
                              )
                            }
                            style={{ width: '100%' }}>
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                          <Button
                            onClick={() => {
                              handleConfirmRole(user.id_user);
                              setSelectedUserIdForRoleEdit(null);
                            }}
                            className="btn btn-success btn-sm">
                            ✓
                          </Button>
                          <Button
                            onClick={() => setSelectedUserIdForRoleEdit(null)}
                            className="btn btn-danger btn-sm">
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => toggleModifiedRole(user.id_user)}
                          className="border-danger text-danger w-100 btn-sm">
                          {user.role}
                        </Button>
                      )}
                    </>
                  )}
                </td>

                <td className="text-nowrap">
                  {format(new Date(user.inscription_date), 'dd-MM-yyyy', { locale: fr })}
                </td>
                <td>
                  {visibleAdmin ? (
                    <Button
                      onClick={() => handleDelete(user.id_user)}
                      className="btn btn-danger btn-sm">
                      Supprimer
                    </Button>
                  ) : (
                    <Link to={'/login'} className="btn btn-danger btn-sm">
                      Authorisation requise
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleAdmin && (
        <Button onClick={toggleVisibility} className="s-btn mt-3">
          Ajouter
        </Button>
      )}
      {visible && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">Ajouter un utilisateur</h5>
                <Button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={toggleVisibility}></Button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  {error && <div className="alert alert-danger">{error}</div>}

                  <Input
                    label="Nom"
                    name="name_user"
                    classlabel="form-label text-dark"
                    classinput="form-control bg-light"
                    type="text"
                    placeholder="Entrez votre nom"
                    value={formData.name_user}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Prénom"
                    classlabel="form-label text-dark"
                    name="first_name"
                    classinput="form-control bg-light"
                    type="text"
                    placeholder="Entrez votre prénom"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email"
                    classlabel="form-label text-dark"
                    name="email"
                    type="email"
                    classinput="form-control bg-light"
                    placeholder="Entrez votre email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Mot de passe"
                    name="password"
                    classlabel="form-label text-dark"
                    type="password"
                    classinput="form-control bg-light"
                    placeholder="Créez votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Confirmer le mot de passe"
                    name="password_confirm"
                    classlabel="form-label text-dark"
                    type="password"
                    classinput="form-control bg-light"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Date de naissance"
                    name="birthday"
                    classlabel="form-label text-dark"
                    type="date"
                    classinput="form-control bg-light"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                  />
                  <div className="mb-3">
                    <label className="form-label text-dark">Rôle</label>
                    <select
                      className="form-select"
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
                  <Button type="submit" className="p-btn w-100">
                    Ajouter
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
