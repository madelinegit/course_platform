/* ANPL Admin Dashboard Logic */

document.addEventListener('DOMContentLoaded', () => {
  initNav();

  if (!checkAdminAuth()) {
    showLogin();
    return;
  }
  showDashboard();
});

/* ===== AUTH SCREENS ===== */
function showLogin() {
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');

  const form = document.getElementById('login-form');
  const err  = document.getElementById('login-error');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const pw  = document.getElementById('admin-password').value;
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Verifying…';
    btn.disabled = true;

    const res = await adminLogin(pw);
    if (res.ok) {
      showDashboard();
    } else {
      err.textContent = res.error;
      err.classList.remove('hidden');
      btn.textContent = 'Sign in';
      btn.disabled = false;
    }
  });
}

function showDashboard() {
  document.getElementById('admin-login').classList.add('hidden');
  document.getElementById('admin-dashboard').classList.remove('hidden');
  loadCredentials();
}

/* ===== DATA ===== */
let allCredentials = [];

async function loadCredentials() {
  const token = getAdminToken();
  try {
    const res  = await fetch('/api/admin/credentials', { headers: { Authorization: token } });
    if (!res.ok) { adminLogout(); return; }
    const data = await res.json();
    allCredentials = data.credentials || [];
    renderStats();
    renderTable();
    prefillNextId();
  } catch {
    alert('Failed to load credentials. Check your connection.');
  }
}

/* ===== STATS ===== */
function renderStats() {
  const total = allCredentials.length;
  const now   = new Date();
  const month = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const thisMonth = allCredentials.filter(c => {
    try {
      return new Date(c.issued).getMonth() === now.getMonth() &&
             new Date(c.issued).getFullYear() === now.getFullYear();
    } catch { return false; }
  }).length;

  const distinctions = allCredentials.filter(c => c.result === 'Distinction').length;
  const passes       = allCredentials.filter(c => c.result === 'Pass').length;

  document.getElementById('stat-total').textContent        = total;
  document.getElementById('stat-month').textContent        = thisMonth;
  document.getElementById('stat-month-label').textContent  = month;
  document.getElementById('stat-distinction').textContent  = distinctions;
  document.getElementById('stat-pass').textContent         = passes;
}

/* ===== TABLE ===== */
function renderTable(filter) {
  const tbody  = document.getElementById('cred-tbody');
  const search = document.getElementById('table-search');
  const q      = filter !== undefined ? filter : (search ? search.value.toLowerCase() : '');

  const rows = allCredentials
    .filter(c => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    .slice()
    .reverse();

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--ink-3);padding:32px;">No credentials yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(c => `
    <tr data-id="${esc(c.id)}">
      <td><span class="mono">${esc(c.id)}</span></td>
      <td>${esc(c.name)}</td>
      <td style="color:var(--ink-3)">${esc(c.issued)}</td>
      <td><span class="${c.result === 'Distinction' ? 'text-gold-light' : 'text-muted'}">${esc(c.result)}</span></td>
      <td style="color:var(--ink-3)">${c.modules}/8</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-ghost" onclick="editCred('${esc(c.id)}')">Edit</button>
          <button class="btn btn-sm btn-ghost" onclick="openCertModal(${JSON.stringify(c).replace(/"/g, '&quot;')})">Preview</button>
          <button class="btn btn-sm btn-ghost" onclick="copyLink('${esc(c.id)}')">Copy link</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCred('${esc(c.id)}', '${esc(c.name)}')">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

document.getElementById('table-search')?.addEventListener('input', e => renderTable(e.target.value.toLowerCase()));

/* ===== ADD CREDENTIAL ===== */
function prefillNextId() {
  const el = document.getElementById('next-id-display');
  if (!el) return;
  const year = new Date().getFullYear();
  if (!allCredentials.length) { el.textContent = `ANPL-${year}-0001`; return; }
  const nums = allCredentials.map(c => parseInt(c.id.split('-').pop(), 10)).filter(n => !isNaN(n));
  const next = Math.max(...nums) + 1;
  el.textContent = `ANPL-${year}-${String(next).padStart(4, '0')}`;
}

