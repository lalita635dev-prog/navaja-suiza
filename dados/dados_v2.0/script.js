document.getElementById("toolName").innerHTML =
    "🔪 Navaja Suiza / 🎲 Dados";

const scene = document.getElementById("scene");
const rollBtn = document.getElementById("rollBtn");
const resultText = document.getElementById("result");
const diceCountSelect = document.getElementById("diceCount");

rollBtn.addEventListener("click", rollDice);

// ===== CARAS =====
function createFace(number, className) {
  const face = document.createElement("div");
  face.className = `face ${className}`;

  const dotPositions = {
    1: [5],
    2: [1,9],
    3: [1,5,9],
    4: [1,3,7,9],
    5: [1,3,5,7,9],
    6: [1,3,4,6,7,9]
  };

  dotPositions[number].forEach(pos => {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.gridArea = `${Math.ceil(pos/3)} / ${((pos-1)%3)+1}`;
    face.appendChild(dot);
  });

  return face;
}

function createDice() {
  const dice = document.createElement("div");
  dice.className = "dice";

  dice.appendChild(createFace(1, "front"));
  dice.appendChild(createFace(6, "back"));
  dice.appendChild(createFace(3, "right"));
  dice.appendChild(createFace(4, "left"));
  dice.appendChild(createFace(5, "top"));
  dice.appendChild(createFace(2, "bottom"));

  return dice;
}

// ===== FÍSICA =====
function animateDice(dice, finalValue) {
  let y = -200; // altura inicial
  let velocity = 0;
  let gravity = 0.8;
  let bounce = 0.6;

  let rotX = Math.random() * 360;
  let rotY = Math.random() * 360;
  let rotSpeedX = Math.random() * 20;
  let rotSpeedY = Math.random() * 20;

  function frame() {
    velocity += gravity;
    y += velocity;

    // Rebote
    if (y > 0) {
      y = 0;
      velocity *= -bounce;

      // pérdida de energía
      rotSpeedX *= 0.8;
      rotSpeedY *= 0.8;

      if (Math.abs(velocity) < 2) {
        settle();
        return;
      }
    }

    rotX += rotSpeedX;
    rotY += rotSpeedY;

    dice.style.transform = `
      translateY(${y}px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
    `;

    requestAnimationFrame(frame);
  }

  function settle() {
    const rotations = {
      1: "rotateX(0deg) rotateY(0deg)",
      2: "rotateX(90deg)",
      3: "rotateY(-90deg)",
      4: "rotateY(90deg)",
      5: "rotateX(-90deg)",
      6: "rotateY(180deg)"
    };

    dice.style.transition = "transform 0.5s ease-out";
    dice.style.transform = rotations[finalValue];
  }

  frame();
}

// ===== MAIN =====
function rollDice() {
  const count = parseInt(diceCountSelect.value);
  scene.innerHTML = "";
  resultText.innerHTML = "";

  let results = [];

  for (let i = 0; i < count; i++) {
    const dice = createDice();
    scene.appendChild(dice);

    const value = Math.floor(Math.random() * 6) + 1;
    results.push(value);

    // delay leve entre dados
    setTimeout(() => {
      animateDice(dice, value);
    }, i * 150);
  }

  setTimeout(() => {
    const total = results.reduce((a,b)=>a+b,0);
    resultText.innerHTML = `
      Resultado: ${results.join(" - ")}<br>
      Total: ${total}
    `;
  }, 1800);
}