// Function to extract the playlist ID from the Spotify URL
function extractPlaylistId(url) {
    const match = url.match(/playlist\/([\w\d]+)/);  // Match the 'playlist/xyz123' part of the URL
    if (match) {
        return match[1]; // Return just the playlist ID
    } else {
        alert("Invalid Spotify Playlist URL");
        return null;
    }
}

// Function to load the playlist
async function loadPlaylist() {
    const playlistUrl = document.getElementById('playlistUrl').value; // Get the playlist URL from the input
    const playlistId = extractPlaylistId(playlistUrl); // Extract playlist ID

    if (playlistId) {
        try {
            // Make an API request to your backend to fetch playlist tracks
            const response = await fetch(`http://localhost:3000/playlist/${playlistId}`);
            const tracks = await response.json();
            console.log(tracks);  // Check if the tracks are correctly fetched
            displayTracks(tracks);
        } catch (error) {
            console.error(error);  // Log the error for debugging
            alert("Failed to load playlist");
        }
    }
}


// Function to display tracks on the webpage
function displayTracks(tracks) {
    const playlistEl = document.getElementById('playlist');
    playlistEl.innerHTML = ''; // Clear the playlist before displaying new tracks

    tracks.forEach(track => {
        const trackEl = document.createElement('li');
        trackEl.classList.add('track');
        trackEl.innerHTML = `
            <h3>${track.name}</h3>
            <p><strong>Artist:</strong> ${track.artist}</p>
            <p><strong>Genre:</strong> ${track.genre}</p>
        `;
        playlistEl.appendChild(trackEl);
    });
}
