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
  const [logoFade, setLogoFade] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Playlist tanımları
  const playlists = {
    'Tella Kebap 1': playlistData['playlists/tella-kebap-demo'],
    'Tella Kebap 2': playlistData['playlists/tella-kebap-demo'],
    'Tella Kebap 3': playlistData['playlists/tella-kebap-demo'],
  };

  const tracks = playlists[selectedPlaylist] || [];
  const isTella = username === 'tellakebap.1';
  const logoSrc = isTella
    ? process.env.PUBLIC_URL + '/tella-logo.png'
    : process.env.PUBLIC_URL + '/logo.png';

  // Girişte arka planı ayarla
  useEffect(() => {
    if (!isLoggedIn) return;
    const isTellaUser = username === 'tellakebap.1';
    const targetColor = isTellaUser ? '#0d2048' : '#000';
    document.body.style.transition = 'background-color 0.8s ease';
    document.body.style.backgroundColor = targetColor;
  }, [username, isLoggedIn]);

  // Logo geçiş efekti
  useEffect(() => {
    setLogoFade(true);
    const timeout = setTimeout(() => setLogoFade(false), 300);
    return () => clearTimeout(timeout);
  }, [username]);

  // Ödeme tarihi kontrolü (30 gün)
  useEffect(() => {
    const paidDate = localStorage.getItem("lastPayment");
    if (!paidDate) {
      setIsPaid(false);
      return;
    }
    const now = new Date();
    const lastPaid = new Date(paidDate);
    const diffInDays = (now - lastPaid) / (1000 * 60 * 60 * 24);
    if (diffInDays > 30) {
      setIsPaid(false);
    } else {
      setIsPaid(true);
    }
  }, []);

  // Login fonksiyonu
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

  // Ödeme sayfasına yönlendiren fonksiyon
  const handleRedirectPayment = async () => {
    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username || "Restoran",
          surname: "Kullanıcı",
          email: username + "@example.com",
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = data.redirectUrl;
      } else {
        alert('Ödeme sayfası oluşturulamadı.');
      }
    } catch (error) {
      alert('Sunucu hatası: ' + error.message);
    }
  };

  // Ödeme yapılmamışsa sadece ödeme ekranı göster
  if (isLoggedIn && !isPaid) {
    return (
      <div className="payment-prompt">
        <h2>Çalma listesine erişmek için ödeme yapmalısınız.</h2>
        <button onClick={handleRedirectPayment}>Ödeme Yap</button>
      </div>
    );
  }

  // Giriş ekranı
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <img
          src={logoSrc}
          alt="Logo"
          className={`logo ${logoFade ? 'fade-out' : ''} ${!isTella ? 'logo-large' : ''}`}
        />
        <h1 className="title">Restoran Müzik Paneli</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <span role="img" aria-label="user">👤</span>
            <input placeholder="Kullanıcı Adı" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <span role="img" aria-label="lock">🔒</span>
            <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login-button">Giriş Yap</button>
        </form>
      </div>
    );
  }

  // Playlist ekranı
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <img
          src={logoSrc}
          alt="Logo"
          className={`sidebar-logo ${logoFade ? 'fade-out' : ''} ${!isTella ? 'logo-large' : ''}`}
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
              <img className="track-cover" src={tracks[currentTrackIndex].image} alt="Kapak" />
              <h2 className="track-title">{tracks[currentTrackIndex].name}</h2>
            </div>

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
          </>
        )}
      </main>
    </div>
  );
}
