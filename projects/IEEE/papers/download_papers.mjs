/**
 * Download PDFs for literature review papers.
 * Strategy: OpenAlex (OA) → Unpaywall → Sci-Hub
 * Saves PDFs to the same folder as this script.
 * Run: node projects/IEEE/papers/download_papers.mjs
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = __dirname;
const LOG_FILE  = path.join(OUT_DIR, 'download_log.json');
const MAILTO    = 'research@hkbu.edu.hk';
const SCIHUB    = 'https://sci-hub.st';

const PAPERS = [
  // Vibe Coding / Natural Language Programming
  { key: 'subramonyam2023johnny',  doi: '10.1145/3544548.3581388',               title: 'Why Johnny Can\'t Prompt (CHI 2023)' },
  { key: 'sarkar2022programming',  doi: '10.48550/arxiv.2208.06213',             title: 'What is it like to program with AI?' },
  { key: 'salleh2025vibecoding',   doi: '10.36227/techrxiv.174681482.27435614/v1', title: 'A Review on Vibe Coding (2025)' },
  { key: 'abubakar2025vibe',       doi: '10.48550/arxiv.2509.10652',             title: 'Vibe Coding for Product Design' },
  { key: 'sarkar2025vibecoding2',  doi: '10.48550/arxiv.2506.23253',             title: 'Vibe coding: programming through conversation with AI' },

  // Computational Thinking + Language Education
  { key: 'giannakos2024ct',        doi: '10.1007/s10639-024-12522-4',            title: 'CT integrated into English language curriculum' },
  { key: 'su2023tracking',         doi: '10.3390/su15031983',                    title: 'Tracking Visual Programming for CT' },
  { key: 'wing2006ct',             doi: '10.1145/1118178.1118215',               title: 'Wing 2006 Computational Thinking (CACM)' },

  // Learnersourcing
  { key: 'kim2022learnersourcing', doi: '10.1145/3491140.3528286',               title: 'Learnersourcing: Student-generated Content @ Scale' },
  { key: 'liu2024llm',             doi: '10.1007/s10639-024-12851-4',            title: 'LLM evaluate learnersourcing quality' },
  { key: 'moore2022gpt3',          doi: '10.1007/978-3-031-16290-9_18',          title: 'Student-generated SAQ quality via GPT-3' },

  // AI Assessment
  { key: 'yavuz2025llm',           doi: '10.1111/bjet.13548',                    title: 'Yavuz 2025 LLM EFL essay grading (BJET)' },

  // ProComm / IEEE TPC
  { key: 'leydens2009listening',   doi: '10.1109/TPC.2009.2013312',              title: 'Leydens & Lucena 2009 Listening (IEEE TPC)' },
];

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function fetchUrl(url, timeout = 25000) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0',
        'Accept': 'application/pdf,text/html,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout,
    };
    try {
      const req = mod.get(url, opts, (res) => {
        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          fetchUrl(res.headers.location, timeout).then(resolve);
          return;
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', () => resolve(null));
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch { resolve(null); }
  });
}

function fetchJson(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const opts = { headers: { 'Accept': 'application/json', 'User-Agent': `mailto:${MAILTO}` }, timeout: 15000 };
    try {
      mod.get(url, opts, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch { resolve(null); }
        });
        res.on('error', () => resolve(null));
      }).on('error', () => resolve(null));
    } catch { resolve(null); }
  });
}

function isPdf(buf) {
  return buf && buf.length > 4 && buf.slice(0, 4).toString() === '%PDF';
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Source strategies ─────────────────────────────────────────────────────────

async function tryOpenAlex(doi) {
  const enc = encodeURIComponent(doi);
  const data = await fetchJson(`https://api.openalex.org/works/https://doi.org/${enc}?mailto=${MAILTO}`);
  if (!data) return '';
  const oa = data.open_access || {};
  if (oa.oa_url) return oa.oa_url;
  const best = data.best_oa_location || {};
  return best.pdf_url || best.url || '';
}

async function tryUnpaywall(doi) {
  const enc = encodeURIComponent(doi);
  const data = await fetchJson(`https://api.unpaywall.org/v2/${enc}?email=${MAILTO}`);
  if (!data || !data.is_oa) return '';
  const best = data.best_oa_location || {};
  return best.url_for_pdf || best.url || '';
}

async function tryScihub(doi) {
  const url = `${SCIHUB}/${encodeURIComponent(doi)}`;
  const buf = await fetchUrl(url);
  if (!buf) return '';
  const html = buf.toString('utf8', 0, 50000);
  // Look for PDF embed/iframe/citation_pdf_url
  const patterns = [
    /embed[^>]+src=["']([^"']+\.pdf[^"']*)/i,
    /citation_pdf_url["'\s:]+([^\s"'<>\)]+)/i,
    /iframe[^>]+src=["'](https?:[^"']+\.pdf[^"']*)/i,
    /(https?:\/\/[^\s"'<>]+\.pdf)/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      let u = m[1];
      if (u.startsWith('//')) u = 'https:' + u;
      else if (u.startsWith('/')) u = SCIHUB + u;
      return u;
    }
  }
  // If the response itself is a PDF
  if (isPdf(buf)) return url;
  return '';
}

// ── Main ─────────────────────────────────────────────────────────────────────

function loadLog() {
  try { return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch { return {}; }
}
function saveLog(log) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

async function main() {
  const log = loadLog();
  let downloaded = 0, skipped = 0, failed = 0;

  console.log(`Output folder: ${OUT_DIR}`);
  console.log(`Papers to process: ${PAPERS.length}\n`);

  for (const p of PAPERS) {
    const { key, doi, title } = p;
    const dest = path.join(OUT_DIR, `${key}.pdf`);

    console.log(`[${key}]`);
    console.log(`  ${title.slice(0, 70)}`);

    if (fs.existsSync(dest)) {
      console.log(`  ✓ already downloaded — skip\n`);
      skipped++;
      continue;
    }
    if (log[doi]?.status === 'not-found') {
      console.log(`  – previously not found — skip\n`);
      skipped++;
      continue;
    }

    let pdfBuf = null;
    let source = '';

    // 1. OpenAlex
    const oaUrl = await tryOpenAlex(doi);
    if (oaUrl) {
      process.stdout.write(`  → OpenAlex: ${oaUrl.slice(0, 65)}...\n`);
      pdfBuf = await fetchUrl(oaUrl);
      if (isPdf(pdfBuf)) source = 'OpenAlex';
      else pdfBuf = null;
    }
    await sleep(300);

    // 2. Unpaywall
    if (!pdfBuf) {
      const upUrl = await tryUnpaywall(doi);
      if (upUrl) {
        process.stdout.write(`  → Unpaywall: ${upUrl.slice(0, 65)}...\n`);
        pdfBuf = await fetchUrl(upUrl);
        if (isPdf(pdfBuf)) source = 'Unpaywall';
        else pdfBuf = null;
      }
      await sleep(300);
    }

    // 3. Sci-Hub
    if (!pdfBuf) {
      process.stdout.write(`  → Sci-Hub (${SCIHUB})...\n`);
      const shUrl = await tryScihub(doi);
      if (shUrl) {
        process.stdout.write(`     ${shUrl.slice(0, 70)}...\n`);
        pdfBuf = await fetchUrl(shUrl);
        if (isPdf(pdfBuf)) source = 'Sci-Hub';
        else pdfBuf = null;
      }
      await sleep(2500);
    }

    if (pdfBuf && isPdf(pdfBuf)) {
      fs.writeFileSync(dest, pdfBuf);
      log[doi] = { status: 'ok', source, file: `${key}.pdf`, size_kb: Math.round(pdfBuf.length / 1024) };
      saveLog(log);
      console.log(`  ✅ ${key}.pdf  (${Math.round(pdfBuf.length / 1024)}KB) [${source}]\n`);
      downloaded++;
    } else {
      log[doi] = { status: 'not-found' };
      saveLog(log);
      console.log(`  ❌ not available\n`);
      failed++;
    }
  }

  console.log('='.repeat(50));
  console.log(`Downloaded:   ${downloaded}`);
  console.log(`Skipped:      ${skipped}`);
  console.log(`Not found:    ${failed}`);
  console.log(`Folder:       ${OUT_DIR}`);
}

main().catch(console.error);