document.getElementById('add-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const token = getAdminToken();
  const body  = {
    name:    document.getElementById('add-name').value.trim(),
    issued:  formatDateForDisplay(document.getElementById('add-issued').value),
    result:  document.getElementById('add-result').value,
    modules: parseInt(document.getElementById('add-modules').value, 10)
  };

  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  try {
    const res = await fetch('/api/admin/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const cred = await res.json();
      allCredentials.push(cred);
      renderStats();
      renderTable();
      prefillNextId();
      e.target.reset();
      document.getElementById('add-issued').valueAsDate = new Date();
      showToast(`Certificate awarded to ${cred.name} · ${cred.id}`);
    } else {
      const d = await res.json();
      alert(d.error || 'Failed to save');
    }
  } catch { alert('Connection error'); }
  finally { btn.textContent = 'Award certificate'; btn.disabled = false; }
});

// Default issue date to today
const issuedInput = document.getElementById('add-issued');
if (issuedInput) issuedInput.valueAsDate = new Date();

/* ===== EDIT CREDENTIAL ===== */
let editingId = null;

function editCred(id) {
  const cred = allCredentials.find(c => c.id === id);
  if (!cred) return;
  editingId = id;

  document.getElementById('edit-id-display').textContent = id;
  document.getElementById('edit-name').value    = cred.name;
  document.getElementById('edit-issued').value  = parseDisplayDate(cred.issued);
  document.getElementById('edit-result').value  = cred.result;
  document.getElementById('edit-modules').value = cred.modules;

  document.getElementById('edit-modal').classList.add('open');
}

document.getElementById('edit-cancel')?.addEventListener('click', () => {
  document.getElementById('edit-modal').classList.remove('open');
  editingId = null;
});

document.getElementById('edit-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!editingId) return;
  const token = getAdminToken();
  const body  = {
    name:    document.getElementById('edit-name').value.trim(),
    issued:  formatDateForDisplay(document.getElementById('edit-issued').value),
    result:  document.getElementById('edit-result').value,
    modules: parseInt(document.getElementById('edit-modules').value, 10)
  };

  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  try {
    const res = await fetch(`/api/admin/credentials/${encodeURIComponent(editingId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const updated = await res.json();
      const idx = allCredentials.findIndex(c => c.id === editingId);
      if (idx !== -1) allCredentials[idx] = updated;
      renderStats();
      renderTable();
      document.getElementById('edit-modal').classList.remove('open');
      editingId = null;
      showToast('Credential updated');
    } else {
      const d = await res.json();
      alert(d.error || 'Failed to update');
    }
  } catch { alert('Connection error'); }
  finally { btn.textContent = 'Save changes'; btn.disabled = false; }
});

/* ===== DELETE ===== */
async function deleteCred(id, name) {
  const confirmed = confirm(`Delete ${id} for ${name}?\n\nThis removes their ability to verify. This cannot be undone.`);
  if (!confirmed) return;
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/credentials/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });
    if (res.ok) {
      allCredentials = allCredentials.filter(c => c.id !== id);
      renderStats();
      renderTable();
      prefillNextId();
      showToast(`Deleted ${id}`);
    } else {
      alert('Failed to delete');
    }
  } catch { alert('Connection error'); }
}

/* ===== COPY LINK ===== */
function copyLink(id) {
  const url = `${window.location.origin}/verify?id=${encodeURIComponent(id)}`;
  navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard'));
}

/* ===== LOGOUT ===== */
document.getElementById('logout-btn')?.addEventListener('click', adminLogout);

/* ===== UTILS ===== */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function formatDateForDisplay(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDisplayDate(display) {
  if (!display) return '';
  try {
    const d = new Date(display);
    return d.toISOString().split('T')[0];
  } catch { return ''; }
}

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
    background:var(--dark-2); border:1px solid var(--border);
    color:var(--gold); font-size:13px; padding:12px 24px; border-radius:2px;
    z-index:9999; white-space:nowrap; box-shadow:0 8px 32px rgba(0,0,0,0.4);
    transition:opacity 0.3s;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800);
}
