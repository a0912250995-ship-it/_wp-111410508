const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const initSqlJs = require('sql.js');

const app = express();
const PORT = 3002;
const DB_PATH = path.join(__dirname, 'blog.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'threads-blog-secret-change-in-production',
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
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      avatar_color TEXT DEFAULT '#1d9bf0',
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
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

function getAvatarColor(username) {
  const colors = ['#1d9bf0', '#f4212e', '#00ba7c', '#ff7b9c', '#794bc4', '#ff6f00', '#17b5b0'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// --- Public feed ---
app.get('/', (req, res) => {
  const stmt = db.prepare(`
    SELECT p.*, u.username, u.avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();

  if (req.session.user) {
    const likeStmt = db.prepare('SELECT post_id FROM likes WHERE user_id = ?');
    likeStmt.bind([req.session.user.id]);
    const liked = {};
    while (likeStmt.step()) {
      liked[likeStmt.getAsObject().post_id] = true;
    }
    likeStmt.free();
    res.render('index', { posts, liked, title: 'Threads' });
  } else {
    res.render('index', { posts, liked: {}, title: 'Threads' });
  }
});

// --- Profile (personal posts) ---
app.get('/profile', requireAuth, (req, res) => {
  const stmt = db.prepare(`
    SELECT p.*, u.username, u.avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `);
  stmt.bind([req.session.user.id]);
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();

  const likeStmt = db.prepare('SELECT post_id FROM likes WHERE user_id = ?');
  likeStmt.bind([req.session.user.id]);
  const liked = {};
  while (likeStmt.step()) {
    liked[likeStmt.getAsObject().post_id] = true;
  }
  likeStmt.free();

  res.render('profile', { posts, liked, user: req.session.user, title: `${req.session.user.username} - Threads` });
});

// --- Register ---
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
  const stmt = db.prepare('SELECT id FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) {
    stmt.free();
    return res.status(400).send('Username already exists');
  }
  stmt.free();
  const avatarColor = getAvatarColor(username);
  db.run('INSERT INTO users (username, avatar_color, password_hash) VALUES (?, ?, ?)',
    [username, avatarColor, hashPassword(password)]);
  saveDb();
  res.redirect('/login');
});

// --- Login ---
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
      req.session.user = { id: user.id, username: user.username, avatar_color: user.avatar_color };
      return res.redirect('/');
    }
  } else {
    stmt.free();
  }
  res.status(401).send('Invalid username or password');
});

// --- Logout ---
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// --- Create post ---
app.post('/posts', requireAuth, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).send('Content is required');
  }
  db.run('INSERT INTO posts (user_id, content) VALUES (?, ?)', [req.session.user.id, content.trim()]);
  saveDb();
  res.redirect('/');
});

// --- Like/Unlike post ---
app.post('/posts/:id/like', requireAuth, (req, res) => {
  const postId = Number(req.params.id);
  const stmt = db.prepare('SELECT id FROM posts WHERE id = ?');
  stmt.bind([postId]);
  if (!stmt.step()) {
    stmt.free();
    return res.status(404).send('Post not found');
  }
  stmt.free();

  const checkStmt = db.prepare('SELECT user_id FROM likes WHERE user_id = ? AND post_id = ?');
  checkStmt.bind([req.session.user.id, postId]);
  if (checkStmt.step()) {
    checkStmt.free();
    db.run('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [req.session.user.id, postId]);
  } else {
    checkStmt.free();
    db.run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [req.session.user.id, postId]);
  }
  saveDb();
  res.redirect('back');
});

// --- Single post ---
app.get('/posts/:id', (req, res) => {
  const stmt = db.prepare(`
    SELECT p.*, u.username, u.avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `);
  stmt.bind([Number(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    stmt.free();

    let liked = false;
    if (req.session.user) {
      const likeStmt = db.prepare('SELECT post_id FROM likes WHERE user_id = ? AND post_id = ?');
      likeStmt.bind([req.session.user.id, post.id]);
      liked = likeStmt.step();
      likeStmt.free();
    }

    res.render('post', { post, liked, title: `Post by ${post.username}` });
  } else {
    stmt.free();
    res.status(404).send('Post not found');
  }
});

// --- Delete post ---
app.post('/posts/:id/delete', requireAuth, (req, res) => {
  const postId = Number(req.params.id);
  const stmt = db.prepare('SELECT user_id FROM posts WHERE id = ?');
  stmt.bind([postId]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    stmt.free();
    if (post.user_id !== req.session.user.id) {
      return res.status(403).send('Not your post');
    }
    db.run('DELETE FROM likes WHERE post_id = ?', [postId]);
    db.run('DELETE FROM posts WHERE id = ?', [postId]);
    saveDb();
  } else {
    stmt.free();
  }
  res.redirect('/');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Threads blog running at http://localhost:${PORT}`);
  });
});
