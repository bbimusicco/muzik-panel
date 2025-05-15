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
  const [selectedPlaylist, setSelectedPlaylist] = useState('Tella Kebap 1');

  // Logo görünürlük durumu: visible, fadingOut, fadingIn
  const [logoFadeState, setLogoFadeState] = useState('visible');
  const [displayedLogo, setDisplayedLogo] = useState(process.env.PUBLIC_URL + '/logo.png');

  // Arka plan rengi ve opaklık durumu
  const [backgroundColor, setBackgroundColor] = useState('#000');
  const [bgOpaque, setBgOpaque] = useState(true);

  // Playlistler
  const playlists = {
    'Tella Kebap 1': playlistData['playlists/tella-kebap-demo'],
    'Tella Kebap 2': playlistData['playlists/tella-kebap-demo'],
    'Tella Kebap 3': playlistData['playlists/tella-kebap-demo'],
  };

  const tracks = playlists[selectedPlaylist] || [];
  const isTella = username === 'tellakebap.1';

  // İstenen logo ve arkaplan rengi
  const targetLogo = isTella
    ? process.env.PUBLIC_URL + '/tella-logo.png'
    : process.env.PUBLIC_URL + '/logo.png';

  const targetBgColor = isTella ? '#0d2048' : '#000';

  // Logo fade ve değişim efektleri
  useEffect(() => {
    if (!isLoggedIn) return;
    if (displayedLogo === targetLogo) return;

    // Önce fade out yap
    setLogoFadeState('fadingOut');

    setTimeout(() => {
      // Logo değiştir
      setDisplayedLogo(targetLogo);
      // Fade in yap
      setLogoFadeState('fadingIn');

      setTimeout(() => {
        // Fade durumu visible yap
        setLogoFadeState('visible');
      }, 300);
    }, 300);
  }, [targetLogo, isLoggedIn, displayedLogo]);

  // Arka plan renk geçişi
  useEffect(() => {
    if (!isLoggedIn) return;

    // Opaklık azalt
    setBgOpaque(false);

    setTimeout(() => {
      // Renk değiştir
      setBackgroundColor(targetBgColor);
      // Opaklığı artır
      setBgOpaque(true);
    }, 300);
  }, [targetBgColor, isLoggedIn]);

  // Body arka planını güncelle
  useEffect(() => {
    document.body.style.transition = 'background-color 0.8s ease';
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Giriş işlemi
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

  // Logo için css classlar
  const logoClassName = {
    visible: '',
    fadingOut: 'fade-out',
    fadingIn: 'fade-in',
  }[logoFadeState];

  // Arka plan opacity classları
  const bgClassName = bgOpaque ? 'bg-opaque' : 'bg-transparent';

  if (!isLoggedIn) {
    return (
      <div className={`login-container ${bgClassName}`}>
        <img
          src={displayedLogo}
          alt="Logo"
          className={`custom-logo ${logoClassName}`}
        />
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

  // Giriş yapıldıktan sonra müzik paneli
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <img
          src={displayedLogo}
          alt="Logo"
          className={`custom-logo ${logoClassName}`}
        />
        <div className="playlist-buttons">
          {Object.keys(playlists).map(name => (
            <button
              key={name}
              className={`playlist-button ${selectedPlaylist === name ? 'active' : ''}`}
              onClick={() => {
                setSelectedPlaylist(name);
                setCurrentTrackIndex(0);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </aside>

      <main className="main-content">
        {tracks.length > 0 && (
          <>
            <div className="track-display">
              <img
                className="track-cover"
                src={tracks[currentTrackIndex].image}
                alt="Kapak"
              />
              <h2 className="track-title">{tracks[currentTrackIndex].name}</h2>
            </div>

            <AudioPlayer
              src={tracks[currentTrackIndex].src}
              autoPlay
              showSkipControls
              showJumpControls={false}
              customAdditionalControls={[]}
              onClickPrevious={() => {
                if (currentTrackIndex > 0) setCurrentTrackIndex(currentTrackIndex - 1);
              }}
              onClickNext={() => {
                if (currentTrackIndex < tracks.length - 1) setCurrentTrackIndex(currentTrackIndex + 1);
              }}
              onEnded={() => {
                if (currentTrackIndex < tracks.length - 1) setCurrentTrackIndex(currentTrackIndex + 1);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
