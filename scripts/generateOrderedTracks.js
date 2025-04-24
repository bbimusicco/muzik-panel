// scripts/generateOrderedTracks.js
require('dotenv').config();
console.log('ENV:', {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SECRET_VAR: process.env.SPOTIFY_CLIENT_SECRET ? '✅ VAR' : '❌ YOK',
    PLAYLIST_IDS: process.env.SPOTIFY_PLAYLIST_IDS
  });  
const fs = require('fs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

// Spotify API istemcisi
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Cloud Storage ayarları
const BUCKET = 'muzik-panel-bucket';
const BASE_FOLDER = 'playlists/tella-kebap-demo/';  // klasör yolunuza göre değiştirin

(async () => {
  // Token al
  const { body: tokenData } = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(tokenData.access_token);

  // Playlist ID’lerinizi .env üzerinden alıyoruz
  const playlistIds = process.env.SPOTIFY_PLAYLIST_IDS
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  // Sadece ilk listedeki ID’yi alalım
  const playlistId = playlistIds[0];

  // Parçaları sayfalayarak çek
  let offset = 0;
  const limit = 100;
  const tracks = [];

  while (true) {
    const { body } = await spotify.getPlaylistTracks(playlistId, { offset, limit });
    if (!body.items.length) break;

    body.items.forEach(item => {
      const name = item.track.name;
      const fileName = encodeURIComponent(name.replace(/\s+/g, '-') + '.mp3');
      const src = `https://storage.googleapis.com/${BUCKET}/${BASE_FOLDER}${fileName}`;
      tracks.push({ name, src });
    });

    if (body.items.length < limit) break;
    offset += limit;
  }

  // Sonucu JSON’a yaz
  fs.writeFileSync(
    path.join(__dirname, '../playlists.json'),
    JSON.stringify({ [BASE_FOLDER.replace(/\/$/, '')]: tracks }, null, 2)
  );
  console.log('playlists.json oluşturuldu.');
})();
