const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3003;
const DB_PATH = path.join(__dirname, 'game.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'reaction-game-secret-change-in-production',
  resave: false,
  saveUninitialized: false
}));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

let db;

function saveDb() {
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  saveDb();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  return crypto.scryptSync(password, salt, 64).toString('hex') === hash;
}

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

app.get('/', (req, res) => {
  const stmt = db.prepare('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 10');
  const leaderboard = [];
  while (stmt.step()) {
    leaderboard.push(stmt.getAsObject());
  }
  stmt.free();
  res.render('index', { leaderboard, title: 'Reaction Click Game' });
});

app.get('/leaderboard', (req, res) => {
  const stmt = db.prepare('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 50');
  const leaderboard = [];
  while (stmt.step()) {
    leaderboard.push(stmt.getAsObject());
  }
  stmt.free();
  res.render('leaderboard', { leaderboard, title: 'Leaderboard' });
});

app.post('/api/score', requireAuth, (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number' || score < 0 || score > 10000) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  db.run('INSERT INTO scores (user_id, username, score) VALUES (?, ?, ?)',
    [req.session.user.id, req.session.user.username, Math.floor(score)]);
  saveDb();

  const stmt = db.prepare('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 10');
  const leaderboard = [];
  while (stmt.step()) {
    leaderboard.push(stmt.getAsObject());
  }
  stmt.free();

  res.json({ success: true, leaderboard });
});

app.get('/api/leaderboard', (req, res) => {
  const stmt = db.prepare('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 10');
  const leaderboard = [];
  while (stmt.step()) {
    leaderboard.push(stmt.getAsObject());
  }
  stmt.free();
  res.json(leaderboard);
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (!username || !password || !confirmPassword) {
    return res.status(400).send('All fields are required');
  }
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).send('Username must be 2-20 characters');
  }
  const stmt = db.prepare('SELECT id FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) {
    stmt.free();
    return res.status(400).send('Username already exists');
  }
  stmt.free();
  db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashPassword(password)]);
  saveDb();
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) {
    const user = stmt.getAsObject();
    stmt.free();
    if (verifyPassword(password, user.password_hash)) {
      req.session.user = { id: user.id, username: user.username };
      return res.redirect('/');
    }
  } else {
    stmt.free();
  }
  res.status(401).send('Invalid username or password');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Reaction Game running at http://localhost:${PORT}`);
  });
});
