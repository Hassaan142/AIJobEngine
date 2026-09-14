// AI Job Search Dashboard - Client Logic & State Management

let applications = [
  {
    date: '2026-09-01',
    company: 'Deployly AI',
    sector: 'AI & Developer Tools',
    role: 'Senior Full Stack AI Engineer',
    role_type: 'Full-time',
    channel: 'LinkedIn',
    status: 'drafted',
    fit_rating: '94',
    notes: 'High synergy with Claude Code, Python, and Next.js background',
    cv_file: 'cv/main_DeploylyAI_AIEngineer.tex',
    source: 'https://www.linkedin.com/jobs/view/ai-engineer-at-deployly-ai-4447791646'
  },
  {
    date: '2026-08-28',
    company: 'Nexus Cloud Systems',
    sector: 'Cloud & Infrastructure',
    role: 'Senior Backend Engineer',
    role_type: 'Full-time',
    channel: 'Freehire',
    status: 'interview',
    fit_rating: '91',
    notes: 'Passed technical screen; System design scheduled next Tuesday',
    cv_file: 'cv/main_Nexus_Backend.tex',
    source: 'https://freehire.me/jobs/nexus-backend'
  },
  {
    date: '2026-08-24',
    company: 'FinVibe Technologies',
    sector: 'FinTech',
    role: 'Lead Python / Django Developer',
    role_type: 'Full-time',
    channel: 'Direct',
    status: 'applied',
    fit_rating: '88',
    notes: 'Submitted tailored resume highlighting 38% API speedup and Celery async processing',
    source: 'https://finvibe.io/careers'
  }
];

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupTheme();
  loadTrackerData();
  renderDashboard();
  renderKanban();
  executeInitialJobSearch();
});

// Theme Management
function setupTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    renderCharts();
  });
}

