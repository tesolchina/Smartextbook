import { type StoredLesson } from "@/hooks/use-lessons-store";
import { type TutorConfig } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateLessonHtml(lesson: StoredLesson, tutor: TutorConfig): string {
  const escapedLesson = JSON.stringify(lesson).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  const escapedTutor = JSON.stringify(tutor).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(lesson.title)} — SmartTextbook</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#faf9f7;--card:#fff;--border:#e8e4de;--text:#1a1714;--muted:#6b6560;--primary:#b84c2a;--accent:#c97b3a;--radius:14px;--font-serif:'Georgia',serif;--font-sans:system-ui,-apple-system,sans-serif}
body{font-family:var(--font-sans);background:var(--bg);color:var(--text);min-height:100vh;line-height:1.6}
h1,h2,h3{font-family:var(--font-serif)}
button{cursor:pointer;font-family:inherit}
input,textarea,select{font-family:inherit}
a{color:var(--primary);text-decoration:none}
#setup{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem}
#app{display:none;flex-direction:column;height:100vh}
header{background:var(--card);border-bottom:1px solid var(--border);padding:.9rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-shrink:0}
header h1{font-size:1.1rem;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%}
.main-row{flex:1;display:flex;overflow:hidden;min-height:0}
.content-pane{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.tabs{display:flex;gap:2px;padding:.5rem .75rem 0;background:var(--card);border-bottom:1px solid var(--border);flex-shrink:0}
.tab{display:flex;align-items:center;gap:.4rem;padding:.5rem .75rem;font-size:.8rem;font-weight:600;color:var(--muted);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:color .15s;white-space:nowrap}
.tab.active{color:var(--primary);border-bottom-color:var(--primary)}
.tab:hover:not(.active){color:var(--text)}
.tab-content{flex:1;overflow-y:auto;padding:1.25rem}
.panel{display:none;max-width:860px;margin:0 auto}.panel.active{display:block}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem}
.section-title{font-family:var(--font-serif);font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:.75rem;padding-bottom:.5rem;border-bottom:1px solid var(--border)}
.concepts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:.65rem}
.concept{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.85rem}
.concept strong{display:block;font-size:.85rem;margin-bottom:.25rem;color:var(--text)}
.concept p{font-size:.8rem;color:var(--muted);margin:0;line-height:1.5}
.quiz-q{margin-bottom:1.25rem}.quiz-q p{font-size:.9rem;font-weight:600;margin-bottom:.6rem}
.option{display:flex;align-items:center;gap:.6rem;padding:.6rem .8rem;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;transition:all .15s;font-size:.85rem;margin-bottom:.4rem;background:var(--card)}
.option:hover:not(.disabled){border-color:var(--primary);background:#fdf6f4}
.option.correct{border-color:#22c55e;background:#f0fdf4;color:#166534}
.option.wrong{border-color:#ef4444;background:#fef2f2;color:#991b1b}
.option.disabled{cursor:default}
.explanation{font-size:.8rem;color:var(--muted);margin-top:.5rem;padding:.6rem .8rem;background:#f9f7f5;border-radius:8px;border-left:3px solid var(--accent)}
.quiz-score{text-align:center;padding:1.5rem;font-family:var(--font-serif);font-size:1.1rem;font-weight:700;color:var(--primary)}
.chapter-text{font-family:var(--font-serif);font-size:.92rem;line-height:1.9;white-space:pre-wrap;color:var(--text)}
.chat-pane{width:360px;flex-shrink:0;border-left:1px solid var(--border);display:flex;flex-direction:column;background:var(--card)}
@media(max-width:780px){.main-row{flex-direction:column}.chat-pane{width:100%;border-left:none;border-top:1px solid var(--border);height:42vh}}
.chat-header{padding:.75rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.6rem;flex-shrink:0}
.chat-avatar{width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0}
.chat-header-name{font-size:.85rem;font-weight:700}
.chat-header-sub{font-size:.7rem;color:var(--muted)}
.messages{flex:1;overflow-y:auto;padding:.75rem;display:flex;flex-direction:column;gap:.6rem}
.msg{max-width:88%;font-size:.82rem;line-height:1.55;padding:.55rem .75rem;border-radius:12px;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.msg.user{align-self:flex-end;background:var(--primary);color:#fff;border-bottom-right-radius:4px}
.msg.bot{align-self:flex-start;background:#f0ece8;color:var(--text);border-bottom-left-radius:4px}
.msg.bot p{margin:.2rem 0}.msg.bot strong{font-weight:700}.msg.bot ul,.msg.bot ol{margin:.3rem 0 .3rem 1.1rem}
.msg.typing{color:var(--muted)}
.chat-input-row{display:flex;gap:.5rem;padding:.65rem .75rem;border-top:1px solid var(--border);flex-shrink:0}
.chat-input{flex:1;border:1.5px solid var(--border);border-radius:10px;padding:.5rem .75rem;font-size:.82rem;resize:none;outline:none;transition:border-color .15s;background:var(--bg)}
.chat-input:focus{border-color:var(--primary)}
.send-btn{padding:.5rem .9rem;background:var(--primary);color:#fff;border:none;border-radius:10px;font-size:.8rem;font-weight:700;transition:opacity .15s}
.send-btn:disabled{opacity:.55}
.setup-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:2rem;width:100%;max-width:420px;box-shadow:0 8px 32px rgba(0,0,0,.08)}
.setup-card h2{font-family:var(--font-serif);font-size:1.4rem;font-weight:900;margin-bottom:.3rem}
.setup-card p{font-size:.85rem;color:var(--muted);margin-bottom:1.5rem}
.field{margin-bottom:1rem}
.field label{display:block;font-size:.8rem;font-weight:700;margin-bottom:.4rem}
.field input,.field select{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:.6rem .85rem;font-size:.85rem;outline:none;background:var(--bg);transition:border-color .15s;color:var(--text)}
.field input:focus,.field select:focus{border-color:var(--primary)}
.field small{display:block;font-size:.72rem;color:var(--muted);margin-top:.3rem}
.btn-primary{width:100%;padding:.75rem;background:var(--primary);color:#fff;border:none;border-radius:12px;font-size:.9rem;font-weight:700;margin-top:.5rem;transition:opacity .15s}
.btn-primary:hover{opacity:.9}
.btn-primary:disabled{opacity:.55}
.error-msg{font-size:.78rem;color:#dc2626;margin-top:.5rem;padding:.5rem .75rem;background:#fef2f2;border-radius:8px;display:none}
.key-btn{font-size:.75rem;font-weight:600;color:var(--muted);border:1px solid var(--border);background:var(--card);border-radius:8px;padding:.3rem .65rem;transition:color .15s}
.key-btn:hover{color:var(--primary)}
.msg.bot code{background:#e8e4de;padding:.1em .35em;border-radius:4px;font-size:.85em;font-family:monospace}
.mindmap-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.mindmap-label{font-size:.8rem;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:.4rem}
.regen-btn{font-size:.75rem;font-weight:600;color:var(--muted);border:1px solid var(--border);background:var(--card);border-radius:8px;padding:.3rem .7rem;transition:color .15s}
.regen-btn:hover:not(:disabled){color:var(--primary);border-color:var(--primary)}
.regen-btn:disabled{opacity:.5;cursor:default}
.mindmap-status{text-align:center;padding:4rem 1rem;color:var(--muted);font-size:.85rem}
.mindmap-status svg{display:block;margin:0 auto 1rem;opacity:.3}
.mindmap-diagram{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;overflow:auto}
.mindmap-diagram svg{width:100%;height:auto}
.mindmap-error{background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius);padding:1.25rem;color:#dc2626;font-size:.85rem;text-align:center}
.mm-spin{display:inline-block;animation:mmspin 1s linear infinite}
@keyframes mmspin{to{transform:rotate(360deg)}}
</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
</head>
<body>

<div id="setup">
  <div class="setup-card">
    <h2>🎓 ${escapeHtml(lesson.title)}</h2>
    <p>Enter your API key to unlock your AI tutor, <strong>${escapeHtml(tutor.name)}</strong>. Your key is stored only in this browser.</p>

    <div class="field">
      <label>Provider</label>
      <select id="setup-provider">
        <option value="openai|https://api.openai.com/v1">OpenAI</option>
        <option value="grok|https://api.x.ai/v1">Grok (xAI)</option>
        <option value="gemini|https://generativelanguage.googleapis.com/v1beta/openai/">Google Gemini</option>
        <option value="deepseek|https://api.deepseek.com/v1">DeepSeek</option>
        <option value="openrouter|https://openrouter.ai/api/v1">OpenRouter</option>
        <option value="mistral|https://api.mistral.ai/v1">Mistral AI</option>
        <option value="together|https://api.together.xyz/v1">Together AI</option>
        <option value="minimax|https://api.minimax.chat/v1">MiniMax</option>
        <option value="poe|https://api.poe.com/v1">Poe</option>
        <option value="kimi|https://api.moonshot.cn/v1">Kimi (Moonshot AI)</option>
        <option value="custom|">Custom (OpenAI-compatible)</option>
      </select>
    </div>

    <div class="field" id="custom-url-field" style="display:none">
      <label>Base URL</label>
      <input type="url" id="setup-base-url" placeholder="https://your-endpoint.com/v1" />
    </div>

    <div class="field">
      <label>API Key</label>
      <input type="password" id="setup-key" placeholder="Paste your API key here" autocomplete="off" />
    </div>

    <div class="field">
      <label>Model</label>
      <select id="setup-model-sel"></select>
      <input type="text" id="setup-model-txt" placeholder="Type model name…" autocomplete="off" style="display:none;margin-top:.5rem" />
      <small id="model-hint"></small>
    </div>

    <div class="error-msg" id="setup-error"></div>
    <button class="btn-primary" id="setup-btn">Start Learning</button>
    <p style="font-size:.7rem;color:var(--muted);margin-top:.85rem;text-align:center">
      Your key never leaves this browser. It is sent directly to your chosen provider.
    </p>
  </div>
</div>

<div id="app">
  <header>
    <h1>${escapeHtml(lesson.title)}</h1>
    <button class="key-btn" id="change-key-btn">⚙ Change key</button>
  </header>

  <div class="main-row">
    <div class="content-pane">
      <div class="tabs">
        <button class="tab active" data-tab="summary">📋 Summary</button>
        <button class="tab" data-tab="concepts">🔑 Concepts</button>
        <button class="tab" data-tab="quiz">✏️ Quiz</button>
        <button class="tab" data-tab="mindmap">🗺️ Mind Map</button>
        <button class="tab" data-tab="chapter">📖 Source</button>
      </div>
      <div class="tab-content">
        <div class="panel active" id="panel-summary">
          <div class="card">
            <div class="section-title">Summary</div>
            <div id="summary-text" style="font-size:.9rem;line-height:1.8"></div>
          </div>
        </div>

        <div class="panel" id="panel-concepts">
          <div class="section-title" style="margin-bottom:.75rem">Key Concepts</div>
          <div class="concepts-grid" id="concepts-grid"></div>
        </div>

        <div class="panel" id="panel-quiz">
          <div id="quiz-container"></div>
          <div class="quiz-score" id="quiz-score" style="display:none"></div>
        </div>

        <div class="panel" id="panel-mindmap">
          <div class="mindmap-toolbar">
            <span class="mindmap-label">&#x1F4CC; Concept Mind Map</span>
            <button class="regen-btn" id="mindmap-regen-btn" disabled>&#x21BB; Regenerate</button>
          </div>
          <div id="mindmap-body">
            <div class="mindmap-status" id="mindmap-idle">
              <p>Click the tab to generate a mind map. It will appear here after the first render.</p>
            </div>
          </div>
        </div>

        <div class="panel" id="panel-chapter">
          <div class="card">
            <div class="chapter-text" id="chapter-text"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-pane">
      <div class="chat-header">
        <div class="chat-avatar" id="chat-avatar"></div>
        <div>
          <div class="chat-header-name" id="chat-name"></div>
          <div class="chat-header-sub">AI Tutor</div>
        </div>
      </div>
      <div class="messages" id="messages">
        <div class="msg bot" id="welcome-msg"></div>
      </div>
      <div class="chat-input-row">
        <textarea class="chat-input" id="chat-input" placeholder="Ask a question…" rows="1"></textarea>
        <button class="send-btn" id="send-btn">Send</button>
      </div>
    </div>
  </div>
</div>

<script>
const LESSON = ${escapedLesson};
const TUTOR = ${escapedTutor};
const STORAGE_KEY = 'lb_key_${lesson.id}';

let chatHistory = [];
let apiKey = '', model = '', baseUrl = '', provider = '';

function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (s && s.key && s.model) {
      apiKey = s.key; model = s.model; baseUrl = s.baseUrl || ''; provider = s.provider || 'openai';
      return true;
    }
  } catch {}
  return false;
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ key: apiKey, model, baseUrl, provider }));
}

function boot() {
  if (loadSaved()) { showApp(); } else { showSetup(); }
}

function showSetup() {
  document.getElementById('setup').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function showApp() {
  document.getElementById('setup').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  renderLesson();
}

const providerSel = document.getElementById('setup-provider');
const customUrlField = document.getElementById('custom-url-field');
const setupBtn = document.getElementById('setup-btn');
const setupError = document.getElementById('setup-error');

const PROVIDER_MODELS = {
  openai: [
    { v: 'gpt-4o-mini',     l: 'GPT-4o Mini — fast & affordable (recommended)' },
    { v: 'gpt-4o',          l: 'GPT-4o — flagship' },
    { v: 'gpt-4.1-mini',    l: 'GPT-4.1 Mini' },
    { v: 'gpt-4.1',         l: 'GPT-4.1' },
    { v: 'gpt-4-turbo',     l: 'GPT-4 Turbo' },
    { v: 'o4-mini',         l: 'o4 Mini — reasoning' },
    { v: 'o3-mini',         l: 'o3 Mini — reasoning' },
  ],
  grok: [
    { v: 'grok-3-mini',     l: 'Grok 3 Mini — fast (recommended)' },
    { v: 'grok-3',          l: 'Grok 3' },
    { v: 'grok-2-1212',     l: 'Grok 2' },
  ],
  gemini: [
    { v: 'gemini-2.0-flash',               l: 'Gemini 2.0 Flash (recommended)' },
    { v: 'gemini-2.0-flash-lite',          l: 'Gemini 2.0 Flash Lite — fastest' },
    { v: 'gemini-2.5-pro-preview-03-25',   l: 'Gemini 2.5 Pro Preview' },
    { v: 'gemini-1.5-pro',                 l: 'Gemini 1.5 Pro' },
    { v: 'gemini-1.5-flash',               l: 'Gemini 1.5 Flash' },
  ],
  deepseek: [
    { v: 'deepseek-chat',      l: 'DeepSeek V3 (recommended)' },
    { v: 'deepseek-reasoner',  l: 'DeepSeek R1 — reasoning' },
  ],
  openrouter: [
    { v: 'openai/gpt-4o-mini',                            l: 'OpenAI GPT-4o Mini' },
    { v: 'anthropic/claude-3.5-haiku',                    l: 'Claude 3.5 Haiku' },
    { v: 'anthropic/claude-3.7-sonnet',                   l: 'Claude 3.7 Sonnet' },
    { v: 'google/gemini-2.0-flash-exp:free',              l: 'Gemini 2.0 Flash (free)' },
    { v: 'meta-llama/llama-3.3-70b-instruct',             l: 'Llama 3.3 70B' },
    { v: 'deepseek/deepseek-chat',                        l: 'DeepSeek V3' },
    { v: 'deepseek/deepseek-r1',                          l: 'DeepSeek R1 — reasoning' },
    { v: 'qwen/qwen-2.5-72b-instruct',                    l: 'Qwen 2.5 72B' },
    { v: 'mistralai/mistral-small-3.1-24b-instruct:free', l: 'Mistral Small 3.1 (free)' },
  ],
  mistral: [
    { v: 'mistral-small-latest',   l: 'Mistral Small (recommended)' },
    { v: 'mistral-medium-latest',  l: 'Mistral Medium' },
    { v: 'mistral-large-latest',   l: 'Mistral Large' },
    { v: 'open-mistral-nemo',      l: 'Mistral NeMo — open' },
  ],
  together: [
    { v: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',  l: 'Llama 3.3 70B Turbo (recommended)' },
    { v: 'meta-llama/Llama-3.1-8B-Instruct-Turbo',   l: 'Llama 3.1 8B Turbo — cheapest' },
    { v: 'Qwen/Qwen2.5-72B-Instruct-Turbo',          l: 'Qwen 2.5 72B Turbo' },
    { v: 'deepseek-ai/DeepSeek-V3',                  l: 'DeepSeek V3' },
    { v: 'mistralai/Mixtral-8x22B-Instruct-v0.1',    l: 'Mixtral 8x22B' },
  ],
  minimax: [
    { v: 'MiniMax-Text-01',  l: 'MiniMax Text-01 (recommended)' },
    { v: 'abab6.5s-chat',    l: 'abab6.5s Chat' },
  ],
  poe: [
    { v: 'Claude-3-Haiku',     l: 'Claude 3 Haiku' },
    { v: 'Claude-3.5-Sonnet',  l: 'Claude 3.5 Sonnet' },
    { v: 'GPT-4o-mini',        l: 'GPT-4o Mini' },
    { v: 'GPT-4o',             l: 'GPT-4o' },
    { v: 'Gemini-Flash',       l: 'Gemini Flash' },
    { v: 'Llama-3.1-405B',     l: 'Llama 3.1 405B' },
  ],
  kimi: [
    { v: 'moonshot-v1-8k',    l: 'Moonshot v1 8K (recommended)' },
    { v: 'moonshot-v1-32k',   l: 'Moonshot v1 32K' },
    { v: 'moonshot-v1-128k',  l: 'Moonshot v1 128K' },
  ],
};

const modelSel  = document.getElementById('setup-model-sel');
const modelTxt  = document.getElementById('setup-model-txt');
const modelHint = document.getElementById('model-hint');

function populateModels(prov) {
  const models = PROVIDER_MODELS[prov] || [];
  modelSel.innerHTML = '';
  if (prov === 'custom') {
    modelSel.style.display = 'none';
    modelTxt.style.display = 'block';
    modelTxt.placeholder = 'Type model name…';
    modelHint.textContent = 'Enter the exact model ID your endpoint accepts.';
    return;
  }
  modelSel.style.display = 'block';
  models.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.v; opt.textContent = m.l;
    modelSel.appendChild(opt);
  });
  const other = document.createElement('option');
  other.value = '__other__'; other.textContent = 'Other — type model name…';
  modelSel.appendChild(other);
  const isPoe = prov === 'poe';
  modelHint.textContent = isPoe
    ? 'Use the exact bot handle shown on poe.com — case-sensitive.'
    : 'Select a model, or choose "Other" to enter a custom name.';
  modelSel.dispatchEvent(new Event('change'));
}

modelSel.addEventListener('change', () => {
  const isOther = modelSel.value === '__other__';
  modelTxt.style.display = isOther ? 'block' : 'none';
  if (isOther) { modelTxt.focus(); }
});

providerSel.addEventListener('change', () => {
  const prov = providerSel.value.split('|')[0];
  customUrlField.style.display = prov === 'custom' ? 'block' : 'none';
  populateModels(prov);
});

populateModels('openai');

function getModelValue() {
  if (modelSel.style.display === 'none') return modelTxt.value.trim();
  if (modelSel.value === '__other__') return modelTxt.value.trim();
  return modelSel.value;
}

setupBtn.addEventListener('click', async () => {
  const key = document.getElementById('setup-key').value.trim();
  const mdl = getModelValue();
  const [prov, pUrl] = providerSel.value.split('|');
  const bUrl = prov === 'custom' ? document.getElementById('setup-base-url').value.trim() : pUrl;

  if (!key) { showError('Please enter your API key.'); return; }
  if (!mdl) { showError('Please select or enter a model name.'); return; }
  if (prov === 'custom' && !bUrl) { showError('Enter a base URL for custom provider.'); return; }

  setupError.style.display = 'none';
  setupBtn.textContent = 'Verifying…'; setupBtn.disabled = true;

  const ok = await testKey(key, mdl, bUrl, prov);
  if (ok === true) {
    apiKey = key; model = mdl; baseUrl = bUrl; provider = prov;
    saveSettings(); showApp();
  } else {
    showError(ok || 'Connection failed. Check your key and model name.');
    setupBtn.textContent = 'Start Learning'; setupBtn.disabled = false;
  }
});

function showError(msg) {
  setupError.textContent = msg; setupError.style.display = 'block';
}

async function testKey(key, mdl, bUrl, prov) {
  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key };
    if (prov === 'openrouter') { headers['HTTP-Referer'] = 'https://smartextbook.replit.com'; headers['X-Title'] = 'SmartTextbook'; }
    const res = await fetch(bUrl + '/chat/completions', {
      method: 'POST', headers,
      body: JSON.stringify({ model: mdl, messages: [{ role: 'user', content: 'Say OK.' }], max_tokens: 5 })
    });
    if (res.ok) return true;
    const data = await res.json().catch(() => ({}));
    return data?.error?.message || 'HTTP ' + res.status;
  } catch(e) { return e.message; }
}

document.getElementById('change-key-btn').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY); showSetup();
});

