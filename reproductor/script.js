document.getElementById("toolName").innerHTML =
    "🔪 Navaja Suiza / 📺 Reproductor de YouTube";

// REPLAZA ESTO CON TU API KEY DE GOOGLE CLOUD
const API_KEY = 'AIzaSyCq9EF68Y-VkuBeoCVscPdaxIDDtHf--Z4';

const searchBtn = document.getElementById('search-btn');
const queryInput = document.getElementById('query');
const resultsContainer = document.getElementById('results');
const player = document.getElementById('player');

// Escuchar clic en el botón y tecla Enter
searchBtn.addEventListener('click', searchVideos);
queryInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchVideos(); });

async function searchVideos() {
    const query = queryInput.value.trim();
    if (!query) return;

    if (API_KEY === 'TU_API_KEY_AQUÍ') {
        alert('Por favor, introduce tu API Key de YouTube en el código JavaScript.');
        return;
    }

    // URL de la API de YouTube para buscar videos por palabra clave
    const url = `https://googleapis.com{encodeURIComponent(query)}&type=video&key=${API_KEY}`;

    try {
        resultsContainer.innerHTML = '<p>Buscando...</p>';
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            displayResults(data.items);
            // Reproducir el primer video de la lista automáticamente
            playVideo(data.items[0].id.videoId);
        } else {
            resultsContainer.innerHTML = '<p>No se encontraron videos.</p>';
        }
    } catch (error) {
        console.error('Error al buscar videos:', error);
        resultsContainer.innerHTML = '<p>Hubo un error en la búsqueda. Revisa la consola.</p>';
    }
}

function displayResults(videos) {
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.medium.url;
        const channel = video.snippet.channelTitle;

        // Crear el elemento HTML de la tarjeta
        const item = document.createElement('div');
        item.className = 'video-item';
        item.innerHTML = `
                <img src="${thumbnail}" alt="${title}">
                <div>
                    <h4>${title}</h4>
                    <p>${channel}</p>
                </div>
            `;

        // Cambiar de video al hacer clic
        item.addEventListener('click', () => playVideo(videoId));
        resultsContainer.appendChild(item);
    });
}

function playVideo(videoId) {
    // Cargar el video en el iframe sin salir de la web
    player.src = `https://youtube.com{videoId}?autoplay=1`;
}