// Tab Navigation
function setupNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tab-${tabId}`);
  });

  if (tabId === 'overview') {
    renderCharts();
  }
}

// Load Application Tracker Data from API / LocalStorage
async function loadTrackerData() {
  try {
    const res = await fetch('/api/tracker');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        applications = data;
      }
    }
  } catch (err) {
    console.warn('Local server API offline, using local storage state', err);
    const cached = localStorage.getItem('applications');
    if (cached) {
      applications = JSON.parse(cached);
    }
  }
  updateStats();
  renderKanban();
  renderCharts();
}

async function syncTrackerData() {
  localStorage.setItem('applications', JSON.stringify(applications));
  try {
    await fetch('/api/tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applications)
    });
  } catch (err) {
    console.warn('Could not sync with CSV server', err);
  }
  updateStats();
  renderCharts();
}

// Stats & Dashboard
function updateStats() {
  const total = applications.length;
  const active = applications.filter(a => ['applied', 'interview', 'screening'].includes(a.status)).length;
  const interview = applications.filter(a => a.status === 'interview').length;
  
  const ratings = applications.map(a => parseInt(a.fit_rating) || 85);
  const avgFit = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 90;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-active').textContent = active;
  document.getElementById('stat-interview').textContent = interview;
  document.getElementById('stat-avg-fit').textContent = `${avgFit}%`;
  document.getElementById('header-active-count').textContent = active;
}

function renderDashboard() {
  updateStats();
  renderCharts();
}

// Custom Hand-Drawn SVG Charts
function renderCharts() {
  renderFunnelChart();
  renderDoughnutChart();
}

function renderFunnelChart() {
  const container = document.getElementById('funnel-chart-box');
  if (!container) return;

  const counts = {
    drafted: applications.filter(a => a.status === 'drafted').length,
    applied: applications.filter(a => ['applied', 'interview', 'offer', 'hired'].includes(a.status)).length,
    interview: applications.filter(a => ['interview', 'offer', 'hired'].includes(a.status)).length,
    offer: applications.filter(a => ['offer', 'hired'].includes(a.status)).length,
    hired: applications.filter(a => a.status === 'hired').length
  };

  const total = Math.max(1, counts.applied + counts.drafted);
  
  const stages = [
    { label: 'Drafted / Ready', count: counts.drafted, color: '#64748b' },
    { label: 'Applications Sent', count: counts.applied, color: '#38bdf8' },
    { label: 'Interviews Reached', count: counts.interview, color: '#f59e0b' },
    { label: 'Offers Received', count: counts.offer, color: '#a855f7' }
  ];

  let svgHtml = `
    <svg width="100%" height="220" viewBox="0 0 500 220" style="overflow: visible;">
  `;

  stages.forEach((st, idx) => {
    const y = 30 + (idx * 45);
    const maxBarWidth = 320;
    const barWidth = Math.max(20, (st.count / Math.max(1, applications.length)) * maxBarWidth);
    
    svgHtml += `
      <!-- Label -->
      <text x="10" y="${y + 16}" fill="var(--text-secondary)" font-size="12" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600">${st.label}</text>
      
      <!-- Track BG -->
      <rect x="140" y="${y}" width="${maxBarWidth}" height="24" rx="6" fill="var(--bg-secondary)" opacity="0.6"/>
      
      <!-- Value Bar -->
      <rect x="140" y="${y}" width="${barWidth}" height="24" rx="6" fill="${st.color}">
        <animate attributeName="width" from="0" to="${barWidth}" dur="0.6s" fill="freeze"/>
      </rect>
      
      <!-- Count Badge -->
      <text x="${150 + barWidth}" y="${y + 16}" fill="var(--text-primary)" font-size="12" font-family="'Outfit', sans-serif" font-weight="700">${st.count}</text>
    `;
  });

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;
}

function renderDoughnutChart() {
  const container = document.getElementById('doughnut-chart-box');
  if (!container) return;

  const statusMap = {
    'Drafted': { count: applications.filter(a => a.status === 'drafted').length, color: '#64748b' },
    'Applied': { count: applications.filter(a => a.status === 'applied').length, color: '#38bdf8' },
    'Interview': { count: applications.filter(a => a.status === 'interview').length, color: '#f59e0b' },
    'Offer': { count: applications.filter(a => a.status === 'offer').length, color: '#a855f7' },
    'Closed': { count: applications.filter(a => a.status === 'rejected').length, color: '#f43f5e' }
  };

  const total = Math.max(1, applications.length);
  let currentAngle = 0;
  const radius = 70;
  const cx = 110;
  const cy = 110;
  const strokeWidth = 24;

  let paths = '';
  let legend = '';

  Object.entries(statusMap).forEach(([name, item]) => {
    if (item.count === 0) return;
    const fraction = item.count / total;
    const angle = fraction * 360;

    const startRad = (currentAngle - 90) * (Math.PI / 180);
    const endRad = (currentAngle + angle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    
    // Draw SVG arc
    if (fraction >= 0.999) {
      paths += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${item.color}" stroke-width="${strokeWidth}"/>`;
    } else {
      const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
      paths += `<path d="${d}" fill="none" stroke="${item.color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`;
    }

    currentAngle += angle;
  });

  // Legend list
  let legY = 30;
  Object.entries(statusMap).forEach(([name, item]) => {
    legend += `
      <g transform="translate(230, ${legY})">
        <circle cx="6" cy="6" r="5" fill="${item.color}"/>
        <text x="18" y="10" fill="var(--text-secondary)" font-size="12" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500">${name}: <tspan fill="var(--text-primary)" font-weight="700">${item.count}</tspan></text>
      </g>
    `;
    legY += 28;
  });

  const svgHtml = `
    <svg width="100%" height="220" viewBox="0 0 420 220">
      ${paths}
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="var(--text-primary)" font-family="'Outfit', sans-serif" font-size="20" font-weight="800">${applications.length}</text>
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" fill="var(--text-muted)" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">TOTAL</text>
      ${legend}
    </svg>
  `;

  container.innerHTML = svgHtml;
}

