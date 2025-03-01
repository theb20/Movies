import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from "react-icons/fa";
import Button from "../Btn-generique/btn";
import "./VideoPlayer.css";

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setProgress((video.currentTime / video.duration) * 100 || 0);
      setCurrentTime(formatTime(video.currentTime));
    };

    const setVideoDuration = () => setDuration(formatTime(video.duration));

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", setVideoDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", setVideoDuration);
    };
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    setIsMuted(newVolume == 0);
    videoRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleProgressChange = (event) => {
    const newTime = (event.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(event.target.value);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-100 h-100"
        onContextMenu={(e) => e.preventDefault()} // Désactive clic droit
        controls={false}
      />

      {/* Barre de contrôle Bootstrap */}
      <div className="controls d-flex justify-content-between align-items-center p-2">
        <Button onClick={togglePlayPause} className="btn btn-light">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>

        <span className="text-light">{currentTime} / {duration}</span>

        <input
          type="range"
          className="form-range w-50"
          value={progress}
          onChange={handleProgressChange}
          max="100"
        />

        <Button onClick={toggleMute} className="btn btn-light">
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </Button>

        <input
          type="range"
          className="form-range volume-control"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />

        <Button onClick={handleFullscreen} className="btn btn-light">
          <FaExpand />
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
