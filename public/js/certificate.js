/* ANPL Certificate SVG Generator */

function generateCertificateSVG({ name, issued, result, id }) {
  const resultColor = result === 'Distinction' ? '#8A6A2A' : '#7A7A72';
  const domain = window.location.hostname || 'anpl.co';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="540" viewBox="0 0 780 540">
  <defs>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#C9A87C" stop-opacity="0.4"/>
      <stop offset="50%"  stop-color="#C9A87C"/>
      <stop offset="100%" stop-color="#C9A87C" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#FDFAF3"/>
      <stop offset="100%" stop-color="#F5EFE0"/>
    </linearGradient>
  </defs>

  <!-- Parchment background -->
  <rect width="780" height="540" fill="url(#bgGrad)"/>

  <!-- Outer border double line -->
  <rect x="16" y="16" width="748" height="508" rx="2" fill="none" stroke="#C9A87C" stroke-width="1.5"/>
  <rect x="22" y="22" width="736" height="496" rx="1" fill="none" stroke="#C9A87C" stroke-width="0.5"/>

  <!-- Corner ornaments -->
  <path d="M16,50 L16,16 L50,16" stroke="#C9A87C" stroke-width="1.5" fill="none"/>
  <path d="M730,16 L764,16 L764,50" stroke="#C9A87C" stroke-width="1.5" fill="none"/>
  <path d="M16,490 L16,524 L50,524" stroke="#C9A87C" stroke-width="1.5" fill="none"/>
  <path d="M730,524 L764,524 L764,490" stroke="#C9A87C" stroke-width="1.5" fill="none"/>

  <!-- Top ornamental rule -->
  <line x1="60" y1="72" x2="720" y2="72" stroke="#C9A87C" stroke-width="0.5" opacity="0.5"/>
  <line x1="60" y1="75" x2="720" y2="75" stroke="#C9A87C" stroke-width="0.5" opacity="0.25"/>

  <!-- Institution name -->
  <text x="390" y="108" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="10" font-weight="600"
    letter-spacing="4" fill="#8A6A2A">AI-NATIVE PRODUCT LEADERSHIP</text>

  <!-- ANPL Wordmark -->
  <text x="390" y="158" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="52" font-weight="400"
    letter-spacing="10" fill="#1A1A14">ANPL</text>

  <!-- Subtitle rule -->
  <line x1="200" y1="172" x2="580" y2="172" stroke="#C9A87C" stroke-width="0.75" opacity="0.6"/>

  <!-- This certifies that -->
  <text x="390" y="210" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="14" font-style="italic"
    fill="#5A4A3A">This certifies that</text>

  <!-- Graduate name -->
  <text x="390" y="268" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="46" font-weight="400"
    fill="#0D0D0A">${escapeXML(name)}</text>

  <!-- Name underline -->
  <line x1="160" y1="282" x2="620" y2="282" stroke="#C9A87C" stroke-width="0.75" opacity="0.5"/>

  <!-- Body text -->
  <text x="390" y="316" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="13" font-style="italic"
    fill="#5A4A3A">has successfully completed all requirements of the</text>

  <!-- Program name -->
  <text x="390" y="352" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="20" font-weight="500"
    letter-spacing="0.5" fill="#1A1A14">AI-Native Product Leadership Certification</text>

  <!-- Program subtitle -->
  <text x="390" y="374" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="10"
    letter-spacing="2.5" fill="#8A7A6A">PROFESSIONAL CERTIFICATION &#xB7; 8 MODULES</text>

  <!-- Ornamental rule above signatures -->
  <line x1="60" y1="396" x2="720" y2="396" stroke="#C9A87C" stroke-width="0.5" opacity="0.25"/>
  <line x1="60" y1="399" x2="720" y2="399" stroke="#C9A87C" stroke-width="0.5" opacity="0.5"/>

  <!-- Seal circle -->
  <circle cx="390" cy="448" r="36" fill="none" stroke="#C9A87C" stroke-width="1"/>
  <circle cx="390" cy="448" r="30" fill="none" stroke="#C9A87C" stroke-width="0.4" opacity="0.5"/>
  <text x="390" y="443" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="11" font-weight="500"
    letter-spacing="1" fill="#8A6A2A">ANPL</text>
  <text x="390" y="457" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="7" font-weight="600"
    letter-spacing="2" fill="#8A6A2A">CERTIFIED</text>

  <!-- Left signature -->
  <text x="175" y="430" text-anchor="middle"
    font-family="Georgia, serif" font-size="18" font-style="italic"
    fill="#2A2A24">Madeline Gall</text>
  <line x1="90" y1="437" x2="260" y2="437" stroke="#2A2A24" stroke-width="0.75" opacity="0.4"/>
  <text x="175" y="452" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="8.5" font-weight="500"
    letter-spacing="1.5" fill="#8A7A6A">PROGRAM DIRECTOR</text>

  <!-- Right signature -->
  <text x="605" y="430" text-anchor="middle"
    font-family="Georgia, serif" font-size="18" font-style="italic"
    fill="#2A2A24">M. Gall</text>
  <line x1="520" y1="437" x2="690" y2="437" stroke="#2A2A24" stroke-width="0.75" opacity="0.4"/>
  <text x="605" y="452" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="8.5" font-weight="500"
    letter-spacing="1.5" fill="#8A7A6A">LEAD INSTRUCTOR</text>

  <!-- Result + ID bottom strip -->
  <line x1="60" y1="468" x2="720" y2="468" stroke="#C9A87C" stroke-width="0.4" opacity="0.3"/>
  <text x="175" y="484" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="8.5" font-weight="600"
    letter-spacing="2" fill="#8A6A2A">RESULT: <tspan fill="${resultColor}">${escapeXML(result)}</tspan></text>
  <text x="390" y="484" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="8.5" font-weight="600"
    letter-spacing="2" fill="#8A6A2A">ISSUED: <tspan fill="#2A2A24">${escapeXML(issued)}</tspan></text>
  <text x="605" y="484" text-anchor="middle"
    font-family="'JetBrains Mono', monospace" font-size="9" fill="#8A6A2A">${escapeXML(id)}</text>

  <!-- Verify URL -->
  <text x="390" y="514" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="8"
    letter-spacing="1.5" fill="#B0A090">VERIFY AT ${domain.toUpperCase()}/VERIFY</text>
</svg>`;
}

function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function downloadSVG(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = (filename || 'ANPL-certificate') + '.svg';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadPNG(svgString, filename) {
  const scale  = 2;
  const canvas = document.createElement('canvas');
  canvas.width  = 780 * scale;
  canvas.height = 540 * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const img  = new Image();

  img.onload = () => {
    ctx.drawImage(img, 0, 0, 780, 540);
    URL.revokeObjectURL(url);
    const a    = document.createElement('a');
    a.download = (filename || 'ANPL-certificate') + '.png';
    a.href     = canvas.toDataURL('image/png');
    a.click();
  };
  img.onerror = () => {
    alert('PNG export failed — please use the SVG download instead.');
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function shareToLinkedIn(credential) {
  const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(credential.id)}`;
  const issuedDate = new Date(credential.issued);
  const year  = isNaN(issuedDate) ? new Date().getFullYear() : issuedDate.getFullYear();
  const month = isNaN(issuedDate) ? 1 : issuedDate.getMonth() + 1;

  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'AI-Native Product Leadership Certification',
    organizationName: 'ANPL',
    issueYear: year,
    issueMonth: month,
    certUrl: verifyUrl,
    certId: credential.id,
  });

  window.open(`https://www.linkedin.com/profile/add?${params.toString()}`, '_blank');
}

function openCertModal(credential) {
  const overlay = document.getElementById('cert-modal');
  const container = document.getElementById('cert-svg-container');
  const svgString = generateCertificateSVG(credential);
  container.innerHTML = svgString;

  overlay.classList.add('open');

  const btnSVG      = document.getElementById('btn-download-svg');
  const btnPNG      = document.getElementById('btn-download-png');
  const btnLink     = document.getElementById('btn-copy-link');
  const btnLinkedIn = document.getElementById('btn-linkedin');

  const fname = credential.id.replace(/\s/g, '-');

  if (btnSVG)      btnSVG.onclick      = () => downloadSVG(svgString, fname);
  if (btnPNG)      btnPNG.onclick      = () => downloadPNG(svgString, fname);
  if (btnLinkedIn) btnLinkedIn.onclick = () => shareToLinkedIn(credential);
  if (btnLink) btnLink.onclick = () => {
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(credential.id)}`;
    navigator.clipboard.writeText(url).then(() => {
      const orig = btnLink.textContent;
      btnLink.textContent = '✓ Copied';
      setTimeout(() => { btnLink.textContent = orig; }, 2000);
    });
  };

  overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('open'); };
  document.getElementById('cert-modal-close').onclick = () => overlay.classList.remove('open');
}
