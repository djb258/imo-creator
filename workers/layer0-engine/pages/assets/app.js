/**
 * Layer 0 Engine — Frontend JavaScript
 * Plain JS. No framework. The UI is the variable — the engine is the constant.
 */

const API_BASE = '/api';

// ─── Input Form (index.html) ───

const form = document.getElementById('extraction-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const statusEl = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    const resultsEl = document.getElementById('results');
    const resultsSummary = document.getElementById('results-summary');
    const errorEl = document.getElementById('error');
    const errorText = document.getElementById('error-text');

    // Reset
    statusEl.classList.remove('hidden');
    resultsEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    submitBtn.disabled = true;
    statusText.textContent = 'Running extraction\u2026 This may take a few minutes.';

    const body = {
      domainName: document.getElementById('domain-name').value,
      domainDescription: document.getElementById('domain-description').value,
      sigmaTolerance: parseFloat(document.getElementById('sigma-tolerance').value),
      maxGates: parseInt(document.getElementById('max-gates').value, 10),
    };

    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Show results
      statusEl.classList.add('hidden');
      resultsEl.classList.remove('hidden');

      const s = data.session;
      resultsSummary.innerHTML = `
        <p><strong>Domain:</strong> ${escapeHtml(s.domainName)}</p>
        <p><strong>Status:</strong> ${s.status}</p>
        <p><strong>Gates run:</strong> ${s.totalGates}</p>
        <p><strong>Constants locked:</strong> ${s.totalConstants}</p>
        <p><strong>Variables isolated:</strong> ${s.totalVariables}</p>
        <p><strong>Final \u03c3:</strong> ${s.finalSigma !== null ? s.finalSigma.toFixed(4) : '\u2014'}</p>
      `;

      // Update dashboard link with session ID
      const dashLink = document.getElementById('view-dashboard');
      dashLink.href = `/dashboard.html?session=${s.id}`;
    } catch (err) {
      statusEl.classList.add('hidden');
      errorEl.classList.remove('hidden');
      errorText.textContent = err.message;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ─── Dashboard (dashboard.html) ───

let currentSessionData = null;

async function loadSessions() {
  const listEl = document.getElementById('sessions-list');
  if (!listEl) return;

  try {
    const res = await fetch(`${API_BASE}/sessions`);
    const data = await res.json();

    if (!data.sessions || data.sessions.length === 0) {
      listEl.innerHTML = '<p class="loading">No sessions yet. <a href="/">Start one.</a></p>';
      return;
    }

    listEl.innerHTML = data.sessions.map(s => `
      <div class="session-card" onclick="loadSession('${s.id}')">
        <div>
          <div class="session-card-name">${escapeHtml(s.domainName)}</div>
          <div class="session-card-meta">${s.totalConstants} constants \u00b7 ${s.totalVariables} variables \u00b7 ${s.totalGates} gates</div>
        </div>
        <span class="badge badge-${s.status.toLowerCase().replace('_', '-')}">${s.status}</span>
      </div>
    `).join('');

    // Auto-load session from URL param
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session');
    if (sessionId) loadSession(sessionId);
  } catch (err) {
    listEl.innerHTML = `<p class="loading">Error loading sessions: ${escapeHtml(err.message)}</p>`;
  }
}

async function loadSession(sessionId) {
  const detailEl = document.getElementById('session-detail');
  if (!detailEl) return;

  try {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
    const data = await res.json();
    currentSessionData = data;

    detailEl.classList.remove('hidden');

    // Find session info from list or gates
    if (data.gates.length > 0) {
      const gate = data.gates[0];
      document.getElementById('detail-domain').textContent = `Session: ${sessionId.substring(0, 8)}\u2026`;
    }

    // Stats
    document.getElementById('stat-gates').textContent = data.gates.length;
    document.getElementById('stat-constants').textContent = data.constants.length;
    document.getElementById('stat-variables').textContent =
      data.gates.filter(g => g.verdict === 'VARIABLE').length;

    const lastSigma = data.gates.filter(g => g.monteCarloSigma !== null).pop();
    document.getElementById('stat-sigma').textContent =
      lastSigma ? lastSigma.monteCarloSigma.toFixed(4) : '\u2014';

    // Gate timeline
    const timeline = document.getElementById('gates-timeline');
    timeline.innerHTML = data.gates.map(g => {
      const verdictClass = getVerdictClass(g.verdict);
      return `
        <div class="gate-row">
          <span class="gate-number">${g.gateNumber}</span>
          <span class="gate-candidate">${escapeHtml(g.candidateConstant)}</span>
          <span class="gate-verdict ${verdictClass}">${g.verdict}</span>
        </div>
      `;
    }).join('');

    // Constants table
    const tbody = document.querySelector('#constants-table tbody');
    tbody.innerHTML = data.constants.map((c, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(c.constantName)}</td>
        <td>${escapeHtml(c.constantDefinition)}</td>
        <td>${c.gateNumber}</td>
        <td class="${c.validationEvidence.imo.pass ? 'pass' : 'fail'}">
          ${c.validationEvidence.imo.pass ? 'PASS' : 'FAIL'}
        </td>
        <td class="${c.validationEvidence.ctb.pass ? 'pass' : 'fail'}">
          ${c.validationEvidence.ctb.pass ? 'PASS' : 'FAIL'}
        </td>
        <td class="${c.validationEvidence.circle.pass ? 'pass' : 'fail'}">
          ${c.validationEvidence.circle.pass ? 'PASS' : 'FAIL'}
        </td>
      </tr>
    `).join('');

    // Sigma chart
    drawSigmaChart(data.gates);
  } catch (err) {
    console.error('Failed to load session:', err);
  }
}

function getVerdictClass(verdict) {
  const map = {
    'CONSTANT_LOCKED': 'verdict-locked',
    'VARIABLE': 'verdict-variable',
    'PHANTOM_RECLASSIFY': 'verdict-phantom',
    'BACK_PROPAGATE': 'verdict-backprop',
    'DONE': 'verdict-done',
  };
  return map[verdict] || '';
}

function drawSigmaChart(gates) {
  const canvas = document.getElementById('sigma-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const sigmaGates = gates.filter(g => g.monteCarloSigma !== null);

  if (sigmaGates.length === 0) {
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText('No quantitative gates yet', 20, 100);
    return;
  }

  const w = canvas.width;
  const h = canvas.height;
  const padding = 40;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  ctx.clearRect(0, 0, w, h);

  // Find sigma range
  const sigmas = sigmaGates.map(g => g.monteCarloSigma);
  const maxSigma = Math.max(...sigmas) * 1.1;
  const minSigma = 0;

  // Draw axes
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  // Draw sigma line
  ctx.strokeStyle = '#4a9eff';
  ctx.lineWidth = 2;
  ctx.beginPath();

  sigmaGates.forEach((g, i) => {
    const x = padding + (i / Math.max(sigmaGates.length - 1, 1)) * chartW;
    const y = h - padding - ((g.monteCarloSigma - minSigma) / (maxSigma - minSigma)) * chartH;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw points
  sigmaGates.forEach((g, i) => {
    const x = padding + (i / Math.max(sigmaGates.length - 1, 1)) * chartW;
    const y = h - padding - ((g.monteCarloSigma - minSigma) / (maxSigma - minSigma)) * chartH;

    ctx.fillStyle = g.sigmaDirection === 'TIGHTENED' ? '#4ade80' :
                    g.sigmaDirection === 'EXPANDED' ? '#f87171' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Labels
  ctx.fillStyle = '#888';
  ctx.font = '10px monospace';
  ctx.fillText('\u03c3', 10, padding + chartH / 2);
  ctx.fillText('Gate', w / 2, h - 5);
}

// ─── Export Functions ───

function exportMarkdown() {
  if (!currentSessionData) return;

  const output = document.getElementById('export-output');
  output.classList.remove('hidden');

  const { gates, constants } = currentSessionData;
  let md = `# Layer 0 Extraction Results\n\n`;
  md += `## Locked Constants (${constants.length})\n\n`;
  md += `| # | Constant | Definition | Gate | IMO | CTB | Circle |\n`;
  md += `|---|----------|-----------|------|-----|-----|--------|\n`;

  constants.forEach((c, i) => {
    md += `| ${i + 1} | ${c.constantName} | ${c.constantDefinition} | ${c.gateNumber} | ${c.validationEvidence.imo.pass ? 'PASS' : 'FAIL'} | ${c.validationEvidence.ctb.pass ? 'PASS' : 'FAIL'} | ${c.validationEvidence.circle.pass ? 'PASS' : 'FAIL'} |\n`;
  });

  md += `\n## Gate Results (${gates.length})\n\n`;
  gates.forEach(g => {
    md += `### Gate ${g.gateNumber} (${g.altitudeFt} ft)\n`;
    md += `- Candidate: ${g.candidateConstant}\n`;
    md += `- Verdict: ${g.verdict}\n`;
    if (g.monteCarloSigma !== null) md += `- Sigma: ${g.monteCarloSigma.toFixed(4)}\n`;
    md += `\n`;
  });

  output.textContent = md;
}

function exportJSON() {
  if (!currentSessionData) return;

  const output = document.getElementById('export-output');
  output.classList.remove('hidden');
  output.textContent = JSON.stringify(currentSessionData, null, 2);
}

// ─── Utilities ───

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
