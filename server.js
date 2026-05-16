require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE     = path.join(__dirname, 'data', 'credentials.json');
const STUDENTS_FILE = path.join(__dirname, 'data', 'students.json');

const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ───────────────────────────── HELPERS ───────────────────────────── */

function readCredentials() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeCredentials(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function readStudents() {
  if (!fs.existsSync(STUDENTS_FILE)) return { students: [] };
  return JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'));
}
function writeStudents(data) {
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function hashPassword(p) {
  return crypto.createHash('sha256').update(p + 'anpl-salt-2025').digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function nextCredentialId(credentials) {
  const year = new Date().getFullYear();
  if (!credentials.length) return `ANPL-${year}-0001`;
  const nums = credentials
    .map(c => parseInt(c.id.split('-').pop(), 10))
    .filter(n => !isNaN(n));
  return `ANPL-${year}-${String(Math.max(...nums) + 1).padStart(4, '0')}`;
}

async function sendAccessEmail(student) {
  const accessUrl = `${process.env.BASE_URL}/course?token=${student.token}`;

  if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@anpl.co',
      to: student.email,
      subject: 'Your ANPL course access',
      html: `
        <p>Hi ${student.name || 'there'},</p>
        <p>You're enrolled. Click the link below to access your course — bookmark it, it's yours permanently.</p>
        <p><a href="${accessUrl}">${accessUrl}</a></p>
        <p>Complete all 8 modules and submit your capstone to earn your ANPL credential.</p>
        <p>— Madeline</p>
      `,
    });
  } else {
    console.log(`\n📧 ACCESS LINK for ${student.email}:\n${accessUrl}\n`);
  }
}

/* ───────────────────────────── MIDDLEWARE ───────────────────────────── */

function requireAdmin(req, res, next) {
  const token    = req.headers['authorization'];
  const expected = hashPassword(process.env.ADMIN_PASSWORD || '');
  if (!token || token !== expected) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function getStudentFromToken(token) {
  if (!token) return null;
  const { students } = readStudents();
  return students.find(s => s.token === token) || null;
}

/* ───────────────────────────── AUTH ───────────────────────────── */

app.post('/api/auth/admin', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true, token: hashPassword(password) });
  }
  return res.status(401).json({ error: 'Incorrect password' });
});

/* ───────────────────────────── STRIPE CHECKOUT ───────────────────────────── */

app.post('/api/checkout', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payments not configured' });
  try {
    const base = process.env.BASE_URL || `http://localhost:${PORT}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AI-Native Product Leadership Certification',
            description: '8 modules · Self-paced · Certificate of completion',
          },
          unit_amount: 29700,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${base}/api/enroll?session={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${base}/#enroll`,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: true },
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error('Stripe error:', e.message);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

/* ───────────────────────────── ENROLLMENT (post-Stripe success) ───────────────────────────── */

app.get('/api/enroll', async (req, res) => {
  if (!stripe) return res.redirect('/?error=payments-not-configured');
  try {
    const { session } = req.query;
    if (!session) return res.redirect('/#enroll');

    const stripeSession = await stripe.checkout.sessions.retrieve(session);
    if (stripeSession.payment_status !== 'paid') return res.redirect('/#enroll');

    const data = readStudents();

    // Idempotent — don't double-enroll
    const existing = data.students.find(s => s.stripeSessionId === session);
    if (existing) return res.redirect(`/welcome?token=${existing.token}`);

    const token = generateToken();
    const student = {
      id:              crypto.randomUUID ? crypto.randomUUID() : generateToken().slice(0, 36),
      email:           stripeSession.customer_details.email,
      name:            stripeSession.customer_details.name || '',
      token,
      stripeSessionId: session,
      purchasedAt:     new Date().toISOString(),
      progress:        {},
      completedAt:     null,
    };

    data.students.push(student);
    writeStudents(data);
    await sendAccessEmail(student);

    res.redirect(`/welcome?token=${token}`);
  } catch (e) {
    console.error('Enrollment error:', e.message);
    res.redirect('/?error=enrollment');
  }
});

/* ───────────────────────────── STUDENT API ───────────────────────────── */

app.get('/api/student/me', (req, res) => {
  const token   = req.headers['x-student-token'] || req.query.token;
  const student = getStudentFromToken(token);
  if (!student) return res.status(401).json({ error: 'Invalid token' });
  res.json({ name: student.name, email: student.email, progress: student.progress, completedAt: student.completedAt });
});

app.post('/api/student/progress', (req, res) => {
  const token   = req.headers['x-student-token'];
  const student = getStudentFromToken(token);
  if (!student) return res.status(401).json({ error: 'Invalid token' });

  const { module, completed } = req.body;
  const data = readStudents();
  const s    = data.students.find(st => st.token === token);
  s.progress[module] = completed;

  const all = ['module-01','module-02','module-03','module-04','module-05','module-06','module-07','module-08'];
  if (all.every(m => s.progress[m])) {
    s.completedAt = s.completedAt || new Date().toISOString();
  }

  writeStudents(data);
  res.json({ progress: s.progress, completedAt: s.completedAt });
});

/* ───────────────────────────── ADMIN: STUDENTS ───────────────────────────── */

app.get('/api/admin/students', requireAdmin, (req, res) => {
  res.json(readStudents());
});

/* ───────────────────────────── ADMIN: CREDENTIALS ───────────────────────────── */

app.get('/api/credentials/:id', (req, res) => {
  try {
    const { credentials } = readCredentials();
    const found = credentials.find(c => c.id.toUpperCase() === req.params.id.toUpperCase());
    if (!found) return res.status(404).json({ error: 'Not found' });
    res.json(found);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/admin/credentials', requireAdmin, (req, res) => {
  try { res.json(readCredentials()); }
  catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/credentials', requireAdmin, (req, res) => {
  try {
    const { name, issued, result, modules } = req.body;
    if (!name || !issued || !result) return res.status(400).json({ error: 'name, issued, and result required' });
    const data = readCredentials();
    const id   = nextCredentialId(data.credentials);
    const cred = { id, name: name.trim(), issued, modules: modules || 8, result };
    data.credentials.push(cred);
    writeCredentials(data);
    res.status(201).json(cred);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/credentials/:id', requireAdmin, (req, res) => {
  try {
    const data = readCredentials();
    const idx  = data.credentials.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const { name, issued, result, modules } = req.body;
    data.credentials[idx] = {
      ...data.credentials[idx],
      ...(name    && { name: name.trim() }),
      ...(issued  && { issued }),
      ...(result  && { result }),
      ...(modules && { modules }),
    };
    writeCredentials(data);
    res.json(data.credentials[idx]);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/credentials/:id', requireAdmin, (req, res) => {
  try {
    const data = readCredentials();
    const idx  = data.credentials.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = data.credentials.splice(idx, 1)[0];
    writeCredentials(data);
    res.json({ deleted });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

/* ───────────────────────────── SPA FALLBACK ───────────────────────────── */

app.get('*', (req, res) => {
  const urlPath  = req.path;
  const candidates = [
    path.join(__dirname, 'public', urlPath, 'index.html'),
    path.join(__dirname, 'public', urlPath + '.html'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return res.sendFile(c);
  }
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`ANPL running at http://localhost:${PORT}`));
module.exports = app;
