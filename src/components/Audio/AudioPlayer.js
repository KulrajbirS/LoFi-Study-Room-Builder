import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Sample lo-fi tracks (you'll replace these with actual audio files)
  const tracks = [
    { 
      id: 1, 
      name: 'Rainy Afternoon', 
      artist: 'Lo-Fi Collective',
      src: '/audio/rainy-afternoon.mp3' // Placeholder
    },
    { 
      id: 2, 
      name: 'Study Session', 
      artist: 'Chill Beats',
      src: '/audio/study-session.mp3' // Placeholder
    },
    { 
      id: 3, 
      name: 'Coffee Shop Vibes', 
      artist: 'Ambient Sounds',
      src: '/audio/coffee-shop.mp3' // Placeholder
    },
    { 
      id: 4, 
      name: 'Late Night Focus', 
      artist: 'Deep Focus',
      src: '/audio/late-night.mp3' // Placeholder
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleNext);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleNext);
      };
    }
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log('Play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio && duration) {
      const seekTime = (e.target.value / 100) * duration;
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="player-header">
        <h3>🎵 Lo-Fi Player</h3>
      </div>
      
      <div className="track-info">
        <div className="track-name">{tracks[currentTrack]?.name}</div>
        <div className="track-artist">{tracks[currentTrack]?.artist}</div>
      </div>
      
      <div className="progress-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress-bar"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>
      
      <div className="controls">
        <button onClick={handlePrevious} className="control-btn">
          ⏮️
        </button>
        <button onClick={togglePlay} className="play-btn">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={handleNext} className="control-btn">
          ⏭️
        </button>
      </div>
      
      <div className="volume-container">
        <span>🔊</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
      
      <div className="playlist">
        <h4>Playlist</h4>
        <div className="track-list">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`track-item ${index === currentTrack ? 'active' : ''}`}
              onClick={() => {
                setCurrentTrack(index);
                setIsPlaying(true);
              }}
            >
              <span className="track-number">{index + 1}.</span>
              <div className="track-details">
                <div className="track-title">{track.name}</div>
                <div className="track-artist-small">{track.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;