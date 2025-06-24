import './Detail.css';
import { FaPlay, FaFilm, FaStar } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { AiFillLike } from 'react-icons/ai';
import Button from '../../components/Btn-generique/btn.jsx';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Services
import movieService from '../../../services/movieService.js';
import mentionService from '../../../services/mentionService.js';
import likeService from '../../../services/mentionService.js';

const Detail = () => {
  // =============================================================================
  // ÉTATS (STATE)
  // =============================================================================
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [movie, setMovie] = useState(null);
  const [allMovie, setAllMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [getLike, setGetLike] = useState([]);
  const [visible, setVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  // =============================================================================
  // VARIABLES ET PARAMÈTRES
  // =============================================================================
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('token');
  const userId = storedUser ? JSON.parse(atob(storedUser.split('.')[1])).id_user : null;
  const idMovie = parseInt(id);

  // =============================================================================
  // FONCTIONS UTILITAIRES
  // =============================================================================
  const getUserFirstName = useCallback(() => {
    if (!storedUser) return 'Utilisateur';
    try {
      return decodeURIComponent(escape(JSON.parse(atob(storedUser.split('.')[1])).first_name));
    } catch (error) {
      console.error('Erreur lors de la récupération du prénom:', error);
      return 'Utilisateur';
    }
  }, [storedUser]);

  // =============================================================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =============================================================================
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handleSubmitComment = useCallback(
    async (e) => {
      e?.preventDefault();

      if (!userId) {
        console.error('Utilisateur non connecté');
        return;
      }

      if (!commentText.trim()) {
        return;
      }

      try {
        await mentionService.addComment({
          id_movie: idMovie,
          id_user: userId,
          content: commentText.trim()
        });

        // Rafraîchir les commentaires
        const allComments = await mentionService.getAllComments();
        const filteredComments = allComments.filter((comment) => comment.id_movie === idMovie);
        setMentions(filteredComments);
        setCommentText('');
        setVisible(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
      }
    },
    [userId, commentText, idMovie]
  );

  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        if (!userId) {
          console.error('Utilisateur non connecté');
          return;
        }

        // Vérifier si l'utilisateur est l'auteur du commentaire
        const comment = mentions.find((c) => c.id_comment === commentId);
        if (!comment || comment.id_user !== userId) {
          console.error("Vous n'êtes pas autorisé à supprimer ce commentaire");
          return;
        }

        await mentionService.deleteComment(commentId);
        setMentions((prevMentions) => prevMentions.filter((c) => c.id_comment !== commentId));
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
      }
    },
    [userId, mentions]
  );

  const handleLike = useCallback(async () => {
    if (!userId) return;

    const hasLiked = getLike.includes(idMovie);

    try {
      if (!hasLiked) {
        await likeService.addLike({ id_movie: idMovie });
        setGetLike((prev) => [...prev, idMovie]);
        setTotalLikes((prev) => prev + 1);
      } else {
        await likeService.deleteLike(idMovie);
        setGetLike((prev) => prev.filter((i) => i !== idMovie));
        setTotalLikes((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Erreur like:', error);
    }
  }, [userId, getLike, idMovie]);

  // =============================================================================
  // EFFETS (useEffect)
  // =============================================================================

  // Gestion du responsive
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Chargement des données du film
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);
      } catch (error) {
        console.error('Erreur lors de la récupération du film:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Chargement des likes de l'utilisateur
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!userId) return;

      try {
        const likeData = await likeService.getAllLikesByUser(userId);
        setGetLike(likeData.movieIds || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des likes:', error);
        setGetLike([]);
      }
    };

    fetchUserLikes();
  }, [userId]);

  // Chargement de tous les films
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const allMovies = await movieService.getAllMovies();
        setAllMovie(allMovies);
      } catch (error) {
        console.error('Erreur lors de la récupération de tous les films:', error);
      }
    };

    fetchAllMovies();
  }, []);

  // Chargement des commentaires
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      try {
        const allComments = await mentionService.getAllComments();
        const filteredComments = allComments.filter((comment) => comment.id_movie === parseInt(id));
        setMentions(filteredComments);
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
      }
    };

    fetchComments();
  }, [id]);

  // Chargement du nombre total de likes
  useEffect(() => {
    const fetchMovieLikes = async () => {
      try {
        const likesData = await likeService.getAllLikesByMovie(idMovie);
        setTotalLikes(likesData.totalLikes || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des likes:', error);
        setTotalLikes(0);
      }
    };

    if (idMovie) {
      fetchMovieLikes();
    }
  }, [idMovie]);

  // =============================================================================
  // FONCTION UTILITAIRE POUR LE RENDU DES ÉTOILES
  // =============================================================================
  const renderStars = (rating) => {
    return Array.from({ length: Math.floor(rating) }).map((_, index) => (
      <FaStar key={index} className="text-danger" size={isMobile ? 16 : 20} />
    ));
  };

  // =============================================================================
  // RENDU PRINCIPAL
  // =============================================================================
  if (loading) return <div className="text-white text-center p-5">Chargement...</div>;
  if (!movie) return <div className="text-white text-center p-5">Film non trouvé</div>;

  return (
    <div className="container-detail" style={{ minHeight: '50vh' }}>
      {/* Section principale du film */}
      <div className="detail-top position-relative" style={{ height: isMobile ? '40vh' : '50vh' }}>
        <div
          className="movie-backdrop position-absolute w-100"
          style={{ height: isMobile ? '40vh' : '50vh' }}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}>
          {isHovered && !isMobile ? (
            <video className="w-100 h-100 object-fit-cover" autoPlay muted loop>
              <source src={movie.trailer} />
              Vidéo impossible à lire, veuillez changer de navigateur.
            </video>
          ) : (
            <img
              src={isMobile ? movie.img_presentation : movie.img_cover}
              alt={movie.title}
              className="w-100 h-100 object-fit-cover"
            />
          )}
        </div>

        <div
          className="content-movie position-absolute z-1 text-white p-3 p-lg-5"
          style={{ top: isMobile ? '10vh' : '14vh' }}>
          <h1 className="title-detail mb-2 mb-lg-3" style={{ fontSize: isMobile ? '2.5em' : '' }}>
            {movie.title}
          </h1>

          <p className={`lead mb-3 mb-lg-4 ${isMobile ? 'fs-6' : ''}`}>{movie.description}</p>
          <p className="fs-6 text-light fs-lg-5">
            {format(new Date(movie.release_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>

          <div className="d-flex flex-wrap align-items-center gap-1 gap-lg-3">
            <Button
              className="p-btn d-flex align-items-center justify-content-center gap-2"
              style={{ padding: isMobile ? '8px 16px' : '' }}
              onClick={() => navigate(`/stream/${id}`)}>
              <FaPlay size={isMobile ? 14 : 16} /> Play
            </Button>

            <Button className="t-btn" style={{ padding: isMobile ? '8px 16px' : '' }}>
              <FaFilm size={isMobile ? 14 : 16} /> Bande annonce
            </Button>

            <div className="d-flex align-items-center gap-2">
              <Button
                className={getLike.includes(idMovie) ? 'btn-danger' : 'btn-outline-danger'}
                onClick={handleLike}
                disabled={!userId}>
                <AiFillLike color={getLike.includes(idMovie) ? 'white' : 'red'} />
              </Button>
            </div>

            <p className="m-0 d-flex align-items-center">{renderStars(movie.rating)}</p>

            <p>{totalLikes} J'aime</p>
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="detail-bottom p-3 p-lg-4">
        {/* Films tendance */}
        <div className="db-top mb-3 mb-lg-4">
          <h4 className={`text-white ${isMobile ? 'fs-5' : ''}`}>Tendance actuelle</h4>
          <div className="trending-content d-flex gap-3 gap-lg-4 overflow-x-auto">
            {allMovie
              .filter((movie) => movie.rating >= 4)
              .slice(0, 11)
              .map((movieItem) => (
                <div
                  className="movie-card position-relative flex-shrink-0"
                  style={{
                    height: isMobile ? '200px' : '300px',
                    width: isMobile ? '150px' : '250px'
                  }}
                  key={movieItem.id_movie}>
                  <Link to={`/detail/${movieItem.id_movie}`} className="text-decoration-none">
                    <img
                      src={movieItem.img_presentation}
                      className="h-100 w-100 rounded-3"
                      style={{ objectFit: 'cover' }}
                      alt={movieItem.title}
                    />
                    <div
                      className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
                      style={{
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        borderRadius: '0 0 0.5rem 0.5rem'
                      }}>
                      <h4 className="mb-0 text-truncate">{movieItem.title}</h4>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Section commentaires */}
        <div className="db-bottom">
          <h4 className={`text-white mb-3 ${isMobile ? 'fs-5' : ''}`}>Commentaires</h4>

          <div className="comments-container">
            <div className="d-flex overflow-x-scroll gap-3">
              {mentions.map((comment) => (
                <div
                  key={comment.id_comment}
                  data-comment-id={comment.id_comment}
                  className="comment-card col-12 col-md-6 col-lg-4 rounded-4 bg-dark p-0 mb-3 position-relative overflow-hidden">
                  <div className="comment-header p-3 bg-dark bg-opacity-75">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="avatar-circle bg-danger rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '50px',
                            height: '50px',
                            minWidth: '50px'
                          }}>
                          <span className="fs-4 text-white fw-bold">
                            {comment.name_user?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="user-info">
                          <h5 className="mb-0 text-white fw-bold">{comment.first_name}</h5>
                          <p className="mb-0 text-white-50 small">
                            {format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      {userId === comment.id_user && (
                        <Button
                          className="delete-btn p-2 rounded-circle bg-transparent border-0"
                          onClick={() => handleDeleteComment(comment.id_comment)}>
                          <IoIosCloseCircleOutline
                            className="text-danger"
                            size={24}
                            style={{ transition: 'all 0.2s ease' }}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="comment-body p-3">
                    <p className="text-white mb-0 text-justify">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton d'ajout de commentaire */}
          <div className="d-flex justify-content-end position-relative mt-4">
            <Button
              className="s-btn rounded-1 position-absolute z-3 px-4"
              onClick={() => setVisible(!visible)}>
              {visible ? 'Fermer' : 'Ajouter'}
            </Button>
          </div>

          {/* Formulaire de commentaire */}
          {visible && (
            <div className="comment-form z-2 top-0 bottom-0 start-0 end-0 position-absolute bg-black bg-opacity-75 p-4 d-flex justify-content-center align-items-center rounded-3">
              <div className="bg-white bg-opacity-25 rounded-3 px-4 py-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="avatar-circle bg-danger rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      minWidth: '50px'
                    }}>
                    <span className="fs-4 text-white fw-bold">
                      {getUserFirstName()[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="user-info">
                    <h5 className="mb-0 text-white fw-bold">{getUserFirstName()}</h5>
                    <p className="mb-0 text-white-50 small">
                      {format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>

                <form
                  className="comment-body m-3 gap-3 d-flex flex-column"
                  onSubmit={handleSubmitComment}>
                  <textarea
                    className="form-control border-0 bg-dark text-white"
                    placeholder="Votre commentaire ici..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                      height: '130px',
                      minWidth: '260px',
                      resize: 'none'
                    }}
                    required
                  />
                  <div className="d-flex bg-transparent justify-content-end">
                    <Button
                      type="submit"
                      className="s-btn rounded-1 w-100"
                      disabled={!commentText.trim()}>
                      Envoyer
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Detail;
