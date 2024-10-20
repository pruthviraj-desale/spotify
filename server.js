const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());  // Enable CORS for all routes


// Spotify API credentials
const client_id = '06297cdb57a34730a037e583f0db5662';
const client_secret = '18f46e03130246abab2296d6ba57d2cc';

// Function to get the access token
async function getAccessToken() {
    const authUrl = "https://accounts.spotify.com/api/token";
    const authData = new URLSearchParams({
        grant_type: 'client_credentials'
    });
    const authHeaders = {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const response = await axios.post(authUrl, authData, authHeaders);
    return response.data.access_token;
}

// Function to get playlist tracks
async function getPlaylistTracks(playlistId) {
    const accessToken = await getAccessToken();
    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const response = await axios.get(playlistUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return response.data.items.map(item => ({
        name: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        // Removing genre since it's not provided in track details
        genre: 'Unknown' 
    }));
}

// API route to fetch playlist tracks
app.get('/playlist/:id', async (req, res) => {
    const playlistId = req.params.id;
    try {
        const tracks = await getPlaylistTracks(playlistId);
        res.json(tracks);
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);  // Log the error to the console
        res.status(500).json({ error: 'Failed to fetch playlist tracks' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
