document.getElementById("toolName").innerHTML =
    "🔪 Navaja Suiza / 🎲 Generador de Números";

const generateBtn = document.getElementById("generateBtn");
const resultDiv = document.getElementById("result");

generateBtn.addEventListener("click", () => {
    const min = parseInt(document.getElementById("min").value);
    const max = parseInt(document.getElementById("max").value);
    const count = parseInt(document.getElementById("count").value);

    // Validaciones
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
        alert("Por favor completá todos los campos");
        return;
    }

    if (min >= max) {
        alert("El mínimo debe ser menor que el máximo");
        return;
    }

    if (count <= 0) {
        alert("La cantidad debe ser mayor a 0");
        return;
    }

    resultDiv.innerHTML = "";

    // Generación con pequeña animación progresiva
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const random = Math.floor(Math.random() * (max - min + 1)) + min;

            const span = document.createElement("div");
            span.classList.add("number");
            span.textContent = random;

            resultDiv.appendChild(span);
        }, i * 120);
    }
});
