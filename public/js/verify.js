/* ANPL Verify Page Logic */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();

  const input  = document.getElementById('cred-input');
  const btn    = document.getElementById('verify-btn');
  const result = document.getElementById('verify-result');

  // Deep-link: auto-fill and trigger from URL ?id=
  const params = new URLSearchParams(window.location.search);
  const urlId  = params.get('id');
  if (urlId && input) {
    input.value = urlId;
    setTimeout(doVerify, 300);
  }

  if (btn)   btn.addEventListener('click', doVerify);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') doVerify(); });

  async function doVerify() {
    const id = input.value.trim();
    if (!id) return;

    btn.textContent = 'Verifying…';
    btn.disabled = true;
    result.innerHTML = '';

    try {
      const res  = await fetch(`/api/credentials/${encodeURIComponent(id)}`);
      if (res.ok) {
        const cred = await res.json();
        renderSuccess(cred);
      } else {
        renderError(id);
      }
    } catch {
      renderError(id, true);
    } finally {
      btn.textContent = 'Verify';
      btn.disabled = false;
    }
  }

  function renderSuccess(cred) {
    result.innerHTML = `
      <div class="result-card reveal visible">
        <div class="result-header verified">
          <span>✓</span> Credential verified
        </div>
        <div class="result-body">
          <p class="eyebrow">Graduate</p>
          <p class="result-name">${escHTML(cred.name)}</p>
          <p style="color:var(--ink-3);font-size:14px;margin-top:4px;">AI-Native Product Leadership &middot; Lead AI. Don't Chase It.</p>
          <div class="result-meta">
            <div class="result-meta-item">
              <span class="result-meta-label">Credential ID</span>
              <span class="result-meta-value mono">${escHTML(cred.id)}</span>
            </div>
            <div class="result-meta-item">
              <span class="result-meta-label">Issued</span>
              <span class="result-meta-value">${escHTML(cred.issued)}</span>
            </div>
            <div class="result-meta-item">
              <span class="result-meta-label">Result</span>
              <span class="result-meta-value ${cred.result === 'Distinction' ? 'distinction' : 'pass'}">${escHTML(cred.result)}</span>
            </div>
            <div class="result-meta-item">
              <span class="result-meta-label">Modules</span>
              <span class="result-meta-value">${cred.modules} of 8</span>
            </div>
            <div class="result-meta-item">
              <span class="result-meta-label">Program</span>
              <span class="result-meta-value">ANPL Certification</span>
            </div>
            <div class="result-meta-item">
              <span class="result-meta-label">Status</span>
              <span class="result-meta-value" style="color:#6BCB77;">Active</span>
            </div>
          </div>
          <div style="margin-top:24px;">
            <button class="btn btn-primary" onclick="openCertModal(${JSON.stringify(cred).replace(/"/g, '&quot;')})">
              View certificate →
            </button>
          </div>
        </div>
      </div>`;

    // Update page URL without reload
    const url = new URL(window.location);
    url.searchParams.set('id', cred.id);
    window.history.replaceState({}, '', url);
  }

  function renderError(id, network) {
    const msg = network
      ? 'Connection error. Please try again.'
      : `The ID <strong style="color:var(--white);font-family:var(--font-mono)">${escHTML(id)}</strong> does not match any ANPL certificate. Check for typos or contact support.`;

    result.innerHTML = `
      <div class="result-card reveal visible">
        <div class="result-header error">
          <span>✕</span> Credential not found
        </div>
        <div class="result-body">
          <p style="font-size:15px;color:var(--ink-3);line-height:1.7;">
            ${msg}
          </p>
        </div>
      </div>`;
  }

  function escHTML(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Stats: update graduate count
  fetchStats();

  async function fetchStats() {
    // Stats are static from credentials.json count — server doesn't expose a count endpoint publicly,
    // so we just leave the numbers baked into the HTML or update here if needed.
  }
});
