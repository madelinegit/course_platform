/* ANPL Certificate SVG Generator */

function generateCertificateSVG({ name, issued, result, id }) {
  const resultColor = result === 'Distinction' ? '#F0E6D3' : '#B0B0A6';
  const domain = window.location.hostname || 'anpl.co';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="540" viewBox="0 0 780 540" style="font-family: Georgia, serif;">
  <defs>
    <linearGradient id="ruleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="rgba(240,230,211,0.1)"/>
      <stop offset="55%"  stop-color="#F0E6D3"/>
      <stop offset="80%"  stop-color="#F7F0E6"/>
      <stop offset="100%" stop-color="#F0E6D3"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="780" height="540" fill="#0E0E0C"/>

  <!-- Outer border -->
  <rect x="14" y="14" width="752" height="512" rx="3" fill="none" stroke="#F0E6D3" stroke-width="0.5"/>

  <!-- Inner border -->
  <rect x="24" y="24" width="732" height="492" rx="2" fill="none" stroke="#F0E6D3" stroke-width="0.3" opacity="0.2"/>

  <!-- Top rule -->
  <rect x="0" y="0" width="780" height="2" fill="url(#ruleGrad)"/>

  <!-- Corner ornaments: top-left (dim) -->
  <path d="M38,38 L38,58 M38,38 L58,38" stroke="#F0E6D3" stroke-width="1" fill="none" opacity="0.07"/>
  <!-- top-right (bright) -->
  <path d="M742,38 L742,58 M742,38 L722,38" stroke="#F0E6D3" stroke-width="1" fill="none" opacity="0.25"/>
  <!-- bottom-left (dim) -->
  <path d="M38,502 L38,482 M38,502 L58,502" stroke="#F0E6D3" stroke-width="1" fill="none" opacity="0.07"/>
  <!-- bottom-right (bright) -->
  <path d="M742,502 L742,482 M742,502 L722,502" stroke="#F0E6D3" stroke-width="1" fill="none" opacity="0.25"/>

  <!-- Eyebrow -->
  <text x="390" y="94" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="10" font-weight="500"
    letter-spacing="3" fill="#B8A898">AI-NATIVE PRODUCT LEADERSHIP</text>

  <!-- ANPL Wordmark -->
  <text x="390" y="148" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="48" font-weight="300"
    letter-spacing="8" fill="#F7F0E6" filter="url(#glow)">ANPL</text>

  <!-- Rule under wordmark -->
  <line x1="240" y1="162" x2="540" y2="162" stroke="#F0E6D3" stroke-width="0.5" opacity="0.4"/>

  <!-- This certifies that -->
  <text x="390" y="200" text-anchor="middle"
    font-family="Georgia, serif" font-size="13" font-style="italic"
    letter-spacing="2" fill="#B8A898">This certifies that</text>

  <!-- Graduate name -->
  <text x="390" y="258" text-anchor="middle"
    font-family="'Fraunces', Georgia, serif" font-size="44" font-weight="400"
    letter-spacing="1" fill="#FDFCF8">${escapeXML(name)}</text>

  <!-- Name underline -->
  <line x1="180" y1="272" x2="600" y2="272" stroke="#F0E6D3" stroke-width="0.5" opacity="0.4"/>

  <!-- Has successfully completed -->
  <text x="390" y="306" text-anchor="middle"
    font-family="Georgia, serif" font-size="12" font-style="italic"
    letter-spacing="1.5" fill="#7A7A72">has successfully completed</text>

  <!-- Program name -->
  <text x="390" y="346" text-anchor="middle"
    font-family="Georgia, serif" font-size="22" font-weight="600"
    letter-spacing="1" fill="#F0E6D3">Lead AI. Don&#x27;t Chase It.</text>

  <!-- Program subtitle -->
  <text x="390" y="370" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="11"
    letter-spacing="2" fill="#B0B0A6">PROFESSIONAL CERTIFICATION PROGRAM &#xB7; 8 MODULES</text>

  <!-- Horizontal rule -->
  <line x1="100" y1="392" x2="680" y2="392" stroke="#F0E6D3" stroke-width="0.4" opacity="0.25"/>

  <!-- Bottom row: labels -->
  <text x="195" y="428" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="10" font-weight="500"
    letter-spacing="2" fill="#B8A898">RESULT</text>
  <text x="390" y="428" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="10" font-weight="500"
    letter-spacing="2" fill="#B8A898">ISSUED</text>
  <text x="585" y="428" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="10" font-weight="500"
    letter-spacing="2" fill="#B8A898">CREDENTIAL ID</text>

  <!-- Bottom row: values -->
  <text x="195" y="450" text-anchor="middle"
    font-family="Georgia, serif" font-size="14" fill="${resultColor}">${escapeXML(result)}</text>
  <text x="390" y="450" text-anchor="middle"
    font-family="Georgia, serif" font-size="14" fill="#F7F5EF">${escapeXML(issued)}</text>
  <text x="585" y="450" text-anchor="middle"
    font-family="'JetBrains Mono', monospace" font-size="13" fill="#F0E6D3">${escapeXML(id)}</text>

  <!-- Bottom rule -->
  <rect x="0" y="480" width="780" height="2" fill="url(#ruleGrad)"/>

  <!-- Verify URL -->
  <text x="390" y="505" text-anchor="middle"
    font-family="'Instrument Sans', sans-serif" font-size="9"
    letter-spacing="2" fill="#4A4A42">VERIFY AT ${domain.toUpperCase()}/VERIFY &#xB7; LEAD AI. DON&#x27;T CHASE IT.</text>
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
