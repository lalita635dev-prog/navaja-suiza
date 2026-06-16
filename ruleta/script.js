document.getElementById("toolName").innerHTML =
    "🔪 Navaja Suiza / 🎡 Ruleta";

let options = ["Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5"];
let startAngle = 0;
let arc;
let spinning = false;
let lastWinnerIndex = null;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    let size = Math.min(window.innerWidth * 0.9, 400);
    canvas.width = size;
    canvas.height = size;
}

window.addEventListener("resize", () => {
    resizeCanvas();
    drawWheel();
});

function drawWheel() {
    if (options.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No hay opciones", canvas.width / 2, canvas.height / 2);

        return;
    } //por si no hay nada para mostrar
    arc = Math.PI * 2 / options.length;
    let size = canvas.width;
    let center = size / 2;

    ctx.clearRect(0, 0, size, size);

    options.forEach((opt, i) => {
        let angle = startAngle + i * arc;

        ctx.fillStyle = `hsl(${(i * 360 / options.length)}, 70%, 60%)`;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, center, angle, angle + arc);
        ctx.fill();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "#fff";
        let baseFontSize = canvas.width / (options.length * 2);
        let fontSize = baseFontSize;

        // Reducir tamaño si el texto es largo
        if (opt.length > 5) {
            fontSize *= 0.7;
        }
        if (opt.length > 9) {
            fontSize *= 0.6;
        }
        if (opt.length > 13) {
            fontSize *= 0.5;
        }

        fontSize = Math.max(10, fontSize);

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";

        // 🔥 Sombra para mejorar lectura
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // 🔥 Borde (stroke) para contraste
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.max(2, center * 0.015);

        // Dibujar texto con borde + relleno
        ctx.strokeText(opt, center * 0.65, 0);
        ctx.fillText(opt, center * 0.65, 0);

        // reset sombra (importante)
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.restore();
    });
}

function spin() {
    if (spinning) return;
    spinning = true;

    let spinAngle = Math.random() * 2000 + 3000;
    let duration = 3500;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;

        let easeOut = 1 - Math.pow(1 - progress / duration, 3);
        startAngle += (spinAngle * easeOut) * Math.PI / 180;

        drawWheel();

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            showResult();
        }
    }

    requestAnimationFrame(animate);
}

function showResult() {
    let degrees = startAngle * 180 / Math.PI;
    let normalized = (360 - ((degrees - 270) % 360)) % 360;
    let index = Math.floor(normalized / (360 / options.length));
    lastWinnerIndex = index;
    let winner = options[index];

    document.getElementById("resultText").innerText = winner;
    document.getElementById("resultModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("resultModal").style.display = "none";
}

function removeWinner() {
    if (lastWinnerIndex === null) return;

    options.splice(lastWinnerIndex, 1);
    persistOptions();

    updateBox();
    drawWheel();

    closeModal();
}

function addOption() {
    let input = document.getElementById("newOption");
    if (input.value) {
        options.push(input.value);
        persistOptions();
        input.value = "";
        updateBox();
        drawWheel();
    }
}

function updateBox() {
    document.getElementById("optionsBox").value = options.join("\n");
}

function syncFromTextarea() {
    options = document.getElementById("optionsBox").value
        .split("\n")
        .filter(o => o);

    persistOptions();
    drawWheel();
}

//autoguardado
function persistOptions() {
    localStorage.setItem("wheelOptions", JSON.stringify(options));
}

function exportJSON() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options));
    let dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "ruleta.json");
    dl.click();
}

function importJSON(event) {
    let file = event.target.files[0];

    document.getElementById("fileName").innerText = file.name;

    let reader = new FileReader();

    reader.onload = function (e) {
        try {
            options = JSON.parse(e.target.result);
        } catch {
            alert("El archivo no es un JSON válido");
            return;
        }
        persistOptions();
        updateBox();
        drawWheel();
    };

    reader.readAsText(file);
}

// init
resizeCanvas();

let saved = localStorage.getItem("wheelOptions");

if (saved) {
    try {
        options = JSON.parse(saved);
    } catch {
        options = [];
    }
}

updateBox();
drawWheel();