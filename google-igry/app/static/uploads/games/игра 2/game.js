const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const keys = {};

window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function load(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const bg = load("assets/background.png");
const playerImg = load("assets/player.png");
const coinImg = load("assets/coin.png");
const enemyImg = load("assets/enemy.png");

const WORLD = { width: 3000, height: 2000 };

const player = {
  x: 200,
  y: 200,
  size: 50,
  speed: 300
};

let coins = [];
let enemies = [];
let score = 0;

function spawnCoin() {
  coins.push({
    x: Math.random() * WORLD.width,
    y: Math.random() * WORLD.height,
    size: 25
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * WORLD.width,
    y: Math.random() * WORLD.height,
    size: 40,
    speed: 120 + Math.random() * 80
  });
}

for (let i = 0; i < 10; i++) spawnCoin();
for (let i = 0; i < 5; i++) spawnEnemy();

const camera = { x: 0, y: 0 };

function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

let last = 0;

function update(dt) {
  if (keys["KeyW"]) player.y -= player.speed * dt;
  if (keys["KeyS"]) player.y += player.speed * dt;
  if (keys["KeyA"]) player.x -= player.speed * dt;
  if (keys["KeyD"]) player.x += player.speed * dt;

  player.x = Math.max(0, Math.min(WORLD.width - player.size, player.x));
  player.y = Math.max(0, Math.min(WORLD.height - player.size, player.y));

  coins = coins.filter(c => {
    if (dist2(player.x, player.y, c.x, c.y) < 900) {
      score++;
      return false;
    }
    return true;
  });

  enemies.forEach(e => {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;

    e.x += (dx / d) * e.speed * dt;
    e.y += (dy / d) * e.speed * dt;

    if (dist2(player.x, player.y, e.x, e.y) < 900) {
      score = 0;
    }
  });

  if (coins.length < 10) spawnCoin();
}

function updateCamera() {
  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;

  camera.x = Math.max(0, Math.min(WORLD.width - canvas.width, camera.x));
  camera.y = Math.max(0, Math.min(WORLD.height - canvas.height, camera.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bg, -camera.x, -camera.y, WORLD.width, WORLD.height);

  ctx.drawImage(
    playerImg,
    player.x - camera.x,
    player.y - camera.y,
    player.size,
    player.size
  );

  coins.forEach(c => {
    ctx.drawImage(
      coinImg,
      c.x - camera.x,
      c.y - camera.y,
      c.size,
      c.size
    );
  });

  enemies.forEach(e => {
    ctx.drawImage(
      enemyImg,
      e.x - camera.x,
      e.y - camera.y,
      e.size,
      e.size
    );
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function loop(t) {
  const dt = (t - last) / 1000;
  last = t;

  update(dt);
  updateCamera();
  draw();

  requestAnimationFrame(loop);
}

function start() {
  if (bg.complete && playerImg.complete && coinImg.complete && enemyImg.complete) {
    requestAnimationFrame(loop);
  } else {
    requestAnimationFrame(start);
  }
}

start();