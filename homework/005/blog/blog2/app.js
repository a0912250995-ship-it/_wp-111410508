const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const initSqlJs = require('sql.js');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'blog.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'blog-secret-change-in-production',
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
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();
  res.render('index', { posts, title: 'My Blog' });
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

app.get('/posts/new', requireAuth, (req, res) => {
  res.render('create', { title: 'New Post' });
});

app.get('/posts/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([Number(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    stmt.free();
    res.render('post', { post, title: post.title });
  } else {
    stmt.free();
    res.status(404).send('Post not found');
  }
});

app.post('/posts', requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  const stmt = db.prepare('SELECT last_insert_rowid() AS id');
  stmt.step();
  const id = stmt.getAsObject().id;
  stmt.free();
  saveDb();
  res.redirect(`/posts/${id}`);
});

app.get('/posts/:id/edit', requireAuth, (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([Number(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    stmt.free();
    res.render('edit', { post, title: 'Edit Post' });
  } else {
    stmt.free();
    res.status(404).send('Post not found');
  }
});

app.post('/posts/:id', requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  db.run('UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, content, Number(req.params.id)]);
  saveDb();
  res.redirect(`/posts/${req.params.id}`);
});

app.post('/posts/:id/delete', requireAuth, (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [Number(req.params.id)]);
  saveDb();
  res.redirect('/');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});
