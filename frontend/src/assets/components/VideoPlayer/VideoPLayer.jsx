import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import movieService from '../../../services/movieService';
import './VideoPlayer.css';

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
        console.error('Erreur lors du chargement du film :', error);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!movie) return;

    const timer = setTimeout(() => {
      if (!videoRef.current) return;

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      const player = videojs(videoRef.current, {
        controls: true,
        preload: 'auto',
        fluid: true,
        sources: [{ src: movie.video, type: 'video/mp4' }]
      });

      playerRef.current = player;
    }, 100); // délai 100ms pour que la vidéo soit montée

    return () => clearTimeout(timer);
  }, [movie]);

  return (
    <div className="video-container" style={{ textAlign: 'center', color: 'white' }}>
      {!movie ? (
        <p>Chargement en cours...</p>
      ) : (
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          controls
          controlsList="nodownload" // Empêche le téléchargement dans la barre de contrôle
          onContextMenu={(e) => e.preventDefault()} // Désactive clic droit sur la vidéo
        />
      )}
    </div>
  );
};

export default SecureVideoPlayer;