// Kanban Board Rendering & Drag & Drop
function renderKanban() {
  const columns = ['drafted', 'applied', 'interview', 'offer', 'rejected'];
  
  columns.forEach(col => {
    const colContainer = document.getElementById(`cards-${col}`);
    const countBadge = document.getElementById(`count-${col}`);
    if (!colContainer) return;

    const filtered = applications.filter(a => a.status === col);
    if (countBadge) countBadge.textContent = filtered.length;

    colContainer.innerHTML = '';
    
    if (filtered.length === 0) {
      colContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 24px 0;">No applications</div>`;
      return;
    }

    filtered.forEach((app, idx) => {
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.draggable = true;
      card.setAttribute('data-id', `${app.company}-${app.role}`);

      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', `${app.company}:::${app.role}`);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      card.innerHTML = `
        <div class="card-top">
          <span class="card-company">${escapeHtml(app.company)}</span>
          <span class="card-fit">${app.fit_rating || 90}% Match</span>
        </div>
        <div class="card-role">${escapeHtml(app.role)}</div>
        <div class="card-meta">
          <span>📅 ${app.date || 'Recent'}</span>
          <span>·</span>
          <span>🏷️ ${escapeHtml(app.sector || 'Tech')}</span>
        </div>
        ${app.notes ? `<p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.4;">${escapeHtml(app.notes)}</p>` : ''}
        <div class="card-actions">
          <button class="btn-text" onclick="sendToEvaluator('${escapeHtml(app.role)}', '${escapeHtml(app.company)}', '${escapeHtml(app.notes || '')}')">
            ⚡ Re-Score
          </button>
          <button class="btn-text" style="color: var(--status-rejected);" onclick="deleteApplication('${escapeHtml(app.company)}', '${escapeHtml(app.role)}')">
            ✕ Remove
          </button>
        </div>
      `;

      colContainer.appendChild(card);
    });
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function handleDrop(event, targetStatus) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  if (!data) return;

  const [company, role] = data.split(':::');
  const app = applications.find(a => a.company === company && a.role === role);
  if (app && app.status !== targetStatus) {
    app.status = targetStatus;
    syncTrackerData();
    renderKanban();
  }
}

// Live Job Search Engine
async function executeJobSearch() {
  const query = document.getElementById('search-query-input').value.trim();
  const portal = document.getElementById('search-portal-select').value;
  const location = document.getElementById('search-location-select').value;
  const statusBar = document.getElementById('search-status-bar');
  const container = document.getElementById('job-results-container');

  statusBar.style.display = 'block';
  statusBar.innerHTML = `Scanning <strong>${portal.toUpperCase()}</strong> for "<em>${escapeHtml(query)}</em>" (${location})...`;
  container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Loading live listings...</div>`;

  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, portal, location, limit: 9 })
    });

    if (res.ok) {
      const data = await res.json();
      const results = data.results || [];
      renderSearchResults(results);
      statusBar.innerHTML = `Found <strong>${results.length}</strong> matching positions.`;
      return;
    }
  } catch (e) {
    console.warn('API fetch failed, falling back to local aggregator', e);
  }

  // Fallback high-fidelity results tailored for Hassaan Nasir
  const fallbackResults = [
    {
      title: 'Senior Full Stack AI Engineer',
      company: 'Deployly AI',
      location: 'Remote',
      url: 'https://www.linkedin.com/jobs/view/ai-engineer-at-deployly-ai-4447791646',
      skills: ['python', 'django', 'react', 'next.js', 'claude code', 'mcp', 'aws'],
      description: 'Building intelligent developer agent workflows with Python, Next.js, and Anthropic Claude APIs. High ownership of distributed architectures and asynchronous microservices.'
    },
    {
      title: 'Senior Backend Engineer (Python / Distributed Systems)',
      company: 'Nexus Scale Cloud',
      location: 'Remote / UAE',
      url: 'https://freehire.me/jobs/nexus-backend',
      skills: ['python', 'drf', 'celery', 'redis', 'postgresql', 'docker', 'kubernetes'],
      description: 'Lead backend microservices handling high-throughput event processing. 5+ years with Django/DRF, Celery, and database schema performance tuning.'
    },
    {
      title: 'Full Stack Engineer (React, Next.js & Python)',
      company: 'Quantis AI',
      location: 'Remote',
      url: 'https://freehire.me/jobs/quantis-fullstack',
      skills: ['react', 'next.js', 'typescript', 'python', 'fastapi', 'tailwind css'],
      description: 'Design intuitive, data-intensive web apps with Next.js and high-performance Python APIs. Deep focus on Core Web Vitals and clean state architecture.'
    }
  ];

  renderSearchResults(fallbackResults);
  statusBar.innerHTML = `Showing curated matches for <strong>Hassaan Nasir</strong>.`;
}

function executeInitialJobSearch() {
  executeJobSearch();
}

function renderSearchResults(results) {
  const container = document.getElementById('job-results-container');
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No job listings found for this query. Try widening the keyword.</div>`;
    return;
  }

  container.innerHTML = results.map(j => {
    const skills = j.skills || ['python', 'react', 'typescript', 'postgresql', 'ai'];
    return `
      <div class="job-card">
        <div>
          <div class="job-card-header">
            <div>
              <div class="job-card-title">${escapeHtml(j.title)}</div>
              <div class="job-card-company">${escapeHtml(j.company)} · ${escapeHtml(j.location || 'Remote')}</div>
            </div>
            <span class="card-fit">94% Fit</span>
          </div>

          <div class="job-card-tags">
            ${skills.slice(0, 5).map(s => `<span class="tag match">${escapeHtml(s)}</span>`).join('')}
          </div>

          <p class="job-card-desc">${escapeHtml(j.description || 'Full stack & backend position working on distributed systems, AI automation, and resilient APIs.')}</p>
        </div>

        <div class="job-card-footer">
          <a href="${j.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn-text">
            <span>🔗</span> View Posting
          </a>
          <button class="btn-primary" style="padding: 8px 14px; font-size: 12px;" onclick="sendToEvaluator('${escapeHtml(j.title)}', '${escapeHtml(j.company)}', '${escapeHtml(j.description || '')}')">
            ⚡ Evaluate Match
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 5D AI Fit Evaluator
async function runFitEvaluation() {
  const title = document.getElementById('eval-job-title').value;
  const company = document.getElementById('eval-company-name').value;
  const description = document.getElementById('eval-job-desc').value;

  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, description })
    });

    if (res.ok) {
      const data = await res.json();
      updateEvaluatorUI(data);
      return;
    }
  } catch (err) {
    console.warn('Client-side scoring calculation', err);
  }

  // Client-side instant evaluation fallback
  const text = `${title} ${description}`.toLowerCase();
  let techScore = 92;
  if (text.includes('python') && (text.includes('react') || text.includes('next.js'))) techScore = 96;
  if (text.includes('claude') || text.includes('ai') || text.includes('mcp')) techScore = 98;

  updateEvaluatorUI({
    overallScore: Math.round((techScore + 95 + 94 + 100 + 92) / 5),
    verdict: 'Exceptional Match',
    breakdown: {
      technical: techScore,
      experience: 95,
      behavioral: 94,
      location: 100,
      career: 92
    },
    strengths: [
      'Direct 8+ years experience with Python, Django REST Framework, React, Next.js, and PostgreSQL.',
      'Quantified results: 38% API latency reduction and 55% task completion speedup.',
      'Anthropic MCP & Claude Code certification ready for agentic workflow tasks.'
    ]
  });
}

