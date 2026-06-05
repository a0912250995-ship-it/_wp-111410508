const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const initSqlJs = require('sql.js');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'blog.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
  saveDb();
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

app.get('/posts/new', (req, res) => {
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

app.post('/posts', (req, res) => {
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

app.get('/posts/:id/edit', (req, res) => {
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

app.post('/posts/:id', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  db.run('UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, content, Number(req.params.id)]);
  saveDb();
  res.redirect(`/posts/${req.params.id}`);
});

app.post('/posts/:id/delete', (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [Number(req.params.id)]);
  saveDb();
  res.redirect('/');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});
