import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import movieService from '../../../../../services/movieService.js';
import Button from '../../../../components/Btn-generique/btn.jsx';
import Input from '../../../../components/Input-Form/Input.jsx';
import { IoMdCloseCircleOutline, IoMdTrash, IoMdCreate } from 'react-icons/io';
import wallpaper from '../../../../images/Background/bg-popup.jpeg';
import './Movies.css';
const Movies = () => {
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState({});
  const [modified, setModified] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [visibleFrom, setVisibleFrom] = useState(false);

  const toggleVisibleFrom = () => {
    setVisibleFrom(!visibleFrom);
  };
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    release_date: '',
    img_cover: null,
    img_presentation: null,
    trailer: null,
    video: null,
    rating: 0,
    id_category: '',
    description: ''
  });
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement initial des films et catégories
  const fetchMoviesAndCategories = useCallback(async () => {
    try {
      const [moviesData, categoriesData] = await Promise.all([
        movieService.getAllMovies(),
        movieService.getCategories()
      ]);

      const categoryMap = {};
      categoriesData.forEach((cat) => {
        categoryMap[cat.id_category] = cat.category_name;
      });

      setMovies(moviesData);
      setCategories(categoryMap);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des films ou catégories :', error);
      // Gérer l'affichage de l'erreur à l'utilisateur
    }
  }, []); // Aucune dépendance car ces services ne changent pas

  useEffect(() => {
    fetchMoviesAndCategories();
  }, [fetchMoviesAndCategories]);

  const toggleModified = (id) => {
    if (modified === id) {
      setModified(null); // Annuler la modification
      // Réinitialiser formData si nécessaire ici, ou le faire à l'entrée du mode modification
      setFormData({
        // Réinitialise formData au film sélectionné
        title: '',
        director: '',
        release_date: '',
        img_cover: null,
        img_presentation: null,
        trailer: null,
        video: null,
        rating: 0,
        id_category: '',
        description: ''
      });
    } else {
      setModified(id); // Activer la modification
      // Pré-remplir formData avec les données du film sélectionné
      const movieToEdit = movies.find((movie) => movie.id_movie === id);
      if (movieToEdit) {
        setFormData({
          title: movieToEdit.title || '',
          director: movieToEdit.director || '',
          release_date: movieToEdit.release_date
            ? format(new Date(movieToEdit.release_date), 'yyyy-MM-dd')
            : '',
          img_cover: null, // Les inputs de type file ne peuvent pas être pré-remplis
          img_presentation: null, // Laisser null pour que l'utilisateur re-sélectionne si besoin
          trailer: null,
          video: null,
          rating: movieToEdit.rating || 0,
          id_category: movieToEdit.id_category || '',
          description: movieToEdit.description || ''
        });
      }
    }
  };

  // Bascule la visibilité du formulaire d'ajout de film
  const toggleAddMovieModal = () => {
    setShowAddMovieModal(!showAddMovieModal);
    // Réinitialiser le formulaire quand on l'ouvre/ferme
    setFormData({
      title: '',
      director: '',
      release_date: '',
      img_cover: null,
      img_presentation: null,
      trailer: null,
      video: null,
      rating: 0,
      id_category: '',
      description: ''
    });
    // Réinitialiser les inputs file (méthode DOM directe)
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = '';
    });
  };

  // Gère les changements dans les champs du formulaire (texte, nombre, select)
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value // Pour les fichiers, stocke l'objet File
    }));
  };

  // Soumission du formulaire d'ajout/édition
  const handleSubmit = async () => {
    // Validation des champs (inchangée)
    const requiredFields = [
      'title',
      'director',
      'release_date',
      'img_cover',
      'img_presentation',
      'trailer',
      'video',
      'rating',
      'id_category',
      'description'
    ];

    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === 'string' && formData[field].trim() === '')
      ) {
        alert(`Le champ "${field}" est requis.`);
        return;
      }
    }

    if (formData.rating < 0 || formData.rating > 5) {
      alert('La note doit être comprise entre 0 et 5.');
      return;
    }

    // --- Construction de FormData pour multipart/form-data ---
    const formDataToSend = new FormData();

    // Ajout des champs texte
    formDataToSend.append('title', formData.title);
    formDataToSend.append('director', formData.director);
    formDataToSend.append('release_date', formData.release_date);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('id_category', formData.id_category);
    formDataToSend.append('description', formData.description);

    // Ajout des fichiers (exemple, vérifier si ce sont bien des fichiers)
    if (formData.img_cover instanceof File) {
      formDataToSend.append('img_cover', formData.img_cover);
    }
    if (formData.img_presentation instanceof File) {
      formDataToSend.append('img_presentation', formData.img_presentation);
    }
    if (formData.trailer instanceof File) {
      formDataToSend.append('trailer', formData.trailer);
    }
    if (formData.video instanceof File) {
      formDataToSend.append('video', formData.video);
    }

    try {
      await movieService.putMovie(modified, formDataToSend); // Mettre à jour le film
      console.log('✅ Film mis à jour avec succès !');
      alert('Film mis à jour avec succès !');

      setModified(null); // Quitter le mode modification après sauvegarde
      toggleAddMovieModal(); // Fermer le modal si c'était un ajout
      fetchMoviesAndCategories(); // Recharger la liste
    } catch (error) {
      console.error("❌ Erreur lors de l'opération sur le film :", error);
      let errorMessage = "Une erreur est survenue lors de l'opération sur le film.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      alert(errorMessage);
    }
  };

  // Suppression d'un film
  const handleDelete = async (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      try {
        await movieService.deleteMovie(movieId);
        fetchMoviesAndCategories(); // Recharger les films après suppression
        console.log('✅ Film supprimé avec succès !');
      } catch (error) {
        console.error('❌ Erreur lors de la suppression du film:', error);
        alert('Erreur lors de la suppression du film.');
      }
    }
  };

  // --- Composant d'affichage de carte pour mobile ---
  const MovieCard = ({ movie }) => (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0">
        <div className="col-4">
          <img
            src={movie.img_cover}
            alt={movie.title}
            className="img-fluid rounded-start h-100"
            style={{ objectFit: 'cover', minHeight: '120px' }}
            onError={(e) => {
              e.target.src = wallpaper;
            }}
          />
        </div>
        <div className="col-8">
          <div className="card-body p-2">
            <h6 className="card-title mb-1 text-truncate">{movie.title}</h6>
            <p className="card-text mb-1">
              <small className="text-muted">ID: {movie.id_movie}</small>
            </p>
            <p className="card-text mb-1">
              <small className="text-muted">
                Sortie:{' '}
                {movie.release_date ? format(new Date(movie.release_date), 'dd/MM/yyyy') : 'N/A'}
              </small>
            </p>
            <div className="d-flex align-items-center mb-2">
              <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: `${movie.rating * 20}%` }}
                  aria-valuenow={movie.rating * 20}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <small className="text-muted">{(movie.rating * 20).toFixed(0)}%</small>
            </div>
            <p className="card-text mb-2">
              <small className="text-muted">
                Catégorie: {categories[movie.id_category] || 'N/A'}
              </small>
            </p>
            {userRole === 'admin' && (
              <div className="d-flex gap-1">
                <Button
                  onClick={() => toggleModified(movie.id_movie)} // Correction ici : passer l'ID
                  className="btn btn-sm btn-outline-primary flex-grow-1">
                  <IoMdCreate size={14} /> Modifier
                </Button>
                {/* visibleAdmin n'est plus un état séparé, mais userRole === 'admin' est suffisant */}
                <Button
                  onClick={() => handleDelete(movie.id_movie)}
                  className="btn btn-sm btn-outline-danger flex-grow-1">
                  <IoMdTrash size={14} /> Supprimer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // --- Rendu du composant principal (JSX) ---
  return (
    <div className="movies p-2 p-md-4">
      {/* En-tête de la page (Titre et bouton Ajouter) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className={`${isMobile ? 'h5' : ''} py-2`}>Films ({movies.length})</h3>
        {userRole === 'admin' && ( // Afficher le bouton Ajouter seulement pour les admins
          <Button
            onClick={toggleAddMovieModal}
            children={isMobile ? '+' : 'Ajouter un film'} // Texte plus explicite
            className="p-btn"
            style={isMobile ? { minWidth: '40px', padding: '8px' } : {}}
          />
        )}
      </div>

      {/* Affichage du tableau pour desktop */}
      {!isMobile && (
        <div className="table-wrapper" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="table-responsive">
            <table className="table table-borderless table-striped table-sm align-middle mb-0 bg-white">
              <thead className="sticky-top bg-light shadow-sm" style={{ top: 0, zIndex: 1 }}>
                <tr>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    ID
                  </th>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    Couverture
                  </th>
                  <th scope="col" className="text-start text-secondary fw-bold py-3">
                    Titre & Détails
                  </th>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    Sortie
                  </th>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    Ajouté le
                  </th>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    Note
                  </th>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    Catégorie
                  </th>
                  <th scope="col" className="text-center text-secondary fw-bold py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <p className="mb-0 text-muted fst-italic fs-5">Aucun film trouvé.</p>
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr key={movie.id_movie}>
                      {/* Colonne ID */}
                      <td className="text-center text-muted">
                        <small>{movie.id_movie}</small>
                      </td>

                      <td className="text-center">
                        {modified === movie.id_movie ? (
                          <div className="d-flex flex-column flex-md-row gap-2 align-items-center justify-content-center py-2">
                            {visibleFrom ? (
                              <div className=" top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-25 z-3 d-flex align-items-center justify-content-center">
                                <div className="p-4 bg-white">
                                  <Input
                                    classinput="form-control form-control-sm"
                                    type="file"
                                    label="Présentation"
                                    classlabel="text-muted"
                                    name="img_presentation"
                                    onChange={handleChange}
                                    placeholder="Présentation"
                                    id={`presentation-file-${movie.id_movie}`} // ID unique pour label si besoin
                                  />
                                  <Input
                                    // classinput et classlabel sont remplacés par className.
                                    classinput="form-control form-control-sm"
                                    type="file"
                                    label={'Couverture'}
                                    classlabel="text-muted"
                                    name="img_cover"
                                    onChange={handleChange}
                                    placeholder="Couverture"
                                    id={`cover-file-${movie.id_movie}`} // ID unique pour label si besoin
                                  />
                                  <Input
                                    // classinput et classlabel sont remplacés par className.
                                    classinput="form-control form-control-sm"
                                    type="file"
                                    label={'Bande annonce'}
                                    name="trailer"
                                    classlabel="text-muted"
                                    onChange={handleChange}
                                    placeholder="Bande annonce"
                                    id={`cover-file-${movie.id_movie}`} // ID unique
                                  />
                                  <Input
                                    classinput="form-control form-control-sm"
                                    type="file"
                                    classlabel="text-muted"
                                    label={'Vidéo'}
                                    name="video"
                                    onChange={handleChange}
                                    placeholder="video"
                                    id={`cover-file-${movie.id_movie}`} // ID unique pour label si besoin
                                  />
                                </div>
                              </div>
                            ) : (
                              <Button
                                className="btn btn-sm btn-outline-primary"
                                onClick={toggleVisibleFrom} // Assurez-vous que cette fonction est bien définie
                              >
                                <IoMdCreate size={14} />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="position-relative d-flex justify-content-center align-items-center">
                            {/* Assurez-vous que l'affichage de ces deux images est intentionnel */}
                            <img
                              src={movie.img_cover}
                              alt={movie.title}
                              className="rounded-circle border border-light"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = wallpaper;
                              }}
                            />
                            {/* La deuxième image positionnée avec left: '50px' devrait être mieux centrée dans la td */}
                            <img
                              src={movie.img_presentation}
                              alt={movie.title}
                              className="rounded-circle position-absolute border border-light"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                left: '50px' // Ajusté pour qu'elle soit dans le même td
                              }}
                              onError={(e) => {
                                e.target.src = wallpaper;
                              }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Colonne Titre et Description */}
                      <td>
                        {modified === movie.id_movie ? (
                          <div className="d-flex flex-column flex-md-row gap-2 py-2">
                            <Input
                              classinput="form-control form-control-sm bg-light"
                              placeholder="Titre"
                              classlabel="d-none"
                              value={formData.title}
                              onChange={handleChange}
                              type="text"
                              name="title"
                            />
                            <Input
                              classinput="form-control form-control-sm bg-light"
                              placeholder="Description"
                              classlabel="d-none"
                              value={formData.description}
                              onChange={handleChange}
                              type="text"
                              name="description"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="fw-semibold mb-0 text-dark">{movie.title}</p>
                            <p
                              className="text-muted text-sm mb-0 text-truncate"
                              style={{ maxWidth: '200px' }}>
                              {movie.description || 'Pas de description disponible.'}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Colonne Date de sortie */}
                      <td className="text-center">
                        {modified === movie.id_movie ? (
                          <Input
                            classinput="form-control form-control-sm bg-white"
                            type="date"
                            classlabel="d-none"
                            value={formData.release_date}
                            onChange={handleChange}
                            name="release_date"
                          />
                        ) : (
                          <p className="text-sm text-dark mb-0">
                            {movie.release_date
                              ? format(new Date(movie.release_date), 'dd/MM/yyyy')
                              : 'N/A'}
                          </p>
                        )}
                      </td>

                      {/* Colonne Date de création */}
                      <td className="text-center">
                        {modified === movie.id_movie ? (
                          <Input
                            classinput="form-control form-control-sm bg-white"
                            classlabel="d-none"
                            type="date"
                            value={formData.created_at || ''}
                            onChange={handleChange}
                            name="created_at"
                          />
                        ) : (
                          <p className="text-sm text-muted mb-0">
                            {movie.created_at
                              ? format(new Date(movie.created_at), 'dd/MM/yyyy')
                              : 'N/A'}
                          </p>
                        )}
                      </td>

                      {/* Colonne Note */}
                      <td className="text-center" style={{ minWidth: '100px' }}>
                        {modified === movie.id_movie ? (
                          <Input
                            classinput="form-control form-control-sm bg-light text-center mx-auto"
                            classlabel="d-none"
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            max="5"
                            step="0.5"
                            style={{ width: '50px' }}
                          />
                        ) : (
                          <div className="d-flex flex-column align-items-center">
                            <span className="text-sm text-dark fw-bold mb-1">
                              {movie.rating ? `${(movie.rating * 20).toFixed(0)}%` : 'N/A'}
                            </span>
                            <div className="progress w-75" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${movie.rating * 20}%` }}
                                aria-valuenow={movie.rating}
                                aria-valuemin="0"
                                aria-valuemax="5"></div>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="text-center ">
                        {modified === movie.id_movie ? (
                          <select
                            name="id_category"
                            className="form-control w-100 bg-primary bg-opacity-10"
                            value={formData.id_category}
                            onChange={handleChange}
                            required>
                            <option value="">Sélectionner</option>
                            {Object.entries(categories).map(([id, name]) => (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-2 px-3">
                            {categories[movie.id_category]}
                          </span>
                        )}
                      </td>

                      <td className="text-center">
                        {userRole === 'admin' && (
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                            {modified === movie.id_movie && (
                              <Button
                                onClick={handleSubmit}
                                className="btn btn-sm btn-outline-success">
                                <IoMdCreate size={14} /> Enregistrer
                              </Button>
                            )}
                            <Button
                              onClick={() => toggleModified(movie.id_movie)}
                              className="btn btn-sm btn-outline-secondary">
                              {modified === movie.id_movie ? (
                                <IoMdCloseCircleOutline size={14} />
                              ) : (
                                <IoMdCreate size={14} />
                              )}{' '}
                              {modified === movie.id_movie ? 'Annuler' : 'Modifier'}
                            </Button>
                            <Button
                              onClick={() => handleDelete(movie.id_movie)}
                              className="btn btn-sm btn-outline-danger">
                              <IoMdTrash size={14} /> Supprimer
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Affichage des cartes pour mobile */}
      {isMobile && (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {movies.length === 0 ? (
            <div className="text-center py-4">
              <p className="mb-0 text-muted">Aucun film trouvé</p>
            </div>
          ) : (
            movies.map((movie) => <MovieCard key={movie.id_movie} movie={movie} />)
          )}
        </div>
      )}

      {/* Modal/Overlay pour l'ajout/édition de film */}
      {showAddMovieModal && (
        <div className="overlay position-fixed d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3 top-0 bottom-0 end-0 start-0">
          <div
            className="movie-form-container position-relative p-2 p-md-4 rounded"
            style={{
              width: isMobile ? '95%' : '80%',
              maxHeight: '95vh',
              overflowY: 'auto'
            }}>
            <Button
              onClick={toggleAddMovieModal}
              className="btn border-0 text-danger text-opacity-75 end-0 position-absolute"
              style={{ top: isMobile ? '8px' : 'auto', right: isMobile ? '8px' : 'auto' }}>
              <IoMdCloseCircleOutline size={isMobile ? 20 : 25} />
            </Button>

            <h2 className={`text-light text-center ${isMobile ? 'fs-4' : 'fs-lg-1'} mb-3 mb-md-4`}>
              {modified ? 'Modifier le film' : 'Ajouter un film'}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mx-auto p-2 p-md-4 bg-white rounded-4 shadow-sm">
              <div className={`d-flex ${isMobile ? 'flex-column' : 'flex-wrap'} gap-3 gap-md-4`}>
                <div className="flex-grow-1">
                  <div className={`d-flex ${isMobile ? 'flex-column' : 'gap-3'} mb-3`}>
                    <div className={`${isMobile ? 'mb-3' : 'w-100'}`}>
                      <Input
                        type="text"
                        label={'Titre'}
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control bg-primary bg-opacity-10"
                        placeholder="Ex: Black Panther"
                        required
                      />
                    </div>
                    <div className="w-100">
                      <Input
                        type="text"
                        label={'Réalisateur'}
                        name="director"
                        id="director"
                        value={formData.director}
                        onChange={handleChange}
                        className="form-control bg-primary bg-opacity-10"
                        placeholder="Ex: John Kennedy"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <Input
                      type="date"
                      label={'Date de sortie'}
                      name="release_date"
                      id="release_date"
                      value={formData.release_date}
                      onChange={handleChange}
                      className="form-control bg-primary bg-opacity-10"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <Input
                      type="file"
                      name="img_cover"
                      label={'Image de couverture * (Image)'}
                      id="img_cover_modal"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-control bg-primary bg-opacity-10"
                      required={!modified}
                    />
                    {formData.img_cover && (
                      <small className="text-muted d-block">
                        Fichier: {formData.img_cover.name}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <Input
                      type="file"
                      label={'Image de présentation * (Image)'}
                      name="img_presentation"
                      id="img_presentation_modal"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-control bg-primary bg-opacity-10"
                      required={!modified} // Requis seulement si c'est un nouvel ajout
                    />
                    {formData.img_presentation && (
                      <small className="text-muted d-block">
                        Fichier: {formData.img_presentation.name}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <Input
                      type="file"
                      label={'Bande annonce * (Vidéo)'}
                      name="trailer"
                      id="trailer_modal"
                      onChange={handleChange}
                      accept="video/*"
                      classinput="form-control bg-primary bg-opacity-10"
                      required={!modified}
                    />
                    {formData.trailer && (
                      <small className="text-muted d-block">
                        Fichier: {formData.trailer.name}
                        {isMobile
                          ? ''
                          : ` (${(formData.trailer.size / 1024 / 1024).toFixed(2)} MB)`}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <Input
                      type="file"
                      label={'Film complet * (Vidéo)'}
                      name="video"
                      id="video_modal"
                      onChange={handleChange}
                      accept="video/*"
                      classinput="form-control bg-primary bg-opacity-10"
                      required={!modified} // Requis seulement si c'est un nouvel ajout
                    />
                    {formData.video && (
                      <small className="text-muted d-block">
                        Fichier: {formData.video.name}
                        {isMobile ? '' : ` (${(formData.video.size / 1024 / 1024).toFixed(2)} MB)`}
                      </small>
                    )}
                  </div>

                  <div className={`d-flex ${isMobile ? 'flex-column' : 'gap-3'} mb-3`}>
                    <div className={`${isMobile ? 'mb-3' : 'w-100'}`}>
                      <label htmlFor="rating_modal" className="form-label text-dark">
                        Note * (0-5)
                      </label>
                      <Input
                        type="number"
                        value={formData.rating}
                        onChange={handleChange}
                        id="rating_modal"
                        name="rating"
                        classinput="form-control bg-primary bg-opacity-10"
                        min="0"
                        max="5"
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="w-100">
                      <label htmlFor="category_modal" className="form-label text-dark">
                        Catégorie *
                      </label>
                      <select
                        name="id_category"
                        id="category_modal"
                        value={formData.id_category}
                        onChange={handleChange}
                        className="form-control bg-primary bg-opacity-10"
                        required>
                        <option value="">-- Sélectionner une catégorie --</option>
                        {Object.entries(categories).map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description_modal" className="form-label text-dark">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      id="description_modal"
                      value={formData.description}
                      onChange={handleChange}
                      rows={isMobile ? '3' : '5'}
                      className="form-control bg-primary bg-opacity-10"
                      placeholder="Description du film..."
                      required
                    />
                  </div>
                </div>

                {!isMobile && (
                  <div className="w-100 w-md-50" style={{ maxWidth: '50%' }}>
                    <img
                      src={wallpaper}
                      className="w-100 h-100 rounded-4"
                      alt="Movie form background"
                      style={{ objectFit: 'cover', minHeight: '400px' }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button
                  type="submit"
                  children={modified ? 'Sauvegarder les modifications' : 'Ajouter le film'}
                  className="p-btn opacity-75 w-100"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
