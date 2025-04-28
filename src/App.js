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
  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [logoFade, setLogoFade] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#000');

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

  // Logo ve Arka Plan için Fade Effect
  useEffect(() => {
    setLogoFade(true);
    const timeout = setTimeout(() => {
      setLogoFade(false);
    }, 300);

    const targetColor = isTella ? '#0d2048' : '#000';
    setBackgroundColor(targetColor);

    return () => clearTimeout(timeout);
  }, [isTella]);

  useEffect(() => {
    const body = document.body;
    body.style.transition = 'background-color 0.8s ease';
    body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Ödeme kontrolü artık server'dan geliyor
  useEffect(() => {
    if (isLoggedIn) {
      const checkPayment = async () => {
        try {
          const response = await fetch(`/api/check-payment/'+{username}`);
          const data = await response.json();
          setIsPaid(data.paid);
        } catch (error) {
          console.error('Ödeme kontrol hatası:', error);
        }
      };
      checkPayment();
    }
  }, [isLoggedIn]);

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

  const handlePayment = async () => {
    setLoadingPayment(true);
    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Pekcan',
          surname: 'Birinci',
          email: 'pekcan@example.com',
          cardHolderName: 'Pekcan Birinci',
          cardNumber: '5528790000000008', // Test kartı
          expireMonth: '12',
          expireYear: '2030',
          cvc: '123'
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsPaid(true);
        alert('Ödeme başarılı! 🎉');
      } else {
        alert('Ödeme başarısız: ' + (data.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Sunucu hatası: ' + error.message);
    }
    setLoadingPayment(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <img src={logoSrc} alt="Logo" className={`logo ${logoFade ? 'fade-out' : ''}`} />
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

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <img src={logoSrc} alt="Logo" className={`sidebar-logo ${logoFade ? 'fade-out' : ''}`} />
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
        {!isPaid ? (
          <div className="payment-prompt">
            <h2>Çalma listesine erişmek için ödeme yapmalısınız.</h2>
            <button onClick={handlePayment} disabled={loadingPayment}>
              {loadingPayment ? 'Ödeme yapılıyor...' : 'Ödeme Yap'}
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
