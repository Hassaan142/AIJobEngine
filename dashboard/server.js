import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf'
};

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0 || (lines.length === 1 && !lines[0].trim())) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line handling quotes
    const values = [];
    let insideQuotes = false;
    let currentVal = '';
    
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(obj);
  }
  return rows;
}

function stringifyCSV(headers, rows) {
  const headerLine = headers.join(',');
  const rowLines = rows.map(r => {
    return headers.map(h => {
      let val = r[h] !== undefined ? String(r[h]) : '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });
  return [headerLine, ...rowLines].join('\n') + '\n';
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers for local versatility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/profile' && req.method === 'GET') {
    try {
      const profilePath = path.join(ROOT_DIR, '.claude/skills/job-application-assistant/01-candidate-profile.md');
      let profileText = '';
      if (fs.existsSync(profilePath)) {
        profileText = fs.readFileSync(profilePath, 'utf-8');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: 'Hassaan Nasir',
        title: 'Senior Full Stack & AI Engineer',
        experience: '8+ Years',
        email: 'hasaan.engineer1@gmail.com',
        location: 'Pakistan / UAE / Worldwide Remote',
        linkedin: 'https://linkedin.com/in/hassaan713-nasir',
        skills: {
          primary: ['Python 3', 'Django', 'Django REST Framework', 'React.js', 'Next.js', 'TypeScript', 'PostgreSQL', 'Celery', 'Redis', 'REST APIs', 'Microservices'],
          ai: ['Claude Code', 'Anthropic Claude API', 'OpenAI API', 'LangChain', 'LangGraph', 'Model Context Protocol (MCP)', 'Cursor AI'],
          cloud: ['Docker', 'Kubernetes', 'AWS (EC2, ECS, S3, RDS)', 'GitLab CI/CD', 'GitHub Actions', 'Terraform', 'Linux'],
          observability: ['Sentry', 'Datadog', 'Grafana', 'Prometheus', 'OpenTelemetry'],
          secondary: ['FastAPI', 'Node.js', 'Express.js', 'ClickHouse', 'Elasticsearch', 'GraphQL', 'Tailwind CSS']
        },
        rawMarkdown: profileText
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/tracker' && req.method === 'GET') {
    try {
      const trackerPath = path.join(ROOT_DIR, 'job_search_tracker.csv');
      if (!fs.existsSync(trackerPath)) {
        // Return starter template if empty
        const starterHeaders = ['date', 'company', 'sector', 'role', 'role_type', 'channel', 'status', 'contact_person', 'fit_rating', 'notes', 'cv_file', 'cover_letter_file', 'source', 'deadline'];
        const starterData = [
          {
            date: '2026-09-01',
            company: 'Deployly AI',
            sector: 'AI & Developer Tools',
            role: 'Senior Full Stack AI Engineer',
            role_type: 'Full-time',
            channel: 'LinkedIn',
            status: 'drafted',
            contact_person: 'Talent Acquisition',
            fit_rating: '94',
            notes: 'High synergy with Claude Code, Python, and Next.js background',
            cv_file: 'cv/main_DeploylyAI_AIEngineer.tex',
            cover_letter_file: 'cover_letters/cover_DeploylyAI.tex',
            source: 'https://www.linkedin.com/jobs/view/ai-engineer-at-deployly-ai-4447791646',
            deadline: '2026-09-30'
          },
          {
            date: '2026-08-28',
            company: 'Nexus Cloud Systems',
            sector: 'Cloud & Infrastructure',
            role: 'Senior Backend Engineer (Python/PostgreSQL)',
            role_type: 'Full-time',
            channel: 'Freehire',
            status: 'interview',
            contact_person: 'Engineering Manager',
            fit_rating: '91',
            notes: 'Completed technical take-home; System design interview scheduled',
            cv_file: 'cv/main_Nexus_Backend.tex',
            cover_letter_file: 'cover_letters/cover_Nexus.tex',
            source: 'https://freehire.me/jobs/nexus-backend',
            deadline: '2026-09-15'
          }
        ];
        fs.writeFileSync(trackerPath, stringifyCSV(starterHeaders, starterData));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(starterData));
        return;
      }
      const content = fs.readFileSync(trackerPath, 'utf-8');
      const rows = parseCSV(content);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/tracker' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const trackerPath = path.join(ROOT_DIR, 'job_search_tracker.csv');
        const headers = ['date', 'company', 'sector', 'role', 'role_type', 'channel', 'status', 'contact_person', 'fit_rating', 'notes', 'cv_file', 'cover_letter_file', 'source', 'deadline'];
        
        let rows = [];
        if (fs.existsSync(trackerPath)) {
          rows = parseCSV(fs.readFileSync(trackerPath, 'utf-8'));
        }
        
        if (Array.isArray(payload)) {
          // Replace all rows
          rows = payload;
        } else if (payload.action === 'delete') {
          rows = rows.filter(r => !(r.company === payload.company && r.role === payload.role));
        } else {
          // Update or insert
          const existingIdx = rows.findIndex(r => r.company === payload.company && r.role === payload.role);
          if (existingIdx >= 0) {
            rows[existingIdx] = { ...rows[existingIdx], ...payload };
          } else {
            rows.unshift({
              date: payload.date || new Date().toISOString().split('T')[0],
              company: payload.company || 'Unknown',
              sector: payload.sector || 'Tech',
              role: payload.role || 'Senior Engineer',
              role_type: payload.role_type || 'Full-time',
              channel: payload.channel || 'Direct',
              status: payload.status || 'drafted',
              contact_person: payload.contact_person || '',
              fit_rating: payload.fit_rating || '85',
              notes: payload.notes || '',
              cv_file: payload.cv_file || '',
              cover_letter_file: payload.cover_letter_file || '',
              source: payload.source || '',
              deadline: payload.deadline || ''
            });
          }
        }
        
        fs.writeFileSync(trackerPath, stringifyCSV(headers, rows));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: rows.length, data: rows }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Live Scraper Endpoint
  if (pathname === '/api/search' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { query = 'Senior Full Stack Engineer', location = 'Remote', portal = 'freehire', limit = 10 } = JSON.parse(body || '{}');
        
        let cmd = 'bun';
        let args = [];
        
        if (portal === 'linkedin') {
          args = ['run', path.join(ROOT_DIR, '.agents/skills/linkedin-search/cli/src/cli.ts'), 'search', '-q', query, '-l', location, '--limit', String(limit)];
        } else {
          // Default freehire
          args = ['run', path.join(ROOT_DIR, '.agents/skills/freehire-search/cli/src/cli.ts'), 'search', '-q', query, '--limit', String(limit)];
        }

        const child = spawn(cmd, args, {
          cwd: ROOT_DIR,
          env: { ...process.env, PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}` }
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (d) => { stdout += d.toString(); });
        child.stderr.on('data', (d) => { stderr += d.toString(); });

        child.on('close', (code) => {
          if (code !== 0 && !stdout) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: stderr || `Process exited with code ${code}` }));
            return;
          }
          try {
            const data = JSON.parse(stdout);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } catch (pe) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ raw: stdout, results: [] }));
          }
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Fit Evaluator Endpoint
  if (pathname === '/api/evaluate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { title = '', company = '', description = '' } = JSON.parse(body || '{}');
        const text = `${title} ${description}`.toLowerCase();
        
        // Comprehensive scoring engine against Hassaan Nasir's profile
        const techKeywords = {
          'python': 10, 'django': 10, 'drf': 8, 'rest': 6, 'postgresql': 10, 'postgres': 10,
          'react': 9, 'next.js': 10, 'nextjs': 10, 'typescript': 10, 'javascript': 6,
          'celery': 9, 'redis': 8, 'fastapi': 8, 'docker': 8, 'kubernetes': 8, 'aws': 9,
          'ai': 9, 'llm': 9, 'claude': 10, 'openai': 9, 'langchain': 9, 'langgraph': 9,
          'mcp': 10, 'observability': 7, 'sentry': 8, 'datadog': 8, 'grafana': 7,
          'microservices': 8, 'ci/cd': 7, 'pytest': 7, 'jest': 7, 'cypress': 7
        };

        let matchedTech = [];
        let missingTech = [];
        let techPoints = 0;
        let totalPossibleTech = 0;

        for (const [kw, pts] of Object.entries(techKeywords)) {
          if (text.includes(kw)) {
            matchedTech.push(kw);
            techPoints += pts;
          }
        }

        // Normalize tech score (60 - 98 scale for reasonable matches)
        let techScore = Math.min(98, Math.max(50, Math.round(55 + (matchedTech.length * 3.5))));
        
        // Experience / Seniority match
        let expScore = 88;
        if (text.includes('senior') || text.includes('lead') || text.includes('staff') || text.includes('architect') || text.includes('5+') || text.includes('8+')) {
          expScore = 95;
        } else if (text.includes('principal')) {
          expScore = 88;
        } else if (text.includes('junior') || text.includes('entry')) {
          expScore = 65;
        }

        // Behavioral & Culture match
        let behavioralScore = 92;
        if (text.includes('ownership') || text.includes('distributed') || text.includes('autonomous') || text.includes('scale') || text.includes('mentor')) {
          behavioralScore = 96;
        }

        // Location & Remote match
        let locationScore = 95;
        let isRemote = text.includes('remote') || text.includes('anywhere') || text.includes('worldwide') || text.includes('work from home');
        let isUAE = text.includes('dubai') || text.includes('uae') || text.includes('abu dhabi');
        let isPakistan = text.includes('pakistan') || text.includes('lahore') || text.includes('karachi') || text.includes('islamabad');
        let isVisa = text.includes('visa') || text.includes('sponsor') || text.includes('relocation');

        if (!isRemote && !isUAE && !isPakistan && !isVisa) {
          locationScore = 70; // requires investigation
        }

        // Career alignment
        let careerScore = Math.round((techScore * 0.5) + (expScore * 0.3) + 18);
        careerScore = Math.min(97, Math.max(60, careerScore));

        // Overall weighted average
        const overallScore = Math.round((techScore * 0.35) + (expScore * 0.25) + (behavioralScore * 0.15) + (locationScore * 0.10) + (careerScore * 0.15));

        let verdict = 'Strong Fit';
        if (overallScore < 70) verdict = 'Moderate Fit';
        else if (overallScore < 80) verdict = 'Good Fit';
        else if (overallScore >= 90) verdict = 'Exceptional Match';

        const strengths = [
          `Direct 8+ years alignment with ${matchedTech.slice(0, 5).join(', ').toUpperCase() || 'Full Stack & Backend'} architecture`,
          'Proven record of high performance (38% API speedup, 55% task completion speedup)',
          'Extensive experience with AI workflows, Claude Code, and autonomous tooling'
        ];

        const suggestions = [
          'Highlight PostgreSQL optimization and query indexing metrics in the custom CV',
          'Emphasize asynchronous pipelines (Celery/Redis) and distributed microservices',
          'Mention Anthropic MCP & Claude Code certification in the opening elevator pitch'
        ];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          overallScore,
          verdict,
          breakdown: {
            technical: techScore,
            experience: expScore,
            behavioral: behavioralScore,
            location: locationScore,
            career: careerScore
          },
          matchedKeywords: matchedTech,
          strengths,
          suggestions
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Security sandbox: don't allow directory traversal outside dashboard/ and root assets
  if (!filePath.startsWith(__dirname) && !filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const fileContent = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileContent);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`AI Job Search Dashboard running at http://localhost:${PORT}`);
});
