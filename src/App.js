import React, { useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import AudioPlayer from 'react-h5-audio-player';
import playlistData from './playlists.json';

const logo = process.env.PUBLIC_URL + '/logo.png';
const tracks = playlistData['playlists/tella-kebap-demo'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      (username === 'admin' && password === 'Babalar2009!') ||
      (username === 'admin1' && password === 'Babalar2009!')
    ) {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else if (username === 'demo' && password === 'demo') {
      setIsLoggedIn(true);
      setIsAdmin(false);
    } else {
      alert('Kullanıcı adı veya şifre yanlış');
    }    
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000'
      }}>
        <img src={logo} alt="Logo" style={{ width: 150, marginBottom: 20 }} />
        <h1 style={{ color: '#fff', fontSize: 28, marginBottom: 20 }}>Restoran Müzik Paneli</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
          <input
            placeholder="Kullanıcı Adı"
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginBottom: 10,
              padding: 8,
              backgroundColor: '#111',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 4
            }}
          />
          <input
            type="password"
            placeholder="Şifre"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: 10,
              padding: 8,
              backgroundColor: '#111',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 4
            }}
          />
          <button
            type="submit"
            style={{
              padding: 10,
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <img src={logo} alt="Logo" style={{ width: 120, marginBottom: 20 }} />
      <h1 style={{ marginBottom: 20 }}>Çalma Listesi</h1>
      <AudioPlayer
        src={tracks[currentTrackIndex].src}
        autoPlay
        showSkipControls
        showJumpControls={false}
        loop={false}
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
        <div style={{ marginTop: 30, color: '#aaa' }}>
          <p>Şu an çalan: {tracks[currentTrackIndex].name}</p>
        </div>
      )}
    </div>
  );
}
