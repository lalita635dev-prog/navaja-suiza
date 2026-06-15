let qrCode;
let logoData = null;

const qrContainer = document.getElementById("qrContainer");

qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: "",
    image: "",
    dotsOptions: {
        color: "#000000",
        type: "rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,        // más espacio alrededor del logo
        imageSize: 0.25   // un poco más chico para mejor lectura
    },
    qrOptions: {
        errorCorrectionLevel: "H"
    },
    backgroundOptions: {
        color: "#ffffff"
    }
});

qrCode.append(qrContainer);

/* VALIDAR */
function isValidURL(string) {
    try { new URL(string); return true; }
    catch { return false; }
}

/* GENERAR */
function generateQR() {
    const url = document.getElementById("urlInput").value;
    const color = document.getElementById("colorPicker").value;
    const error = document.getElementById("error");

    if (!isValidURL(url)) {
        error.innerText = "⚠️ URL inválida";
        return;
    }

    error.innerText = "";

    qrContainer.classList.remove("show");

    setTimeout(() => {
        qrCode.update({
            data: url,
            dotsOptions: { color: color },
            image: logoData,
            backgroundOptions: {
                color: "#ffffff"
            }
        });

        qrContainer.classList.add("show");
    }, 200);
}

/* DESCARGAR */
function downloadQR(format) {
    qrCode.download({
        name: "qr",
        extension: format
    });
}

/* COPIAR */
async function copyQR() {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]);
            alert("✅ Copiado");
        } catch {
            alert("❌ Error");
        }
    });
}

/* DRAG & DROP */
const dropZone = document.getElementById("dropZone");
const logoInput = document.getElementById("logoInput");

dropZone.addEventListener("click", () => logoInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.background = "rgba(59,130,246,0.2)";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
});

logoInput.addEventListener("change", (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file) return;

    document.getElementById("fileName").innerText = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        logoData = e.target.result;
        generateQR();
    };
    reader.readAsDataURL(file);
}

/* RESET */
function resetAll() {
    document.getElementById("urlInput").value = "";
    document.getElementById("colorPicker").value = "#000000";
    document.getElementById("fileName").innerText = "Sin logo";
    document.getElementById("error").innerText = "";
    logoData = null;

    qrCode.update({
        data: "",
        image: ""
    });
}

/* TEMA */
document.getElementById("themeToggle").addEventListener("click", () => {
    const body = document.body;

    if (body.classList.contains("dark")) {
        body.classList.replace("dark", "light");
        themeToggle.innerText = "☀️";
    } else {
        body.classList.replace("light", "dark");
        themeToggle.innerText = "🌙";
    }
});