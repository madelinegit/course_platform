require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'credentials.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ===== HELPERS ===== */
function readCredentials() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeCredentials(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'anpl-salt-2025').digest('hex');
}

function nextCredentialId(credentials) {
  const year = new Date().getFullYear();
  if (!credentials.length) return `ANPL-${year}-0001`;
  const nums = credentials
    .map(c => {
      const parts = c.id.split('-');
      return parseInt(parts[parts.length - 1], 10);
    })
    .filter(n => !isNaN(n));
  const max = Math.max(...nums);
  return `ANPL-${year}-${String(max + 1).padStart(4, '0')}`;
}

/* ===== AUTH MIDDLEWARE ===== */
function requireAdmin(req, res, next) {
  const token = req.headers['authorization'];
  const expected = hashPassword(process.env.ADMIN_PASSWORD || '');
  if (!token || token !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/* ===== AUTH ENDPOINTS ===== */
app.post('/api/auth/course', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  if (password === process.env.COURSE_PASSWORD) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'Incorrect password' });
});

app.post('/api/auth/admin', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  if (password === process.env.ADMIN_PASSWORD) {
    const token = hashPassword(password);
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ error: 'Incorrect password' });
});

/* ===== PUBLIC CREDENTIAL LOOKUP ===== */
app.get('/api/credentials/:id', (req, res) => {
  const { id } = req.params;
  const { credentials } = readCredentials();
  const found = credentials.find(c => c.id.toUpperCase() === id.toUpperCase());
  if (!found) return res.status(404).json({ error: 'Not found' });
  return res.json(found);
});

/* ===== ADMIN: LIST ALL ===== */
app.get('/api/admin/credentials', requireAdmin, (req, res) => {
  const data = readCredentials();
  res.json(data);
});

/* ===== ADMIN: ADD ===== */
app.post('/api/admin/credentials', requireAdmin, (req, res) => {
  const { name, issued, result, modules } = req.body;
  if (!name || !issued || !result) {
    return res.status(400).json({ error: 'name, issued, and result are required' });
  }
  const data = readCredentials();
  const id = nextCredentialId(data.credentials);
  const newCred = {
    id,
    name: name.trim(),
    issued,
    modules: modules || 8,
    result
  };
  data.credentials.push(newCred);
  writeCredentials(data);
  res.status(201).json(newCred);
});

/* ===== ADMIN: EDIT ===== */
app.put('/api/admin/credentials/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, issued, result, modules } = req.body;
  const data = readCredentials();
  const idx = data.credentials.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.credentials[idx] = {
    ...data.credentials[idx],
    ...(name    && { name: name.trim() }),
    ...(issued  && { issued }),
    ...(result  && { result }),
    ...(modules && { modules })
  };
  writeCredentials(data);
  res.json(data.credentials[idx]);
});

/* ===== ADMIN: DELETE ===== */
app.delete('/api/admin/credentials/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const data = readCredentials();
  const idx = data.credentials.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = data.credentials.splice(idx, 1)[0];
  writeCredentials(data);
  res.json({ deleted });
});

/* ===== SPA FALLBACK ===== */
app.get('*', (req, res) => {
  // Serve directory index.html files for clean URLs
  const urlPath = req.path;
  const candidates = [
    path.join(__dirname, 'public', urlPath, 'index.html'),
    path.join(__dirname, 'public', urlPath + '.html'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return res.sendFile(candidate);
  }
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ANPL server running at http://localhost:${PORT}`);
});

module.exports = app;