function renderLesson() {
  document.getElementById('summary-text').innerHTML = simpleMarkdown(LESSON.summary || 'No summary available.');

  const grid = document.getElementById('concepts-grid');
  grid.innerHTML = '';
  (LESSON.keyConcepts || []).forEach(c => {
    const el = document.createElement('div');
    el.className = 'concept';
    el.innerHTML = '<strong>' + escHtml(c.term) + '</strong><p>' + escHtml(c.definition) + '</p>';
    grid.appendChild(el);
  });

  renderQuiz();
  document.getElementById('chapter-text').textContent = LESSON.chapterText || '';

  const initials = TUTOR.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('chat-avatar').textContent = initials;
  document.getElementById('chat-name').textContent = TUTOR.name;
  document.getElementById('welcome-msg').innerHTML = simpleMarkdown(
    'Hi! I\'m **' + TUTOR.name + '**, your AI tutor for this lesson. Ask me anything about *' + LESSON.title + '*!'
  );
}

function renderQuiz() {
  const qs = LESSON.quizQuestions || [];
  const container = document.getElementById('quiz-container');
  if (!qs.length) { container.innerHTML = '<p style="color:var(--muted);font-size:.85rem">No quiz questions available.</p>'; return; }

  let answered = 0, correct = 0;
  container.innerHTML = '';

  qs.forEach((q, qi) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-q';
    const qText = document.createElement('p');
    qText.textContent = (qi + 1) + '. ' + q.question;
    qDiv.appendChild(qText);

    q.options.forEach((opt, oi) => {
      const btn = document.createElement('div');
      btn.className = 'option';
      btn.textContent = opt;
      btn.dataset.qi = qi; btn.dataset.oi = oi;
      btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled')) return;
        qDiv.querySelectorAll('.option').forEach(b => b.classList.add('disabled'));
        if (oi === q.correctIndex) { btn.classList.add('correct'); correct++; }
        else { btn.classList.add('wrong'); qDiv.querySelectorAll('.option')[q.correctIndex].classList.add('correct'); }
        answered++;
        const exp = document.createElement('div');
        exp.className = 'explanation';
        exp.textContent = q.explanation;
        qDiv.appendChild(exp);
        if (answered === qs.length) {
          const score = document.getElementById('quiz-score');
          score.style.display = 'block';
          const pct = Math.round(correct / qs.length * 100);
          score.textContent = correct + ' / ' + qs.length + ' correct (' + pct + '%)' + (pct === 100 ? ' 🎉' : pct >= 70 ? ' 👍' : ' — keep studying!');
        }
      });
      qDiv.appendChild(btn);
    });
    container.appendChild(qDiv);
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'mindmap') onMindmapTabActivated();
  });
});

