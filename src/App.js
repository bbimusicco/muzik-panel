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
  const [logoFade, setLogoFade] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#000');

  const tracks = playlistData['playlists/tella-kebap-demo'];
  const isTella = username === 'tellakebap.1';

  const logo = isTella
    ? process.env.PUBLIC_URL + '/tella-logo.png'
    : process.env.PUBLIC_URL + '/logo.png';

  // Apply fade transition once when username becomes 'tellakebap.1'
  useEffect(() => {
    const body = document.body;
    body.style.transition = 'background-color 0.8s ease';
    if (username === 'tellakebap.1') {
      setBackgroundColor('#0d2048');
    } else {
      setBackgroundColor('#000');
    }
  }, [username]);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

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

      <div className="track-display-column">
        <img className="track-cover" src={tracks[currentTrackIndex].image} alt="Kapak" />
        <h2 className="track-title">{tracks[currentTrackIndex].name}</h2>
      </div>

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
