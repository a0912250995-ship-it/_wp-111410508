const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3003;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

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

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      username TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
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

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 10');
  res.render('index', { leaderboard: result.rows, title: 'Reaction Click Game' });
});

app.get('/leaderboard', async (req, res) => {
  const result = await pool.query('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 50');
  res.render('leaderboard', { leaderboard: result.rows, title: 'Leaderboard' });
});

app.post('/api/score', requireAuth, async (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number' || score < 0 || score > 10000) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  await pool.query(
    'INSERT INTO scores (user_id, username, score) VALUES ($1, $2, $3)',
    [req.session.user.id, req.session.user.username, Math.floor(score)]
  );

  const result = await pool.query('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 10');
  res.json({ success: true, leaderboard: result.rows });
});

app.get('/api/leaderboard', async (req, res) => {
  const result = await pool.query('SELECT * FROM scores ORDER BY score DESC, created_at ASC LIMIT 10');
  res.json(result.rows);
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.post('/register', async (req, res) => {
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
  const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (existing.rows.length > 0) {
    return res.status(400).send('Username already exists');
  }
  await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
    [username, hashPassword(password)]
  );
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    if (verifyPassword(password, user.password_hash)) {
      req.session.user = { id: user.id, username: user.username };
      return res.redirect('/');
    }
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
