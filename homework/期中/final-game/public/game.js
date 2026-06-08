const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 500;

const GAME_DURATION = 30;
const SPAWN_INTERVAL = 800;
const CIRCLE_LIFETIME = 1500;
const BASE_RADIUS = 30;

let circles = [];
let score = 0;
let gameRunning = false;
let gameTimeLeft = GAME_DURATION;
let spawnTimer = null;
let gameTimer = null;
let animFrame = null;
let combo = 0;
let particles = [];

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#FF8C00', '#00CED1',
  '#FF69B4', '#7B68EE', '#32CD32', '#FFD700'
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomPosition(radius) {
  return {
    x: Math.random() * (canvas.width - 2 * radius) + radius,
    y: Math.random() * (canvas.height - 2 * radius) + radius
  };
}

function spawnCircle() {
  if (!gameRunning) return;
  const radius = BASE_RADIUS + Math.random() * 10;
  const pos = getRandomPosition(radius);
  const color = getRandomColor();
  const now = Date.now();
  circles.push({
    x: pos.x,
    y: pos.y,
    r: radius,
    color: color,
    born: now,
    lifetime: CIRCLE_LIFETIME + Math.random() * 500
  });
}

function createParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 4 + 2,
      color: color,
      life: 1.0
    });
  }
}

function drawCircle(c) {
  const age = Date.now() - c.born;
  const lifeLeft = 1 - age / c.lifetime;
  if (lifeLeft <= 0) return false;

  ctx.globalAlpha = lifeLeft;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r * (0.5 + 0.5 * lifeLeft), 0, Math.PI * 2);

  const gradient = ctx.createRadialGradient(c.x - c.r * 0.3, c.y - c.r * 0.3, 0, c.x, c.y, c.r);
  gradient.addColorStop(0, lightenColor(c.color, 40));
  gradient.addColorStop(1, c.color);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;

  return true;
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
  const b = Math.min(255, (num & 0x0000FF) + percent);
  return `rgb(${r},${g},${b})`;
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 0.03;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = p.life;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawHUD() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, 50);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 15, 34);

  if (combo > 1) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Combo x' + combo, 160, 34);
  }

  const timeColor = gameTimeLeft <= 5 ? '#FF4444' : '#fff';
  ctx.fillStyle = timeColor;
  ctx.textAlign = 'right';
  ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Time: ' + Math.ceil(gameTimeLeft) + 's', canvas.width - 15, 34);
}

function drawOverlay(text, subtext) {
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 20);

  if (subtext) {
    ctx.font = '20px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText(subtext, canvas.width / 2, canvas.height / 2 + 40);
  }
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = circles.length - 1; i >= 0; i--) {
    if (!drawCircle(circles[i])) {
      circles.splice(i, 1);
    }
  }

  drawParticles();
  drawHUD();

  const now = Date.now();
  if (gameRunning) {
    const elapsed = (now - gameStartTime) / 1000;
    gameTimeLeft = Math.max(0, GAME_DURATION - elapsed);
    if (gameTimeLeft <= 0) {
      endGame();
      return;
    }
  }

  animFrame = requestAnimationFrame(gameLoop);
}

let gameStartTime = 0;

function startGame() {
  score = 0;
  combo = 0;
  circles = [];
  particles = [];
  gameTimeLeft = GAME_DURATION;
  gameRunning = true;
  gameStartTime = Date.now();

  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('gameOverPanel').style.display = 'none';

  spawnTimer = setInterval(spawnCircle, SPAWN_INTERVAL);
  gameLoop();
}

function endGame() {
  gameRunning = false;
  clearInterval(spawnTimer);
  cancelAnimationFrame(animFrame);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawParticles();
  drawHUD();
  drawOverlay('Game Over!', 'Score: ' + score);

  document.getElementById('startBtn').style.display = 'inline-block';
  document.getElementById('startBtn').textContent = 'Play Again';
  document.getElementById('gameOverPanel').style.display = 'block';
  document.getElementById('finalScore').textContent = score;

  const loggedIn = document.getElementById('userData')?.dataset?.loggedIn === 'true';
  if (loggedIn && score > 0) {
    submitScore(score);
  }
}

function submitScore(score) {
  fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: score })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        updateLeaderboard(data.leaderboard);
      }
    })
    .catch(() => {});
}

function updateLeaderboard(leaderboard) {
  const list = document.getElementById('leaderboardList');
  list.innerHTML = '';
  leaderboard.forEach((entry, i) => {
    const li = document.createElement('li');
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    li.textContent = `${medal} ${entry.username} - ${entry.score}`;
    list.appendChild(li);
  });
}

function handleCanvasClick(e) {
  if (!gameRunning) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  let clientX, clientY;
  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const clickX = (clientX - rect.left) * scaleX;
  const clickY = (clientY - rect.top) * scaleY;

  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    const dx = clickX - c.x;
    const dy = clickY - c.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= c.r) {
      circles.splice(i, 1);
      combo++;
      const bonus = Math.min(combo, 10);
      const points = 10 + bonus * 2;
      score += points;

      createParticles(c.x, c.y, c.color, 15);

      const pop = document.getElementById('popSound');
      pop.currentTime = 0;
      pop.play().catch(() => {});

      return;
    }
  }

  combo = 0;
}

canvas.addEventListener('click', handleCanvasClick);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleCanvasClick(e);
}, { passive: false });

window.startGame = startGame;
