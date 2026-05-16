/* ANPL Auth Utilities */

const COURSE_KEY  = 'anpl_course_access';
const ADMIN_KEY   = 'anpl_admin';
const STUDENT_KEY = 'anpl_student_token';

function checkCourseAuth() {
  return localStorage.getItem(COURSE_KEY) === 'true';
}

function checkAdminAuth() {
  return !!localStorage.getItem(ADMIN_KEY);
}

function getAdminToken() {
  return localStorage.getItem(ADMIN_KEY);
}

async function courseLogin(password) {
  try {
    const res = await fetch('/api/auth/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      localStorage.setItem(COURSE_KEY, 'true');
      return { ok: true };
    }
    const data = await res.json();
    return { ok: false, error: data.error || 'Incorrect password' };
  } catch {
    return { ok: false, error: 'Connection error. Please try again.' };
  }
}

async function adminLogin(password) {
  try {
    const res = await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem(ADMIN_KEY, token);
      return { ok: true };
    }
    const data = await res.json();
    return { ok: false, error: data.error || 'Incorrect password' };
  } catch {
    return { ok: false, error: 'Connection error. Please try again.' };
  }
}

/* ── Student token auth ── */

function getStudentToken() {
  // Check URL first, then localStorage
  const params = new URLSearchParams(window.location.search);
  return params.get('token') || localStorage.getItem(STUDENT_KEY);
}

function setStudentToken(token) {
  localStorage.setItem(STUDENT_KEY, token);
}

function clearStudentToken() {
  localStorage.removeItem(STUDENT_KEY);
}

async function validateStudentToken(token) {
  try {
    const res = await fetch('/api/student/me', {
      headers: { 'x-student-token': token }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function markModuleComplete(moduleId) {
  const token = getStudentToken();
  if (!token) return;
  try {
    await fetch('/api/student/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-student-token': token },
      body: JSON.stringify({ module: moduleId, completed: true }),
    });
  } catch {}
}

function courseLogout() {
  localStorage.removeItem(COURSE_KEY);
  clearStudentToken();
  window.location.href = '/course/';
}

function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
  window.location.reload();
}

/* Protect a module page — call at top of each module page */
function requireCourseAuth() {
  if (!checkCourseAuth()) {
    window.location.href = '/course/';
    return false;
  }
  return true;
}

/* Shared scroll reveal */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* Shared nav scroll effect */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Shared accordion */
function initAccordions(selector) {
  const items = document.querySelectorAll(selector || '.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}
