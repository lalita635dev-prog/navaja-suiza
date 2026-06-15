document.getElementById("toolName").innerHTML =
    "🔪 Navaja Suiza / 🎱 Bolillero";

const machine = document.getElementById("machine");
const ballsContainer = document.getElementById("balls");
const result = document.getElementById("result");
const totalBalls = document.getElementById("totalBalls");
const resetBtn = document.getElementById("resetBtn");

let isSpinning = false;
let ballsPhysics = [];
let drawn = [];

let drumRotation = 0;
let spinVelocity = 0;

const radius = 120;
const centerX = 150;
const centerY = 120;
const ballSize = 20;

// 🎱 INIT
function initPhysics() {
  const total = parseInt(totalBalls.value);

  ballsPhysics = [];
  drawn = [];
  result.innerText = "";

  for (let i = 1; i <= total; i++) {
    ballsPhysics.push({
      id: i,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    });
  }

  renderBalls();
}

// ⚙️ FÍSICA
function updatePhysics() {

  // 🌀 fuerza de giro
  const spinForce = spinVelocity * 0.02;

  ballsPhysics.forEach(b => {

    // aplicar giro (empuje tangencial)
    const dx = b.x - centerX;
    const dy = b.y - centerY;

    b.vx += -dy * spinForce * 0.01;
    b.vy += dx * spinForce * 0.01;

    // mover
    b.x += b.vx;
    b.y += b.vy;

    // 🎱 rebote circular
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius - ballSize) {
      const angle = Math.atan2(dy, dx);

      // reposicionar en borde
      b.x = centerX + Math.cos(angle) * (radius - ballSize);
      b.y = centerY + Math.sin(angle) * (radius - ballSize);

      // rebote
      b.vx *= -0.7;
      b.vy *= -0.7;
    }

    // fricción
    b.vx *= 0.99;
    b.vy *= 0.99;
  });

  // 💥 colisiones entre bolas
  for (let i = 0; i < ballsPhysics.length; i++) {
    for (let j = i + 1; j < ballsPhysics.length; j++) {

      let b1 = ballsPhysics[i];
      let b2 = ballsPhysics[j];

      let dx = b2.x - b1.x;
      let dy = b2.y - b1.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < ballSize) {

        // empujar separación
        let angle = Math.atan2(dy, dx);
        let overlap = ballSize - dist;

        b1.x -= Math.cos(angle) * overlap / 2;
        b1.y -= Math.sin(angle) * overlap / 2;
        b2.x += Math.cos(angle) * overlap / 2;
        b2.y += Math.sin(angle) * overlap / 2;

        // intercambio de velocidad
        let tempVx = b1.vx;
        let tempVy = b1.vy;

        b1.vx = b2.vx;
        b1.vy = b2.vy;
        b2.vx = tempVx;
        b2.vy = tempVy;
      }
    }
  }
}

// 🎨 RENDER
function renderBalls() {
  ballsContainer.innerHTML = "";

  ballsPhysics.forEach(b => {
    const el = document.createElement("div");
    el.className = "ball";
    el.innerText = b.id;

    el.style.transform = `translate(${b.x}px, ${b.y}px)`;

    ballsContainer.appendChild(el);
  });
}

// 🔄 LOOP
function loop() {

  // 🌀 aplicar rotación con inercia
  drumRotation += spinVelocity;
  spinVelocity *= 0.95; // freno progresivo

  if (spinVelocity < 0.05) spinVelocity = 0;

  // aplicar rotación visual
  ballsContainer.style.transform = `rotate(${drumRotation}deg)`;

  updatePhysics();
  renderBalls();

  // 🎯 cuando se detiene → extraer
  if (!isSpinning && spinVelocity === 0 && ballsPhysics.length > 0) {
    extractBall();
    spinVelocity = -1; // evitar múltiples extracciones
  }

  requestAnimationFrame(loop);
}

loop();

// 🎯 EXTRAER
function extractBall() {
  const count = parseInt(document.getElementById("drawCount").value);

  let available = ballsPhysics.filter(b => !drawn.includes(b.id));

  if (!available.length) {
    result.innerText = "No quedan bolillas";
    return;
  }

  let selectedList = [];

  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    const selected = available.splice(index, 1)[0];

    drawn.push(selected.id);
    selectedList.push(selected);
  }

  result.innerText = selectedList.map(b => b.id).join(" - ");

  selectedList.forEach(selected => {
    const el = [...document.querySelectorAll(".ball")]
      .find(e => e.innerText == selected.id);

    if (!el) return;

    el.style.transition = "all 0.8s ease";
    el.style.transform = "translate(150px, -100px) scale(1.8)";
    el.style.opacity = "0";
  });
  // eliminar de la física
ballsPhysics = ballsPhysics.filter(b => !drawn.includes(b.id));
}


// 🖱️ INTERACCIÓN
machine.addEventListener("mousedown", () => {
  isSpinning = true;
  spinVelocity = 15; // impulso inicial
});

machine.addEventListener("mouseup", () => {
  isSpinning = false;
});

// 🔁 RESET
resetBtn.addEventListener("click", initPhysics);

// 🚀 INIT
initPhysics();