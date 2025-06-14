import './Detail.css';
import { FaPlay, FaFilm } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { AiFillLike } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa6';
import Button from '../../components/Btn-generique/btn.jsx';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import movieService from '../../../services/movieService.js';
import mentionService from '../../../services/mentionService.js';
import likeService from '../../../services/mentionService.js'; // Correction du chemin d'importation

// Ajoutez l'import en haut du fichier
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Detail = () => {
  // États
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [movie, setMovie] = useState(null);
  const [allMovie, setAllMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [getLike, setGetLike] = useState([]);
  const [closeComment, setCloseComment] = useState();
  const [visible, setVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Paramètres et variables
  const { id } = useParams();
  const storedUser = localStorage.getItem('token');
  const userId = storedUser ? JSON.parse(atob(storedUser.split('.')[1])).id_user : null;
  const idMovie = parseInt(id);
  const navigate = useNavigate();

  // Effets close comment
  useEffect(() => {
    const closeComment = document.querySelectorAll('.close-comment');
    try {
      if (userId === comment.id_user) {
        // alors sera en display block
        closeComment.forEach((btnClose) => {
          btnClose.style.display = 'block';
          setCloseComment(btnClose);
        });
      } else {
        // alors sera en display none
        closeComment.forEach((btnClose) => {
          btnClose.style.display = 'none';
          setCloseComment(btnClose);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmitComment = async () => {
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
        content: commentText
      });

      // Rafraîchir les commentaires
      const allComments = await mentionService.getAllComments();
      const filteredComments = allComments.filter((comment) => comment.id_movie === parseInt(id));
      setMentions(filteredComments);
      setVisible(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  // Chargement des données du film
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);
      } catch (error) {
        console.error('Erreur lors de la récupération du film:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovieDetails();
  }, [id]);

  // Chargement des likes de l'utilisateur
  useEffect(() => {
    const fetchGetLike = async () => {
      if (!userId) return;

      try {
        const likeData = await likeService.getAllLikesByUser(userId);
        setGetLike(likeData.movieIds || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des likes:', error);
        setGetLike([]);
      }
    };

    fetchGetLike();
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

  useEffect(() => {
    const fetchAllCommentById = async () => {
      try {
        const allComments = await mentionService.getAllComments();
        const filteredComments = allComments.filter((comment) => comment.id_movie === parseInt(id));
        setMentions(filteredComments);

        // Gestion de l'affichage des boutons de suppression
        const closeButtons = document.querySelectorAll('.close-comment');
        closeButtons.forEach((btnClose) => {
          const commentId = btnClose.closest('.allComment').getAttribute('data-comment-id');
          const comment = filteredComments.find((c) => c.id_comment === parseInt(commentId));

          if (comment && userId === comment.id_user) {
            btnClose.style.display = 'block';
          } else {
            btnClose.style.display = 'none';
          }
          setCloseComment(btnClose);
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
      }
    };
    fetchAllCommentById();
  }, [id, userId]);

  // Chargement du nombre total de likes
  useEffect(() => {
    const initializeLikes = async () => {
      try {
        const likesData = await likeService.getAllLikesByMovie(idMovie);
        setTotalLikes(likesData.totalLikes || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des likes:', error);
        setTotalLikes(0);
      }
    };
    initializeLikes();
  }, [idMovie]);
  // Gestion de la suppression des commentaires
  const handleDeleteComment = async (commentId) => {
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

      // Mise à jour locale des commentaires sans rechargement de page
      setMentions((prevMentions) => prevMentions.filter((c) => c.id_comment !== commentId));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };
  // Gestion des likes
  const handleLike = async () => {
    if (!userId) {
      console.error('Utilisateur non connecté');
      return;
    }

    try {
      const isLiked = getLike.includes(idMovie);

      if (!isLiked) {
        await likeService.addLike({
          id_movie: idMovie,
          id_user: userId
        });
        setGetLike((prev) => [...prev, idMovie]);
        setTotalLikes((prev) => prev + 1);
      } else {
        await likeService.deleteLike(idMovie, userId);
        setGetLike((prev) => prev.filter((id) => id !== idMovie));
        setTotalLikes((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Erreur lors de la gestion du like:', error);
    }
  };

  // Rendus conditionnels
  if (loading) return <div className="text-white text-center p-5">Chargement...</div>;
  if (!movie) return <div className="text-white text-center p-5">Film non trouvé</div>;

  // Rendu principal
  return (
    <div className="container-detail" style={{ minHeight: '50vh' }}>
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

          <p className={`lead mb-3 mb-lg-4 ${isMobile ? 'fs-6' : ''}`}>
            {movie.description}
            <p className="fs-6 text-dark fs-lg-5">
              {format(new Date(movie.release_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
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
                className={`btn rounded-5 p-2 ${getLike.includes(parseInt(idMovie)) ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={handleLike}>
                <AiFillLike size={isMobile ? 24 : 26} />
              </Button>
            </div>
            <p className="m-0 d-flex align-items-center">
              {Array.from({ length: Math.floor(movie.rating) }).map((_, index) => (
                <FaStar key={index} className="text-danger" size={isMobile ? 16 : 20} />
              ))}
            </p>
            <p>{totalLikes} J'aime</p>
          </div>
        </div>
      </div>

      <div className="detail-bottom p-3 p-lg-4">
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
                  <Link
                    onClick={() => (window.location.href = `/detail/${movieItem.id_movie}`)}
                    className="text-decoration-none">
                    <img
                      src={movieItem.img_presentation}
                      className="h-100 w-100 rounded-3"
                      style={{
                        objectFit: 'cover'
                      }}
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
                            {comment.name_user[0].toUpperCase()}
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
          <div className="d-flex justify-content-end position-relative mt-4">
            <Button
              className="s-btn rounded-1 position-absolute z-3 px-4"
              onClick={() => setVisible(!visible)}>
              {visible ? 'Fermer' : 'Ajouter'}
            </Button>
          </div>

          {visible && (
            <div
              style={{}}
              className="comment-form z-2 top-0 bottom-0 start-0 end-0 position-absolute bg-black bg-opacity-75 p-4 d-flex justify-content-center align-items-center rounded-3">
              <div className="bg-white bg-opacity-25 rounded-3 px-4 py-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="avatar-circle bg-danger rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      minWidth: '50px'
                    }}>
                    <span className="fs-4 text-white fw-bold">A</span>
                  </div>
                  <div className="user-info">
                    <h5 className="mb-0 text-white fw-bold">
                      {storedUser
                        ? decodeURIComponent(
                            escape(JSON.parse(atob(storedUser.split('.')[1])).first_name)
                          )
                        : 'Utilisateur'}
                    </h5>
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
                    }}></textarea>

                  <div className="d-flex bg-transparent justify-content-end">
                    <Button
                      type="submit"
                      className="s-btn rounded-1  w-100"
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
