import './Mentions.css';
import { useState, useEffect } from 'react';
import mentions from '../../../../../services/mentionService.js';
import categoryService from '../../../../../services/movieService.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';
import Button from '../../../../components/Btn-generique/btn.jsx';
import Input from '../../../../components/Input-Form/Input.jsx';
import { FaComment } from 'react-icons/fa';
import { AiFillLike } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { IoIosClose } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Mentions = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  const [visibleCat, setVisibleCat] = useState(false);
  const [visibleAdmin, setVisibleAdmin] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addCategorie, setAddCategorie] = useState({ category_name: '', slug: '' });
  useEffect(() => {
    if (userRole === 'admin') {
      setVisibleAdmin(true);
    }
  }, [userRole]);
  // Gestionnaire d'événements pour la modification des valeurs du formulair
  const handleChangeCat = (e) => {
    const { name, value } = e.target;
    setAddCategorie({ ...addCategorie, [name]: value });
  };

  const toggleVisibilityCat = () => {
    setVisibleCat(!visibleCat);
  };

  const handleSubmitCat = async () => {
    try {
      await categoryService.addCategory(addCategorie);
      setCategories([...categories, addCategorie]);
      setAddCategorie({ category_name: '', slug: '' });
      toggleVisibilityCat();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie :", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsRes, likesRes, categoriesRes] = await Promise.all([
          mentions.getAllComments(),
          mentions.getAllLikes(),
          categoryService.getCategories()
        ]);
        setComments(commentsRes);
        setLikes(likesRes);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données :', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteComment = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await mentions.deleteComment(id);
        setComments(comments.filter((comment) => comment.id_comment !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire :', error);
      }
    }
  };

  const handleDeleteLike = async (id_movie) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce like ?')) {
      try {
        await mentions.deleteLike(id_movie);
        setLikes(likes.filter((like) => like.id_movie !== id_movie));
      } catch (error) {
        console.error('Erreur lors de la suppression du like :', error);
      }
    }
  };

  const handleDeleteCat = async (id) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
    if (!confirmed) return;

    try {
      // Optionnel : tu peux ici désactiver un bouton ou afficher un loader

      await categoryService.deleteCategory(id);

      // Utilisation de la version fonctionnelle du state pour éviter les erreurs de synchronisation
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id_category !== id)
      );
    } catch (error) {
      console.error(`Échec de la suppression de la catégorie ${id} :`, error);
      alert('Une erreur est survenue lors de la suppression. Veuillez réessayer.');
    } finally {
      // Optionnel : réactivation du bouton ou masquage du loader
    }
  };

  return (
    <div className="mentions-container container h-100 overflow-y-scroll py-4">
      <h3 className="mb-4">Mentions</h3>

      {/* Remplacement de d-flex gap-3 par row g-3 pour la grille Bootstrap */}
      <div className="row g-3">
        {/* Colonne pour les commentaires et les likes */}
        {/* Prend 12 colonnes sur les petits et moyens écrans (md), 8 sur les grands écrans (lg) */}
        <div className="col-12 col-lg-8">
          <div className="bg-white rounded shadow-sm p-4 mb-3">
            {' '}
            {/* Ajout de mb-3 pour l'espacement sur mobile */}
            <h5 className="fw-bold d-flex gap-2 mb-3">
              <FaComment size={20} /> Commentaires
            </h5>
            {/* table-responsive pour le défilement horizontal sur les petits écrans */}
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center mb-5">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>ID (user)</th>
                    <th>Nom</th>
                    <th>ID Commentaire</th>
                    <th>ID Film</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id_comment}>
                      <td className="fw-bold text-primary">{comment.id_user}</td>
                      <td>{comment.name_user}</td>
                      <td>{comment.id_comment}</td>
                      <td>{comment.id_movie}</td>
                      <td>{comment.content}</td>
                      <td className="text-muted">
                        {format(new Date(comment.comment_date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </td>
                      <td>
                        <Button
                          onClick={() => handleDeleteComment(comment.id_comment)}
                          children={'Supprimer'}
                          className="s-btn"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <h5 className="fw-bold d-flex gap-2 mb-3">
              <AiFillLike size={20} /> Likes
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>ID Film</th>
                    <th>Titre</th>
                    <th>ID User</th>
                    <th>Images</th>
                    <th>Nom utilisateur</th>
                    <th>Date ajout</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {likes.map((like) => (
                    <tr key={`${like.id_movie}-${like.id_user}`}>
                      <td className="fw-bold text-primary">{like.id_movie}</td>
                      <td>{like.title}</td>
                      <td>{like.id_user}</td>
                      <td style={{ width: '100px' }}>
                        <div className="d-flex align-items-center position-relative justify-content-center ps-3 gap-2">
                          <img
                            src={like.img_cover}
                            alt="img_cover"
                            className="rounded-5"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <img
                            src={like.img_presentation}
                            alt="img_presentation"
                            className="rounded-5 position-absolute"
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              right: '30px'
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">{like.name_user}</span>
                      </td>
                      <td className="text-muted">
                        {format(new Date(like.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </td>
                      <td>
                        <Button
                          onClick={() => handleDeleteLike(like.id_movie)}
                          children={'Supprimer'}
                          className="s-btn"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne pour les catégories */}
        {/* Prend 12 colonnes sur les petits et moyens écrans (md), 4 sur les grands écrans (lg) */}
        <div className="col-12 col-lg-4">
          <div
            style={{ height: '450px' }}
            className="p-4 rounded position-relative bg-light shadow-sm category-panel">
            {' '}
            {/* Ajout de 'category-panel' pour des styles spécifiques */}
            <h6 className="mb-3 d-flex justify-content-between">
              📁 Catégories disponibles
              <span className="bg-dark bg-opacity-10 p-2 rounded-5 ms-2 text-center">
                {categories.length}
              </span>
            </h6>
            {categories.length > 0 ? (
              <ul className="list-group" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {categories.map((cat) => (
                  <li
                    key={cat.id_category}
                    className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <strong>{cat.category_name}</strong>
                    </span>
                    <span className="badge bg-secondary">{cat.slug}</span>
                    {visibleAdmin && (
                      <Button
                        className="bg-danger px-2 py-1 bg-opacity-10 rounded-circle"
                        onClick={() => handleDeleteCat(cat.id_category)}>
                        <MdDelete style={{ color: 'var(--color-red)' }} size={20} />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chargement des catégories...</p>
            )}
            {visibleAdmin ? (
              <Button
                onClick={toggleVisibilityCat}
                children={'Ajouter'}
                className="p-btn w-100 mt-2"
              />
            ) : (
              <Link to={'/login'} className="btn w-100 btn-danger btn-sm">
                Authorisation requise
              </Link>
            )}
            {visibleCat && (
              <div className="bg-dark bg-opacity-75 position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center z-3">
                <div
                  style={{ height: '300px' }}
                  className="bg-light d-flex flex-column justify-content-between border rounded-3 m-2 w-75 p-4 add-category-overlay">
                  {' '}
                  {/* Ajout de 'add-category-overlay' */}
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold">Ajouter une catégorie</h5>
                    <Button className="bg-danger bg-opacity-25" onClick={toggleVisibilityCat}>
                      <IoIosClose style={{ color: 'var(--color-red)' }} size={20} />
                    </Button>
                  </div>
                  <Input
                    label="Nom de la catégorie"
                    type="text"
                    classinput="bg-white"
                    value={addCategorie.category_name}
                    onChange={handleChangeCat}
                    classlabel="text-dark"
                    name="category_name"
                    placeholder="Entrez le nom de la catégorie"
                  />
                  <Input
                    classinput="bg-white"
                    classlabel="text-dark"
                    value={addCategorie.slug}
                    onChange={handleChangeCat}
                    type="text"
                    label="Slug"
                    name="slug"
                    placeholder="Entrez le slug de la catégorie"
                  />
                  <Button
                    children={'Soumettre'}
                    onClick={handleSubmitCat}
                    className="p-btn w-100 mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentions;
