import React, { useState, useEffect } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import AudioPlayer from 'react-h5-audio-player';
import playlistData from './playlists.json';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
const [logoFade, setLogoFade] = useState(false);


  const tracks = playlistData['playlists/tella-kebap-demo'];

  const isTella = username === 'tellakebap.1';
  const logo = isTella
    ? process.env.PUBLIC_URL + '/tella-logo.png'
    : process.env.PUBLIC_URL + '/logo.png';

    useEffect(() => {
      const body = document.body;
      body.style.transition = 'background-color 0.8s ease';
      body.style.backgroundColor = isTella ? '#0d2048' : '#000';
    
      // Logo fade animasyonu
      setLogoFade(true);
      const timeout = setTimeout(() => {
        setLogoFade(false);
      }, 200);
    
      return () => clearTimeout(timeout);
    }, [isTella]);    

  const handleLogin = (e) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'admin1') && password === 'Babalar2009!') {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else if (username === 'demo' && password === 'demo') {
      setIsLoggedIn(true);
      setIsAdmin(false);
    } else if (username === 'tellakebap.1' && password === 't03kdA+n') {
      setIsLoggedIn(true);
      setIsAdmin(false);
    } else {
      alert('Kullanıcı adı veya şifre yanlış');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <img src={logo} alt="Logo" className={`logo ${logoFade ? 'fade-out' : ''}`}/>
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

      {isAdmin && (
        <div className="admin-info">
          <p>Şu an çalan: {tracks[currentTrackIndex].name}</p>
        </div>
      )}
    </div>
  );
}
