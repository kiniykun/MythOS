/* ===== Windows 11 Update: tells the user when their copy of this OS is outdated =====
   How it works: this file knows its own build number (OS_VERSION.build). It downloads
   version.json from the server (or from the "Update source" URL in Settings) and
   compares. When you publish a new version, bump BOTH the build in version.json and
   OS_VERSION below. Anyone still running an older copy sees an "update available" notice. */
(function(){
var CUR={version:'1.0.0',build:1};
window.OS_VERSION=CUR;
var FILES=['index.html','style.css','script.js','extras.js','inline-apps.js','update.js','version.json'];
var S={state:'idle',remote:null,checked:0,error:''},notified=false,busy=null;
function url(){var u=(window.sysConfig&&sysConfig.updateUrl||'').trim()||'version.json';return u+(u.indexOf('?')<0?'?':'&')+'t='+Date.now()}
function done(){try{window.dispatchEvent(new Event('osupdate'))}catch(e){}return S}
window.OSUpdate={current:CUR,state:S,
 check:function(manual){
  if(busy)return busy;S.state='checking';S.error='';done();
  busy=fetch(url(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('The update server answered '+r.status+'.');return r.json()}).then(function(j){
    var b=Number(j&&j.build);if(!isFinite(b))throw new Error('That update source doesn’t look right (no build number).');
    S.remote=j;S.checked=Date.now();
    if(b>CUR.build){S.state='available';if(!notified&&!manual||(manual&&!notified)){notified=true;try{showNotification('Windows 11 Update','Version '+(j.version||b)+' is available. Open Settings → Windows 11 Update to install it.')}catch(e){}}}
    else S.state='latest';
    try{localStorage.setItem('win_upd_last',String(S.checked))}catch(e){}
  }).catch(function(e){S.state='error';S.checked=Date.now();
    S.error=location.protocol==='file:'?'Updates can’t be checked when the OS is opened as a file. Open it from a web server, or set an Update source in Settings.':(navigator.onLine===false?'You’re offline.':(e&&e.message)||'Couldn’t reach the update server.')
  }).then(function(){busy=null;return done()});
  return busy},
 restart:function(){
  /* re-download every file past the browser cache, then reload into the new version */
  Promise.all(FILES.map(function(f){return fetch(f+'?t='+Date.now(),{cache:'reload'}).catch(function(){})})).then(function(){location.reload()})}
};
function start(){var cfg=window.sysConfig||{};if(cfg.pauseUpdates)return;window.OSUpdate.check(false)}
window.addEventListener('load',function(){setTimeout(function(){var iv=setInterval(function(){if(window.oobeDone&&window.oobeDone()){clearInterval(iv);start()}},1500);setTimeout(function(){clearInterval(iv)},120000)},4000)});
window.addEventListener('online',function(){if(!(window.sysConfig&&sysConfig.pauseUpdates))window.OSUpdate.check(false)});
setInterval(function(){if(!(window.sysConfig&&sysConfig.pauseUpdates))window.OSUpdate.check(false)},6*3600*1000);
})();
