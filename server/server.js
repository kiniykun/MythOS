'use strict';
/* MythOS server. No dependencies, Node 18+.
   - Accounts: Microsoft (Azure / Entra ID) only. The OS signs in with Microsoft, then hands the server its Microsoft access token.
     The server checks that token with Microsoft Graph (/me) and gives back its own session token. No passwords are ever stored here.
   - Sessions: random tokens (only a SHA-256 of each token is stored)
   - Also serves the MythOS files from the folder above, so everything is same-origin. */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1';          // use HOST=0.0.0.0 only behind HTTPS
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(__dirname, 'public');
const DATA = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
fs.mkdirSync(DATA, { recursive: true });
const UF = path.join(DATA, 'users.json'), SF = path.join(DATA, 'sessions.json');
const DAY = 864e5, SESSION_MS = 30 * DAY;

function load(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function save(f, o) { const t = f + '.tmp'; fs.writeFileSync(t, JSON.stringify(o), { mode: 0o600 }); fs.renameSync(t, f); }
let users = load(UF, {}), sessions = load(SF, {});
(function prune() { const n = Date.now(); for (const k in sessions) if (sessions[k].exp < n) delete sessions[k]; save(SF, sessions); })();

const sha = t => crypto.createHash('sha256').update(t).digest('hex');

/* ---- tiny rate limiter ---- */
const hits = new Map();
function limited(key, max, ms) {
  const n = Date.now(), r = hits.get(key);
  if (!r || n - r.t > ms) { hits.set(key, { n: 0, t: n }); return false; }
  return r.n >= max;
}
function hit(key) { const r = hits.get(key); if (r) r.n++; }
setInterval(() => { const n = Date.now(); for (const [k, r] of hits) if (n - r.t > 36e5) hits.delete(k); }, 6e5).unref();

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
function clean(s, n) { return String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, n); }
function ip(req) { return req.socket.remoteAddress || 'x'; }

function send(res, code, obj, extra) {
  const b = JSON.stringify(obj);
  res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Admin-Key', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' }, extra));
  res.end(b);
}
function body(req, max) {
  return new Promise((ok, bad) => {
    let d = '', n = 0; max = max || 10240;
    req.on('data', c => { n += c.length; if (n > max) { bad(new Error('too big')); req.destroy(); } else d += c; });
    req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch (e) { bad(new Error('bad json')); } });
    req.on('error', bad);
  });
}
function authed(req) {
  const m = /^Bearer ([0-9a-f]{64})$/.exec(req.headers.authorization || ''); if (!m) return null;
  const s = sessions[sha(m[1])]; if (!s || s.exp < Date.now() || !users[s.email]) return null;
  return { user: users[s.email], key: sha(m[1]) };
}
function newSession(email) {
  const t = crypto.randomBytes(32).toString('hex'); sessions[sha(t)] = { email, exp: Date.now() + SESSION_MS }; save(SF, sessions); return t;
}
/* ---- MythOS Servers: chat servers people create and use together ---- */
const XF = path.join(DATA, 'servers.json');
let servers = load(XF, null);
if (!servers) { servers = { s_lounge: { id: 's_lounge', name: 'MythOS Lounge', owner: '', ownerName: 'MythOS', created: new Date().toISOString(), next: 2, messages: [{ id: 1, t: Date.now(), u: 'MythOS', text: 'Welcome to the MythOS Lounge! Say hi, or create your own server on the left.' }] } }; }
let xDirty = false; function saveServers() { xDirty = true; }
setInterval(() => { if (xDirty) { xDirty = false; try { save(XF, servers); } catch (e) {} } }, 1500).unref();
process.on('SIGINT', () => { try { save(XF, servers); } catch (e) {} process.exit(0); });
process.on('SIGTERM', () => { try { save(XF, servers); } catch (e) {} process.exit(0); });
const STARTED = Date.now(); let reqCount = 0;
const sinfo = (s, me) => ({ mine: !!me && s.owner === me.email, id: s.id, name: s.name, ownerName: s.ownerName, created: s.created, count: s.messages.length, last: s.messages.length ? s.messages[s.messages.length - 1].t : 0 });
const pub = u => ({ name: u.name, email: u.email, created: u.created });
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);   // optional: only these Microsoft accounts may sign in
const ALLOWED_TENANT = (process.env.ALLOWED_TENANT || '').trim().toLowerCase();                                    // optional: only accounts from this Azure tenant ID


