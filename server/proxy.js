// Drift web proxy: no dependencies. Fetches a page on the server, strips frame-blocking headers,
// rewrites links so everything keeps flowing through /px, and patches fetch/XHR/forms in the page.
// Works for most normal sites. Heavy single-page apps (Google, YouTube, logins) may still fail.
const http = require('http'), https = require('https'), dns = require('dns'), net = require('net'), zlib = require('zlib');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const MAX_BODY = 40 * 1024 * 1024, MAX_REQ = 5 * 1024 * 1024;

function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const s = ip.toLowerCase();
  if (s.startsWith('::ffff:')) return isPrivate(s.slice(7));
  return s === '::1' || s === '::' || s.startsWith('fc') || s.startsWith('fd') || s.startsWith('fe8') || s.startsWith('fe9') || s.startsWith('fea') || s.startsWith('feb');
}
// refuse to connect to private / local addresses (so the proxy can't be used to reach your own network)
function safeLookup(host, opts, cb) {
  dns.lookup(host, opts, (err, addr, fam) => {
    if (err) return cb(err);
    const list = Array.isArray(addr) ? addr : [{ address: addr, family: fam }];
    if (list.some(x => isPrivate(x.address))) return cb(new Error('blocked address'));
    cb(null, addr, fam);
  });
}

