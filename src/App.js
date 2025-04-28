import React, { useState, useEffect } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import AudioPlayer from 'react-h5-audio-player';
import playlistData from './playlists.json';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState('playlists/tella-kebap-demo');
  const [fadeTransition, setFadeTransition] = useState(false);
  const [logoFade, setLogoFade] = useState(false);

  const playlists = {
    'playlists/tella-kebap-demo': playlistData['playlists/tella-kebap-demo'],
    'playlists/ikinci-playlist': playlistData['playlists/tella-kebap-demo'],
    'playlists/ucuncu-playlist': playlistData['playlists/tella-kebap-demo'],
  };

  const tracks = playlists[selectedPlaylist];
  const isTella = username === 'tellakebap.1';

  const logo = isTella
    ? process.env.PUBLIC_URL + '/tella-logo.png'
    : process.env.PUBLIC_URL + '/logo.png';

  useEffect(() => {
    const body = document.body;
    body.style.transition = 'background-color 0.8s ease';
    if (isLoggedIn && username === 'tellakebap.1') {
      body.style.backgroundColor = '#0d2048';
    } else {
      body.style.backgroundColor = '#000';
    }

    setLogoFade(true);
    const timeout = setTimeout(() => {
      setLogoFade(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, username]);

  const handleLogin = (e) => {
    e.preventDefault();
    const validLogins = [
      { user: 'admin', pass: 'Babalar2009!' },
      { user: 'admin1', pass: 'Babalar2009!' },
      { user: 'demo', pass: 'demo' },
      { user: 'tellakebap.1', pass: 't03kdA+n' },
    ];

    const matched = validLogins.find(u => u.user === username && u.pass === password);
    if (matched) {
      setIsLoggedIn(true);
    } else {
      alert('Kullanıcı adı veya şifre yanlış');
    }
  };

  const handlePlaylistChange = (e) => {
    setFadeTransition(true);
    setTimeout(() => {
      setSelectedPlaylist(e.target.value);
      setCurrentTrackIndex(0);
      setFadeTransition(false);
    }, 300);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <img src={logo} alt="Logo" className={`logo ${logoFade ? 'fade-out' : ''}`} />
        <h1 className="title">Restoran Müzik Paneli</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <span role="img" aria-label="user">👤</span>
            <input
              placeholder="Kullanıcı Adı"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span role="img" aria-label="lock">🔒</span>
            <input
              type="password"
              placeholder="Şifre"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="playlist-title">Çalma Listesi</h1>

      {/* Playlist seçici */}
      <div className="dropdown-container">
        <select value={selectedPlaylist} onChange={handlePlaylistChange} className="dropdown">
          <option value="playlists/tella-kebap-demo">Tella Kebap Playlist 1</option>
          <option value="playlists/ikinci-playlist">Tella Kebap Playlist 2</option>
          <option value="playlists/ucuncu-playlist">Tella Kebap Playlist 3</option>
        </select>
      </div>

      {/* Track göstergesi */}
      <div className={`track-display-column ${fadeTransition ? 'fade' : ''}`}>
        <img className="track-cover" src={tracks[currentTrackIndex].image} alt="Kapak" />
        <h2 className="track-title">{tracks[currentTrackIndex].name}</h2>
      </div>

      {/* Player */}
      <div className="player-wrapper">
        <AudioPlayer
          src={tracks[currentTrackIndex].src}
          autoPlay
          showSkipControls
          showJumpControls={false}
          customAdditionalControls={[]}
          onClickPrevious={() => {
            if (currentTrackIndex > 0) {
              setCurrentTrackIndex(currentTrackIndex - 1);
            }
          }}
          onClickNext={() => {
            if (currentTrackIndex < tracks.length - 1) {
              setCurrentTrackIndex(currentTrackIndex + 1);
            }
          }}
          onEnded={() => {
            if (currentTrackIndex < tracks.length - 1) {
              setCurrentTrackIndex(currentTrackIndex + 1);
            }
          }}
        />
      </div>
    </div>
  );
}