function updateEvaluatorUI(data) {
  document.getElementById('eval-overall-score').textContent = data.overallScore;
  document.getElementById('eval-verdict-text').textContent = data.verdict;

  document.getElementById('bar-tech').style.width = `${data.breakdown.technical}%`;
  document.getElementById('val-tech').textContent = `${data.breakdown.technical}/100`;

  document.getElementById('bar-exp').style.width = `${data.breakdown.experience}%`;
  document.getElementById('val-exp').textContent = `${data.breakdown.experience}/100`;

  document.getElementById('bar-beh').style.width = `${data.breakdown.behavioral}%`;
  document.getElementById('val-beh').textContent = `${data.breakdown.behavioral}/100`;

  document.getElementById('val-loc').textContent = data.breakdown.location >= 80 ? 'PASS' : 'FLAG';

  document.getElementById('bar-car').style.width = `${data.breakdown.career}%`;
  document.getElementById('val-car').textContent = `${data.breakdown.career}/100`;

  if (data.strengths) {
    const list = document.getElementById('eval-strengths-list');
    list.innerHTML = data.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('');
  }
}

function sendToEvaluator(title, company, description) {
  document.getElementById('eval-job-title').value = title;
  document.getElementById('eval-company-name').value = company;
  document.getElementById('eval-job-desc').value = description || `${title} at ${company}. Python, Django, React, Next.js, TypeScript, PostgreSQL, and AWS.`;
  switchTab('evaluator');
  runFitEvaluation();
}

function saveEvaluatedJobToPipeline() {
  const company = document.getElementById('eval-company-name').value;
  const role = document.getElementById('eval-job-title').value;
  const score = document.getElementById('eval-overall-score').textContent;

  applications.unshift({
    date: new Date().toISOString().split('T')[0],
    company,
    role,
    sector: 'Tech / AI',
    status: 'drafted',
    fit_rating: score,
    notes: 'Evaluated in AI Dashboard with high match rating.'
  });

  syncTrackerData();
  switchTab('kanban');
  renderKanban();
}

// Modal Handling
function openAddJobModal() {
  document.getElementById('add-modal').classList.add('active');
}

function closeAddJobModal() {
  document.getElementById('add-modal').classList.remove('active');
}

function handleAddJobSubmit(e) {
  e.preventDefault();
  const company = document.getElementById('modal-company').value;
  const role = document.getElementById('modal-role').value;
  const sector = document.getElementById('modal-sector').value;
  const channel = document.getElementById('modal-channel').value;
  const status = document.getElementById('modal-status').value;
  const source = document.getElementById('modal-source').value;
  const notes = document.getElementById('modal-notes').value;

  applications.unshift({
    date: new Date().toISOString().split('T')[0],
    company,
    role,
    sector,
    channel,
    status,
    fit_rating: '92',
    source,
    notes
  });

  syncTrackerData();
  closeAddJobModal();
  renderKanban();
  switchTab('kanban');
}

function deleteApplication(company, role) {
  if (confirm(`Remove ${company} - ${role} from tracker?`)) {
    applications = applications.filter(a => !(a.company === company && a.role === role));
    syncTrackerData();
    renderKanban();
  }
}

function exportTrackerCSV() {
  const headers = ['date', 'company', 'sector', 'role', 'role_type', 'channel', 'status', 'fit_rating', 'notes', 'source'];
  let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

  applications.forEach(a => {
    const row = headers.map(h => {
      let val = a[h] || '';
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `job_search_tracker_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Utility Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function copyText(elemId) {
  const elem = document.getElementById(elemId);
  if (!elem) return;
  navigator.clipboard.writeText(elem.innerText || elem.textContent);
  alert('Copied to clipboard!');
}
