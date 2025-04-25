require('dotenv').config();
const fs = require('fs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const BUCKET = 'muzik-panel-bucket';
const BASE_FOLDER = 'playlists/tella-kebap-demo/';

(async () => {
  const { body: tokenData } = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(tokenData.access_token);

  const playlistId = process.env.SPOTIFY_PLAYLIST_IDS.split(',')[0];
  const tracks = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { body } = await spotify.getPlaylistTracks(playlistId, { offset, limit });
    if (!body.items.length) break;

    body.items.forEach(item => {
      const track = item.track;
      const name = track.name;
      const fileName = encodeURIComponent(name.replace(/\s+/g, '-') + '.mp3');
      const src = `https://storage.googleapis.com/${BUCKET}/${BASE_FOLDER}${fileName}`;
      const image = track.album?.images?.[0]?.url || '';

      tracks.push({ name, src, image });
    });

    if (body.items.length < limit) break;
    offset += limit;
  }

  fs.writeFileSync(
    path.join(__dirname, '../src/playlists.json'),
    JSON.stringify({ [BASE_FOLDER.replace(/\/$/, '')]: tracks }, null, 2)
  );

  console.log('Güncellenmiş playlists.json oluşturuldu 🎵');
})();
