document.getElementById("toolName").innerHTML =
    "🔪 Navaja Suiza / 🎧 Reproductor Multi-Plataforma";


let historial =
    JSON.parse(localStorage.getItem("ns-player-history")) || [];

let currentFilter = "all";

document.getElementById('loadBtn').addEventListener('click', procesarUrl);

function procesarUrl() {
    const url = document.getElementById('mediaUrl').value.trim();
    const canvas = document.getElementById('canvas-reproductor');

    if (!url) return alert("Por favor, ingresa una URL válida.");

    // Resetear clases por si venía de un video anterior
    canvas.classList.remove('video-active');
    canvas.innerHTML = '';

    // 1. REGLA YOUTUBE
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const ytRegEx = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(ytRegEx);
        if (match && match[1]) {
            canvas.classList.add('video-active');
            canvas.innerHTML = `<iframe src="https://www.youtube.com/embed/${match[1]}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            guardarHistorial(url, "video");
            return;
        }
    }

    // 2. REGLA SPOTIFY
    if (url.includes('spotify.com')) {
        // Convierte urls normales en urls de inserción (embed)
        // Ej: https://open.spotify.com/track/4PTG3Z6ehGkBF3zIwYQZ6b -> .../embed/track/...
        const embedUrl = url.replace('spotify.com/', 'spotify.com/embed/');
        canvas.innerHTML = `<iframe src="${embedUrl}" width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
        guardarHistorial(url, "audio");
        return;
    }

    // 3. REGLA SOUNDCLOUD
    if (url.includes('soundcloud.com')) {
        // SoundCloud requiere pasar la URL completa codificada a su widget oficial
        const encondedUrl = encodeURIComponent(url);
        canvas.innerHTML = `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${encondedUrl}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`;
        guardarHistorial(url, "audio");
        return;
    }

    // 4. REGLA DAILYMOTION
    if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
        // Extraer ID de Dailymotion
        const dmRegEx = /(?:dailymotion\.com(?:\/video|\/embed\/video)\/([^_]+)|dai\.ly\/([^\s?]+))/;
        const match = url.match(dmRegEx);
        const dmId = match ? (match[1] || match[2]) : null;

        if (dmId) {
            canvas.classList.add('video-active');
            canvas.innerHTML = `<iframe src="https://www.dailymotion.com/embed/video/${dmId}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
            guardarHistorial(url, "video");
            return;
        }
    }

    // Si no coincide con ninguna
    canvas.innerHTML = `<div class="placeholder-text" style="color: #ff4a4a;">Plataforma no soportada o URL incorrecta.</div>`;
}

function guardarHistorial(url, tipo) {
    historial = historial.filter(
        item => item.url !== url
    );
    historial.unshift({
        url,
        tipo,
        fecha: new Date().toLocaleString()
    });

    historial = historial.slice(0, 30);

    localStorage.setItem(
        "ns-player-history",
        JSON.stringify(historial)
    );

    renderHistorial();
}

function renderHistorial() {

    const container =
        document.getElementById("historyList");

    let lista = historial;

    if (currentFilter !== "all") {

        lista =
            historial.filter(
                h => h.tipo === currentFilter
            );
    }

    if (!lista.length) {

        container.innerHTML =
            "Sin reproducciones.";

        return;
    }

    container.innerHTML = lista.map(item => `

        <div
            class="history-item"
            onclick="reproducirDesdeHistorial('${item.url}')">
            <div>
                ${item.url}
            </div>

            <div class="history-type">

                ${item.tipo.toUpperCase()}
                ·
                ${item.fecha}

            </div>

        </div>

    `).join("");
}

function reproducirDesdeHistorial(url) {

    document.getElementById("mediaUrl").value = url;

    procesarUrl();
}

document
    .getElementById("clearHistoryBtn")
    .addEventListener("click", () => {

        historial = [];

        localStorage.removeItem(
            "ns-player-history"
        );

        renderHistorial();
    });

document
    .getElementById("clearPlayerBtn")
    .addEventListener("click", () => {
        document.getElementById("mediaUrl").value = "";

        const canvas =
            document.getElementById(
                "canvas-reproductor"
            );

        canvas.classList.remove(
            "video-active"
        );

        canvas.innerHTML = `

        <div class="placeholder-text">

            El reproductor aparecerá aquí

        </div>

    `;
    });

document
    .querySelectorAll(".tab-btn")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            document
                .querySelectorAll(".tab-btn")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

            currentFilter =
                btn.dataset.tab;

            renderHistorial();
        });
    });

renderHistorial();