/* ---- usage info: your own MythOS sessions send what you use so future updates can be built from it ---- */
const TF = path.join(DATA, 'usage.jsonl'), ADMIN_KEY = process.env.ADMIN_KEY || '';
const tHits = new Map(), COLLECT = process.env.COLLECT_USAGE !== '0';   // COLLECT_USAGE=0 makes this server store nothing
function tOk(ip) { const n = Date.now(), a = (tHits.get(ip) || []).filter(x => n - x < 60000); a.push(n); tHits.set(ip, a); return a.length <= 60; }
function clip(v, n) { return String(v == null ? '' : v).slice(0, n); }
function isAdmin(req) { return ADMIN_KEY ? req.headers['x-admin-key'] === ADMIN_KEY : !!authed(req); }
function readUsage() { try { return fs.readFileSync(TF, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean); } catch (e) { return []; } }
async function telemetry(req, res, p) {
  if (req.method === 'POST' && p === '/api/telemetry') {
    if (!COLLECT) { req.resume(); return send(res, 200, { ok: true, n: 0, off: true }); }
    if (!tOk(req.socket.remoteAddress || 'x')) return send(res, 429, { error: 'Slow down.' });
    let b; try { b = await body(req, 40960); } catch (e) { return send(res, 400, { error: 'Bad request.' }); }
    const a = authed(req), who = a ? a.user.email : 'anon', sid = clip(b.sid, 40), ctx = b.ctx && typeof b.ctx === 'object' ? JSON.parse(JSON.stringify(b.ctx, (k, v) => typeof v === 'string' ? v.slice(0, 120) : v)) : null;
    const evs = (Array.isArray(b.events) ? b.events : []).slice(0, 40).map(e => ({ t: +e.t || Date.now(), who, sid, ev: clip(e.ev, 40), d: clip(JSON.stringify(e.d || {}), 500), ctx: e.ev === 'session' ? ctx : undefined }));
    if (evs.length) {
      try { if (fs.existsSync(TF) && fs.statSync(TF).size > 20e6) fs.renameSync(TF, TF + '.old'); fs.appendFileSync(TF, evs.map(e => JSON.stringify(e)).join('\n') + '\n', { mode: 0o600 }); } catch (e) { return send(res, 500, { error: 'Couldn’t save.' }); }
    }
    return send(res, 200, { ok: true, n: evs.length });
  }
  if (req.method === 'GET' && p === '/api/insights') {
    if (!isAdmin(req)) return send(res, 401, { error: ADMIN_KEY ? 'Wrong admin key.' : 'Sign in first.' });
    const all = readUsage(), cnt = (f) => { const m = {}; all.forEach(e => { const k = f(e); if (k) m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((x, y) => y[1] - x[1]).slice(0, 25); };
    const dj = e => { try { return JSON.parse(e.d); } catch (x) { return {}; } };
    return send(res, 200, { total: all.length, sessions: new Set(all.map(e => e.sid)).size, since: all[0] ? all[0].t : null,
      apps: cnt(e => e.ev === 'app_open' && dj(e).id), quality: cnt(e => e.ev === 'quality' && (dj(e).q + ' · ' + dj(e).app)), uploads: cnt(e => e.ev === 'upload' && dj(e).ext),
      settings: cnt(e => e.ev === 'setting' && dj(e).k), errors: all.filter(e => e.ev === 'error').slice(-30).reverse().map(e => ({ t: e.t, d: dj(e) })), recent: all.slice(-100).reverse().map(e => ({ t: e.t, ev: e.ev, d: dj(e) })) });
  }
  if (req.method === 'POST' && p === '/api/insights/clear') { if (!isAdmin(req)) return send(res, 401, { error: 'Not allowed.' }); try { fs.unlinkSync(TF); } catch (e) {} return send(res, 200, { ok: true }); }
  return false;
}

async function api(req, res, p) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  reqCount++;
  if (p === '/api/telemetry' || p.startsWith('/api/insights')) { const r = await telemetry(req, res, p); if (r !== false) return; }
  if (p === '/api/health') return send(res, 200, { ok: true, service: 'windope' });
  if (p === '/api/status') { const a = authed(req), o = { ok: true, name: 'mythos', startedAt: STARTED, uptimeSec: Math.round((Date.now() - STARTED) / 1000), node: process.version };
    if (a) { o.accounts = Object.keys(users).length; o.sessions = Object.keys(sessions).length; o.servers = Object.keys(servers).length; o.requests = reqCount; } return send(res, 200, o); }
  try {
    if (req.method === 'POST' && p === '/api/ms-login') {
      if (limited('ms:' + ip(req), 30, 6e5)) return send(res, 429, { error: 'Too many tries. Wait a few minutes and try again.' });
      hit('ms:' + ip(req));
      const b = await body(req, 8192), tk = String(b.token || '');
      if (tk.length < 20 || tk.length > 6000 || /[^A-Za-z0-9._~+\/=-]/.test(tk)) return send(res, 400, { error: 'That Microsoft sign-in didn’t look right.' });
      let me;
      try {
        const r = await fetch('https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName', { headers: { Authorization: 'Bearer ' + tk }, signal: AbortSignal.timeout(8000) });
        if (!r.ok) return send(res, 401, { error: 'Microsoft didn’t accept that sign-in. Try signing in again.' });
        me = await r.json();
      } catch (e) { return send(res, 502, { error: 'Couldn’t reach Microsoft to check your sign-in.' }); }
      const email = clean(me.mail || me.userPrincipalName, 254).toLowerCase(), name = clean(me.displayName || email.split('@')[0], 24) || 'User';
      if (!EMAIL.test(email)) return send(res, 400, { error: 'Your Microsoft account has no email address.' });
      if (ALLOWED_EMAILS.length && ALLOWED_EMAILS.indexOf(email) < 0) return send(res, 403, { error: 'This MythOS server isn’t open to that account.' });
      if (ALLOWED_TENANT) { try { const tid = String(JSON.parse(Buffer.from(tk.split('.')[1], 'base64url').toString()).tid || '').toLowerCase(); if (tid !== ALLOWED_TENANT) return send(res, 403, { error: 'This MythOS server only accepts accounts from one organization.' }); } catch (e) { return send(res, 403, { error: 'Couldn’t check your organization.' }); } }
      const old = users[email]; users[email] = { email, name, created: old ? old.created : new Date().toISOString() }; save(UF, users);
      return send(res, 200, { token: newSession(email), user: pub(users[email]) });
    }
    if (req.method === 'GET' && p === '/api/me') { const a = authed(req); return a ? send(res, 200, pub(a.user)) : send(res, 401, { error: 'Signed out.' }); }
    if (req.method === 'POST' && p === '/api/logout') { const a = authed(req); if (a) { delete sessions[a.key]; save(SF, sessions); } return send(res, 200, { ok: true }); }
    let m;
    if (p === '/api/servers' || (m = /^\/api\/servers\/(s_[a-z0-9]{1,12})(\/messages|\/delete)?$/.exec(p))) {
      const a = authed(req); if (!a) return send(res, 401, { error: 'Sign in with your Microsoft account first.' });
      const me = a.user;
      if (p === '/api/servers') {
        if (req.method === 'GET') return send(res, 200, { servers: Object.values(servers).map(s => sinfo(s, me)).sort((x, y) => y.last - x.last) });
        if (req.method === 'POST') {
          const b = await body(req), name = clean(b.name, 24);
          if (name.length < 2) return send(res, 400, { error: 'Give your server a name (2 to 24 characters).' });
          if (Object.values(servers).some(s => s.name.toLowerCase() === name.toLowerCase())) return send(res, 409, { error: 'A server with that name already exists.' });
          if (Object.values(servers).filter(s => s.owner === me.email).length >= 5) return send(res, 400, { error: 'You can own up to 5 servers.' });
          if (Object.keys(servers).length >= 500) return send(res, 400, { error: 'This MythOS has reached its server limit.' });
          const id = 's_' + crypto.randomBytes(5).toString('hex');
          servers[id] = { id, name, owner: me.email, ownerName: me.name, created: new Date().toISOString(), next: 2, messages: [{ id: 1, t: Date.now(), u: 'MythOS', text: me.name + ' created ' + name + '.' }] };
          saveServers(); return send(res, 201, { server: sinfo(servers[id], me) });
        }
      } else {
        const s = servers[m[1]]; if (!s) return send(res, 404, { error: 'That server doesn’t exist any more.' });
        if (m[2] === '/messages' && req.method === 'GET') {
          const after = Math.max(0, parseInt(new URL(req.url, 'http://x').searchParams.get('after')) || 0);
          const list = after ? s.messages.filter(x => x.id > after) : s.messages.slice(-100);
          return send(res, 200, { messages: list, server: sinfo(s, me) });
        }
        if (m[2] === '/messages' && req.method === 'POST') {
          if (limited('msg:' + me.email, 15, 10000)) return send(res, 429, { error: 'Slow down a little.' }); hit('msg:' + me.email);
          const b = await body(req), text = clean(b.text, 500); if (!text) return send(res, 400, { error: 'Type a message first.' });
          const msg = { id: s.next++, t: Date.now(), u: me.name, e: me.email === s.owner ? 'owner' : '', text };
          s.messages.push(msg); if (s.messages.length > 500) s.messages.splice(0, s.messages.length - 500); saveServers(); return send(res, 201, { message: msg });
        }
        if (m[2] === '/delete' && req.method === 'POST') {
          if (s.owner !== me.email) return send(res, 403, { error: 'Only the owner can delete this server.' });
          delete servers[s.id]; saveServers(); return send(res, 200, { ok: true });
        }
      }
    }
    return send(res, 404, { error: 'Not found.' });
  } catch (e) { return send(res, e.message === 'too big' ? 413 : 400, { error: 'That request didn’t look right.' }); }
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.zip': 'application/zip' };
function serveFile(req, res, file) {
  fs.stat(file, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    const h = { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' };
    if (file.startsWith(PUB)) { h['Content-Security-Policy'] = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors *; base-uri 'none'; form-action 'none'"; h['Referrer-Policy'] = 'no-referrer'; }
    res.writeHead(200, h); if (req.method === 'HEAD') return res.end(); fs.createReadStream(file).pipe(res);
  });
}
http.createServer((req, res) => {
  let p; try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); return res.end(); }
  if (p.indexOf('\0') >= 0) { res.writeHead(400); return res.end(); }
  if (p === '/px') return require('./proxy').handle(req, res);   // Drift browser proxy
  if (p.startsWith('/api/')) return api(req, res, p);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  if (p === '/insights') { res.writeHead(301, { Location: '/insights/' }); return res.end(); }
  if (p === '/insights/') return serveFile(req, res, path.join(PUB, 'insights', 'index.html'));
  const rel = path.normalize('.' + (p.endsWith('/') ? p + 'index.html' : p)), seg = rel.split(path.sep);
  if (seg[0] === 'server' || seg.some(s => s.startsWith('.') && s !== '.')) { res.writeHead(404); return res.end('Not found'); }   // never expose server/, data or dotfiles
  const f = path.resolve(ROOT, rel);
  if (!f.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  serveFile(req, res, f);
}).listen(PORT, HOST, () => {
  console.log('MythOS server running at http://' + (HOST === '0.0.0.0' ? 'localhost' : HOST) + ':' + PORT + '/');
  console.log('MythOS:        http://localhost:' + PORT + '/');
  console.log('Accounts: Microsoft (Azure / Entra ID) sign-in. Set up your app registration first, see README.md.');
  if (HOST !== '127.0.0.1' && HOST !== 'localhost') console.log('NOTE: put this behind HTTPS before real people use it. Microsoft sign-in also needs https (or http://localhost).');
});
