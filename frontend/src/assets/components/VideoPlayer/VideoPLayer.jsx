import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import movieService from "../../../services/movieService";
import "./VideoPlayer.css";

const SecureVideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await movieService.getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du film :", error);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  useEffect(() => {
    // Attendre que l'élément vidéo soit monté dans le DOM
    const timer = setTimeout(() => {
      if (!movie || !videoRef.current) return;

      // Nettoyer l'ancien lecteur si nécessaire
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      // Initialiser le nouveau lecteur
      const player = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        responsive: true,
        preload: 'auto',
        html5: {
          hls: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        },
        sources: [{
          src: `${import.meta.env.VITE_API_URL}${movie.video}`,
          type: 'video/mp4'
        }]
      });

      playerRef.current = player;

      // Écouter les événements du lecteur
      player.on('ready', () => {
        console.log('Lecteur prêt');
      });

      player.on('error', (error) => {
        console.error('Erreur du lecteur:', error);
      });
    }, 100); // Petit délai pour s'assurer que le DOM est prêt

    return () => {
      clearTimeout(timer);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [movie]);

  if (!movie) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-container">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-default-skin"
        />
      </div>
    </div>
  );
};

export default SecureVideoPlayer;
