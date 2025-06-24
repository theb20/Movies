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
  // --- State Management ---
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState({});
  const [modified, setModified] = useState(null); // ID of the movie being modified
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false); // State for the Add/Edit Movie Modal
  const [visibleFrom, setVisibleFrom] = useState(false); // Used for file inputs visibility during edit

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

  // --- Authentication / User Role ---
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  // --- Effects ---

  // Effect for handling window resize to determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Callback to fetch movies and categories
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
      // TODO: Gérer l'affichage de l'erreur à l'utilisateur (e.g., toast notification)
    }
  }, []); // No dependencies, as services don't change

  // Initial data fetch on component mount
  useEffect(() => {
    fetchMoviesAndCategories();
  }, [fetchMoviesAndCategories]);

  // --- Event Handlers ---

  const toggleVisibleFrom = () => {
    setVisibleFrom(!visibleFrom);
  };

  const toggleModified = (id) => {
    if (modified === id) {
      setModified(null); // Cancel modification
      // Reset formData to initial empty state when cancelling edit
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
      // Also reset visibleFrom when cancelling edit
      setVisibleFrom(false);
    } else {
      setModified(id); // Activate modification
      // Pre-fill formData with the selected movie's data
      const movieToEdit = movies.find((movie) => movie.id_movie === id);
      if (movieToEdit) {
        setFormData({
          title: movieToEdit.title || '',
          director: movieToEdit.director || '',
          release_date: movieToEdit.release_date
            ? format(new Date(movieToEdit.release_date), 'yyyy-MM-dd')
            : '',
          img_cover: null, // File inputs cannot be pre-filled, set to null
          img_presentation: null,
          trailer: null,
          video: null,
          rating: movieToEdit.rating || 0,
          id_category: movieToEdit.id_category || '',
          description: movieToEdit.description || ''
        });
      }
      // Hide file inputs by default when starting an edit
      setVisibleFrom(false);
    }
  };

  // Toggles the visibility of the add/edit movie form modal
  const toggleAddMovieModal = () => {
    setShowAddMovieModal((prev) => !prev);
    // Reset the form when opening/closing
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
    // Directly reset file inputs (since their value cannot be controlled by state)
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = '';
    });
    // Ensure file inputs are hidden when opening fresh add modal
    setVisibleFrom(false);
    setModified(null); // Ensure we are not in edit mode when adding
  };

  // Handles changes in form fields (text, number, select, file)
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating < 0 || formData.rating > 5) {
      alert('La note doit être comprise entre 0 et 5.');
      return;
    }

    // --- Construct FormData for multipart/form-data ---
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('director', formData.director);
    formDataToSend.append('release_date', formData.release_date);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('id_category', formData.id_category);
    formDataToSend.append('description', formData.description);

    // Append files, checking if they are actual File objects
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
      if (modified) {
        await movieService.putMovie(modified, formDataToSend);
        console.log('✅ Film mis à jour avec succès !');
        alert('Film mis à jour avec succès !');
      } else {
        console.log('1');
        await movieService.addMovie(formDataToSend); // Create new movie
        console.log('2');

        console.log('✅ Film ajouté avec succès !');
        alert('Film ajouté avec succès !');
      }
      modified && toggleAddMovieModal();
      fetchMoviesAndCategories(); // Reload movies after adding/updating
      setModified(null); // Reset modified state after operation
      setShowAddMovieModal(false);
    } catch (error) {
      console.log("❌ Erreur lors de l'opération sur le film :", error);
      alert("Une erreur est survenue lors de l'opération sur le film.");
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      try {
        await movieService.deleteMovie(movieId);
        fetchMoviesAndCategories(); // Reload movies after deletion
        console.log('✅ Film supprimé avec succès !');
      } catch (error) {
        console.error('❌ Erreur lors de la suppression du film:', error);
        alert('Erreur lors de la suppression du film.');
      }
    }
  };

  return (
    <div className="movies p-2 p-md-4">
      {/* Page Header (Title and Add Button) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className={`${isMobile ? 'h5' : ''} py-2`}>Films ({movies.length})</h3>
        {userRole === 'admin' && ( // Display Add button only for admins
          <Button
            onClick={toggleAddMovieModal}
            children={isMobile ? '+' : 'Ajouter un film'}
            className="p-btn"
            style={isMobile ? { minWidth: '40px', padding: '8px' } : {}}
          />
        )}
      </div>

      {/* Desktop Table View */}
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
              <tbody className="overflow-y-scroll">
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <p className="mb-0 text-muted fst-italic fs-5">Aucun film trouvé.</p>
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr key={movie.id_movie}>
                      {/* ID Column */}
                      <td className="text-center text-muted">
                        <small>{movie.id_movie}</small>
                      </td>

                      {/* Cover Column (with edit mode for files) */}
                      <td className="text-center">
                        {modified === movie.id_movie ? (
                          <div className="d-flex flex-column flex-md-row gap-2 align-items-center justify-content-center py-2">
                            {visibleFrom ? (
                              <div className="top-0 start-0 end-0 bottom-0 bg-dark w-100 bg-opacity-25 z-3 d-flex align-items-center justify-content-center">
                                <div className="p-4 bg-white">
                                  <Input
                                    classinput="form-control form-control-sm bg-light"
                                    type="file"
                                    label="Présentation"
                                    classlabel="text-muted"
                                    name="img_presentation"
                                    onChange={handleChange}
                                    placeholder="Présentation"
                                    id={`presentation-file-${movie.id_movie}`}
                                  />
                                  <Input
                                    classinput="form-control form-control-sm bg-light"
                                    type="file"
                                    label={'Couverture'}
                                    classlabel="text-muted"
                                    name="img_cover"
                                    onChange={handleChange}
                                    placeholder="Couverture"
                                    id={`cover-file-${movie.id_movie}`}
                                  />
                                  <Input
                                    classinput="form-control form-control-sm bg-light"
                                    type="file"
                                    label={'Bande annonce'}
                                    name="trailer"
                                    classlabel="text-muted"
                                    onChange={handleChange}
                                    placeholder="Bande annonce"
                                    id={`trailer-file-${movie.id_movie}`}
                                  />
                                  <Input
                                    classinput="form-control form-control-sm bg-light"
                                    type="file"
                                    classlabel="text-muted"
                                    label={'Vidéo'}
                                    name="video"
                                    onChange={handleChange}
                                    placeholder="video"
                                    id={`video-file-${movie.id_movie}`}
                                  />
                                  <Button
                                    onClick={toggleVisibleFrom}
                                    className="btn btn-sm btn-outline-danger mt-2">
                                    <IoMdCloseCircleOutline size={14} />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                className="btn btn-sm btn-outline-primary"
                                onClick={toggleVisibleFrom}>
                                <IoMdCreate size={14} /> Fichiers
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="position-relative d-flex justify-content-center align-items-center">
                            {/* Display both images, adjusted for proper overlap */}
                            <img
                              src={movie.img_cover}
                              alt={movie.title}
                              className="rounded-circle border border-light"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                zIndex: 1
                              }}
                              onError={(e) => {
                                e.target.src = wallpaper;
                              }}
                            />
                            <img
                              src={movie.img_presentation}
                              alt={movie.title}
                              className="rounded-circle position-absolute border border-light"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                left: '50%', // Centered relative to its container
                                transform: 'translateX(-25%)', // Shift left by 25% of its own width
                                zIndex: 0 // Behind the first image
                              }}
                              onError={(e) => {
                                e.target.src = wallpaper;
                              }}
                            />
                          </div>
                        )}
                      </td>

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

                      <td className="text-center">
                        {modified === movie.id_movie ? (
                          <Input
                            classinput="form-control form-control-sm bg-light"
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

                      {/* Creation Date Column */}
                      <td className="text-center">
                        <p className="text-sm text-muted mb-0">
                          {movie.created_at
                            ? format(new Date(movie.created_at), 'dd/MM/yyyy')
                            : 'N/A'}
                        </p>
                      </td>

                      {/* Rating Column */}
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

                      {/* Category Column */}
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

                      {/* Actions Column */}
                      <td className="text-center">
                        {userRole === 'admin' && (
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                            {modified === movie.id_movie && (
                              <Button
                                onClick={handleSubmit}
                                className="btn btn-sm btn-outline-success">
                                <IoMdCreate size={14} />
                              </Button>
                            )}
                            <Button
                              onClick={() => toggleModified(movie.id_movie)}
                              className="btn btn-sm btn-outline-secondary">
                              {modified === movie.id_movie ? (
                                <IoMdCloseCircleOutline size={14} />
                              ) : (
                                <IoMdCreate size={14} />
                              )}
                            </Button>
                            <Button
                              onClick={() => handleDelete(movie.id_movie)}
                              className="btn btn-sm btn-outline-danger">
                              <IoMdTrash size={14} />
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

      {isMobile && (
        <div className="mobile-movies-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {movies.length === 0 ? (
            <p className="text-center py-5 text-muted fst-italic fs-5">Aucun film trouvé.</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.id_movie} className="card shadow-sm border-0 rounded-4 mb-3">
                {/* Added mb-3 for spacing */}
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-3">
                    {/* Cover Images */}
                    <div className="position-relative me-3">
                      <img
                        src={movie.img_cover}
                        alt={movie.title}
                        className="rounded-circle border border-light"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', zIndex: 1 }}
                        onError={(e) => {
                          e.target.src = wallpaper;
                        }}
                      />
                      <img
                        src={movie.img_presentation}
                        alt={movie.title}
                        className="rounded-circle position-absolute border border-light"
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          left: '50%',
                          transform: 'translateX(-25%)',
                          zIndex: 0
                        }}
                        onError={(e) => {
                          e.target.src = wallpaper;
                        }}
                      />
                    </div>

                    {/* Title and Category */}
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0 text-dark fw-bold">{movie.title}</h5>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                        {categories[movie.id_category]}
                      </span>
                    </div>

                    {/* Mobile Actions (Edit/Delete) */}
                    {userRole === 'admin' && (
                      <div className="d-flex gap-2 align-items-center">
                        <Button
                          onClick={() => toggleModified(movie.id_movie)}
                          className="btn btn-sm btn-outline-secondary p-2">
                          {modified === movie.id_movie ? (
                            <IoMdCloseCircleOutline size={18} />
                          ) : (
                            <IoMdCreate size={18} />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleDelete(movie.id_movie)}
                          className="btn btn-sm btn-outline-danger p-2">
                          <IoMdTrash size={18} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Edit Form (collapsed by default, expanded when modified) */}
                  {modified === movie.id_movie && (
                    <form onSubmit={handleSubmit} className="mb-3">
                      <hr className="my-3" />
                      <div className="row g-2 mb-3">
                        <div className="col-12">
                          <Input
                            classinput="form-control form-control-sm bg-light"
                            classlabel="text-dark"
                            placeholder="Titre"
                            label="Titre"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            name="title"
                          />
                        </div>
                        <div className="col-12">
                          <Input
                            classinput="form-control form-control-sm bg-light"
                            placeholder="Réalisateur"
                            classlabel="text-dark"
                            label="Réalisateur"
                            value={formData.director}
                            onChange={handleChange}
                            type="text"
                            name="director"
                          />
                        </div>
                        <div className="col-12">
                          <Input
                            classinput="form-control form-control-sm bg-light"
                            type="date"
                            classlabel="text-dark"
                            label="Date de sortie"
                            value={formData.release_date}
                            onChange={handleChange}
                            name="release_date"
                          />
                        </div>
                        <div className="col-12">
                          <label
                            htmlFor={`rating-mobile-${movie.id_movie}`}
                            className="form-label text-dark small">
                            Note (0-5)
                          </label>
                          <Input
                            classinput="form-control form-control-sm bg-light"
                            type="number"
                            name="rating"
                            classlabel="text-dark"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            max="5"
                            step="0.1"
                            id={`rating-mobile-${movie.id_movie}`}
                          />
                        </div>
                        <div className="col-12">
                          <label
                            htmlFor={`category-mobile-${movie.id_movie}`}
                            className="form-label text-dark small">
                            Catégorie
                          </label>
                          <select
                            name="id_category"
                            id={`category-mobile-${movie.id_movie}`}
                            className="form-control form-control-sm bg-primary bg-opacity-10"
                            value={formData.id_category}
                            onChange={handleChange}
                            required>
                            <option value="">-- Sélectionner une catégorie --</option>
                            {Object.entries(categories).map(([id, name]) => (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12">
                          <label
                            htmlFor={`description-mobile-${movie.id_movie}`}
                            className="form-label text-dark small">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id={`description-mobile-${movie.id_movie}`}
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="form-control form-control-sm bg-primary bg-opacity-10"
                            placeholder="Description du film..."
                            required
                          />
                        </div>
                        <div className="col-12">
                          <Button
                            onClick={toggleVisibleFrom}
                            className="btn btn-sm btn-outline-primary w-100 mb-2">
                            <IoMdCreate size={14} /> Modifier les fichiers
                          </Button>
                          {visibleFrom && (
                            <div className="d-flex flex-column gap-2 mt-2">
                              <Input
                                classinput="form-control form-control-sm bg-light"
                                type="file"
                                label="Couverture (Image)"
                                classlabel="text-dark"
                                name="img_cover"
                                onChange={handleChange}
                                id={`cover-file-mobile-${movie.id_movie}`}
                              />
                              <Input
                                classinput="form-control form-control-sm bg-light"
                                type="file"
                                classlabel="text-dark"
                                label="Présentation (Image)"
                                name="img_presentation"
                                onChange={handleChange}
                                id={`presentation-file-mobile-${movie.id_movie}`}
                              />
                              <Input
                                classinput="form-control form-control-sm bg-light"
                                type="file"
                                classlabel="text-dark"
                                label="Bande Annonce (Vidéo)"
                                name="trailer"
                                onChange={handleChange}
                                id={`trailer-file-mobile-${movie.id_movie}`}
                              />
                              <Input
                                classinput="form-control form-control-sm bg-light"
                                type="file"
                                classlabel="text-dark"
                                label="Film (Vidéo)"
                                name="video"
                                onChange={handleChange}
                                id={`video-file-mobile-${movie.id_movie}`}
                              />
                              <Button
                                onClick={toggleVisibleFrom}
                                className="btn btn-sm btn-outline-danger mt-2">
                                <IoMdCloseCircleOutline size={14} /> Annuler
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="col-12 text-end mt-3">
                          <Button onClick={handleSubmit} className="btn btn-primary w-100">
                            Enregistrer les modifications
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* General Info for Mobile (always visible unless editing) */}
                  {modified !== movie.id_movie && (
                    <>
                      <hr className="my-3" />
                      <div className="row g-2 text-muted small">
                        <div className="col-6">
                          <strong>Réalisateur:</strong> {movie.director || 'N/A'}
                        </div>
                        <div className="col-6 text-end">
                          <strong>Sortie:</strong>{' '}
                          {movie.release_date
                            ? format(new Date(movie.release_date), 'dd/MM/yyyy')
                            : 'N/A'}
                        </div>
                        <div className="col-6">
                          <strong>Ajouté le:</strong>{' '}
                          {movie.created_at
                            ? format(new Date(movie.created_at), 'dd/MM/yyyy')
                            : 'N/A'}
                        </div>
                        <div className="col-6 text-end">
                          <strong>Note:</strong>{' '}
                          {movie.rating ? `${(movie.rating * 20).toFixed(0)}%` : 'N/A'}
                          <div className="progress w-75 float-end" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: `${movie.rating * 20}%` }}
                              aria-valuenow={movie.rating}
                              aria-valuemin="0"
                              aria-valuemax="5"></div>
                          </div>
                        </div>
                        <div className="col-12 mt-2">
                          <strong>Description:</strong>{' '}
                          {movie.description || 'Pas de description disponible.'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAddMovieModal && userRole === 'admin' && (
        <div className="modal-overlay bg-dark bg-opacity-50 d-flex align-items-center justify-content-center position-fixed p-4 overflow-auto z-3 top-0 bottom-0 start-0 end-0">
          <div
            style={{ height: '80%' }}
            className="modal-content-movie-add w-75 overflow-auto bg-white rounded-4 p-2 p-lg-4">
            <div className="modal-header-movie-add d-flex position-relative">
              <h5 className="modal-title">Ajouter un film</h5>
              <Button
                onClick={toggleAddMovieModal}
                className="close-button text-danger position-absolute end-0">
                <IoMdCloseCircleOutline size={24} />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body-movie-add">
              <Input
                label="Titre"
                classlabel="form-label text-dark"
                classinput="form-control bg-light"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre du film"
                required
              />
              <Input
                label="Réalisateur"
                classlabel="form-label text-dark"
                classinput="form-control bg-light"
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                placeholder="Nom du réalisateur"
                required
              />
              <Input
                label="Date de sortie"
                classlabel="form-label text-dark"
                classinput="form-control bg-light"
                type="date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                required
              />
              <div className="mb-3">
                <label htmlFor="categorySelect" className="form-label">
                  Catégorie
                </label>
                <select
                  id="categorySelect"
                  name="id_category"
                  className="form-select"
                  value={formData.id_category}
                  onChange={handleChange}
                  required>
                  <option value="">Sélectionner une catégorie</option>
                  {Object.entries(categories).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Note (0-5)"
                classlabel="form-label text-dark"
                classinput="form-control bg-light"
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Note du film (ex: 3.5)"
                min="0"
                max="5"
                step="0.1"
                required
              />
              <div className="mb-3">
                <label htmlFor="descriptionTextarea" className="form-label">
                  Description
                </label>
                <textarea
                  id="descriptionTextarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="form-control bg-light"
                  placeholder="Description détaillée du film..."
                  required
                />
              </div>

              {/* File Inputs for Add/Edit */}
              <h6 className="mt-4 mb-3">Fichiers du film</h6>
              <Input
                label="Image de couverture"
                classlabel="form-label text-dark"
                classinput="form-control bg-light"
                type="file"
                name="img_cover"
                onChange={handleChange}
                required={!modified}
              />
              <Input
                label="Image de présentation"
                classlabel="form-label text-dark"
                classinput="form-control bg-light"
                type="file"
                name="img_presentation"
                onChange={handleChange}
                required={!modified}
              />
              <Input
                label="Bande annonce (Vidéo)"
                classlabel="form-label text-dark text-dark bg-light"
                classinput="form-control bg-light text-dark bg-light"
                type="file"
                name="trailer"
                onChange={handleChange}
                required={!modified}
              />
              <Input
                label="Fichier vidéo du film"
                classlabel="form-label text-dark bg-light"
                classinput="form-control text-dark bg-light"
                type="file"
                name="video"
                onChange={handleChange}
                required={!modified}
              />

              <Button type="submit" className="btn btn-primary w-100 mt-4">
                {modified ? 'Enregistrer les modifications' : 'Ajouter le film'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