const PX = u => '/px?u=' + encodeURIComponent(u);
function abs(u, base) {
  try {
    u = String(u).trim().replace(/&amp;/g, '&');
    if (!u || /^(data:|blob:|javascript:|mailto:|tel:|about:|#)/i.test(u)) return null;
    return new URL(u, base).href;
  } catch (e) { return null; }
}
function rwUrl(u, base) { const a = abs(u, base); return a && /^https?:/i.test(a) ? PX(a) : u; }
function rwCss(css, base) {
  return css
    .replace(/url\(\s*(["']?)(.*?)\1\s*\)/gi, (m, q, v) => 'url(' + q + rwUrl(v, base) + q + ')')
    .replace(/@import\s+(["'])(.*?)\1/gi, (m, q, v) => '@import ' + q + rwUrl(v, base) + q);
}

// runs inside every proxied page
const CLIENT = `(function(){var B=window.__PXB;
function A(u){try{u=String(u);if(/^(data:|blob:|javascript:|about:|mailto:|tel:|#)/i.test(u)||u.indexOf('/px?u=')===0)return u;return '/px?u='+encodeURIComponent(new URL(u,B).href)}catch(e){return u}}
function real(u){try{u=String(u);if(u.indexOf('/px?u=')===0)return decodeURIComponent(u.slice(6));return new URL(u,B).href}catch(e){return u}}
var f=window.fetch;if(f)window.fetch=function(i,o){try{if(typeof i==='string'||i instanceof URL)i=A(i);else if(i&&i.url)i=new Request(A(i.url),i)}catch(e){}return f.call(this,i,o)};
var xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){arguments[1]=A(u);return xo.apply(this,arguments)};
var wo=window.open;window.open=function(u,n,g){return wo.call(window,u?A(u):u,'_self',g)};
var sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(k,v){if(/^(src|href|action|poster)$/i.test(k)&&typeof v==='string')v=A(v);return sa.call(this,k,v)};
[[HTMLImageElement,'src'],[HTMLScriptElement,'src'],[HTMLIFrameElement,'src'],[HTMLLinkElement,'href'],[HTMLAnchorElement,'href'],[HTMLSourceElement,'src'],[HTMLMediaElement,'src'],[HTMLFormElement,'action']].forEach(function(p){try{var d=Object.getOwnPropertyDescriptor(p[0].prototype,p[1]);if(d&&d.set)Object.defineProperty(p[0].prototype,p[1],{get:d.get,set:function(v){d.set.call(this,typeof v==='string'?A(v):v)},configurable:true})}catch(e){}});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a&&a.target&&a.target!=='_self')a.target='_self'},true);
document.addEventListener('submit',function(e){var fm=e.target;if(!fm||fm.tagName!=='FORM')return;if((fm.method||'get').toLowerCase()!=='get')return;e.preventDefault();
 var u=new URL(real(fm.getAttribute('action')||B));var sp=new URLSearchParams();new FormData(fm).forEach(function(v,k){if(typeof v==='string')sp.append(k,v)});u.search=sp.toString();location.href=A(u.href)},true);
function tell(){try{parent.postMessage({drift:1,url:B,title:document.title},'*')}catch(e){}}
tell();document.addEventListener('DOMContentLoaded',tell);window.addEventListener('load',tell);
})();`;

function rwHtml(html, base) {
  html = html.replace(/(\s(?:href|src|action|poster|data-src|data-href)\s*=\s*)(["'])([\s\S]*?)\2/gi, (m, a, q, v) => a + q + rwUrl(v, base) + q);
  html = html.replace(/(\ssrcset\s*=\s*)(["'])([\s\S]*?)\2/gi, (m, a, q, v) =>
    a + q + v.split(',').map(s => { const t = s.trim().split(/\s+/); if (t[0]) t[0] = rwUrl(t[0], base); return t.join(' '); }).join(', ') + q);
  html = html.replace(/\s(integrity|nonce|crossorigin)\s*=\s*("[^"]*"|'[^']*')/gi, '');
  html = html.replace(/<meta[^>]+http-equiv\s*=\s*["']?refresh[^>]*>/gi, '');
  html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (m, a, c) => '<style' + a + '>' + rwCss(c, base) + '</style>');
  html = html.replace(/(\sstyle\s*=\s*)(["'])([\s\S]*?)\2/gi, (m, a, q, v) => a + q + rwCss(v, base) + q);
  const inj = '<script>window.__PXB=' + JSON.stringify(base).replace(/</g, '\\u003c') + ';' + CLIENT + '</script>';
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + inj) : inj + html;
}

function decode(buf, enc) {
  enc = (enc || '').toLowerCase();
  try {
    if (enc === 'gzip' || enc === 'x-gzip') return zlib.gunzipSync(buf);
    if (enc === 'br') return zlib.brotliDecompressSync(buf);
    if (enc === 'deflate') return zlib.inflateSync(buf);
  } catch (e) { /* fall through */ }
  return buf;
}

function fail(res, code, msg) {
  if (res.headersSent) return res.end();
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<!doctype html><meta charset="utf-8"><body style="font:15px system-ui;padding:40px;color:#333"><h2>Can’t open this page</h2><p>' + String(msg).replace(/</g, '&lt;') + '</p>');
}

function handle(req, res) {
  let target;
  try {
    const q = new URL(req.url, 'http://x');
    target = new URL(q.searchParams.get('u') || '');
    if (!/^https?:$/.test(target.protocol)) throw 0;
  } catch (e) { return fail(res, 400, 'That address isn’t valid.'); }

  // only pages served by this same site may use the proxy (keeps it from being an open proxy for everyone)
  const ref = req.headers.referer || '';
  let okRef = false; try { okRef = new URL(ref).host === req.headers.host; } catch (e) {}
  if (!okRef) return fail(res, 403, 'Open this through the Drift browser.');

  const chunks = []; let size = 0, dead = false;
  req.on('data', c => { size += c.length; if (size > MAX_REQ) { dead = true; req.destroy(); } else chunks.push(c); });
  req.on('end', () => { if (!dead) go(Buffer.concat(chunks)); });

  function go(body) {
    const h = {
      'user-agent': UA, accept: req.headers.accept || '*/*', 'accept-language': req.headers['accept-language'] || 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br', referer: target.origin + '/'
    };
    if (req.headers.range) h.range = req.headers.range;
    if (req.headers['content-type'] && body.length) h['content-type'] = req.headers['content-type'];
    if (body.length) h['content-length'] = body.length;
    const lib = target.protocol === 'https:' ? https : http;
    const up = lib.request(target, { method: req.method, headers: h, lookup: safeLookup, timeout: 20000 }, r => {
      const out = {};
      for (const k of Object.keys(r.headers)) {
        const l = k.toLowerCase();
        if (['x-frame-options', 'content-security-policy', 'content-security-policy-report-only', 'set-cookie', 'strict-transport-security',
          'content-encoding', 'content-length', 'transfer-encoding', 'connection', 'alt-svc', 'report-to', 'nel', 'cross-origin-opener-policy',
          'cross-origin-embedder-policy', 'cross-origin-resource-policy', 'permissions-policy'].includes(l)) continue;
        out[l] = r.headers[k];
      }
      out['access-control-allow-origin'] = '*';
      if (r.headers.location) { const a = abs(r.headers.location, target.href); if (a) out.location = PX(a); }
      const ct = String(r.headers['content-type'] || '').toLowerCase();
      const isHtml = ct.includes('text/html'), isCss = ct.includes('text/css');
      if (!isHtml && !isCss) {
        if (r.headers['content-encoding']) out['content-encoding'] = r.headers['content-encoding'];
        if (r.headers['content-length']) out['content-length'] = r.headers['content-length'];
        res.writeHead(r.statusCode, out); return r.pipe(res);
      }
      const parts = []; let n = 0;
      r.on('data', c => { n += c.length; if (n > MAX_BODY) { r.destroy(); } else parts.push(c); });
      r.on('end', () => {
        let txt = decode(Buffer.concat(parts), r.headers['content-encoding']).toString('utf8');
        txt = isHtml ? rwHtml(txt, target.href) : rwCss(txt, target.href);
        out['content-type'] = (isHtml ? 'text/html' : 'text/css') + '; charset=utf-8';
        res.writeHead(r.statusCode, out); res.end(txt);
      });
      r.on('error', () => res.end());
    });
    up.on('timeout', () => up.destroy(new Error('The site took too long to answer.')));
    up.on('error', e => fail(res, 502, e.message === 'blocked address' ? 'That address isn’t allowed.' : 'Couldn’t reach ' + target.host + '. ' + (e.message || '')));
    if (body.length) up.write(body);
    up.end();
  }
}

module.exports = { handle };