let mmGenerated = false, mmGenerating = false, mmId = 0;

function mmSetBody(html) { document.getElementById('mindmap-body').innerHTML = html; }

async function generateMindmap() {
  if (mmGenerating) return;
  mmGenerating = true;
  const regenBtn = document.getElementById('mindmap-regen-btn');
  regenBtn.disabled = true;
  mmSetBody('<div class="mindmap-status"><span class="mm-spin">&#9696;</span><br>Generating mind map…</div>');

  const concepts = (LESSON.keyConcepts || []).slice(0, 12);
  const conceptList = concepts.map(c => '- ' + c.term + ': ' + c.definition).join('\\n');
  const title = LESSON.title.slice(0, 40);

  const prompt = \`You are an expert educational content creator. Create a Mermaid mindmap diagram.

Lesson title: \${LESSON.title}

Summary:
\${(LESSON.summary || '').slice(0, 1500)}

Key concepts:
\${conceptList}

Return ONLY valid Mermaid mindmap syntax — no markdown fences, no explanation, no other text.
The output must start with the word "mindmap" on the first line.

Use this structure:
mindmap
  root(\${title})
    ConceptA
      Sub-idea 1
      Sub-idea 2
    ConceptB
      Sub-idea 1

Rules:
- The root node is the lesson title (keep it short, under 40 chars).
- Add one branch per major concept (use the term as the branch label).
- Each branch may have 1-3 sub-ideas.
- Use no more than 8 top-level branches.
- Do NOT use parentheses or special Mermaid node shapes — plain text labels only.
- Return ONLY the Mermaid mindmap block, nothing else.\`;

  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
    if (provider === 'openrouter') { headers['HTTP-Referer'] = 'https://smartextbook.replit.com'; headers['X-Title'] = 'SmartTextbook'; }

    const res = await fetch(baseUrl + '/chat/completions', {
      method: 'POST', headers,
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], stream: false })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'HTTP ' + res.status);

    let mermaidText = data.choices?.[0]?.message?.content || '';
    mermaidText = mermaidText.replace(/^\`\`\`(?:mermaid)?\\s*/i, '').replace(/\\s*\`\`\`\\s*$/, '').trim();
    if (!mermaidText.toLowerCase().startsWith('mindmap')) {
      const m = mermaidText.match(/mindmap[\\s\\S]*/i);
      mermaidText = m ? m[0].trim() : null;
    }
    if (!mermaidText) throw new Error('AI did not return a valid mind map. Try regenerating.');

    await renderMermaid(mermaidText);
    mmGenerated = true;
  } catch(e) {
    mmSetBody('<div class="mindmap-error">⚠️ ' + escHtml(e.message) + '<br><br><button class="regen-btn" onclick="generateMindmap()">↻ Try again</button></div>');
  }

  mmGenerating = false;
  regenBtn.disabled = false;
}

async function renderMermaid(text) {
  const id = 'mm' + (++mmId);
  try {
    mermaid.initialize({ startOnLoad: false, theme: 'default', fontFamily: 'Georgia, serif', fontSize: 14 });
    const { svg } = await mermaid.render(id, text);
    const wrapper = document.createElement('div');
    wrapper.className = 'mindmap-diagram';
    wrapper.innerHTML = svg;
    const svgEl = wrapper.querySelector('svg');
    if (svgEl) { svgEl.style.width = '100%'; svgEl.removeAttribute('height'); }
    document.getElementById('mindmap-body').innerHTML = '';
    document.getElementById('mindmap-body').appendChild(wrapper);
  } catch(e) {
    throw new Error('Could not render diagram: ' + (e.message || 'invalid Mermaid syntax') + '. Try regenerating.');
  }
}

function onMindmapTabActivated() {
  if (!mmGenerated && !mmGenerating) generateMindmap();
}

document.getElementById('mindmap-regen-btn').addEventListener('click', generateMindmap);

const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const messagesEl = document.getElementById('messages');

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 96) + 'px';
});
sendBtn.addEventListener('click', sendMessage);

function appendMsg(role, html) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML = html;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || sendBtn.disabled) return;
  input.value = ''; input.style.height = 'auto';
  sendBtn.disabled = true;

  appendMsg('user', escHtml(text));
  chatHistory.push({ role: 'user', content: text });
  const typing = appendMsg('bot typing', '…');

  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
    if (provider === 'openrouter') { headers['HTTP-Referer'] = 'https://smartextbook.replit.com'; headers['X-Title'] = 'SmartTextbook'; }

    const messages = [
      { role: 'system', content: TUTOR.systemPrompt },
      ...chatHistory.slice(-12).map(h => ({ role: h.role, content: h.content }))
    ];

    const res = await fetch(baseUrl + '/chat/completions', {
      method: 'POST', headers,
      body: JSON.stringify({ model, messages, stream: false })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'HTTP ' + res.status);

    const reply = data.choices?.[0]?.message?.content || '(no response)';
    chatHistory.push({ role: 'assistant', content: reply });
    typing.className = 'msg bot';
    typing.innerHTML = simpleMarkdown(reply);
  } catch(e) {
    typing.className = 'msg bot';
    typing.innerHTML = '<span style="color:#dc2626">Error: ' + escHtml(e.message) + '</span>';
  }
  sendBtn.disabled = false;
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function simpleMarkdown(text) {
  return escHtml(text)
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
    .replace(/\`(.+?)\`/g, '<code>$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>')
    .replace(/^[-*] (.+)$/gm, '• $1')
    .replace(/\\n\\n/g, '</p><p>')
    .replace(/\\n/g, '<br>');
}

boot();
</script>
</body>
</html>`;
}
