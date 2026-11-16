(function(){try{var q=new URLSearchParams(location.search);if(window.opener&&window.opener!==window&&q.get('state')&&(q.get('code')||q.get('error'))){window.opener.postMessage({msauth:1,code:q.get('code'),state:q.get('state'),error:q.get('error_description')||q.get('error')},location.origin);window.close()}}catch(e){}})();
var _SYSTEM_PATHS = ["C:/Windows/System32/kernel32.dll", "/var/www/html/windows11/", "https://windows11.local/api/v1/auth"];
var _devBuildVer = "3.0.1";

var APPS = {
    'explorer': {title: 'Files', path: 'script/Apps/Explorer/index.html', icon: 'Icons/explorer.svg', pinned: true},
    'settings': {title: 'Settings', path: 'script/Apps/Settings/index.html', icon: 'Icons/settings.svg', pinned: true},
    'music': {title: 'Music', path: 'script/Apps/Music/index.html', icon: 'Icons/music.svg', pinned: true},
    'browser': {title: 'Drift', path: 'script/Apps/Browser/index.html', icon: 'Icons/chrome.png', pinned: true},
    'store': {title: 'Store', path: 'script/Apps/Store/index.html', icon: 'Icons/store.svg', pinned: true},
    'messages': {title: 'Messages', path: 'script/Apps/Messages/index.html', icon: 'Icons/messages.svg', pinned: true},
    'youtube': {title: 'YouTube', path: 'script/Apps/YouTube/index.html', icon: 'Icons/youtube.svg', pinned: true},
    'customize': {title: 'Customize', path: 'script/Apps/Customize/index.html', icon: 'Icons/customize.svg', pinned: false, hidden: true}
};

var savedPins = localStorage.getItem('c_pins_v2');
if(savedPins) {
    let p = JSON.parse(savedPins);
    for(let k in p) {
        if(APPS[k]) APPS[k].pinned = p[k];
    }
}

function syncPins() {
    let obj = {};
    for(let k in APPS) obj[k] = APPS[k].pinned;
    localStorage.setItem('c_pins_v2', JSON.stringify(obj));
}

var wallpaperRegistry = {
    "Bloom": {id: "Bloom", name: "Bloom", url: "bloom", locked: false},
    "Default": {id: "Default", name: "Snake Skeleton", url: "Videos/default.mp4", locked: false},
    "green": {id: "green", name: "Green Anime", url: "Videos/green.mp4", locked: false},
    "33A56": {id: "hunt_trait", name: "Hunt Showdown", url: "Videos/33A56.mp4", locked: false},
    "99Med": {id: "99Med", name: "92 Med", url: "Videos/92Med.mp4", locked: false},
    "Crown": {id: "Crown", name: "Crowned", url: "Videos/Crown.png", locked: false},
    "F-1": {id: "F-1", name: "F-1 Formula", url: "Videos/F-1.mp4", locked: false},
    "Minecraft01": {id: "Minecraft01", name: "Minecraft 01", url: "Videos/Minecraft01.mp4", locked: false},
    "Minecraft03": {id: "Minecraft03", name: "Minecraft 03", url: "Videos/Minecraft03.mp4", locked: false},
    "Skello": {id: "Skello", name: "Skello", url: "Videos/Skello.MP4", locked: false},
    "sukuna-fire": {id: "sukuna-fire", name: "Sukuna Fire", url: "Videos/sukuna-fire.mp4", locked: false},
    "CozyFox": {id: "CozyFox", name: "Cozy Fox", url: "Videos/CozyFox.mp4", locked: false},
    "RainyCity": {id: "RainyCity", name: "Rainy City", url: "Videos/RainyCity.mp4", locked: false},
    "Gojo": {id: "Gojo", name: "Gojo", url: "Videos/Gojo.mp4", locked: false},
    "BlackHole": {id: "BlackHole", name: "Black Hole", url: "Videos/BlackHole.mp4", locked: false},
};

var sysConfig = JSON.parse(localStorage.getItem('cine_sys_config')) || {};
if(sysConfig.optBg === undefined) sysConfig.optBg = false;
if(sysConfig.shortBoot === undefined) sysConfig.shortBoot = false;
if(sysConfig.wpLoop === undefined) sysConfig.wpLoop = false;
if(sysConfig.idleLock === undefined) sysConfig.idleLock = false; 
if(sysConfig.redirectConfirm === undefined) sysConfig.redirectConfirm = false; 
if(!sysConfig.panicKey) sysConfig.panicKey = '`';
if(!sysConfig.homeWallpaper) sysConfig.homeWallpaper = 'Bloom';
if(!sysConfig.lockWallpaper) sysConfig.lockWallpaper = 'Bloom';
if(!sysConfig.cloak) sysConfig.cloak = 'none';
if(sysConfig.showFps === undefined) sysConfig.showFps = false;
if(!sysConfig.theme) sysConfig.theme = 'dark';
if(sysConfig.wpAdapt === undefined) sysConfig.wpAdapt = true;
if(!sysConfig.wpNoAdapt) sysConfig.wpNoAdapt = {};
if(sysConfig.clock24 === undefined) sysConfig.clock24 = true;

window.updateSysSetting = function(key, value) {
    sysConfig[key] = value;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    if(key === 'optBg') applySystemSettings();
    if(key === 'wpLoop') updateWallpaperLoop();
    if(key === 'showFps') applyFps();
    if(key === 'accent') applyAccent();
    if(key === 'clock24') updateClock();
    if(key === 'theme' || key === 'wpAdapt' || key === 'wpNoAdapt') { if(window.applyTheme) applyTheme(); }
    if(key === 'userName' && window.applyUser) applyUser();
};
window.applyAccent=function(){ document.documentElement.style.setProperty('--accent', sysConfig.accent || '#4cc2ff'); };
document.addEventListener('DOMContentLoaded', applyAccent);
function applyFps(){ var f=document.getElementById('fps-counter'); if(f) f.style.display = sysConfig.showFps ? '' : 'none'; }
document.addEventListener('DOMContentLoaded', applyFps);

var cloaks = {
    none: {title: "Windows 11", icon: ""},
    google: {title: "Google", icon: "https://www.google.com/favicon.ico"},
    drive: {title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"},
    canvas: {title: "Dashboard", icon: "https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico"},
    classroom: {title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png"}
};

window.updateCloak = function(key) {
    sysConfig.cloak = key;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    applyCloak();
};

var WIN_FAVICON = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cg%20fill%3D%22%230a84ff%22%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2212.500%22%20height%3D%2212.500%22%20rx%3D%221.200%22/%3E%3Crect%20x%3D%2216.500%22%20y%3D%223%22%20width%3D%2212.500%22%20height%3D%2212.500%22%20rx%3D%221.200%22/%3E%3Crect%20x%3D%223%22%20y%3D%2216.500%22%20width%3D%2212.500%22%20height%3D%2212.500%22%20rx%3D%221.200%22/%3E%3Crect%20x%3D%2216.500%22%20y%3D%2216.500%22%20width%3D%2212.500%22%20height%3D%2212.500%22%20rx%3D%221.200%22/%3E%3C/g%3E%3C/svg%3E';
function applyCloak() {
    var k = sysConfig.cloak || 'none';
    var sel = cloaks[k];
    var icons = document.querySelectorAll("link[rel*='icon']");
    for(var i=0; i<icons.length; i++) icons[i].remove();
    
    if(sel && k !== 'none') {
        document.title = sel.title;
        let n = document.createElement('link');
        n.type = 'image/x-icon';
        n.rel = 'shortcut icon';
        n.href = sel.icon;
        document.getElementsByTagName('head')[0].appendChild(n);
    } else {
        document.title = "Windows 11";
        let n = document.createElement('link');
        n.rel = 'icon'; n.type = 'image/svg+xml';
        n.href = WIN_FAVICON;
        document.getElementsByTagName('head')[0].appendChild(n);
    }
}
setInterval(applyCloak, 2000);

var isDesktopActive = false;
var bootActive = true;
var enterCount = 0;
var highestZ = 500;
var activeWindowId = null;
var isMediaPlaying = false;
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var activeCtxId = null;

if(isMobile) {
    var mobWarn = document.getElementById('mobile-warning');
    if(mobWarn && mobWarn.showModal) mobWarn.showModal();
    else if(mobWarn) mobWarn.style.display = 'flex';
    
    var lastTap = 0;
    document.addEventListener('touchstart', function(e) {
        let t = new Date().getTime();
        let tl = t - lastTap;
        if(tl < 500 && tl > 0) {
            if(mobWarn && mobWarn.close) mobWarn.close();
            else if(mobWarn) mobWarn.style.display = 'none';
        }
        lastTap = t;
    });
}

async function loadDynamicResources() {
    renderUI();
    initWallpapers();
    setupAppContextMenu();
}

window.onbeforeunload = function(e) {
    if(sysConfig.redirectConfirm) {
        let msg = "Are you sure you want to leave? This helps block GoGuardian redirects.";
        e.returnValue = msg;
        return msg;
    }
};

document.addEventListener("DOMContentLoaded", function() {
    applyCloak();
    loadDynamicResources();
    document.getElementById('boot-layer').style.display = 'block';
    setTimeout(startBootSequence, 50);
    loadDesktop();
    updateSidebarData();
});

function renderUI() {
    let dock = document.getElementById('dock-container');
    let dHTML = '<div class="dock-item dock-start" title="Start" onclick="toggleStartMenu()"><img src="Icons/start.svg" alt="Start"></div><div class="dock-item" title="Search" onclick="toggleStartMenu();setTimeout(function(){var i=document.getElementById(\'start-search-input\');if(i)i.focus()},120)"><img src="Icons/search.svg" alt="Search"></div><div class="dock-item" title="All apps" onclick="toggleAppDrawer()"><img src="Icons/apps.svg" alt="All apps"></div><div class="dock-sep"></div>';
    
    let pGrid = document.getElementById('pinned-grid');
    let pHTML = '';
    
    for(let id in APPS) {
        if(APPS[id].pinned) {
            dHTML += '<div class="dock-item" data-id="'+id+'" onmousedown="DragSystem.start(event,this,\'dock\',\''+id+'\')" onclick="toggleApp(\''+id+'\')" oncontextmenu="openDockCtx(event, \''+id+'\')"><img src="'+APPS[id].icon+'"></div>';
            pHTML += '<div class="pinned-item" data-id="'+id+'" onmousedown="DragSystem.start(event,this,\'drawer\',\''+id+'\')" onclick="if(!DragSystem.isDragMove)toggleApp(\''+id+'\')"><img src="'+APPS[id].icon+'"><span>'+APPS[id].title+'</span></div>';
        }
    }
    
    dock.innerHTML = dHTML;
    pGrid.innerHTML = pHTML;
    let rg = document.getElementById('rec-grid'), rH = '', rc = 0;
    for(let id in APPS) { if(!APPS[id].pinned && !APPS[id].hidden && rc < 6) { rc++; rH += '<div class="rec-item" data-id="'+id+'" onmousedown="DragSystem.start(event,this,\'drawer\',\''+id+'\')" onclick="if(!DragSystem.isDragMove)toggleApp(\''+id+'\')"><img src="'+APPS[id].icon+'"><div><b>'+APPS[id].title+'</b><small>Recently added</small></div></div>'; } }
    if(rg) rg.innerHTML = '<div class="rec-empty">Your recent files and apps will show up here.</div>';
    populateDrawer();
}

function openDockCtx(e, id) {
    e.preventDefault(); e.stopPropagation();
    hideAllCtx();
    activeCtxId = id;
    let m = document.getElementById('dock-ctx-menu');
    if(m) {
        m.style.display = 'block';
        m.style.left = e.pageX + 'px';
        m.style.top = e.pageY + 'px';
    }
}

function openDrawerCtx(e, id) {
    e.preventDefault(); 
  e.stopPropagation();
    hideAllCtx();
    activeCtxId = id;
    let m = document.getElementById('drawer-ctx-menu');
    if(m) {
        m.style.display = 'block';
        m.style.left = e.pageX + 'px';
        m.style.top = e.pageY + 'px';
    }
}

document.getElementById('ctx-pin-app').onclick = function() {
    if(activeCtxId && APPS[activeCtxId]) {
        APPS[activeCtxId].pinned = true;
        syncPins();
        renderUI();
    }
    hideAllCtx();
}

document.getElementById('ctx-unpin-app').onclick = function() {
    if(activeCtxId && APPS[activeCtxId]) {
        APPS[activeCtxId].pinned = false;
        syncPins();
        renderUI();
    }
    hideAllCtx();
}

function hideAllCtx() {
    let menus = ['app-context-menu','desktop-context-menu','drawer-ctx-menu','dock-ctx-menu'];
    for(let i=0; i<menus.length; i++) {
        let m = document.getElementById(menus[i]);
        if(m) m.style.display = 'none';
    }
}
document.addEventListener('click', hideAllCtx);

document.addEventListener('keydown', function(e) {
    if(bootActive && e.key === 'Enter' && document.getElementById('boot-layer').style.display !== 'none') {
        enterCount++;
        if(enterCount >= 1) skipBootSequence();
        setTimeout(function(){ enterCount = 0; }, 500);
    }
    if(e.key && sysConfig.panicKey && e.key.toLowerCase() === sysConfig.panicKey.toLowerCase()) {
        window.location.href = sysConfig.panicUrl||"https://google.com";
    }
});

function startBootSequence() {
    // Windows 11 style: loads on its own, no key presses needed
    setTimeout(function() { if(bootActive) skipBootSequence(); }, 2600);
}

function skipBootSequence() {
    if(!bootActive) return;
    bootActive = false;
    let lay = document.getElementById('boot-layer');
    let bv = document.getElementById('boot-video');
    if(bv) bv.pause();
    
    if(lay) {
        lay.style.opacity = '0';
        document.getElementById('lock-screen').classList.add('active');
        
        let lv = document.getElementById('lock-video');
        if(lv.style.display !== 'none') {
            lv.play().catch(function(e) {});
        }
        
        setTimeout(function() { lay.style.display = 'none'; }, 600);
        updateClock();
    }
}

function showNotification(title, msg) {
    let c = document.getElementById('toast-container');
    let t = document.createElement('div');
    t.className = 'toast-notification';
    t.innerHTML = '<div class="toast-header"><div class="toast-app-info"><div class="toast-icon"><i class="fas fa-bell"></i></div><span>System</span></div><i class="fas fa-times toast-close"></i></div><div class="toast-title">' + title + '</div><div class="toast-body">' + msg + '</div>';
    c.appendChild(t);
    
    setTimeout(function(){ t.classList.add('show'); }, 100);
    t.onclick = function() {
        t.classList.remove('show');
        setTimeout(function(){ t.remove(); }, 400);
    };
    setTimeout(t.onclick, 6000);
}

var welcomeShown = false;
window.unlockSystem = function() {
    let scr = document.getElementById('lock-screen');
    scr.classList.add('slide-up');
    setTimeout(function() {
        scr.classList.remove('active');
        isDesktopActive = true;
        document.getElementById('lock-video').pause();
        
        if(!sysConfig.optBg) {
            let bV = document.getElementById('bg-video');
            if(bV.style.display !== 'none') bV.play().catch(function(e){});
        }
        if(!welcomeShown) {
            showNotification("Welcome to Windows 11", "Open Settings to personalize your PC.");
            welcomeShown = true;
        }
    }, 600);
    resetIdle();
};

function applyMediaToElements(url, vidEl, imgEl, isBg) {
    if(!url) return;
    let isImg = url.match(/\.(png|jpg|jpeg|gif|webp)$/i) || (window.wpKinds && window.wpKinds[url] === 'img');
    if(isImg) {
        vidEl.style.display = 'none';
        vidEl.pause();
        imgEl.style.display = 'block';
        imgEl.src = url;
    } else {
        imgEl.style.display = 'none';
        vidEl.style.display = 'block';
        vidEl.src = url;
        vidEl.load();
        if(isBg && isDesktopActive && !sysConfig.optBg) vidEl.play().catch(function(e){});
        if(!isBg && document.getElementById('lock-screen').classList.contains('active')) vidEl.play().catch(function(e){});
    }
}

function initWallpapers() {
    let bV = document.getElementById('bg-video');
    let bI = document.getElementById('bg-img');
    let lV = document.getElementById('lock-video');
    let lI = document.getElementById('lock-img');
    
    if(wallpaperRegistry[sysConfig.homeWallpaper]) {
        applyMediaToElements(wallpaperRegistry[sysConfig.homeWallpaper].url, bV, bI, true);
    }
    if(wallpaperRegistry[sysConfig.lockWallpaper]) {
        applyMediaToElements(wallpaperRegistry[sysConfig.lockWallpaper].url, lV, lI, false);
    } else {
        applyMediaToElements("bloom", lV, lI, false);
    }
    
    updateWallpaperLoop();
    let wChk = document.getElementById('wp-loop-chk');
    if(wChk) wChk.checked = sysConfig.wpLoop;
}

function updateWallpaperLoop() {
    let bV = document.getElementById('bg-video');
    let lV = document.getElementById('lock-video');
    if(bV) bV.loop = sysConfig.wpLoop;
    if(lV) lV.loop = sysConfig.wpLoop;
    if(!sysConfig.optBg && isDesktopActive && bV && bV.paused && bV.style.display !== 'none') {
        bV.play().catch(function(e){});
    }
}

function updateClock() {
    let n = new Date();
    let dArr = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    let mArr = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    
    let h24 = n.getHours();
    let hrs = (sysConfig.clock24 ? h24 : (h24 % 12 || 12)).toString().padStart(2, '0') ;
    let ampm = sysConfig.clock24 ? '' : (h24 >= 12 ? ' PM' : ' AM');
    let min = n.getMinutes().toString().padStart(2, '0');
    let dNum = n.getDate().toString().padStart(2, '0');
    let dName = dArr[n.getDay()];
    let yr = n.getFullYear();
    
    let lDay = document.getElementById('lock-day-large');
    let lDat = document.getElementById('lock-date');
    let lTim = document.getElementById('lock-time');
    let hDay = document.getElementById('lbl-day');
    
    if(lDay && !lDay.querySelector('img')) lDay.innerText = dName;
    if(hDay && !hDay.querySelector('img')) hDay.innerText = dName;
    if(lDat) lDat.innerText = dNum + ' ' + mArr[n.getMonth()] + ', ' + yr + '.';
    if(lTim) lTim.innerText = hrs + ':' + min + ampm;
}
setInterval(updateClock, 1000);

var idleTime = 0;
function resetIdle() { idleTime = 0; }
document.addEventListener('mousemove', resetIdle);
document.addEventListener('keypress', resetIdle);

setInterval(function() {
    idleTime++;
    let scr = document.getElementById('lock-screen');
    if(sysConfig.idleLock && idleTime >= ((sysConfig.idleMinutes||3)*60) && !scr.classList.contains('active') && !bootActive) {
        if(isMediaPlaying) {
            idleTime = 0; 
        } else {
            isDesktopActive = false;
            scr.classList.remove('slide-up');
            scr.classList.add('active');
            document.getElementById('bg-video').pause();
            let lv = document.getElementById('lock-video');
            if(lv.style.display !== 'none') lv.play().catch(function(e){});
        }
    }
}, 1000);

window.openUpdateLog = function() {
    let u = document.getElementById('update-modal');
    if(u && u.showModal) u.showModal();
    else if(u) u.style.display = 'flex';
};

function updateSidebarData() {}
setInterval(updateSidebarData, 5000);

function populateDrawer() {
    let g = document.getElementById('drawer-grid');
    g.innerHTML = '';
    for(let key in APPS) {
        let a = APPS[key];
        if(a.hidden) continue;
        let d = document.createElement('div');
        d.className = 'drawer-item';
        d.dataset.id = key;
        d.innerHTML = '<img src="' + a.icon + '" style="pointer-events:none;"><span>' + a.title + '</span>';
        
        d.onmousedown = function(e) { DragSystem.start(e, this, 'drawer', this.dataset.id); };
        d.onclick = function(e) {
            if(!DragSystem.isDragMove) {
                toggleApp(this.dataset.id);
                toggleAppDrawer();
            }
        };
        d.oncontextmenu = function(e) { openDrawerCtx(e, this.dataset.id); }
        g.appendChild(d);
    }
}

function filterDrawer(val) {
    let items = document.querySelectorAll('.drawer-item');
    let q = val.toLowerCase();
    for(let i=0; i<items.length; i++) {
        let txt = items[i].innerText.toLowerCase();
        if(txt.includes(q)) items[i].style.display = 'flex';
        else items[i].style.display = 'none';
    }
}

function toggleAppDrawer() {
    let d = document.getElementById('app-drawer');
    if(d.classList.contains('open')) {
        d.classList.remove('open');
        setTimeout(function(){ d.style.display='none'; }, 300);
    } else {
        d.style.display = 'block';
        setTimeout(function(){ d.classList.add('open'); }, 10);
    }
}

function toggleApp(id) {
    let w = document.getElementById('win-' + id);
    if(w) {
        if(w.classList.contains('minimized')) {
            w.classList.remove('minimized');
            w.classList.add('active');
            w.style.zIndex = ++highestZ;
            activeWindowId = id;
            startImmersiveMode(w);
        } else if(activeWindowId === id) {
            minimizeWindow(id);
        } else {
            w.style.zIndex = ++highestZ;
            activeWindowId = id;
            startImmersiveMode(w);
        }
    } else {
        openWindow(id);
    }
}

function openWindow(id) {
    let m = document.getElementById('start-menu');
    if(m) {
        m.classList.remove('open');
        setTimeout(function(){ m.style.display='none'; }, 300);
    }
    
    let layer = document.getElementById('windows-layer');
    let win = document.getElementById('win-' + id);
    
    if(!win) {
        let dat = APPS[id] || {title: 'APP', path: 'about:blank'};
        win = document.createElement('div');
        win.id = 'win-' + id;
        win.className = 'window active header-visible';
        win.style.zIndex = ++highestZ;
        
        let iframeStr = dat.internal ? '<iframe allow="' + permAllow(id) + '" id="frame-' + id + '"></iframe>' : (window._INLINE_APPS && window._INLINE_APPS[dat.path]) ? '<iframe allow="' + permAllow(id) + '" id="frame-' + id + '" srcdoc="' + window._INLINE_APPS[dat.path].replace(/&/g,'&amp;').replace(/"/g,'&quot;') + '"></iframe>' : '<iframe allow="' + permAllow(id) + '" id="frame-' + id + '" src="' + dat.path + '"></iframe>';
        
        win.innerHTML = '<div class="win-header" onmousedown="DragSystem.startWinDrag(event, \'' + id + '\')"><div class="win-title">' + dat.title + '</div><div class="win-controls"><div class="win-btn btn-min" onclick="minimizeWindow(\'' + id + '\')"></div><div class="win-btn btn-close" onclick="closeWindow(\'' + id + '\')"></div></div></div><div class="win-body">' + iframeStr + '</div>';
        
        layer.appendChild(win);
        
        if(dat.internal && id === 'settings') {
            let f = document.getElementById('frame-' + id);
            if(f) {
                let html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                    <style>
                        body { background: #000; color: #fff; font-family: 'Rajdhani', sans-serif; padding: 25px; margin: 0; outline: none; }
                        * { outline: none; -webkit-tap-highlight-color: transparent; }
                        h2 { border-bottom: 2px solid #333; padding-bottom: 10px; font-weight: 700; letter-spacing: 1px; }
                        .setting-card { background: #111; border: 1px solid #333; padding: 15px; border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
                        .setting-text { display: flex; flex-direction: column; }
                        .setting-text b { color: #fff; font-size: 15px; }
                        .setting-text small { color: #888; font-size: 13px; }
                        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
                        .switch input { opacity: 0; width: 0; height: 0; }
                        .slider { position: absolute; cursor: pointer; inset: 0; background-color: #444; transition: .3s; border-radius: 34px; }
                        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: #fff; transition: .3s; border-radius: 50%; }
                        input:checked + .slider { background-color: #fff; }
                        input:checked + .slider:before { transform: translateX(20px); background-color: #000; }
                        input[type="text"], select { background: #222; color: #fff; border: 1px solid #444; padding: 6px; border-radius: 6px; }
                        input:focus, select:focus { border-color: #888; }
                    </style>
                </head>
                <body>
                    <h2>SYSTEM CONFIGURATION</h2>
                    <div class="setting-card">
                        <div class="setting-text"><b>Optimized Background</b><small>Disables video background</small></div>
                        <label class="switch"><input type="checkbox" id="chk-bg" onchange="window.parent.updateSysSetting('optBg',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Fast Boot</b><small>Skips the startup sequence</small></div>
                        <label class="switch"><input type="checkbox" id="chk-boot" onchange="window.parent.updateSysSetting('shortBoot',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Idle Lock Screen</b><small>Locks system when away for 3 minutes</small></div>
                        <label class="switch"><input type="checkbox" id="chk-idle" onchange="window.parent.updateSysSetting('idleLock',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Redirect Confirmation</b><small>Helps Protect Against GoGuardian tracking!</small></div>
                        <label class="switch"><input type="checkbox" id="chk-redir" onchange="window.parent.updateSysSetting('redirectConfirm',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Tab Cloaking</b><small>Disguises OS as another site</small></div>
                        <select id="cloak-select" onchange="window.parent.updateCloak(this.value)">
                            <option value="none">None (Windows 11)</option>
                            <option value="google">Google</option>
                            <option value="drive">Google Drive</option>
                            <option value="canvas">Canvas</option>
                        </select>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Panic Key</b><small>Instant site redirection shortcut</small></div>
                        <input type="text" id="panic-input" maxlength="1" style="width:40px; text-align:center; font-weight:bold; font-size:16px;" onkeyup="window.parent.updateSysSetting('panicKey',this.value)">
                    </div>
                    <script>
                        var prefs = window.parent.sysConfig;
                        document.getElementById('chk-bg').checked = prefs.optBg;
                        document.getElementById('chk-boot').checked = prefs.shortBoot;
                        document.getElementById('chk-idle').checked = prefs.idleLock;
                        document.getElementById('chk-redir').checked = prefs.redirectConfirm;
                        document.getElementById('cloak-select').value = prefs.cloak;
                        document.getElementById('panic-input').value = prefs.panicKey;
                    <\/script>
                </body>
                </html>`;
                f.srcdoc = html;
            }
        }
    } else {
        win.classList.remove('minimized');
        win.classList.add('active');
        win.style.zIndex = ++highestZ;
    }
    
    activeWindowId = id;
    startImmersiveMode(win);
}

function closeWindow(id) {
    let w = document.getElementById('win-' + id);
    if(w) w.remove();
    if(activeWindowId === id) activeWindowId = null;
    endImmersiveMode();
}

function minimizeWindow(id) {
    let w = document.getElementById('win-' + id);
    if(w) {
        w.classList.add('minimized');
        w.classList.remove('active');
        if(activeWindowId === id) activeWindowId = null;
    }
    endImmersiveMode();
}

function startImmersiveMode(win) {
    document.getElementById('dock-container').classList.add('dock-hidden');
    win.classList.remove('header-visible');
}

function endImmersiveMode() {
    let aw = document.querySelectorAll('.window.active:not(.minimized)');
    if(aw.length === 0) {
        document.getElementById('dock-container').classList.remove('dock-hidden');
        activeWindowId = null;
    } else {
        let t = aw[aw.length - 1];
        activeWindowId = t.id.replace('win-', '');
        t.style.zIndex = ++highestZ;
        startImmersiveMode(t);
    }
}

var dockTimer;
var dEl = document.getElementById('dock-container');
document.getElementById('bottom-trigger').addEventListener('mouseenter', function() {
    dEl.classList.remove('dock-hidden');
    clearTimeout(dockTimer);
});
dEl.addEventListener('mouseleave', function() {
    let aw = document.querySelectorAll('.window.active:not(.minimized)');
    if(aw.length > 0) {
        dockTimer = setTimeout(function() { dEl.classList.add('dock-hidden'); }, 1000);
    }
});
dEl.addEventListener('mouseenter', function() { clearTimeout(dockTimer); });

document.getElementById('top-trigger').addEventListener('mouseenter', function() {
    if(activeWindowId) {
        let w = document.getElementById('win-' + activeWindowId);
        if(w && !w.classList.contains('minimized')) w.classList.add('header-visible');
    }
});

document.addEventListener('mouseover', function(e) {
    if(e.target.closest('.win-header')) {
        if(activeWindowId) {
            let w = document.getElementById('win-' + activeWindowId);
            if(w) w.classList.add('header-visible');
        }
    } else if(activeWindowId && !e.target.closest('#top-trigger')) {
        let w = document.getElementById('win-' + activeWindowId);
        if(w) w.classList.remove('header-visible');
    }
});

var desktopLayout = JSON.parse(localStorage.getItem('cine_desktop_v2')) || [];

function saveDesktop() {
    localStorage.setItem('cine_desktop_v2', JSON.stringify(desktopLayout));
    loadDesktop();
}

function loadDesktop() {
    let c = document.getElementById('desktop-area');
    let ex = document.querySelectorAll('.desktop-app');
    for(let j=0; j<ex.length; j++) ex[j].remove();
    
    desktopLayout.forEach(function(item, idx) {
        let d = document.createElement('div');
        d.className = 'desktop-app';
        d.style.left = item.x + 'px';
        d.style.top = item.y + 'px';
        d.setAttribute('data-idx', idx);
        
        if(item.type === 'folder') {
            let gHTML = '<div class="d-folder-grid">';
            let mx = item.apps.slice(0, 4);
            mx.forEach(function(a) {
                if(APPS[a]) gHTML += '<img src="' + APPS[a].icon + '">';
            });
            gHTML += '</div>';
            if(!item.hideName) gHTML += '<div class="d-label">' + (item.customName || 'Folder') + '</div>';
            
            d.innerHTML = gHTML;
            d.onclick = function(ev) {
                if(DragSystem.isDragMove) return;
                ev.stopPropagation();
                if(!this.classList.contains('expanded-folder')) {
                    closeAllFolders();
                    expandFolder(this, item, idx);
                }
            };
        } else {
            let a = APPS[item.id];
            if(a) {
                let iSrc = item.customIcon || a.icon;
                let lbl = item.customName || a.title;
                let h = '<img src="' + iSrc + '" class="d-icon">';
                if(!item.hideName) h += '<div class="d-label">' + lbl + '</div>';
                d.innerHTML = h;
                d.ondblclick = function(ev) { ev.stopPropagation(); toggleApp(item.id); };
            }
        }
        
        d.onmousedown = function(ev) {
            ev.stopPropagation();
            if(ev.button === 0) DragSystem.start(ev, d, 'desktop', idx);
        };
        
        d.oncontextmenu = function(ev) {
            ev.preventDefault(); ev.stopPropagation();
            hideAllCtx();
            let m = document.getElementById('app-context-menu');
            if(m) {
                m.style.display = 'block';
                m.style.left = ev.pageX + 'px';
                m.style.top = ev.pageY + 'px';
                m.setAttribute('data-target-idx', idx);
            }
        };
        
        c.appendChild(d);
    });
}

function expandFolder(el, dat, idx) {
    el.classList.add('expanded-folder');
    
    let h = '<div class="folder-header">' + (dat.customName || 'Folder') + ' <i class="fas fa-times" onclick="closeAllFolders(event)"></i></div>';
    h += '<div class="folder-grid-expanded">';
    for(let k=0; k<dat.apps.length; k++) {
        let aId = dat.apps[k];
        let info = APPS[aId];
        if(info) {
            h += '<div class="f-app" onclick="event.stopPropagation(); toggleApp(\'' + aId + '\')"><img src="' + info.icon + '"><span>' + info.title + '</span></div>';
        }
    }
    h += '</div>';
    el.innerHTML = h;
    
    setTimeout(function() {
        let rect = el.getBoundingClientRect();
        let sibs = document.querySelectorAll('.desktop-app:not(.expanded-folder)');
        for(let s=0; s<sibs.length; s++) {
            let sib = sibs[s];
            let sr = sib.getBoundingClientRect();
            if(!(rect.right < sr.left || rect.left > sr.right || rect.bottom < sr.top || rect.top > sr.bottom)) {
                let push = (rect.bottom - sr.top) + 20;
                sib.style.transform = 'translateY(' + push + 'px)';
                sib.setAttribute('data-pushed', 'true');
            }
        }
    }, 50);
}

function closeAllFolders(ev) {
    if(ev) ev.stopPropagation();
    let op = document.querySelectorAll('.expanded-folder');
    if(op.length === 0) return;
    
    for(let i=0; i<op.length; i++) op[i].classList.remove('expanded-folder');
    
    let push = document.querySelectorAll('.desktop-app[data-pushed="true"]');
    for(let j=0; j<push.length; j++) {
        push[j].style.transform = '';
        push[j].removeAttribute('data-pushed');
    }
    setTimeout(loadDesktop, 250);
}

function setupAppContextMenu() {
    let m = document.getElementById('app-context-menu');
    if(!m) return;
    m.innerHTML = `
        <li class="ctx-item" id="ctx-rename" role="menuitem" tabindex="0"><i class="fas fa-edit fa-fw" aria-hidden="true"></i> Rename</li>
        <li class="ctx-item" id="ctx-hidename" role="menuitem" tabindex="0"><i class="fas fa-eye-slash fa-fw" aria-hidden="true"></i> Toggle Name</li>
        <li class="ctx-item" id="ctx-changeicon" role="menuitem" tabindex="0"><i class="fas fa-image fa-fw" aria-hidden="true"></i> Change Icon</li>
        <li class="ctx-separator" role="separator"></li>
        <li class="ctx-item" id="ctx-delete" role="menuitem" tabindex="0"><i class="fas fa-trash fa-fw" style="color:#aaa;" aria-hidden="true"></i> Remove</li>
    `;
    
    document.getElementById('ctx-rename').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        OSDlg.prompt("Enter new name:", desktopLayout[i].customName || "",function(nm){
        if(nm !== null) {
            desktopLayout[i].customName = nm.trim() === "" ? "App" : nm;
            saveDesktop();
        }})
        m.style.display = 'none';
    };
    
    document.getElementById('ctx-hidename').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        desktopLayout[i].hideName = !desktopLayout[i].hideName;
        saveDesktop();
        m.style.display = 'none';
    };
    
    document.getElementById('ctx-changeicon').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        OSDlg.prompt("Enter image URL for custom icon:",function(url){
        if(url) {
            desktopLayout[i].customIcon = url;
            saveDesktop();
        }})
        m.style.display = 'none';
    };
    
    document.getElementById('ctx-delete').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        desktopLayout.splice(i, 1);
        saveDesktop();
        m.style.display = 'none';
    };
}

document.addEventListener('contextmenu', function(e) {
    let ids = ['desktop-area', 'windows-layer', 'bg-video', 'bg-img', 'snow-fx', 'right-sidebar'];
    if(ids.includes(e.target.id) || e.target.tagName === 'BODY' || e.target.closest('#right-sidebar')) {
        e.preventDefault();
        hideAllCtx();
        let m = document.getElementById('desktop-context-menu');
        if(m) {
            m.style.display = 'block';
            let x = e.pageX, y = e.pageY;
            if(x + 200 > window.innerWidth) x = window.innerWidth - 200;
            if(y + 100 > window.innerHeight) y = window.innerHeight - 100;
            m.style.left = x + 'px';
            m.style.top = y + 'px';
        }
    }
});

var DragSystem = {
    dragging: false, startPos: {x:0,y:0}, sourceType: null, sourceEl: null,
    idx: null, appId: null, proxy: document.getElementById('drag-proxy'),
    pImg: document.getElementById('proxy-img'), badge: document.getElementById('folder-badge'),
    
    init: function() {
        window.addEventListener('mousemove', e => this.move(e));
        window.addEventListener('mouseup', e => this.end(e));
    },
    
    start: function(e, el, type, id) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = type; this.sourceEl = el; this.isDragMove = false;
        if(type === 'drawer' || type === 'dock') this.appId = id;
        else if(type === 'desktop') { this.idx = id; this.sourceEl.style.opacity = '0.5'; }
    },
    
    startWinDrag: function(e, id) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = 'window'; this.sourceEl = document.getElementById('win-' + id);
        this.isDragMove = false;
    },
    
    move: function(e) {
        if(!this.sourceEl) return;
        let dx = Math.abs(e.clientX - this.startPos.x);
        let dy = Math.abs(e.clientY - this.startPos.y);
        
        if(dx > 3 || dy > 3) {
            this.dragging = true; this.isDragMove = true;
            if(this.sourceType === 'desktop' || this.sourceType === 'drawer' || this.sourceType === 'dock') {
                if(this.sourceType === 'drawer') toggleAppDrawer();
                this.proxy.style.display = 'block';
                this.proxy.style.left = (e.clientX - 25) + 'px';
                this.proxy.style.top = (e.clientY - 25) + 'px';
                
                if(this.sourceType === 'drawer' || this.sourceType === 'dock') {
                    if(APPS[this.appId]) this.pImg.src = APPS[this.appId].icon;
                } else {
                    let itm = desktopLayout[this.idx];
                    if(itm.type === 'app') {
                        if(APPS[itm.id]) this.pImg.src = APPS[itm.id].icon;
                    } else {
                        this.pImg.src = '';
                        this.badge.style.display = 'flex';
                        this.badge.innerText = itm.apps.length;
                    }
                }
            }
        }
    },
    
    end: function(e) {
        if(!this.sourceEl) return;
        if(!this.isDragMove && this.sourceType === 'desktop') { this.reset(); return; }
        if(!this.dragging) { this.reset(); return; }
        
        if(this.sourceType === 'desktop' || this.sourceType === 'drawer' || this.sourceType === 'dock') {
            let nx = Math.max(0, Math.min(window.innerWidth - 90, Math.round(e.clientX - 45)));
            let ny = Math.max(0, Math.min(window.innerHeight - 150, Math.round(e.clientY - 45)));
            
            if(e.clientY > window.innerHeight - 80) {
                if(this.sourceType === 'desktop') desktopLayout.splice(this.idx, 1);
            } else {
                let tIdx = -1;
                let aAll = document.querySelectorAll('.desktop-app');
                for(let i=0; i<aAll.length; i++) {
                    if(aAll[i] !== this.sourceEl) {
                        let r = aAll[i].getBoundingClientRect();
                        if(e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) tIdx = aAll[i].dataset.idx;
                    }
                }
                
                if(tIdx > -1) {
                    let targ = desktopLayout[tIdx];
                    let drp = (this.sourceType === 'drawer' || this.sourceType === 'dock') ? [this.appId] : (desktopLayout[this.idx].type === 'app' ? [desktopLayout[this.idx].id] : desktopLayout[this.idx].apps);
                    
                    if(targ.type === 'app') {
                        targ.type = 'folder';
                        targ.apps = [targ.id].concat(drp);
                        delete targ.id;
                    } else {
                        targ.apps.push.apply(targ.apps, drp);
                    }
                    if(this.sourceType === 'desktop') desktopLayout.splice(this.idx, 1);
                } else {
                    if(this.sourceType === 'drawer' || this.sourceType === 'dock') {
                        desktopLayout.push({type: 'app', id: this.appId, x: nx, y: ny});
                    } else {
                        desktopLayout[this.idx].x = nx;
                        desktopLayout[this.idx].y = ny;
                    }
                }
            }
            saveDesktop();
        }
        this.reset();
    },
    
    reset: function() {
        this.dragging = false;
        if(this.sourceEl) this.sourceEl.style.opacity = '1';
        this.sourceEl = null;
        this.proxy.style.display = 'none';
        this.badge.style.display = 'none';
    }
};
DragSystem.init();

window.toggleDesktopSize = function(l) {
    if(l) document.getElementById('desktop-area').classList.add('desktop-large-mode');
    else document.getElementById('desktop-area').classList.remove('desktop-large-mode');
    document.getElementById('desktop-context-menu').style.display = 'none';
};

var unlockedWallpapers = JSON.parse(localStorage.getItem('cine_unlocked_wp')) || ['default'];
window.wpMode = 'both';

function setWallpaper(k, noti=false, quiet=false) {
    let d = wallpaperRegistry[k];
    if(!d) return;
    
    if(noti && d.locked && !unlockedWallpapers.includes(d.id)) {
        unlockedWallpapers.push(d.id);
        localStorage.setItem('cine_unlocked_wp', JSON.stringify(unlockedWallpapers));
        alert("Wallpaper: [ " + d.name + " ] Unlocked.");
    }
    
    if(window.wpMode === 'home' || window.wpMode === 'both') {
        let bV = document.getElementById('bg-video');
        let bI = document.getElementById('bg-img');
        applyMediaToElements(d.url, bV, bI, true);
        updateSysSetting('homeWallpaper', k);
    }
    
    if(window.wpMode === 'lock' || window.wpMode === 'both') {
        let lV = document.getElementById('lock-video');
        let lI = document.getElementById('lock-img');
        applyMediaToElements(d.url, lV, lI, false);
        updateSysSetting('lockWallpaper', k);
    }
    
    updateWallpaperLoop();
    if(!quiet) openWallpaperMenu();
}

function openWallpaperMenu() {
    let m = document.getElementById('wallpaper-menu');
    let gu = document.getElementById('wp-grid-unlocked');
    let gl = document.getElementById('wp-grid-locked');
    if(!m) return;
    
    if(m.showModal) m.showModal();
    else m.style.display = 'flex';
    m.classList.add('open');
    
    gu.innerHTML = '';
    gl.innerHTML = '';
    
    for(let k in wallpaperRegistry) {
        let d = wallpaperRegistry[k];
        let ul = !d.locked || unlockedWallpapers.includes(d.id);
        let c = document.createElement('div');
        c.className = "wp-card " + (ul ? "" : "wp-locked");
        
        if(ul) {
            let mHtml = "";
            if(d.url.match(/\.(png|jpg|jpeg|gif)$/i)) mHtml = '<img src="' + d.url + '" alt="wp">';
            else mHtml = '<video src="' + d.url + '" preload="auto" playsinline muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>';
            
            c.innerHTML = mHtml + '<div class="wp-info">' + d.name + '</div>';
            c.setAttribute('data-key', k);
            c.onclick = function() {
                setWallpaper(this.getAttribute('data-key'));
                let crds = document.querySelectorAll('.wp-card');
                for(let j=0; j<crds.length; j++) crds[j].classList.remove('active-wp');
                this.classList.add('active-wp');
            };
            gu.appendChild(c);
        } else {
            c.innerHTML = '<div class="wp-info"><i class="fas fa-lock"></i></div>';
            gl.appendChild(c);
        }
    }
    
    let chk = document.getElementById('wp-loop-chk');
    if(chk) {
        chk.checked = sysConfig.wpLoop;
        chk.onchange = e => updateSysSetting('wpLoop', e.target.checked);
    }
}

var sInp = document.getElementById('start-search-input');
if(sInp) {
    sInp.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            let q = this.value.trim();
            if(wallpaperRegistry[q]) {
                setWallpaper(q, true);
                this.value = "";
                this.blur();
            }
        }
    });
}

function toggleStartMenu() {
    let sm = document.getElementById('start-menu');
    if(sm.classList.contains('open')) {
        sm.classList.remove('open');
        setTimeout(function(){ sm.style.display='none'; }, 300);
    } else {
        sm.style.display = 'flex';
        setTimeout(function(){ sm.classList.add('open'); }, 10);
    }
}

document.addEventListener('click', function(e) {
    let sm = document.getElementById('start-menu');
    if(sm && !sm.contains(e.target) && !e.target.closest('.dock-item')) {
        sm.classList.remove('open');
        setTimeout(function(){ sm.style.display='none'; }, 300);
    }
});

var cvsSnow = document.getElementById('snow-fx');
if(cvsSnow) {
    var ctxSnow = cvsSnow.getContext('2d');
    var sW = window.innerWidth, sH = window.innerHeight;
    cvsSnow.width = sW; cvsSnow.height = sH;
    
    var flakes = [];
    for(var f=0; f<30; f++) flakes.push({x: Math.random()*sW, y: Math.random()*sH, r: Math.random()*2, s: Math.random()+0.5});
    
    function drawSnow() {
        if(isDesktopActive) {
            ctxSnow.clearRect(0, 0, sW, sH);
            ctxSnow.fillStyle = "rgba(255,255,255,0.3)";
            for(let i=0; i<flakes.length; i++) {
                let fl = flakes[i];
                ctxSnow.beginPath();
                ctxSnow.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
                ctxSnow.fill();
                fl.y += fl.s;
                if(fl.y > sH) fl.y = 0;
            }
        }
        requestAnimationFrame(drawSnow);
    }
    drawSnow();
}



var fLT = performance.now();
var fFr = 0;
var fLC = 0;

function chkFps(){var nw=performance.now();fFr++;if(nw-fLT>=1000){var fv=document.getElementById('fps-val');if(fv)fv.innerText=fFr;fFr=0;fLT=nw;}requestAnimationFrame(chkFps);}
requestAnimationFrame(chkFps);

/* hide broken wallpaper media so the built-in animated fallback shows through */
(function wpErr(){['bg-img','lock-img'].forEach(function(i){var e=document.getElementById(i);if(e)e.addEventListener('error',function(){var s=e.getAttribute('src')||'';if(s.indexOf('Videos/')===0&&!e.dataset.flat)return;e.style.display='none'})});
['bg-video','lock-video'].forEach(function(i){var e=document.getElementById(i);if(e)e.addEventListener('error',function(){var s=e.getAttribute('src')||'';if(s.indexOf('Videos/')===0&&!e.dataset.flat)return;e.style.display='none'},true)});})();

/* any icon image that fails to load gets a generated letter tile instead of a broken-image glyph */
document.addEventListener('error',function(e){var t=e.target;if(t&&t.closest&&t.closest('.wp-card')&&!((t.getAttribute('src')||'').indexOf('Videos/')===0&&!t.dataset.flat)){t.closest('.wp-card').remove();return}if(!t||t.tagName!=='IMG'||t.dataset.fb||/^(bg-img|lock-img)$/.test(t.id)||((t.getAttribute('src')||'').indexOf('Videos/')===0&&!t.dataset.flat))return;t.dataset.fb=1;
var nm=t.alt||t.title||'';if(!nm){var p=t.closest&&t.closest('[data-id]');var A=p&&window.APPS&&APPS[p.dataset.id];if(A)nm=A.title}nm=(nm||'?').trim();var n=nm[0]||'?',h=0;for(var i=0;i<nm.length;i++)h=(h*31+nm.charCodeAt(i))%360;
t.src='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="hsl('+h+',55%,38%)"/><text x="32" y="43" font-family="Arial" font-weight="700" font-size="32" text-anchor="middle" fill="#fff">'+n.toUpperCase()+'</text></svg>');},true);

/* =====================  WINDOW MANAGER (floating, resizable, snappable)  ===================== */
(function(){
var DOCK=52, MINW=340, MINH=240;
var geo={}; try{geo=JSON.parse(localStorage.getItem('cine_wm2'))||{}}catch(e){}
var SIZES={cine:[1180,720],term:[980,640],files:[920,660],web:[1100,700],settings:[980,680],explorer:[1000,640],store:[1180,740],messages:[980,640]};
function save(){try{localStorage.setItem('cine_wm2',JSON.stringify(geo))}catch(e){}}
function WA(){var d=document.getElementById('dock-container'),dh=d&&d.getBoundingClientRect().height;if(!dh||dh>90)dh=48;return {w:window.innerWidth,h:window.innerHeight-Math.round(dh)}}
function get(id){return document.getElementById('win-'+id)}
function wins(){return Array.prototype.slice.call(document.querySelectorAll('.window.os-win'))}
function box(w){return {x:w.offsetLeft,y:w.offsetTop,w:w.offsetWidth,h:w.offsetHeight}}
function put(w,b,animate){
  if(animate){w.classList.add('anim');clearTimeout(w._at);w._at=setTimeout(function(){w.classList.remove('anim')},300)}
  w.style.left=Math.round(b.x)+'px';w.style.top=Math.round(b.y)+'px';w.style.width=Math.round(b.w)+'px';w.style.height=Math.round(b.h)+'px';
}
function remember(w,id){ if(w.classList.contains('max')||w._snap)return; geo[id]=Object.assign(box(w),{max:false}); save(); }
function clamp(b){var a=WA();b.w=Math.max(MINW,Math.min(b.w,a.w));b.h=Math.max(MINH,Math.min(b.h,a.h));b.x=Math.max(-b.w+120,Math.min(b.x,a.w-120));b.y=Math.max(0,Math.min(b.y,a.h-42));return b}
function initial(id){
  var a=WA(),n=wins().length,s=SIZES[id]||[900,600];
  var w=Math.min(s[0],a.w*.92),h=Math.min(s[1],a.h*.9),off=(n%7)*30;
  return clamp({x:(a.w-w)/2+off-60,y:(a.h-h)/2+off-30,w:w,h:h});
}
var SNAPS={left:function(a){return{x:0,y:0,w:a.w/2,h:a.h}},right:function(a){return{x:a.w/2,y:0,w:a.w/2,h:a.h}},
  tl:function(a){return{x:0,y:0,w:a.w/2,h:a.h/2}},tr:function(a){return{x:a.w/2,y:0,w:a.w/2,h:a.h/2}},
  bl:function(a){return{x:0,y:a.h/2,w:a.w/2,h:a.h/2}},br:function(a){return{x:a.w/2,y:a.h/2,w:a.w/2,h:a.h/2}},
  max:function(a){return{x:0,y:0,w:a.w,h:a.h}}};
function snap(w,id,kind){
  if(kind==='max'){maximize(w,id,true);return}
  if(!w.classList.contains('max')&&!w._snap)remember(w,id);
  w.classList.remove('max');w._snap=kind;put(w,SNAPS[kind](WA()),true);syncMax(w);
}
function maximize(w,id,on){
  if(on){ if(!w.classList.contains('max')&&!w._snap)remember(w,id); w._snap=null; w.classList.add('max'); put(w,SNAPS.max(WA()),true); }
  else{ w.classList.remove('max'); w._snap=null; put(w,clamp(Object.assign({},geo[id]||initial(id))),true); }
  syncMax(w);
}
function syncMax(w){var b=w.querySelector('.wc.m');if(b)b.innerHTML=w.classList.contains('max')?ICON.res:ICON.max}
window.wmToggleMax=function(id){var w=get(id);if(!w)return;maximize(w,id,!(w.classList.contains('max')));focus(id)};
window.wmSnap=function(id,k){var w=get(id);if(w){w.classList.remove('minimized');w.classList.add('active');snap(w,id,k);focus(id)}};
var ICON={min:'<svg viewBox="0 0 12 12"><path d="M1 6h10"/></svg>',max:'<svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" rx="1.5"/></svg>',
  res:'<svg viewBox="0 0 12 12"><rect x="1.5" y="3.5" width="7" height="7" rx="1.2"/><path d="M3.5 3.5v-1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1"/></svg>',
  x:'<svg viewBox="0 0 12 12"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9"/></svg>'};

function focus(id){
  var w=get(id);if(!w)return;
  wins().forEach(function(o){o.classList.toggle('focused',o===w)});
  w.style.zIndex=++highestZ;activeWindowId=id;refreshDock();
}
window.wmFocus=focus;
function refreshDock(){
  var ids={};wins().forEach(function(w){ids[w.id.replace('win-','')]=w});
  document.querySelectorAll('.dock-item').forEach(function(d){
    var w=ids[d.dataset.id];d.classList.toggle('running',!!w);d.classList.toggle('front',!!w&&w.classList.contains('focused')&&!w.classList.contains('minimized'));
  });
}
startImmersiveMode=function(win){ if(win&&win.id)focus(win.id.replace('win-','')) };
endImmersiveMode=function(){
  var vis=wins().filter(function(w){return !w.classList.contains('minimized')});
  if(!vis.length){activeWindowId=null;refreshDock();return}
  vis.sort(function(a,b){return (+a.style.zIndex)-(+b.style.zIndex)});
  focus(vis[vis.length-1].id.replace('win-',''));
};
var _min=minimizeWindow;
minimizeWindow=function(id){var w=get(id);if(w)w.classList.remove('focused');_min(id);refreshDock()};
var _close=closeWindow;
closeWindow=function(id){var w=get(id);if(w){remember(w,id);w.style.transform='scale(.92)';w.style.opacity='0';setTimeout(function(){_close(id);refreshDock()},160);if(activeWindowId===id)activeWindowId=null}};

function decorate(w,id){
  var dat=APPS[id]||{title:id,icon:''};
  w.classList.add('os-win');w.classList.remove('header-visible');
  var h=w.querySelector('.win-header');h.removeAttribute('onmousedown');
  h.innerHTML='<div class="win-title"><img src="'+(dat.icon||'')+'" alt="'+(dat.title||'').replace(/"/g,'')+'"><span>'+(dat.title||id)+'</span></div>'+
    '<div class="win-controls"><div class="wc n" title="Minimize">'+ICON.min+'</div><div class="wc m" title="Maximize">'+ICON.max+'</div><div class="wc x" title="Close">'+ICON.x+'</div></div>';
  h.querySelector('.n').onclick=function(e){e.stopPropagation();minimizeWindow(id)};
  h.querySelector('.m').onclick=function(e){e.stopPropagation();wmToggleMax(id)};
  h.querySelector('.x').onclick=function(e){e.stopPropagation();closeWindow(id)};
  h.querySelector('.win-controls').addEventListener('pointerdown',function(e){e.stopPropagation()});
  h.addEventListener('dblclick',function(){wmToggleMax(id)});
  ['n','s','e','w','nw','ne','sw','se'].forEach(function(d){var r=document.createElement('div');r.className='rz '+d;r.dataset.d=d;w.appendChild(r);r.addEventListener('pointerdown',function(e){startResize(e,w,id,d)})});
  h.addEventListener('pointerdown',function(e){startMove(e,w,id)});
  w.addEventListener('pointerdown',function(){if(!w.classList.contains('focused'))focus(id)},true);
  var g=geo[id];
  put(w,g?clamp(Object.assign({},g)):initial(id));
  if(g&&g.max){maximize(w,id,true);w.classList.remove('anim')}
  syncMax(w);
}
var _open=openWindow;
openWindow=function(id){
  var existed=!!get(id);
  _open(id);
  var w=get(id);if(!w)return;
  if(!existed)decorate(w,id);
  else if(w.classList.contains('minimized'))w.classList.remove('minimized');
  w.classList.add('active');focus(id);
};
toggleApp=function(id){
  var w=get(id);
  if(!w)return openWindow(id);
  if(w.classList.contains('minimized')){w.classList.remove('minimized');w.classList.add('active');focus(id)}
  else if(w.classList.contains('focused'))minimizeWindow(id);
  else focus(id);
};
/* drag to move + snap */
var prev=document.createElement('div');prev.id='snap-prev';document.body.appendChild(prev);
function startMove(e,w,id){
  if(e.button!==0||e.target.closest('.win-controls'))return;
  var sx=e.clientX,sy=e.clientY,moved=false,b=box(w),pend=null,h=e.currentTarget;
  try{h.setPointerCapture(e.pointerId)}catch(_){}
  function mv(ev){
    var dx=ev.clientX-sx,dy=ev.clientY-sy;
    if(!moved){if(Math.abs(dx)+Math.abs(dy)<4)return;moved=true;document.body.classList.add('wm-drag');
      if(w.classList.contains('max')||w._snap){ /* restore under the cursor */
        var g=geo[id]||initial(id),ratio=(sx-b.x)/b.w;w.classList.remove('max','anim');w._snap=null;
        var nw=Math.min(g.w,WA().w),nh=Math.min(g.h,WA().h);b={x:ev.clientX-nw*ratio,y:0,w:nw,h:nh};sx=ev.clientX;sy=ev.clientY-14;
        put(w,b);syncMax(w);dx=0;dy=0;
      }
    }
    put(w,{x:b.x+dx,y:Math.max(0,b.y+dy),w:b.w,h:b.h});
    var a=WA(),X=ev.clientX,Y=ev.clientY,k=null,E=10;
    if(Y<=E){k=(X<E+30)?'tl':(X>a.w-E-30?'tr':'max')}else if(X<=E){k=(Y>a.h-60)?'bl':(Y<60?'tl':'left')}else if(X>=a.w-E){k=(Y>a.h-60)?'br':(Y<60?'tr':'right')}
    pend=k;
    if(k){var s=SNAPS[k](a);prev.style.left=s.x+6+'px';prev.style.top=s.y+6+'px';prev.style.width=s.w-12+'px';prev.style.height=s.h-12+'px';prev.classList.add('on')}else prev.classList.remove('on');
  }
  function up(){
    h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);
    document.body.classList.remove('wm-drag');prev.classList.remove('on');
    if(moved){ if(pend)snap(w,id,pend); else{ var bb=clamp(box(w));put(w,bb);remember(w,id)} }
  }
  h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up);
}
function startResize(e,w,id,d){
  if(e.button!==0)return;e.stopPropagation();e.preventDefault();
  var sx=e.clientX,sy=e.clientY,b=box(w),el=e.currentTarget,a=WA();
  w._snap=null;document.body.classList.add('wm-drag');
  try{el.setPointerCapture(e.pointerId)}catch(_){}
  function mv(ev){
    var dx=ev.clientX-sx,dy=ev.clientY-sy,n={x:b.x,y:b.y,w:b.w,h:b.h};
    if(d.indexOf('e')>-1)n.w=Math.max(MINW,b.w+dx);
    if(d.indexOf('s')>-1)n.h=Math.max(MINH,b.h+dy);
    if(d.indexOf('w')>-1){n.w=Math.max(MINW,b.w-dx);n.x=b.x+(b.w-n.w)}
    if(d.indexOf('n')>-1){n.h=Math.max(MINH,b.h-dy);n.y=Math.max(0,b.y+(b.h-n.h));n.h=b.y+b.h-n.y}
    put(w,n);
  }
  function up(){el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);document.body.classList.remove('wm-drag');remember(w,id)}
  el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
}
window.addEventListener('resize',function(){wins().forEach(function(w){var id=w.id.replace('win-','');
  if(w.classList.contains('max'))put(w,SNAPS.max(WA()));else if(w._snap)put(w,SNAPS[w._snap](WA()));else put(w,clamp(box(w)))})});
/* keep dock indicators fresh */
new MutationObserver(refreshDock).observe(document.getElementById('dock-container'),{childList:true,subtree:true});

/* arrange helpers (used by right-click menu) */
window.wmArrange=function(mode){
  var vis=wins().filter(function(w){return !w.classList.contains('minimized')});var a=WA();
  if(mode==='min'){wins().forEach(function(w){minimizeWindow(w.id.replace('win-',''))});return}
  if(!vis.length)return;
  if(mode==='cascade'){vis.forEach(function(w,i){var id=w.id.replace('win-','');w.classList.remove('max');w._snap=null;put(w,clamp({x:40+i*34,y:20+i*34,w:Math.min(900,a.w*.7),h:Math.min(600,a.h*.75)}),true);remember(w,id)})}
  if(mode==='tile'){var n=vis.length,c=Math.ceil(Math.sqrt(n)),r=Math.ceil(n/c);vis.forEach(function(w,i){w.classList.remove('max');w._snap='tile';put(w,{x:(i%c)*a.w/c,y:Math.floor(i/c)*a.h/r,w:a.w/c,h:a.h/r},true);syncMax(w)})}
};

/* =====================  RIGHT-CLICK MENU  ===================== */
var P={
 img:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg>',
 shuf:'<svg viewBox="0 0 24 24"><path d="M3 6h3c5 0 7 12 12 12h3M3 18h3c1.7 0 3-.9 4-2.2M14 8c1-1.3 2.3-2 4-2h3M18 3l3 3-3 3M18 15l3 3-3 3"/></svg>',
 grid:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
 cas:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3"/></svg>',
 min:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/></svg>',
 lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
 gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
 ref:'<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5"/></svg>',
 full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
 pause:'<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
 side:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/></svg>',
 app:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>',
 big:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M4 4l6 6M20 15v5h-5M20 20l-6-6"/></svg>',
 sml:'<svg viewBox="0 0 24 24"><path d="M10 4v5H5M10 9L4 3M14 20v-5h5M14 15l6 6"/></svg>',
 left:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></svg>',
 info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 pin:'<svg viewBox="0 0 24 24"><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3zM12 14v7"/></svg>',
 desk:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
 edit:'<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/></svg>',
 eye:'<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
 pal:'<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.6 0 2-1 1.4-2-.7-1.2 0-2.5 1.5-2.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/></svg>'
};
var ctx=document.createElement('div');ctx.id='os-ctx';ctx.setAttribute('popover','manual');document.body.appendChild(ctx);
function topOn(){try{if(ctx.showPopover&&!ctx.matches(':popover-open'))ctx.showPopover()}catch(e){}}
function topOff(){try{if(ctx.hidePopover&&ctx.matches(':popover-open'))ctx.hidePopover()}catch(e){}}
window.isFullscreen=function(){return !!document.fullscreenElement};
window.toggleFullscreen=function(){var d=document;return(d.fullscreenElement?d.exitFullscreen():d.documentElement.requestFullscreen()).catch(function(){})};
function item(ic,label,fn,hint,extra){var d=document.createElement('div');d.className='i'+(extra||'');d.innerHTML=P[ic]+'<span>'+label+'</span>'+(hint?'<em>'+hint+'</em>':'');if(fn)d.onclick=function(e){e.stopPropagation();hide();fn()};return d}
function sep(){return document.createElement('hr')}
function chk(on){return on?'✓':''}
function setTheme(v){updateSysSetting('theme',v)}
function personalizeMenu(){
  var c=sysConfig;
  return[
    item('img','Dark mode',function(){setTheme('dark')},chk((c.theme||'dark')!=='light')),
    item('img','Light mode',function(){setTheme('light')},chk(c.theme==='light')),
    sep(),
    item('big','Sharp corners',function(){updateSysSetting('corners','sharp')},chk(c.corners==='sharp')),
    item('big','Default corners',function(){updateSysSetting('corners','default')},chk(!c.corners||c.corners==='default')),
    item('big','Round corners',function(){updateSysSetting('corners','round')},chk(c.corners==='round')),
    sep(),
    item('pause','Reduce animations',function(){updateSysSetting('noAnim',!c.noAnim)},chk(c.noAnim)),
    item('pause','Taskbar blur',function(){updateSysSetting('noGlass',!c.noGlass)},chk(!c.noGlass)),
    item('pause','Optimized background',function(){updateSysSetting('optBg',!c.optBg)},chk(c.optBg)),
    item('pause','Show FPS counter',function(){updateSysSetting('showFps',!c.showFps)},chk(c.showFps)),
    sep(),
    item('gear','More personalization…',function(){openWindow('settings')})
  ]}
function permAllow(id){var d={gamepad:1,autoplay:1,fullscreen:1,clipboard:1,microphone:0,camera:0,geolocation:0},o={};try{o=JSON.parse(localStorage.getItem('app_perm_v1')||'{}')[id]||{}}catch(e){}
  var m={gamepad:'gamepad',autoplay:'autoplay',fullscreen:'fullscreen',clipboard:'clipboard-write',microphone:'microphone',camera:'camera',geolocation:'geolocation'},out=['speaker-selection'];
  Object.keys(m).forEach(function(k){var v=o[k]===undefined?d[k]:o[k];if(v)out.push(m[k])});return out.join('; ')}
window.permAllow=permAllow;
function appInfo(id){var a=APPS[id];if(!a)return;
  try{openWindow('settings');var n=0,t=setInterval(function(){n++;var f=document.getElementById('frame-settings'),w=f&&f.contentWindow;if(w&&w.showAppDetail){clearInterval(t);w.showAppDetail(id)}else if(n>40){clearInterval(t);appInfoDialog(id)}},150);return}catch(e){}
  appInfoDialog(id)}
function appInfoDialog(id){var a=APPS[id];if(!a)return;
  var light=document.documentElement.classList.contains('light'),bg=light?'#f9f9f9':'#2b2b2b',fg=light?'#1a1a1a':'#fff',sub=light?'#5f5f5f':'#c5c5c5',bd=light?'rgba(0,0,0,.12)':'rgba(255,255,255,.12)',cd=light?'#fff':'rgba(255,255,255,.05)';
  function E(t){return String(t==null?'':t).replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
  function B(n){return n>=1048576?(n/1048576).toFixed(1)+' MB':n>=1024?(n/1024).toFixed(1)+' KB':n+' bytes'}
  function D(t){return t?new Date(t).toLocaleString([],{dateStyle:'medium',timeStyle:'short'}):'Unknown'}
  var use={};try{use=JSON.parse(localStorage.getItem('app_use_v1')||'{}')[id]||{}}catch(e){}
  var rec=a.rec||{},q=null;try{q=localStorage.getItem('app_q_'+id)}catch(e){}
  var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:2147483300;background:rgba(0,0,0,.45);display:grid;place-items:center;font:14px "Segoe UI Variable Text","Segoe UI",system-ui,sans-serif';
  var icon=a.icon?'<img src="'+E(a.icon)+'" style="width:64px;height:64px;border-radius:14px;object-fit:cover" alt="">':'';
  function row(k,v,extra){return'<div style="display:flex;justify-content:space-between;gap:16px;padding:11px 14px;background:'+cd+';border:1px solid '+bd+';border-radius:4px;margin-bottom:2px"><span style="color:'+sub+'">'+k+'</span><span style="text-align:right;word-break:break-word" '+(extra||'')+'>'+v+'</span></div>'}
  function btn(i,t,pri){return'<button id="'+i+'" style="height:32px;padding:0 16px;border-radius:4px;font:inherit;cursor:pointer;border:1px solid '+(pri?'transparent':bd)+';background:'+(pri?'var(--accent,#0067c0)':(light?'#fdfdfd':'rgba(255,255,255,.07)'))+';color:'+(pri?'#fff':fg)+'">'+t+'</button>'}
  var run=!!get(id);
  function draw(extra){
    var pin=!!a.pinned,desk=desktopLayout.some(function(d){return d.id===id});
    o.innerHTML='<div style="width:min(520px,94vw);max-height:92vh;overflow:auto;background:'+bg+';color:'+fg+';border:1px solid '+bd+';border-radius:8px;box-shadow:0 32px 80px rgba(0,0,0,.5)"><div style="display:flex;align-items:center;gap:16px;padding:20px 20px 14px">'+icon+'<div style="flex:1;min-width:0"><div style="font-size:20px;font-weight:600">'+E(a.title)+'</div><div style="color:'+sub+';font-size:13px">Version 1.0 &nbsp;|&nbsp; '+(a.user?'Unknown publisher':'Windows 11')+'</div></div><button id="aix" style="width:32px;height:32px;border:0;background:none;color:'+fg+';font-size:15px;cursor:pointer;border-radius:4px">✕</button></div><div style="padding:0 20px 8px"><div style="font-size:13px;font-weight:600;margin:6px 0 8px">App information</div>'
     +row('Status',run?'Running':'Not running')
     +row('Type',a.user?'Installed app (web app)':'System app')
     +row('Source',a.user?(rec.file?'From file “'+E(rec.file)+'”':'Installed by you'):'Built into Windows 11')
     +row('Installed',a.user?D(rec.added):'With Windows 11')
     +row('Last opened',use.last?D(use.last):'Not opened yet')
     +row('Times opened',String(use.n||0))
     +row('App size','<span id="aisz">Calculating…</span>')
     +row('Contents','<span id="aict">…</span>')
     +(a.user?row('Main file',E(rec.entry||'index.html')):'')
     +row('Graphics quality',q?q.charAt(0).toUpperCase()+q.slice(1)+' <a id="aiq" style="color:var(--accent,#4cc2ff);cursor:pointer;margin-left:8px">Reset</a>':'Ask each time')
     +row('Pinned to taskbar',pin?'Yes':'No')+row('On desktop',desk?'Yes':'No')
     +row('Stored in','Windows 11 app storage in this browser')
     +'</div><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;padding:14px 20px 18px;border-top:1px solid '+bd+';margin-top:8px">'+btn('aio',run?'Switch to app':'Open',1)+btn('aip',pin?'Unpin from taskbar':'Pin to taskbar')+btn('aid',desk?'On desktop':'Add to desktop')+(a.user&&window.AppHost?btn('aiu','Uninstall'):'')+'</div></div>';
    var $=function(i){return o.querySelector('#'+i)};
    $('aix').onclick=function(){o.remove()};o.onclick=function(e){if(e.target===o)o.remove()};
    $('aio').onclick=function(){o.remove();run?toggleApp(id):openWindow(id)};
    $('aip').onclick=function(){a.pinned=!pin;syncPins();renderUI();draw()};
    $('aid').onclick=function(){if(desk)return;var n=desktopLayout.length;desktopLayout.push({id:id,x:24+(n%6)*100,y:24+Math.floor(n/6)*110});saveDesktop();draw()};
    var u=$('aiu');if(u)u.onclick=function(){o.remove();OSDlg.confirm('Uninstall “'+a.title+'”? The app and its data will be removed from this PC.',function(){AppHost.uninstall(id).then(function(){renderUI();loadDesktop()})},'Uninstall')};
    var rq=$('aiq');if(rq)rq.onclick=function(){try{localStorage.removeItem('app_q_'+id)}catch(e){}q=null;draw()};
    fill()}
  function fill(){var sz=o.querySelector('#aisz'),ct=o.querySelector('#aict');if(!sz)return;
    if(a.user&&window.AppHost&&AppHost.loadFiles){AppHost.loadFiles(id).then(function(f){if(!f){sz.textContent='Unknown';ct.textContent='—';return}var ks=Object.keys(f),tot=0,c={code:0,img:0,aud:0,vid:0,oth:0};ks.forEach(function(k){tot+=f[k].length||0;if(/\.(html?|js|mjs|css|json|wasm)$/i.test(k))c.code++;else if(/\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(k))c.img++;else if(/\.(mp3|ogg|wav|m4a|flac|aac)$/i.test(k))c.aud++;else if(/\.(mp4|webm|mov)$/i.test(k))c.vid++;else c.oth++});
      var p=[];if(c.code)p.push(c.code+' code');if(c.img)p.push(c.img+' images');if(c.aud)p.push(c.aud+' audio');if(c.vid)p.push(c.vid+' video');if(c.oth)p.push(c.oth+' other');sz.textContent=B(tot)+' ('+ks.length+' files)';ct.textContent=p.join(' · ')||'—'}).catch(function(){sz.textContent='Unknown';ct.textContent='—'})}
    else{var h=window._INLINE_APPS&&_INLINE_APPS[a.path];sz.textContent=h?B(h.length):'Built in';ct.textContent=h?'1 page (HTML, CSS and scripts together)':'—'}}
  draw();document.body.appendChild(o)}
function appMenu(x,y,id,src){
  var a=APPS[id];if(!a)return;var w=get(id),running=!!w,pin=!!a.pinned,desk=desktopLayout.some(function(d){return d.id===id}),items=[];
  var head=document.createElement('div');head.className='i hd';head.innerHTML='<img src="'+a.icon+'" alt=""><span>'+a.title+'</span><em>'+(running?'Running':'')+'</em>';items.push(head,sep());
  items.push(item('app',running?'Switch to window':'Open',function(){running?toggleApp(id):openWindow(id)}));
  if(running){items.push(item('min','Minimize',function(){minimizeWindow(id)}));items.push(item('x','Close window',function(){closeWindow(id)}))}
  items.push(sep());
  items.push(item('pin',pin?'Unpin from taskbar':'Pin to taskbar',function(){a.pinned=!pin;syncPins();renderUI()}));
  items.push(item('desk',desk?'Already on desktop':'Add to desktop',function(){if(desk)return;var n=desktopLayout.length;desktopLayout.push({id:id,x:24+(n%6)*100,y:24+Math.floor(n/6)*110});saveDesktop()},null,desk?' dis':''));
  if(src&&src.kind==='desktop'){var it=desktopLayout[src.idx];
    items.push(sep());
    items.push(item('edit','Rename',function(){OSDlg.prompt('Enter new name:',it.customName||a.title,function(nm){if(nm!==null){it.customName=nm.trim()||a.title;saveDesktop()}})}));
    items.push(item('eye',it.hideName?'Show name':'Hide name',function(){it.hideName=!it.hideName;saveDesktop()}));
    items.push(item('img','Change icon…',function(){OSDlg.prompt('Image URL for a custom icon (leave empty to reset):',it.customIcon||'',function(u){if(u!==null){if(u.trim())it.customIcon=u.trim();else delete it.customIcon;saveDesktop()}})}));
    items.push(item('x','Remove from desktop',function(){desktopLayout.splice(src.idx,1);saveDesktop()}))}
  items.push(sep());
  if(a.user&&window.AppHost)items.push(item('trash','Uninstall',function(){OSDlg.confirm('Uninstall \u201c'+a.title+'\u201d? The app and its data will be removed from this PC.',function(){AppHost.uninstall(id).then(function(){renderUI();loadDesktop()})},'Uninstall')},null,' red'));
  items.push(item('info','App info',function(){appInfo(id)}));
  show(x,y,items)}
function folderMenu(x,y,idx){var it=desktopLayout[idx];if(!it)return;
  show(x,y,[item('app','Open folder',function(){var el=document.querySelector('.desktop-app[data-idx="'+idx+'"]');if(el)el.click()}),sep(),
   item('edit','Rename',function(){OSDlg.prompt('Folder name:',it.customName||'Folder',function(nm){if(nm!==null){it.customName=nm.trim()||'Folder';saveDesktop()}})}),
   item('eye',it.hideName?'Show name':'Hide name',function(){it.hideName=!it.hideName;saveDesktop()}),sep(),
   item('x','Delete folder',function(){desktopLayout.splice(idx,1);saveDesktop()},null,' red')])}
function subm(ic,label,list){var d=document.createElement('div');d.className='i';d.innerHTML=P[ic]+'<span>'+label+'</span><em>›</em>';var s=document.createElement('div');s.className='sub';list.forEach(function(x){s.appendChild(x)});d.appendChild(s);
  d.addEventListener('mouseenter',function(){var r=d.getBoundingClientRect();s.classList.toggle('flip',r.right+230>window.innerWidth);s.style.top='';requestAnimationFrame(function(){var sr=s.getBoundingClientRect(),o=sr.bottom-(window.innerHeight-8);if(o>0)s.style.top=(-6-o)+'px'})});return d}
function hide(){topOff();ctx.style.display='none';ctx.innerHTML=''}
function show(x,y,children){
  hideAllCtx();ctx.innerHTML='';children.forEach(function(c){ctx.appendChild(c)});ctx.style.display='block';topOn();
  var r=ctx.getBoundingClientRect();ctx.style.left=Math.max(6,Math.min(x,window.innerWidth-r.width-6))+'px';ctx.style.top=Math.max(6,Math.min(y,window.innerHeight-r.height-6))+'px';
}
function randomWp(){var keys=Object.keys(wallpaperRegistry).filter(function(k){var d=wallpaperRegistry[k];return !d.locked||unlockedWallpapers.indexOf(d.id)>-1});var k=keys[Math.floor(Math.random()*keys.length)];var m=window.wpMode;window.wpMode='home';
  var chk=document.getElementById('wallpaper-menu');var d=wallpaperRegistry[k];var bV=document.getElementById('bg-video'),bI=document.getElementById('bg-img');applyMediaToElements(d.url,bV,bI,true);updateSysSetting('homeWallpaper',k);updateWallpaperLoop();window.wpMode=m;showToastSafe('Wallpaper: '+d.name)}
function showToastSafe(t){try{showNotification('Wallpaper',t)}catch(e){}}
window.lockNow=lockNow;function lockNow(){var scr=document.getElementById('lock-screen');isDesktopActive=false;scr.classList.remove('slide-up');scr.classList.add('active');try{document.getElementById('bg-video').pause();var lv=document.getElementById('lock-video');if(lv.style.display!=='none')lv.play().catch(function(){})}catch(e){}}
function qrow(list){var d=document.createElement('div');d.className='qrow';list.forEach(function(q){var e=document.createElement('div');e.className='q';e.dataset.t=q[1];e.innerHTML=P[q[0]];e.onclick=function(ev){ev.stopPropagation();hide();q[2]()};d.appendChild(e)});return d}
function desktopMenu(x,y){
  var openList=Object.keys(APPS).filter(function(k){return APPS[k].pinned||APPS[k].user}).map(function(k){var d=document.createElement('div');d.className='i';d.innerHTML='<img src="'+APPS[k].icon+'" alt=""><span>'+APPS[k].title+'</span>';d.onclick=function(e){e.stopPropagation();hide();openWindow(k)};return d});
  var sb=document.getElementById('right-sidebar'),sbHidden=sb&&sb.style.display==='none';
  show(x,y,[
    qrow([['big','Large icons',function(){toggleDesktopSize(true)}],['sml','Small icons',function(){toggleDesktopSize(false)}],['ref','Refresh',function(){location.reload()}],['pal','Wallpaper',openWallpaperMenu],['lock','Lock',lockNow]]),
    subm('big','View',[item('big','Large icons',function(){toggleDesktopSize(true)}),item('sml','Small icons',function(){toggleDesktopSize(false)}),item('side',sbHidden?'Show widgets':'Hide widgets',function(){if(sb)sb.style.display=sbHidden?'':'none'})]),
    subm('app','Open app',openList),
    subm('grid','Arrange windows',[item('left','Tile all',function(){wmArrange('tile')}),item('cas','Cascade',function(){wmArrange('cascade')}),item('min','Show desktop (minimize all)',function(){wmArrange('min')})]),
    sep(),
    item('img','Change wallpaper',openWallpaperMenu),
    item('shuf','Random wallpaper',randomWp),
    item('pause',sysConfig.optBg?'Resume animated wallpaper':'Pause animated wallpaper',function(){updateSysSetting('optBg',!sysConfig.optBg)}),
    sep(),
    subm('pal','Personalize',personalizeMenu()),
    item('gear','Settings',function(){openWindow('settings')}),
    item('full',isFullscreen()?'Exit full screen':'Enter full screen',toggleFullscreen,'F11'),
    sep(),
    item('info','About Windows 11',function(){openUpdateLog()})
  ]);
}
function iconMenu(x,y,el){var pl=el.dataset.place,bin=pl==='bin',its=[item('app','Open',function(){ExplorerHost.open(pl)})];
  if(bin)its.push(item('trash','Empty Recycle Bin',function(){ExplorerHost.open('bin');setTimeout(function(){try{document.getElementById('frame-explorer').contentWindow.emptyBin()}catch(e){}},700)},null,' red'));
  its.push(sep(),item('info','Properties',function(){try{showNotification(bin?'Recycle Bin':'This PC',bin?'Deleted files stay here until you empty it.':'Local Disk (C:) \u00b7 Web Edition')}catch(e){}}));
  show(x,y,its)}
function windowMenu(x,y,id){
  var w=get(id),mx=w.classList.contains('max');
  show(x,y,[item('res',mx?'Restore':'Maximize',function(){wmToggleMax(id)}),item('min','Minimize',function(){minimizeWindow(id)}),sep(),
    item('left','Snap left',function(){wmSnap(id,'left')}),item('left','Snap right',function(){wmSnap(id,'right')}),item('grid','Snap to quarter',function(){wmSnap(id,'tr')}),sep(),item('x','Close',function(){closeWindow(id)})]);
}
document.addEventListener('contextmenu',function(e){
  var t=e.target;
  if(t.closest&&t.closest('.win-header')){var w=t.closest('.window');e.preventDefault();e.stopImmediatePropagation();focus(w.id.replace('win-',''));windowMenu(e.clientX,e.clientY,w.id.replace('win-',''));return}
  var dic=t.closest&&t.closest('.d-ico[data-place]');if(dic){e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll('.d-ico.sel').forEach(function(z){z.classList.remove('sel')});dic.classList.add('sel');iconMenu(e.clientX,e.clientY,dic);return}
  var ap=t.closest&&t.closest('.desktop-app,.dock-item[data-id],.drawer-item[data-id],.pinned-item[data-id],.rec-item[data-id]');
  if(ap){e.preventDefault();e.stopImmediatePropagation();
    if(ap.classList.contains('desktop-app')){var ix=+ap.dataset.idx,di=desktopLayout[ix];if(di&&di.type==='folder')folderMenu(e.clientX,e.clientY,ix);else if(di)appMenu(e.clientX,e.clientY,di.id,{kind:'desktop',idx:ix})}
    else appMenu(e.clientX,e.clientY,ap.dataset.id,{kind:'shell'});return}
  if(t.closest&&t.closest('#dock-container')&&!t.closest('.dock-item,.tray-item')){e.preventDefault();e.stopImmediatePropagation();show(e.clientX,e.clientY,personalizeMenu());return}
  if(t.closest&&t.closest('.window,#dock-container,dialog,#start-menu,#app-drawer,.os-context-menu,#os-ctx,input,textarea'))return;
  e.preventDefault();e.stopImmediatePropagation();desktopMenu(e.clientX,e.clientY);
},true);
document.addEventListener('pointerdown',function(e){if(!e.target.closest('#os-ctx'))hide()},true);
window.addEventListener('blur',hide);
document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});
})();

/* =====================  DAY LOGOS  ===================== */
(function(){
var names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],last='';
function setLogos(){
  var d=names[new Date().getDay()];if(d===last)return;last=d;['lock-day-large','lbl-day'].forEach(function(i){var e=document.getElementById(i);if(e)e.innerHTML=''});
  ['lock-day-large','lbl-day'].forEach(function(id){var el=document.getElementById(id);if(!el)return;
    var im=new Image();im.className='day-logo';im.alt=d.toUpperCase();
    im.onload=function(){el.innerHTML='';el.appendChild(im)};im.src='Videos/Day-'+d+'.png';
    im.onerror=function(){el.textContent=d.toUpperCase()};});
}
var _uc=updateClock;updateClock=function(){_uc();var d=names[new Date().getDay()];if(d!==last)setLogos()};
setLogos();
})();

/* =====================  FLAT-FILE FALLBACK for Videos/*  ===================== */
document.addEventListener('error',function(e){
  var t=e.target;if(!t||!t.tagName)return;
  var tag=t.tagName;if(tag!=='VIDEO'&&tag!=='IMG'&&tag!=='SOURCE')return;
  var src=t.getAttribute('src')||'';if(src.indexOf('Videos/')!==0||t.dataset.flat)return;
  t.dataset.flat=1;e.stopPropagation();t.setAttribute('src',src.replace('Videos/',''));
  if(tag==='SOURCE'&&t.parentNode&&t.parentNode.load)t.parentNode.load();
  else if(tag==='VIDEO'){t.load();if(!t.paused||t.autoplay)t.play().catch(function(){})}
},true);


/* =====================  WINDOWS 11 SHELL: tray, quick settings, calendar, start search  ===================== */
(function(){
var $=function(i){return document.getElementById(i)};
window.closeFlyouts=function(){['qs-panel','cal-panel'].forEach(function(i){var e=$(i);if(e)e.classList.remove('open')})};
function toggleFly(id){var e=$(id),was=e.classList.contains('open');closeFlyouts();if(!was){var sm=$('start-menu');if(sm&&sm.classList.contains('open'))toggleStartMenu();e.classList.add('open')}}
$('tray-qs').onclick=function(e){e.stopPropagation();toggleFly('qs-panel')};
$('tray-clock').onclick=function(e){e.stopPropagation();calM=new Date();drawCal();toggleFly('cal-panel')};
['qs-panel','cal-panel'].forEach(function(i){$(i).addEventListener('click',function(e){e.stopPropagation()})});
document.addEventListener('click',closeFlyouts);
$('tray-show').onclick=function(e){e.stopPropagation();var ws=Array.prototype.slice.call(document.querySelectorAll('.window.os-win'));var anyVis=ws.some(function(w){return !w.classList.contains('minimized')});ws.forEach(function(w){var id=w.id.replace('win-','');if(anyVis&&!w.classList.contains('minimized'))minimizeWindow(id);else if(!anyVis&&w.classList.contains('minimized'))toggleApp(id)})};
// clock
function tick(){var n=new Date(),h=n.getHours(),m=('0'+n.getMinutes()).slice(-2),t=sysConfig.clock24?('0'+h).slice(-2)+':'+m:(h%12||12)+':'+m+(h>=12?' PM':' AM');$('tc-time').textContent=t;$('tc-date').textContent=(n.getMonth()+1)+'/'+n.getDate()+'/'+n.getFullYear()}
tick();setInterval(tick,1000);
// calendar
var calM=new Date();
function drawCal(){var n=new Date(),y=calM.getFullYear(),m=calM.getMonth();
 $('cal-big').textContent=n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});$('cal-sub').textContent=n.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'});
 $('cal-title').textContent=calM.toLocaleDateString([], {month:'long',year:'numeric'});
 var g='';['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d){g+='<i class="dow">'+d+'</i>'});
 var first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();
 for(var i=first-1;i>=0;i--)g+='<i class="o">'+(prev-i)+'</i>';
 for(var d=1;d<=dim;d++)g+='<i'+(d===n.getDate()&&m===n.getMonth()&&y===n.getFullYear()?' class="today"':'')+'>'+d+'</i>';
 var left=(7-((first+dim)%7))%7;for(var k=1;k<=left;k++)g+='<i class="o">'+k+'</i>';
 $('cal-grid').innerHTML=g}
$('cal-prev').onclick=function(){calM=new Date(calM.getFullYear(),calM.getMonth()-1,1);drawCal()};
$('cal-next').onclick=function(){calM=new Date(calM.getFullYear(),calM.getMonth()+1,1);drawCal()};
setInterval(function(){if($('cal-panel').classList.contains('open')){var n=new Date();$('cal-big').textContent=n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}},1000);
// quick settings tiles
var tiles=[['Wi-Fi','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></svg>',true],['Bluetooth','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l10 10-5 5V2l5 5L7 17"/></svg>',true],['Airplane mode','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',false],['Battery saver','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="17" height="10" rx="2.2"/><path d="M22 10.5v3M8 12h5M10.5 9.5v5"/></svg>',function(){return !!sysConfig.optBg},function(v){updateSysSetting('optBg',v)}],['Night light','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',false,function(v){$('night-overlay').style.opacity=v?1:0}],['Full screen','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',function(){return !!document.fullscreenElement},function(v){v?document.documentElement.requestFullscreen().catch(function(){}):document.fullscreenElement&&document.exitFullscreen()}]];
tiles.push(['Dark mode','<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',function(){return sysConfig.theme!=='light'},function(on){updateSysSetting('theme',on?'dark':'light')}]);var qt=$('qs-tiles');tiles.forEach(function(t){var d=document.createElement('div'),st=typeof t[2]==='function'?t[2]():t[2];d.className='qs-tile'+(st?' on':'');d.innerHTML='<span>'+t[1]+'</span><b>'+t[0]+'</b>';
 d.onclick=function(){st=!st;d.classList.toggle('on',st);if(t[3])t[3](st)};qt.appendChild(d)});
$('qs-bright').oninput=function(){document.documentElement.style.filter='brightness('+(this.value/100)+')'};
$('qs-vol').oninput=function(){var v=this.value/100;var all=[document];Array.prototype.forEach.call(document.querySelectorAll('iframe'),function(f){try{all.push(f.contentDocument)}catch(e){}});all.forEach(function(d){if(!d)return;Array.prototype.forEach.call(d.querySelectorAll('video,audio'),function(m){try{m.volume=v}catch(e){}})})};
if(navigator.getBattery)navigator.getBattery().then(function(b){function u(){$('qs-batt').textContent='Battery '+Math.round(b.level*100)+'%'+(b.charging?' (charging)':'')}u();b.addEventListener('levelchange',u);b.addEventListener('chargingchange',u)}).catch(function(){});else $('qs-batt').textContent='Battery 100%';
// start menu search filters pinned apps
var si=$('start-search-input');if(si)si.addEventListener('input',function(){var v=si.value.toLowerCase();document.querySelectorAll('#pinned-grid .pinned-item, #rec-grid .rec-item').forEach(function(e){e.style.display=(!v||e.textContent.toLowerCase().indexOf(v)>-1)?'':'none'})});
})();


/* =====================  DESKTOP ICONS, WIDGETS, POWER MENU  ===================== */
(function(){
var $=function(i){return document.getElementById(i)};
// desktop icons
var di=$('desk-icons');
di.addEventListener('click',function(e){e.stopPropagation();var t=e.target.closest('.d-ico');document.querySelectorAll('.d-ico.sel').forEach(function(x){x.classList.remove('sel')});if(t)t.classList.add('sel')});
function openIco(t){if(!t)return;if(t.dataset.place&&window.ExplorerHost)ExplorerHost.open(t.dataset.place);else if(t.dataset.app)toggleApp(t.dataset.app)}
di.addEventListener('dblclick',function(e){openIco(e.target.closest('.d-ico'))});
var lastTap=0,lastEl=null;di.addEventListener('pointerup',function(e){if(e.pointerType!=='touch')return;var t=e.target.closest('.d-ico'),n=Date.now();if(t&&t===lastEl&&n-lastTap<450){openIco(t);lastTap=0}else{lastTap=n;lastEl=t}});
document.addEventListener('keydown',function(e){if(e.key==='Enter'){var s=document.querySelector('.d-ico.sel');if(s&&!e.target.closest('input,textarea,select'))openIco(s)}});
document.addEventListener('click',function(e){if(!e.target.closest('.d-ico'))document.querySelectorAll('.d-ico.sel').forEach(function(x){x.classList.remove('sel')})});
// power
window.togglePower=function(){$('power-pop').classList.toggle('open')};
document.addEventListener('click',function(){var p=$('power-pop');if(p)p.classList.remove('open')});
// widgets
var wp=$('wid-panel');
$('wid-btn').onclick=function(e){e.stopPropagation();var was=wp.classList.contains('open');closeFlyouts();wp.classList.remove('open');var sm=$('start-menu');if(sm&&sm.classList.contains('open'))toggleStartMenu();if(!was)wp.classList.add('open')};
wp.addEventListener('click',function(e){e.stopPropagation()});
var _cf=window.closeFlyouts;window.closeFlyouts=function(){_cf();wp.classList.remove('open')};
document.addEventListener('click',function(){wp.classList.remove('open')});
function wtick(){var n=new Date(),h=n.getHours();$('wd-greet').textContent=h<5?'Still up?':h<12?'Good morning':h<18?'Good afternoon':'Good evening';
 $('wd-time').textContent=n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});$('wd-date').textContent=n.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'});
 $('wb-day').textContent=n.toLocaleDateString([], {weekday:'long'});$('wb-date').textContent=n.toLocaleDateString([], {month:'short',day:'numeric'})}
wtick();setInterval(wtick,1000);
// focus timer
var total=25*60,left=total,run=null;
function fmt(){var m=Math.floor(left/60),s=left%60;$('wd-tm').textContent=('0'+m).slice(-2)+':'+('0'+s).slice(-2);$('wd-pb').style.width=(100-left/total*100)+'%'}
function stop(){clearInterval(run);run=null;$('wd-go').textContent='Start'}
$('wd-go').onclick=function(){if(run){stop();return}$('wd-go').textContent='Pause';run=setInterval(function(){left--;fmt();if(left<=0){stop();left=total;fmt();try{notify&&notify('Focus timer','Time is up. Take a break!')}catch(e){}}},1000)};
$('wd-rs').onclick=function(){stop();left=total;fmt()};
$('wd-len').onchange=function(){stop();total=this.value*60;left=total;fmt()};fmt();
// notes
var nt=$('wd-note');try{nt.value=localStorage.getItem('win_note')||''}catch(e){}
nt.oninput=function(){try{localStorage.setItem('win_note',nt.value)}catch(e){}};
// device
$('wd-cpu').textContent=navigator.hardwareConcurrency||'-';$('wd-mem').textContent=navigator.deviceMemory?navigator.deviceMemory+' GB':'-';$('wd-bat').textContent='100%';
if(navigator.getBattery)navigator.getBattery().then(function(b){function u(){$('wd-bat').textContent=Math.round(b.level*100)+'%'}u();b.addEventListener('levelchange',u)}).catch(function(){});
})();

/* =====================  THEME + ADAPTIVE WALLPAPER (dark -> light)  ===================== */
(function(){
var BLOOM=function(){return '<div class="bl bl-d" style="background:url(Wallpapers/bloom-dark.jpg) center/cover no-repeat #030a1c"></div><div class="bl bl-l" style="background:url(Wallpapers/bloom-light.jpg) center/cover no-repeat #bcd4f4"></div>'};
window.bloomHTML=BLOOM;
document.getElementById('wp-bloom').innerHTML=BLOOM();document.getElementById('lock-bloom').innerHTML=BLOOM();
var _am=applyMediaToElements;
applyMediaToElements=function(url,v,i,isBg){
  var bl=document.getElementById(isBg?'wp-bloom':'lock-bloom');
  if(url==='bloom'){v.style.display='none';try{v.pause()}catch(e){}i.style.display='none';bl.style.display='block';return}
  bl.style.display='none';_am(url,v,i,isBg);
};
function adaptable(k){return k!=='Bloom'&&sysConfig.wpAdapt!==false&&!(sysConfig.wpNoAdapt||{})[k]}
window.wpAdaptable=adaptable;
window.applyTheme=function(){
  var light=sysConfig.theme==='light',h=document.documentElement;
  h.classList.toggle('light',light);
  document.body.classList.toggle('wp-light',light&&adaptable(sysConfig.homeWallpaper));
  var ls=document.getElementById('lock-screen');if(ls)ls.classList.toggle('lock-light',light&&adaptable(sysConfig.lockWallpaper));
  Array.prototype.forEach.call(document.querySelectorAll('iframe'),function(f){try{f.contentDocument.documentElement.classList.toggle('light',light)}catch(e){}});
  var m=document.querySelector('meta[name=color-scheme]');
};
var _sw=setWallpaper;
setWallpaper=function(k,n,q){_sw(k,n,q);applyTheme()};
var _owm=openWallpaperMenu;
openWallpaperMenu=function(){
  _owm();
  var ch=document.getElementById('wp-adapt-chk');if(ch){ch.checked=sysConfig.wpAdapt!==false;ch.onchange=function(){updateSysSetting('wpAdapt',ch.checked);openWallpaperMenu()}}
  document.querySelectorAll('.wp-card').forEach(function(c){
    var k=c.getAttribute('data-key');if(!k)return;
    if(k==='Bloom'){var m=c.querySelector('video,img');if(m)m.remove();var d=document.createElement('div');d.className='wp-bloom-prev';d.innerHTML=BLOOM();c.insertBefore(d,c.firstChild);d.querySelector('.bl-l').style.opacity=sysConfig.theme==='light'?1:0}
    var b=document.createElement('button');b.className='wp-ad'+(k==='Bloom'||adaptable(k)?' on':'');b.title=k==='Bloom'?'Has a dark and a light version':(adaptable(k)?'Adapts to light mode (click to turn off)':'Stays the same in light mode (click to turn on)');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    if(k!=='Bloom')b.onclick=function(e){e.stopPropagation();var o=sysConfig.wpNoAdapt||{};o[k]=adaptable(k);updateSysSetting('wpNoAdapt',o);applyTheme();openWallpaperMenu()};
    c.appendChild(b);
  });
};
document.addEventListener('DOMContentLoaded',function(){applyTheme()});
applyTheme();
/* the first time the iframe app loads, give it the theme */
document.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IFRAME')applyTheme()},true);
/* user name in start menu */
window.applyUser=function(){var n=sysConfig.userName||'User';document.querySelectorAll('.user-role').forEach(function(e){e.textContent=n})};
document.addEventListener('DOMContentLoaded',applyUser);applyUser();
})();

/* =====================  WINDOWS 11 OOBE  ===================== */
(function(){
var KEY='win_oobe';
function done(){try{return !!localStorage.getItem(KEY)}catch(e){return false}}
window.oobeDone=done;
var st={region:'United States',kb:'US',kb2:null,device:'DESKTOP-'+Math.random().toString(36).slice(2,9).toUpperCase(),mode:'personal',acct:'offline',email:'',user:'',pw:'',
  priv:{location:true,find:true,diag:true,ink:true,tailored:true,ads:true},uses:[]};
try{var rg=(navigator.language||'en-US').split('-')[1];var MAP={US:'United States',GB:'United Kingdom',CA:'Canada',AU:'Australia',DE:'Germany',FR:'France',IN:'India',JP:'Japan',MX:'Mexico',BR:'Brazil',ES:'Spain',IT:'Italy'};if(MAP[rg])st.region=MAP[rg]}catch(e){}
var $=function(i){return document.getElementById(i)};
var P1='#0f6cbd',P2='#2f9be6',T1='#2cb3a8';
var PAGES_UNUSED;
/* illustrations (same soft style as the system one) */
function wrap(inner){return '<svg viewBox="0 0 280 230"><defs><linearGradient id="oa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6df0"/><stop offset="1" stop-color="#6a3fdc"/></linearGradient><linearGradient id="ob" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34c3b7"/><stop offset="1" stop-color="#1a9fa0"/></linearGradient><linearGradient id="oc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fc6ff"/><stop offset="1" stop-color="#2a78f0"/></linearGradient><filter id="osh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#1c3b6b" flood-opacity=".18"/></filter></defs>'+inner+'</svg>'}
var ILL={
 globe:wrap('<circle cx="140" cy="108" r="78" fill="url(#oc)" filter="url(#osh)"/><g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"><ellipse cx="140" cy="108" rx="34" ry="78"/><path d="M62 108h156M72 72h136M72 144h136"/></g><path d="M118 62c10-6 24-4 28 4s-6 12-4 20-14 10-22 4-14-18-2-28z" fill="#fff" fill-opacity=".35"/><path d="M168 118c8-4 18 2 16 12s-12 14-18 8-4-16 2-20z" fill="#fff" fill-opacity=".35"/><path d="M204 44c14 0 24 10 24 24 0 18-24 40-24 40s-24-22-24-40c0-14 10-24 24-24z" fill="url(#ob)" filter="url(#osh)"/><circle cx="204" cy="68" r="8" fill="#fff"/><ellipse cx="140" cy="206" rx="70" ry="8" fill="#1c3b6b" opacity=".08"/>'),
 kb:wrap('<rect x="26" y="70" width="228" height="108" rx="12" fill="#fff" filter="url(#osh)"/><g fill="#dfe8f5">'+(function(){var r='';for(var y=0;y<4;y++)for(var x=0;x<10;x++){if(y==3&&(x>1&&x<8))continue;r+='<rect x="'+(40+x*21)+'" y="'+(84+y*22)+'" width="17" height="17" rx="3.5"/>'}return r})()+'<rect x="82" y="150" width="116" height="17" rx="3.5"/></g><rect x="104" y="84" width="17" height="17" rx="3.5" fill="url(#oc)"/><circle cx="214" cy="52" r="26" fill="url(#ob)" filter="url(#osh)"/><path d="M203 52l8 8 14-16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),
 kb2:wrap('<rect x="22" y="104" width="150" height="72" rx="10" fill="#fff" filter="url(#osh)"/><rect x="108" y="54" width="150" height="72" rx="10" fill="#fff" filter="url(#osh)"/><g fill="#dfe8f5">'+(function(){var r='';for(var y=0;y<3;y++)for(var x=0;x<6;x++){r+='<rect x="'+(34+x*23)+'" y="'+(116+y*17)+'" width="18" height="12" rx="3"/>'}for(var y=0;y<3;y++)for(var x=0;x<6;x++){r+='<rect x="'+(120+x*23)+'" y="'+(66+y*17)+'" width="18" height="12" rx="3"/>'}return r})()+'</g><circle cx="236" cy="50" r="20" fill="url(#ob)"/><path d="M236 41v18M227 50h18" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>'),
 upd:wrap('<circle cx="140" cy="112" r="70" fill="url(#oc)" filter="url(#osh)"/><path d="M104 112a36 36 0 0 1 62-25M176 112a36 36 0 0 1-62 25" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M160 78l10 10 8-16zM120 146l-10-10-8 16z" fill="#fff"/>'),
 pc:wrap('<rect x="46" y="34" width="188" height="124" rx="10" fill="#fff" filter="url(#osh)"/><rect x="56" y="44" width="168" height="104" rx="4" fill="url(#oc)"/><path d="M56 118c30-26 56-8 84-24s56-14 84 4v50H56z" fill="#fff" opacity=".25"/><path d="M120 158h40l8 30h-56z" fill="#cfd9e8"/><rect x="92" y="186" width="96" height="8" rx="4" fill="#dfe8f5" filter="url(#osh)"/><rect x="172" y="108" width="62" height="50" rx="8" fill="url(#ob)" filter="url(#osh)"/><path d="M190 128l8 8 14-16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),
 who:wrap('<rect x="52" y="30" width="176" height="150" rx="12" fill="#fff" filter="url(#osh)"/><circle cx="140" cy="82" r="26" fill="url(#oc)"/><path d="M92 156c4-26 24-40 48-40s44 14 48 40z" fill="url(#oc)"/><rect x="82" y="162" width="116" height="9" rx="4.5" fill="#dfe8f5"/><circle cx="222" cy="168" r="26" fill="url(#ob)" filter="url(#osh)"/><path d="M212 168l8 8 14-16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),
 pw:wrap('<rect x="44" y="76" width="192" height="52" rx="10" fill="#fff" filter="url(#osh)"/><g fill="#2a78f0"><circle cx="82" cy="102" r="7"/><circle cx="112" cy="102" r="7"/><circle cx="142" cy="102" r="7"/><circle cx="172" cy="102" r="7"/></g><rect x="86" y="140" width="108" height="76" rx="12" fill="url(#ob)" filter="url(#osh)"/><path d="M106 140v-18a34 34 0 0 1 68 0v18" fill="none" stroke="#1a9fa0" stroke-width="10" stroke-linecap="round" transform="translate(0 -4)"/><circle cx="140" cy="176" r="9" fill="#fff"/><rect x="136" y="180" width="8" height="18" rx="3" fill="#fff"/>'),
 star:wrap('<rect x="48" y="30" width="184" height="150" rx="12" fill="#fff" filter="url(#osh)"/><g>'+(function(){var c=['#2f6df0','#34c3b7','#f0b429','#e5484d','#8e4ec6','#2cb1bc'],r='';for(var i=0;i<6;i++){var x=62+(i%3)*58,y=46+Math.floor(i/3)*64;r+='<rect x="'+x+'" y="'+y+'" width="50" height="52" rx="8" fill="'+c[i]+'" opacity=".9"/>'}return r})()+'</g><path d="M222 150l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#f0b429" filter="url(#osh)"/>')
};
var OIC={
 pin:'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
 find:'<rect x="5" y="4" width="14" height="10" rx="1.6"/><path d="M3 18h18M9 21h6"/>',
 diag:'<path d="M5 20V10M10 20V5M15 20v-7M20 20V8"/>',
 ink:'<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14 7l3 3"/>',
 tail:'<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>',
 ads:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h6M7 14h10"/>'
};
function oi(k,off){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+OIC[k]+(off?'<path d="M3.5 3.5l17 17" stroke-width="1.8"/>':'')+'</svg>'}

var NAMES=['PIXEL-PANDA','TURBO-TOAST','NEON-NINJA','COSMIC-CAT','WAFFLE-BOT','LASER-LLAMA','GLITCH-GOOSE','MEGA-MANGO','SPACE-SLOTH','TACO-TANK','ZEN-ZAPPER','BYTE-BEAR'];
var ACCENTS=['#4cc2ff','#8b7cff','#ff6bb5','#ff8a4c','#3ddc97','#ffd23f'];
var PERS=[['Gamer 🎮','Frames per second are a lifestyle'],['Chill 🌿','Lo-fi, tea and zero stress'],['Night Owl 🦉','Peak productivity at 2 AM'],['Creator 🎨','Always making something cool'],['Chaos Goblin 🧌','43 tabs and no regrets'],['Speedrunner ⚡','Any% setup, no glitches']];
var FONTS=[['Default','"Segoe UI",system-ui,sans-serif'],['Nunito','Nunito,sans-serif'],['Inter','Inter,sans-serif'],['Poppins','Poppins,sans-serif'],['Space Grotesk','"Space Grotesk",sans-serif'],['Fredoka','Fredoka,sans-serif'],['Comic Neue','"Comic Neue",cursive'],['Playfair Display','"Playfair Display",serif'],['JetBrains Mono','"JetBrains Mono",monospace']];
var CORNERS=[['Sharp','sharp'],['Default','default'],['Round','round']];
var PAGES=[];
function pg(ill,h,ds,body,bt){return '<div class="ill">'+ILL[ill]+'</div><div class="rt"><h1>'+h+'</h1><p class="ds">'+ds+'</p>'+body+'<div class="bt">'+bt+'</div></div>'}
function pick(box,attr,cb){box.onclick=function(e){var b=e.target.closest('button');if(!b||!box.contains(b))return;[].forEach.call(box.children,function(k){k.classList.toggle('on',k===b)});cb(b.dataset[attr])}}
PAGES.push({r:function(c,next){
  c.innerHTML='<div class="ill">'+ILL.pc+'</div><div class="rt"><h1>Let’s name your device</h1><p class="ds">Create a name that’s easy to recognize when you connect to a network or share files. The name can’t include spaces or special characters, and has to be 15 characters or fewer.</p><input class="oin" id="odev" maxlength="15" placeholder="Enter device name" spellcheck="false" autocomplete="off"><div class="oerr" id="oerr"></div><div class="bt"><button class="lm" id="orand">🎲 Surprise me</button><button class="lm" id="oskip">Skip for now</button><button class="ac" id="oyes">Next</button></div></div>';
  var i=$('odev');i.value=st.device;i.focus();i.select();
  function go(){var v=i.value.trim();if(!/^[A-Za-z0-9-]{1,15}$/.test(v)||/^\d+$/.test(v)){$('oerr').textContent='Use 15 or fewer letters, numbers or hyphens, and not only numbers.';return}st.device=v.toUpperCase();next()}
  $('oyes').onclick=go;i.onkeydown=function(e){if(e.key==='Enter')go()};$('oskip').onclick=next;$('orand').onclick=function(){i.value=NAMES[Math.floor(Math.random()*NAMES.length)];$('oerr').textContent=''}}});
PAGES.push({r:function(c,next){
  var MSI='<svg viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>';
  var LCI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';
  var mode=st.ms?'ms':(st.user&&st.user!=='Player 1'?'local':'ms');
  var local='<input class="oin" id="ous" placeholder="Account name" maxlength="24" autocomplete="off" spellcheck="false"><div class="oavu"><div class="oprev" id="oprev"></div><div class="oavb"><button class="oup" id="oupl">Upload picture</button><button class="oup" id="orem">Remove</button></div><input type="file" id="oaf" accept="image/*" hidden></div>';
  var ms='<button class="oup oms" id="oms">'+MSI.replace('<svg ','<svg width="16" height="16" ')+'<span id="omst">Sign up with Microsoft</span></button><input class="oin" id="omcid" placeholder="Application (client) ID from Azure" spellcheck="false" autocomplete="off" style="display:none;margin-top:8px"><p class="ds" style="margin-top:10px">You’ll be taken to Microsoft to sign in or create an account. Your name, email and photo are used on this PC.</p>';
  c.innerHTML=pg('who','How would you like to sign in?','Choose how you’ll use this PC. You can change this later in Settings &gt; Accounts.','<button class="opt" id="omM"><b>'+MSI+'Microsoft account</b>Recommended. Sign up or sign in with Microsoft to use your name, email and photo.</button><button class="opt" id="omL"><b>'+LCI+'Local account</b>Create an account that stays on this PC, with just a name and picture.</button><div id="opL">'+local+'</div><div id="opM">'+ms+'</div><div class="oerr" id="oerr"></div>','<button class="ac" id="oyes">Next</button>');
  var i=$('ous');i.value=(st.user&&st.user!=='Player 1')?st.user:'';
  function show(){$('omM').classList.toggle('on',mode==='ms');$('omL').classList.toggle('on',mode==='local');$('opL').style.display=mode==='local'?'':'none';$('opM').style.display=mode==='ms'?'':'none';$('oerr').textContent=''}
  $('omM').onclick=function(){mode='ms';show()};$('omL').onclick=function(){mode='local';show();i.focus()};
  function prev(){var p=$('oprev');p.style.backgroundImage=st.avatarImg?'url('+st.avatarImg+')':'';p.classList.toggle('has',!!st.avatarImg);$('orem').style.display=st.avatarImg?'':'none'}prev();
  $('oupl').onclick=function(){$('oaf').click()};
  $('oaf').onchange=function(){var f=this.files[0];this.value='';if(!f)return;resizeAvatar(f).then(function(d){st.avatarImg=d;prev();$('oerr').textContent=''},function(e){$('oerr').textContent=e.message})};
  $('orem').onclick=function(){st.avatarImg='';prev()};
  var ci=$('omcid');ci.value=sysConfig.msClientId||window.WINDOPE_MS_CLIENT_ID||'';
  if(st.ms)$('omst').textContent='Signed in as '+(st.ms.email||st.ms.name)+' ✓';
  $('oms').onclick=function(){
    if(!ci.value.trim()&&ci.style.display==='none'){ci.style.display='block';ci.focus();$('oerr').textContent='Enter the Application (client) ID of your Azure app registration, then select the button again.';return}
    $('oerr').textContent='';$('omst').textContent='Waiting for Microsoft…';
    msSignIn(ci.value).then(function(a){st.ms=a;st.user=a.name;i.value=a.name;if(a.img){st.avatarImg=a.img;prev()}$('omst').textContent='Signed in as '+(a.email||a.name)+' ✓'},function(e){$('omst').textContent='Sign up with Microsoft';if(!window.WINDOPE_MS_CLIENT_ID)ci.style.display='block';$('oerr').textContent=e.message})};
  function nx(){
    if(mode==='ms'){if(!st.ms){$('oerr').textContent='Sign in with Microsoft to continue, or choose a local account.';return}st.user=st.ms.name;next();return}
    var v=i.value.trim();if(!v){$('oerr').textContent='Enter a name for your account.';return}if(/[\\\/\[\]:;|=,+*?<>"@]/.test(v)){$('oerr').textContent='The name can’t include special characters.';return}st.ms=null;st.user=v;next()}
  show();$('oyes').onclick=nx;i.onkeydown=function(e){if(e.key==='Enter')nx()}}});
PAGES.push({r:function(c,next){
  c.innerHTML=pg('globe','Pick your look','Choose light or dark and an accent colour. Try the picker for any colour you like.','<div class="ovibe" id="ovibe"><button data-t="dark" class="'+(st.theme==='dark'?'on':'')+'"><i class="vd"></i>Dark</button><button data-t="light" class="'+(st.theme==='light'?'on':'')+'"><i class="vl"></i>Light</button></div><div class="oacc" id="oacc">'+ACCENTS.map(function(a){return '<button data-c="'+a+'" style="background:'+a+'" class="'+(a===st.accent?'on':'')+'"></button>'}).join('')+'<label class="opick" title="Any colour"><input type="color" id="ocol" value="'+st.accent+'"></label></div>','<button class="ac" id="oyes">Next</button>');
  pick($('ovibe'),'t',function(v){st.theme=v;updateSysSetting('theme',v);applyTheme()});
  function acc(v){st.accent=v;updateSysSetting('accent',v);$('oobe').style.setProperty('--oacc',v)}
  pick($('oacc'),'c',acc);$('ocol').oninput=function(){acc(this.value);[].forEach.call($('oacc').querySelectorAll('button'),function(k){k.classList.remove('on')})};
  $('oyes').onclick=next}});
PAGES.push({r:function(c,next){
  c.innerHTML=pg('kb','Choose your font','This changes the text across the whole system. Add any font you like.','<div class="ofonts" id="ofonts">'+fontList().map(function(n){return '<button data-f="'+n+'" class="'+(st.font===n?'on':'')+'" style="font-family:'+fontStack(n).replace(/"/g,'&quot;')+'!important"><b>'+n+'</b><span>The quick brown fox jumps over 123</span></button>'}).join('')+'</div><div class="oaddf"><button id="ofile">Upload font file</button><input id="ogf" placeholder="Or a Google Font name" spellcheck="false"><button id="ogo">Add</button><input type="file" id="ofin" accept=".ttf,.otf,.woff,.woff2" hidden></div><div class="oerr" id="oerr"></div>','<button class="ac" id="oyes">Next</button>');
  pick($('ofonts'),'f',function(v){st.font=v;updateSysSetting('font',v)});
  function done(n){st.font=sysConfig.font;show()}
  $('ofile').onclick=function(){$('ofin').click()};
  $('ofin').onchange=function(){var f=this.files[0];if(f)addFontFile(f).then(done,function(e){$('oerr').textContent=e.message||'Couldn’t add that font.'})};
  function g(){addGoogleFont($('ogf').value).then(done,function(e){$('oerr').textContent=e.message})}
  $('ogo').onclick=g;$('ogf').onkeydown=function(e){if(e.key==='Enter')g()};
  $('oyes').onclick=next}});
PAGES.push({r:function(c,next){
  var ks=Object.keys(wallpaperRegistry).filter(function(k){return !wallpaperRegistry[k].locked});
  c.innerHTML=pg('pc','Pick a wallpaper','You can change it any time, or add your own later.','<div class="owps" id="owps">'+ks.map(function(k){var d=wallpaperRegistry[k],img=/\.(png|jpe?g)$/i.test(d.url),bl=d.url==='bloom',bg=bl?'Wallpapers/bloom-'+(st.theme==='light'?'light':'dark')+'.jpg':(img?d.url:'');return '<button data-w="'+k+'" class="'+(st.wp===k?'on':'')+'"><i style="'+(bg?'background-image:url('+bg+')':'')+'">'+(bg?'':'▶')+'</i>'+d.name+'</button>'}).join('')+'</div>','<button class="ac" id="oyes">Next</button>');
  pick($('owps'),'w',function(v){st.wp=v;window.wpMode='both';setWallpaper(v,false,true)});$('oyes').onclick=next}});
PAGES.push({r:function(c,next){
  function sw(id,label,on){return '<label class="otog"><span>'+label+'</span><input type="checkbox" id="'+id+'"'+(on?' checked':'')+'><i></i></label>'}
  c.innerHTML=pg('upd','Fine-tune the details','Windows, taskbar, clock and motion. Everything here lives in Settings too.','<div class="olab">Window corners</div><div class="ocor" id="ocor">'+CORNERS.map(function(x){return '<button data-k="'+x[1]+'" class="'+(st.corners===x[1]?'on':'')+'"><i class="c-'+x[1]+'"></i>'+x[0]+'</button>'}).join('')+'</div>'+sw('oglass','Blurred glass taskbar',st.glass)+sw('o24','24-hour clock',st.clock24)+sw('oanim','Smooth animations',st.anim),'<button class="ac" id="oyes">Finish</button>');
  pick($('ocor'),'k',function(v){st.corners=v;updateSysSetting('corners',v)});
  $('oglass').onchange=function(){st.glass=this.checked;updateSysSetting('noGlass',!this.checked)};
  $('o24').onchange=function(){st.clock24=this.checked;updateSysSetting('clock24',this.checked)};
  $('oanim').onchange=function(){st.anim=this.checked};
  $('oyes').onclick=next}});
ILL.priv=(function(){return '<svg viewBox="0 0 280 230"><defs><linearGradient id="og1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6df0"/><stop offset="1" stop-color="#6a3fdc"/></linearGradient><linearGradient id="og2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34c3b7"/><stop offset="1" stop-color="#1a9fa0"/></linearGradient><filter id="osh2" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#1c3b6b" flood-opacity=".18"/></filter></defs><path d="M118 76h138a7 7 0 0 1 7 7v92a7 7 0 0 1-7 7h-56l-20 22v-22h-62a7 7 0 0 1-7-7V83a7 7 0 0 1 7-7z" fill="url(#og2)" filter="url(#osh2)"/><rect x="62" y="16" width="160" height="118" rx="9" fill="#fff" filter="url(#osh2)"/><g fill="#e3eded"><rect x="74" y="28" width="38" height="38" rx="4"/><rect x="122" y="28" width="38" height="38" rx="4"/><rect x="170" y="28" width="38" height="38" rx="4"/></g><g fill="none" stroke="#2cb3a8" stroke-width="2.2" stroke-linecap="round"><path d="M93 57s-9-7.5-9-14.5a9 9 0 0 1 18 0c0 7-9 14.5-9 14.5z" fill="#3cc3b8" stroke="none"/><circle cx="93" cy="42.5" r="3.4" fill="#fff" stroke="none"/><circle cx="141" cy="47" r="10"/><path d="M134 49a7 7 0 0 1 14 0M137 53a4 4 0 0 1 8 0M137 44a4.5 4.5 0 0 1 9 0" stroke-width="1.8"/><rect x="180" y="45" width="16" height="12" rx="2" fill="#3cc3b8" stroke="none"/><path d="M184 45v-3a4 4 0 0 1 8 0v3" stroke-width="2.2"/></g><g stroke="#d8dee6" stroke-width="3" stroke-linecap="round"><path d="M100 98v20M108 92v32M116 100v16M124 90v36M132 98v20M140 94v28M148 100v16M156 90v36M164 98v20M172 94v28M180 100v16M188 96v24M196 100v16"/></g><path d="M60 112l42 14v30c0 24-19 40-42 50-23-10-42-26-42-50v-30z" fill="url(#og1)" filter="url(#osh2)"/><path d="M42 158l13 13 24-26" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'})();
var STAT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" stroke-linecap="round"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="4.5" r="1.6"/><path d="M5 8.5c4.5 1.2 9.5 1.2 14 0M12 9v5M12 14l-3.5 6M12 14l3.5 6"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
var idx=0;
function show(){
  var c=$('ocard'),p=PAGES[idx];c.className='ocard';c.onclick=null;c.style.animation='none';void c.offsetWidth;c.style.animation='';
  p.r.call(p,c,function(){idx++;if(idx>=PAGES.length)finish();else show()});
  if(idx>0){var bk=document.createElement('button');bk.className='oback';bk.title='Back';bk.textContent='‹';bk.onclick=function(){idx--;show()};c.appendChild(bk)}
}
function confetti(n){
  var cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:99999;pointer-events:none';cv.width=innerWidth;cv.height=innerHeight;document.body.appendChild(cv);
  var x=cv.getContext('2d'),C=['#4cc2ff','#8b7cff','#ff6bb5','#ff8a4c','#3ddc97','#ffd23f'],P=[];
  for(var i=0;i<n;i++)P.push({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.5,vx:Math.random()*4-2,vy:2+Math.random()*4,s:5+Math.random()*7,r:Math.random()*6,vr:Math.random()*.3-.15,c:C[i%C.length]});
  var t0=Date.now();(function f(){x.clearRect(0,0,cv.width,cv.height);P.forEach(function(q){q.x+=q.vx;q.y+=q.vy;q.r+=q.vr;x.save();x.translate(q.x,q.y);x.rotate(q.r);x.fillStyle=q.c;x.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);x.restore()});if(Date.now()-t0<4200)requestAnimationFrame(f);else cv.remove()})();
}
function finishText(){
  var c=$('ocard');c.className='ocard fin';c.style.animation='none';
  c.innerHTML='<div class="finwrap"><div class="fintxt">Hi, '+(st.user||'Player 1')+'</div><div class="ospin big"></div><div class="fintxt" style="font-size:18px;opacity:.7">Setting things up for you</div></div>';
}
function finish(){
  var nm=st.user||'Player 1';st.user=nm;
  try{localStorage.setItem(KEY,JSON.stringify({done:1,device:st.device,user:nm,avatar:st.avatar}))}catch(e){}
  updateSysSetting('userName',nm);updateSysSetting('deviceName',st.device);updateSysSetting('accountType',st.ms?'Microsoft account':'Local account');updateSysSetting('userEmail',st.ms?st.ms.email:'');updateSysSetting('msLinked',!!st.ms);updateSysSetting('srvToken',st.ms&&st.ms.srvToken?st.ms.srvToken:'');updateSysSetting('avatarImg',st.avatarImg||'');updateSysSetting('theme',st.theme);updateSysSetting('accent',st.accent);updateSysSetting('corners',st.corners);updateSysSetting('noGlass',!st.glass);updateSysSetting('clock24',st.clock24);updateSysSetting('noAnim',!st.anim);
  if(window.applyUser)applyUser();
  $('ostat').style.opacity=0;finishText();
  setTimeout(function(){enter()},3000);
}
function enter(){
  var o=$('oobe');o.classList.add('out');
  setTimeout(function(){
    o.style.display='none';
    var bv=document.getElementById('bg-video');
    isDesktopActive=true;applyTheme();applyLook();
    if(bv&&bv.style.display!=='none'&&!sysConfig.optBg)bv.play().catch(function(){});
    updateClock();
    try{showNotification('Welcome, '+st.user+'!','Open Settings any time to change your look.')}catch(e){}
    welcomeShown=true;
  },800);
}
window.startOOBE=function(){
  st.theme='light';updateSysSetting('theme','light');applyTheme();
  var o=$('oobe');o.style.display='block';$('ostat').innerHTML=STAT;idx=0;show();
};
/* hook the boot sequence: first run -> OOBE, afterwards -> lock screen */
var _skip=skipBootSequence;
skipBootSequence=function(){
  if(!bootActive)return;
  if(done()){_skip();return}
  bootActive=false;var lay=document.getElementById('boot-layer');
  window.startOOBE();
  if(lay){lay.style.opacity='0';setTimeout(function(){lay.style.display='none'},700)}
};
window.runSetupAgain=function(){try{localStorage.removeItem(KEY)}catch(e){}location.reload()};
})();


/* =====================  LOOK: font, corners, glass, motion  ===================== */
(function(){
var F={'Default':'"Segoe UI",system-ui,sans-serif','Nunito':'Nunito,sans-serif','Inter':'Inter,sans-serif','Poppins':'Poppins,sans-serif','Space Grotesk':'"Space Grotesk",sans-serif','Fredoka':'Fredoka,sans-serif','Comic Neue':'"Comic Neue",cursive','Playfair Display':'"Playfair Display",serif','JetBrains Mono':'"JetBrains Mono",monospace'};
var CSS='body,button,input,select{font-family:var(--os-font)!important}';
var CF=function(){return sysConfig.customFonts||[]},cfCss='';
window.fontList=function(){return Object.keys(F).concat(CF().map(function(c){return c.name}))};
window.fontStack=function(n){return F[n]||'"'+n+'",sans-serif'};
window.refreshFonts=function(){
  return Promise.all(CF().map(function(c){return c.type==='file'?FileStore.url(c.id).then(function(u){return u?['f','@font-face{font-family:"'+c.name+'";src:url("'+u+'")}']:['f','']}):Promise.resolve(['i','@import url("https://fonts.googleapis.com/css2?family='+encodeURIComponent(c.name).replace(/%20/g,'+')+':wght@400;600;700&display=swap");'])})).then(function(a){
    cfCss=a.filter(function(x){return x[0]==='i'}).concat(a.filter(function(x){return x[0]==='f'})).map(function(x){return x[1]}).join('\n');
    var st=document.getElementById('oscustomfonts');if(!st){st=document.createElement('style');st.id='oscustomfonts';document.head.appendChild(st)}st.textContent=cfCss;applyLook()})};
function addCustom(c){var l=CF().filter(function(x){return x.name!==c.name});l.push(c);updateSysSetting('customFonts',l);updateSysSetting('font',c.name);return refreshFonts()}
window.addFontFile=function(file){var name=file.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').trim()||'My font',id='font_'+Date.now().toString(36);return FileStore.put(id,file).then(function(){return addCustom({name:name,type:'file',id:id})})};
window.addGoogleFont=function(n){n=(n||'').trim();if(!/^[A-Za-z0-9 ]{2,40}$/.test(n))return Promise.reject(new Error('Type a font name like “Lobster”.'));return addCustom({name:n,type:'google'})};
window.removeFont=function(n){var c=CF().filter(function(x){return x.name===n})[0];if(!c)return Promise.resolve();if(c.type==='file')FileStore.del(c.id);updateSysSetting('customFonts',CF().filter(function(x){return x.name!==n}));if(sysConfig.font===n)updateSysSetting('font','Default');return refreshFonts()};
window.applyLook=function(){
  var h=document.documentElement,f=sysConfig.font&&sysConfig.font!=='Default'?fontStack(sysConfig.font):null;
  if(f)h.style.setProperty('--os-font',f);else h.style.removeProperty('--os-font');
  h.classList.toggle('os-font',!!f);h.setAttribute('data-corners',sysConfig.corners||'default');h.setAttribute('data-glass',sysConfig.noGlass?'off':'on');
  var o=document.getElementById('oobe');h.classList.toggle('no-anim',!!sysConfig.noAnim&&!(o&&o.style.display==='block'));
  [].forEach.call(document.querySelectorAll('iframe'),function(fr){try{var d=fr.contentDocument,r=d.documentElement;if(f)r.style.setProperty('--os-font',f);else r.style.removeProperty('--os-font');var st=d.getElementById('osfont');if(f&&!st){st=d.createElement('style');st.id='osfont';st.textContent=CSS;d.head.appendChild(st)}if(st){st.textContent=cfCss+'\n'+CSS;st.disabled=!f}}catch(e){}})
};
var _u=window.updateSysSetting;window.updateSysSetting=function(k,v){_u(k,v);if(['font','corners','noGlass','noAnim'].indexOf(k)>-1)applyLook()};
var _t=window.applyTheme;window.applyTheme=function(){_t();applyLook()};
document.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IFRAME')applyLook()},true);
document.addEventListener('DOMContentLoaded',function(){applyLook();refreshFonts()});applyLook();setTimeout(refreshFonts,0);
})();

/* =====================  AVATAR (uploaded picture)  ===================== */
(function(){
var _au=window.applyUser;
window.applyUser=function(){if(_au)_au();var a=sysConfig.avatarImg;document.querySelectorAll('.user-avatar').forEach(function(el){if(!el.dataset.def)el.dataset.def=el.innerHTML;el.innerHTML=a?'<img alt="" src="'+a+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block">':el.dataset.def;el.style.fontSize=''})};
window.resizeAvatar=function(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var S=160,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),m=Math.min(im.width,im.height);x.drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,S,S);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.88))};im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('That file is not a picture we can read.'))};im.src=u})};
document.addEventListener('DOMContentLoaded',function(){window.applyUser()});
window.applyUser();
})();

/* =====================  MICROSOFT ACCOUNT (OAuth2 + PKCE, no library)  ===================== */
(function(){
var SC='openid profile email User.Read',AUTH='https://login.microsoftonline.com/'+encodeURIComponent(window.WINDOPE_MS_TENANT||'common')+'/oauth2/v2.0/';
window.msRedirectUri=function(){return location.origin+location.pathname};
function rnd(n){var a=new Uint8Array(n);crypto.getRandomValues(a);return Array.from(a,function(b){return('0'+b.toString(16)).slice(-2)}).join('')}
function b64(buf){return btoa(String.fromCharCode.apply(null,new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
window.msSignIn=function(cid){
  cid=(cid||sysConfig.msClientId||window.WINDOPE_MS_CLIENT_ID||'').trim();
  if(!/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(cid))return Promise.reject(new Error('Enter the Application (client) ID of your Azure app registration (it looks like 00000000-0000-0000-0000-000000000000).'));
  if(location.protocol==='file:'||!window.crypto||!crypto.subtle)return Promise.reject(new Error('Microsoft sign-in needs http://localhost or https. Run the OS from a local server.'));
  var redirect=msRedirectUri(),ver=rnd(32),state=rnd(8);
  return crypto.subtle.digest('SHA-256',new TextEncoder().encode(ver)).then(function(h){
    var url=AUTH+'authorize?client_id='+cid+'&response_type=code&redirect_uri='+encodeURIComponent(redirect)+'&response_mode=query&scope='+encodeURIComponent(SC)+'&code_challenge='+b64(h)+'&code_challenge_method=S256&state='+state+'&prompt=select_account';
    var w=window.open(url,'msauth','width=480,height=680');
    if(!w)throw new Error('Popup blocked. Allow popups for this page and try again.');
    return new Promise(function(res,rej){
      var t=setInterval(function(){if(w.closed){clearInterval(t);window.removeEventListener('message',on);rej(new Error('Sign-in window was closed.'))}},500);
      function on(e){if(e.origin!==location.origin||!e.data||!e.data.msauth||e.data.state!==state)return;clearInterval(t);window.removeEventListener('message',on);e.data.error?rej(new Error(e.data.error)):res(e.data.code)}
      window.addEventListener('message',on)})
  }).then(function(code){
    return fetch(AUTH+'token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:cid,grant_type:'authorization_code',code:code,redirect_uri:redirect,code_verifier:ver,scope:SC})}).then(function(r){return r.json()}).then(function(t){if(!t.access_token)throw new Error(t.error_description||'Microsoft rejected the sign-in.');return t.access_token})
  }).then(function(tk){
    var H={Authorization:'Bearer '+tk};
    return fetch('https://graph.microsoft.com/v1.0/me',{headers:H}).then(function(r){return r.json()}).then(function(me){
      return fetch('https://graph.microsoft.com/v1.0/me/photo/$value',{headers:H}).then(function(r){return r.ok?r.blob():null}).catch(function(){return null}).then(function(bl){
        return(bl?resizeAvatar(bl).catch(function(){return''}):Promise.resolve('')).then(function(img){return{name:me.displayName||'User',email:me.mail||me.userPrincipalName||'',img:img,tk:tk}})})})
  }).then(function(acct){if(cid!==window.WINDOPE_MS_CLIENT_ID)updateSysSetting('msClientId',cid);var t=acct.tk;delete acct.tk;return serverLogin(t).then(function(st){acct.srvToken=st;return acct},function(){acct.srvToken='';return acct})});
};
window.msApply=function(a){updateSysSetting('userName',a.name);updateSysSetting('userEmail',a.email);updateSysSetting('accountType','Microsoft account');if(a.img)updateSysSetting('avatarImg',a.img);updateSysSetting('srvToken',a.srvToken||'');updateSysSetting('msLinked',true);applyUser()};

/* Windope server (Messages + usage info). It checks your Microsoft token with Microsoft Graph and gives this OS a session token. */
window.serverBase=function(){var d=window.WINDOPE_SERVER||(/^https?:$/.test(location.protocol)?location.origin:'http://localhost:8080');return String(sysConfig.serverUrl||d).trim().replace(/\/+$/,'')};
function serverLogin(tk){if(!tk)return Promise.reject(0);var ctl=new AbortController(),to=setTimeout(function(){ctl.abort()},8000);
  return fetch(serverBase()+'/api/ms-login',{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tk})}).then(function(r){clearTimeout(to);return r.json().then(function(j){if(!r.ok||!j.token)throw 0;return j.token})},function(){clearTimeout(to);throw 0})}
window.msSignOut=function(){var t=sysConfig.srvToken;if(t)fetch(serverBase()+'/api/logout',{method:'POST',headers:{Authorization:'Bearer '+t}}).catch(function(){});updateSysSetting('srvToken','');updateSysSetting('accountType','Local account');updateSysSetting('userEmail','');updateSysSetting('msLinked',false)};
})();

/* =====================  FILE STORE (any size, kept in IndexedDB)  ===================== */
(function(){
var DB='winos_files',ST='blobs',_db,urls={};
function open(){return _db||(_db=new Promise(function(res,rej){var r=indexedDB.open(DB,1);r.onupgradeneeded=function(){r.result.createObjectStore(ST)};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}}))}
function run(mode,fn){return open().then(function(db){return new Promise(function(res,rej){var t=db.transaction(ST,mode),q=fn(t.objectStore(ST));t.oncomplete=function(){res(q&&q.result)};t.onerror=t.onabort=function(){rej(t.error||new Error('Not enough storage space in this browser.'))}})})}
window.FileStore={pending:[],onPending:null,
 put:function(id,b){try{if(!this._p){this._p=1;navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}}catch(e){}delete this._u;if(urls[id]){URL.revokeObjectURL(urls[id]);delete urls[id]}return run('readwrite',function(s){return s.put(b,id)})},
 get:function(id){return run('readonly',function(s){return s.get(id)})},
 del:function(id){if(urls[id]){URL.revokeObjectURL(urls[id]);delete urls[id]}return run('readwrite',function(s){return s.delete(id)})},
 url:function(id){if(urls[id])return Promise.resolve(urls[id]);return this.get(id).then(function(b){return b?(urls[id]=URL.createObjectURL(b)):null})},
 take:function(){var l=this.pending;this.pending=[];return l},
 give:function(list){this.pending=this.pending.concat(list);try{if(this.onPending){this.onPending();return}}catch(e){this.onPending=null}try{openWindow('explorer')}catch(e){}}
};
})();

/* =====================  HTML / ZIP -> APP  (upload an .html or a .zip containing one and it becomes an app)  ===================== */
(function(){
var DB='winos_apps',ST='apps';
function idb(){return new Promise(function(res,rej){var r=indexedDB.open(DB,2);r.onupgradeneeded=function(){var d=r.result;if(!d.objectStoreNames.contains(ST))d.createObjectStore(ST,{keyPath:'id'});if(!d.objectStoreNames.contains('files'))d.createObjectStore('files',{keyPath:'id'})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
var mem={},vurls={};
function tx(mode,fn,store){return idb().then(function(db){return new Promise(function(res,rej){var t=db.transaction(store||ST,mode),s=t.objectStore(store||ST),q=fn(s);t.oncomplete=function(){res(q&&q.result)};t.onerror=function(){rej(t.error)}})})}
var MIME={html:'text/html',htm:'text/html',css:'text/css',js:'text/javascript',mjs:'text/javascript',json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',svg:'image/svg+xml',webp:'image/webp',ico:'image/x-icon',mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',mp4:'video/mp4',webm:'video/webm',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf',txt:'text/plain',wasm:'application/wasm',xml:'text/xml',m4a:'audio/mp4',flac:'audio/flac',opus:'audio/ogg',atlas:'text/plain',frag:'text/plain',vert:'text/plain',hx:'text/plain'};
function ext(p){var m=/\.([a-z0-9]+)$/i.exec(p);return m?m[1].toLowerCase():''}
function msg(t,m){try{showNotification(t,m)}catch(e){alert(t+'\n'+m)}}
/* ---- zip reader (stored + deflate) ---- */
function inflate(u8){var ds=new DecompressionStream('deflate-raw');var w=ds.writable.getWriter();w.write(u8);w.close();return new Response(ds.readable).arrayBuffer().then(function(b){return new Uint8Array(b)})}
function u64(dv,o){return Number(dv.getBigUint64(o,true))}
function readZip(buf){
  var dv=new DataView(buf),u8=new Uint8Array(buf),n=u8.length,e=-1;
  for(var i=n-22;i>=Math.max(0,n-65557);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}
  if(e<0)return Promise.reject(new Error('That doesn’t look like a valid zip file.'));
  var cnt=dv.getUint16(e+10,true),off=dv.getUint32(e+16,true),ents=[],dec=new TextDecoder();
  if((cnt===0xFFFF||off===0xFFFFFFFF)&&e>=20&&dv.getUint32(e-20,true)===0x07064b50){var z=u64(dv,e-12);if(dv.getUint32(z,true)===0x06064b50){cnt=u64(dv,z+32);off=u64(dv,z+48)}}
  for(var k=0;k<cnt;k++){
    if(dv.getUint32(off,true)!==0x02014b50)break;
    var meth=dv.getUint16(off+10,true),csz=dv.getUint32(off+20,true),usz=dv.getUint32(off+24,true),nl=dv.getUint16(off+28,true),el=dv.getUint16(off+30,true),cl=dv.getUint16(off+32,true),lo=dv.getUint32(off+42,true);
    var name=dec.decode(u8.subarray(off+46,off+46+nl)),xo=off+46+nl,xe=xo+el;
    while(xo+4<=xe){var id=dv.getUint16(xo,true),sz=dv.getUint16(xo+2,true);if(id===1){var p=xo+4;if(usz===0xFFFFFFFF)p+=8;if(csz===0xFFFFFFFF){csz=u64(dv,p);p+=8}if(lo===0xFFFFFFFF)lo=u64(dv,p);break}xo+=4+sz}
    off+=46+nl+el+cl;
    if(/\/$/.test(name)||/^__MACOSX\//.test(name)||/(^|\/)\.DS_Store$/.test(name))continue;
    ents.push({name:name,meth:meth,csz:csz,lo:lo})}
  var out={};
  return Promise.all(ents.map(function(x){
    var l=x.lo,nl=dv.getUint16(l+26,true),el=dv.getUint16(l+28,true),s=l+30+nl+el,data=u8.subarray(s,s+x.csz);
    if(x.meth===0){out[x.name]=data.slice();return}
    if(x.meth===8)return inflate(data).then(function(d){out[x.name]=d});
  })).then(function(){return out});
}
/* list names in a zip of ANY size without loading it all */
function zipNames(file){
  var tail=Math.min(file.size,65600),base=file.size-tail;
  return file.slice(base).arrayBuffer().then(function(b){
    var dv=new DataView(b),e=-1;for(var i=b.byteLength-22;i>=0;i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}
    if(e<0)throw new Error('bad zip');
    var cnt=dv.getUint16(e+10,true),size=dv.getUint32(e+12,true),off=dv.getUint32(e+16,true);
    function list(cnt,size,off){return file.slice(off,off+size).arrayBuffer().then(function(cb){var d=new DataView(cb),u=new Uint8Array(cb),dec=new TextDecoder(),o=0,nm=[];for(var k=0;k<cnt;k++){if(o+46>cb.byteLength||d.getUint32(o,true)!==0x02014b50)break;var nl=d.getUint16(o+28,true),el=d.getUint16(o+30,true),cl=d.getUint16(o+32,true);nm.push(dec.decode(u.subarray(o+46,o+46+nl)));o+=46+nl+el+cl}return nm})}
    if((cnt===0xFFFF||off===0xFFFFFFFF||size===0xFFFFFFFF)&&e>=20&&dv.getUint32(e-20,true)===0x07064b50){var zo=u64(dv,e-12);return file.slice(zo,zo+56).arrayBuffer().then(function(zb){var z=new DataView(zb);return list(u64(z,32),u64(z,40),u64(z,48))})}
    return list(cnt,size,off)})
}
function zipHasHtml(file){return zipNames(file).then(function(n){return n.some(function(x){return /\.html?$/i.test(x)&&!/^__MACOSX\//.test(x)})}).catch(function(){return false})}
/* ---- find the app's real name and icon ---- */
function dataUrl(u8,mime){var s='',C=0x8000;for(var i=0;i<u8.length;i+=C)s+=String.fromCharCode.apply(null,u8.subarray(i,i+C));return 'data:'+mime+';base64,'+btoa(s)}
function detect(files,entry,fallback){
  var dec=new TextDecoder(),doc,html='';try{html=dec.decode(files[entry]);doc=new DOMParser().parseFromString(html,'text/html')}catch(e){return{name:fallback}}
  var base=dirOf(entry),mf=null,cands=[],ml=doc.querySelector('link[rel~="manifest"]');
  if(ml&&ml.getAttribute('href'))cands.push(norm(base,ml.getAttribute('href').split(/[?#]/)[0]));
  ['manifest.json','manifest.webmanifest','site.webmanifest'].forEach(function(m){cands.push(norm(base,m));cands.push(m)});
  for(var i=0;i<cands.length&&!mf;i++){if(files[cands[i]]){try{mf=JSON.parse(dec.decode(files[cands[i]]));mf._dir=dirOf(cands[i])}catch(e){}}}
  function meta(q){var e=doc.querySelector(q);return e?(e.getAttribute('content')||'').trim():''}
  var gen=/^(untitled|document|index|home|new tab|app|react app|vite app|vite \+ react|my app|page)$/i;
  var names=[mf&&mf.name,mf&&mf.short_name,meta('meta[name="application-name"]'),meta('meta[name="apple-mobile-web-app-title"]'),meta('meta[property="og:site_name"]'),doc.title];
  var name=fallback;for(var j=0;j<names.length;j++){var nm=(names[j]||'').replace(/\s+/g,' ').trim();if(nm&&!gen.test(nm)){name=nm.slice(0,40);break}}
  function sz(x){var m=/(\d+)x\d+/.exec(x||'');return m?+m[1]:(/any/i.test(x||'')?512:0)}
  var ic=[];[].slice.call(doc.querySelectorAll('link[rel][href]')).filter(function(l){return /(^|\s)(apple-touch-icon(-precomposed)?|icon)(\s|$)/i.test(l.getAttribute('rel'))}).sort(function(a,b){return sz(b.getAttribute('sizes'))-sz(a.getAttribute('sizes'))}).forEach(function(l){ic.push({h:l.getAttribute('href'),d:base,r:1})});
  if(mf&&mf.icons)mf.icons.slice().sort(function(a,b){return sz(b.sizes)-sz(a.sizes)}).forEach(function(x){if(x.src)ic.push({h:x.src,d:mf._dir,r:1})});
  ['favicon.ico','favicon.png','favicon.svg','icon.png','icon.svg','logo.png','logo.svg'].forEach(function(f){ic.push({h:f,d:base});ic.push({h:f,d:''})});
  var MT={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',svg:'image/svg+xml',ico:'image/x-icon',webp:'image/webp'},remote=null,icon;
  for(var k=0;k<ic.length&&!icon;k++){var h=ic[k].h;
    if(/^data:image\//i.test(h)){icon=h;break}
    if(/^(https?:)?\/\//i.test(h)){if(!remote&&ic[k].r)remote=h;continue}
    var path=norm(ic[k].d,h.split(/[?#]/)[0]);if(files[path]&&MT[ext(path)]&&files[path].length<400000)icon=dataUrl(files[path],MT[ext(path)])}
  return{name:name,icon:icon||remote||undefined}
}
/* ---- build a self-contained page from files ---- */
function norm(base,rel){var parts=(base?base.split('/'):[]).concat(rel.split('/')),o=[];parts.forEach(function(p){if(p===''||p==='.')return;if(p==='..')o.pop();else o.push(p)});return o.join('/')}
function dirOf(p){var i=p.lastIndexOf('/');return i<0?'':p.slice(0,i)}
/* Runs INSIDE the app page: any relative path the app asks for (fetch, XHR, Image, Audio, script, Worker...) is served from the app's own files */
function vfsShim(ID,B){
  var P=window.parent,W=window,pd='',Q='high';try{Q=P.AppHost.quality(ID)}catch(e){}
  if(Q!=='high'){var dpr=Q==='low'?0.5:0.75,gap=Q==='low'?1000/30:1000/45,last=0,orf=W.requestAnimationFrame.bind(W);try{Object.defineProperty(W,'devicePixelRatio',{get:function(){return dpr},configurable:true})}catch(e){}
    W.requestAnimationFrame=function(cb){return orf(function t(ts){if(ts-last<gap-2){return orf(t)}last=ts;cb(ts)})}}
  try{pd=P.location.href.split(/[?#]/)[0].replace(/[^\/]*$/,'')}catch(e){}
  function R(u){try{
    if(u==null)return null;
    if(typeof u!=='string'){if(typeof URL!=='undefined'&&u instanceof URL)u=u.href;else if(typeof u.url==='string')u=u.url;else u=String(u)}
    if(pd&&u.indexOf(pd)===0)u=u.slice(pd.length);
    if(!u||/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(u))return null;
    return P.AppHost.vfs(ID,u.split(/[?#]/)[0],B)
  }catch(e){return null}}
  W.addEventListener('error',function(e){var t=e.target;if(t&&t!==W&&(t.src||t.href)){try{P.AppHost.fail(ID,t.src||t.href)}catch(x){}}},true);
  if(W.fetch){var of=W.fetch;W.fetch=function(i,o){var u=R(i);return of.call(W,u||i,o)}}
  var xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){var a=[].slice.call(arguments),r=R(u);if(r)a[1]=r;return xo.apply(this,a)};
  function hook(C,p){if(!C)return;var d=Object.getOwnPropertyDescriptor(C.prototype,p);if(!d||!d.set)return;Object.defineProperty(C.prototype,p,{get:d.get,set:function(v){var r=R(v);d.set.call(this,r||v)},configurable:true,enumerable:d.enumerable})}
  hook(W.HTMLImageElement,'src');hook(W.HTMLMediaElement,'src');hook(W.HTMLScriptElement,'src');hook(W.HTMLSourceElement,'src');hook(W.HTMLLinkElement,'href');hook(W.HTMLIFrameElement,'src');
  var sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(/^(src|href|poster)$/i.test(n)&&this.tagName!=='A'){var r=R(v);if(r)v=r}return sa.call(this,n,v)};
  var OA=W.Audio;W.Audio=function(u){var a=new OA();if(u!=null)a.src=u;return a};W.Audio.prototype=OA.prototype;
  if(W.Worker){var OW=W.Worker;W.Worker=function(u,o){return new OW(R(u)||u,o)};W.Worker.prototype=OW.prototype}
}
function vfs(id,p,base){
  var files=mem[id];if(!files)return null;
  var path;try{path=decodeURIComponent(p)}catch(e){path=p}
  var c=[];if(path.charAt(0)==='/'){c.push(norm('',path))}else{c.push(norm(base||'',path));c.push(norm('',path))}
  var hit=null;for(var i=0;i<c.length&&!hit;i++)if(files[c[i]])hit=c[i];
  if(!hit){var low=c[0].toLowerCase();for(var k in files){if(k.toLowerCase()===low){hit=k;break}}}
  if(!hit)return null;
  var key=id+'|'+hit;if(vurls[key])return vurls[key];
  return vurls[key]=URL.createObjectURL(new Blob([files[hit]],{type:MIME[ext(hit)]||'application/octet-stream'}))
}
function build(files,entry,id){
  var blobs={},dec=new TextDecoder();
  function skip(u){return /^(https?:|\/\/|data:|blob:|#|mailto:|javascript:|about:)/i.test(u)}
  function blobFor(path){
    if(blobs[path])return blobs[path];var d=files[path];if(!d)return null;
    var e=ext(path),data=d;
    if(e==='css'){var t=dec.decode(d).replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,function(m,q,u){if(skip(u))return m;var f=blobFor(norm(dirOf(path),u.split(/[?#]/)[0]));return f?'url("'+f+'")':m});data=new TextEncoder().encode(t)}
    return blobs[path]=URL.createObjectURL(new Blob([data],{type:MIME[e]||'application/octet-stream'}));
  }
  var html=dec.decode(files[entry]),base=dirOf(entry);
  html=html.replace(/\b(src|href|poster|data-src)\s*=\s*(["'])([^"']*)\2/gi,function(m,a,q,u){if(!u||skip(u))return m;var p=norm(base,u.split(/[?#]/)[0]);if(/\.html?$/i.test(p))return m;var f=blobFor(p);return f?a+'='+q+f+q:m});
  html=html.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,function(m,q,u){if(skip(u))return m;var f=blobFor(norm(base,u.split(/[?#]/)[0]));return f?'url("'+f+'")':m});
  if(id){mem[id]=files;var tag='<script>('+vfsShim.toString()+')('+JSON.stringify(id)+','+JSON.stringify(base)+')<\/script>';
    html=/<head[^>]*>/i.test(html)?html.replace(/<head[^>]*>/i,function(m){return m+tag}):tag+html}
  return html;
}
/* ---- registry ---- */
function tile(name){var h=0;for(var i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))%360;return 'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="hsl('+h+',60%,42%)"/><text x="32" y="44" font-family="Segoe UI,Arial" font-weight="700" font-size="30" text-anchor="middle" fill="#fff">'+(name.trim()[0]||'A').toUpperCase()+'</text></svg>')}
function register(rec,lazy){
  var path='user:'+rec.id,html;
  if(!lazy){try{html=rec.single?rec.html:build(rec.files,rec.entry,rec.id)}catch(e){msg('Couldn’t open '+rec.name,e.message);return null}
    if(window._INLINE_APPS===undefined)window._INLINE_APPS={};window._INLINE_APPS[path]=html}
  var wasPinned=APPS[rec.id]&&APPS[rec.id].pinned,nm=String(rec.name||'App').replace(/[<>&"]/g,'');
  APPS[rec.id]={title:nm,path:path,icon:rec.icon||tile(nm),pinned:wasPinned!==undefined?wasPinned:true,user:true,lazy:!!lazy,rec:rec,file:rec.file};
  return rec.id;
}
function loadFiles(id){return mem[id]?Promise.resolve(mem[id]):tx('readonly',function(s){return s.get(id)},'files').then(function(r){return r&&r.files})}
/* installed apps load their files only when first opened (big game zips don't slow down startup) */
var _ow=window.openWindow;
window.openWindow=function(id){
  var a=APPS[id];
  if(a&&a.user&&a.rec&&/\.(zip|html?)$/i.test(a.file||'')&&!a.chosen&&!document.getElementById('win-'+id)){
    return askQuality(a).then(function(q){if(!q)return;a.q=q;try{WXTrack('quality',{app:String(a.title).slice(0,30),q:q})}catch(e){}return preloadApp(a,q).then(function(){a.chosen=1;var r=window.openWindow(id);Promise.resolve(r).then(function(){a.chosen=0});return r})})}
  if(a&&a.user&&a.lazy&&!(window._INLINE_APPS&&window._INLINE_APPS[a.path])){
    return loadFiles(id).then(function(files){
      if(!files){msg('Couldn’t open '+a.title,'Its files are missing. Uninstall it and add it again.');return}
      var html;try{html=build(files,a.rec.entry,id)}catch(e){msg('Couldn’t open '+a.title,e.message);return}
      if(window._INLINE_APPS===undefined)window._INLINE_APPS={};window._INLINE_APPS[a.path]=html;a.lazy=false;_ow(id)})
  }
  return _ow(id)
};
function refreshUI(){try{syncPins();renderUI()}catch(e){}}
function slug(n){return 'u_'+n.toLowerCase().replace(/\.[^.]+$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,28)+'_'+Math.random().toString(36).slice(2,6)}
function pretty(n){return n.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g,function(m){return m.toUpperCase()}).trim()||'App'}
function installRec(rec,open){
  if(!rec.added)rec.added=Date.now();
  Object.keys(APPS).forEach(function(k){if(APPS[k].user&&APPS[k].title===rec.name)rec.id=k});
  var meta={},k2;for(k2 in rec)if(k2!=='files')meta[k2]=rec[k2];
  var jobs=[tx('readwrite',function(s){return s.put(meta)})];
  if(!rec.single&&rec.files)jobs.push(tx('readwrite',function(s){return s.put({id:rec.id,files:rec.files})},'files'));
  return Promise.all(jobs).then(function(){var id=register(rec);if(id){refreshUI();msg('App installed',rec.name+' is ready in Start and the taskbar.');if(open)setTimeout(function(){openWindow(id)},250)}return id})
}
function installText(name,text,open){
  var files={};files['index.html']=new TextEncoder().encode(text);
  var d=detect(files,'index.html',pretty(name)),id=slug(name);return installRec({id:id,name:d.name,icon:d.icon,file:name,single:false,files:files,entry:'index.html'},open)
}
/* chooser when a zip has more than one HTML page */
function choose(zipName,cands){
  return new Promise(function(res){
    var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:99999999;background:rgba(0,0,0,.45);display:grid;place-items:center;font:14px "Segoe UI",system-ui,sans-serif';
    var light=document.documentElement.classList.contains('light'),bg=light?'#f9f9f9':'#202020',fg=light?'#111':'#fff';
    o.innerHTML='<div style="width:min(440px,92vw);max-height:80vh;overflow:auto;background:'+bg+';color:'+fg+';border:1px solid rgba(128,128,128,.35);border-radius:12px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.6)"><h2 style="font-size:18px;font-weight:600;margin:0 0 6px">Make apps from “'+zipName.replace(/</g,'')+'”</h2><p style="margin:0 0 14px;opacity:.7;font-size:13px">This zip has more than one app. Merge them into one app with tabs, or select which ones to install separately.</p><div id="chl"></div><div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px"><button id="chx" style="padding:8px 18px;border-radius:6px;border:1px solid rgba(128,128,128,.4);background:transparent;color:inherit;cursor:pointer">Cancel</button><button id="chm" style="padding:8px 18px;border-radius:6px;border:1px solid rgba(128,128,128,.4);background:transparent;color:inherit;cursor:pointer">Merge into one app</button><button id="chk" style="padding:8px 22px;border-radius:6px;border:0;background:var(--accent,#4cc2ff);color:#000;font-weight:600;cursor:pointer">Install</button></div></div>';
    var l=o.querySelector('#chl');cands.forEach(function(c,i){var r=document.createElement('label');r.style.cssText='display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:6px;cursor:pointer';r.innerHTML='<input type="checkbox" '+(i===0?'checked':'')+' data-p="'+c.replace(/"/g,'&quot;')+'"><span>'+c.replace(/</g,'&lt;')+'</span>';l.appendChild(r)});
    document.body.appendChild(o);
    o.querySelector('#chx').onclick=function(){o.remove();res([])};
    o.querySelector('#chm').onclick=function(){var v=[].map.call(o.querySelectorAll('input:checked'),function(i){return i.dataset.p});if(v.length<2)v=cands.slice();o.remove();v.merge=true;res(v)};
    o.querySelector('#chk').onclick=function(){var v=[].map.call(o.querySelectorAll('input:checked'),function(i){return i.dataset.p});o.remove();res(v)}
  })
}

function mergeInstall(n,files,entries,open){
  var nm=pretty(n),ex=Object.keys(APPS).filter(function(k){return APPS[k].user&&APPS[k].title===nm})[0],id=ex||slug(n);
  var list=entries.map(function(e){var f=e.split('/').pop(),nn=/^index\.html?$/i.test(f)?(dirOf(e)?pretty(dirOf(e).split('/').pop()):'Main'):pretty(f);return{n:nn,e:e}});
  var h='<!doctype html><html><head><meta charset="utf-8"><title>'+nm.replace(/</g,'')+'</title><style>html,body{margin:0;height:100%;background:#111;color:#fff;font:13px "Segoe UI",system-ui,sans-serif}#t{display:flex;gap:4px;padding:6px 8px;background:#1b1b1b;overflow:auto;height:30px;align-items:center}#t button{border:0;border-radius:6px;padding:6px 14px;background:transparent;color:#ccc;cursor:pointer;font:inherit;white-space:nowrap}#t button.on{background:#3a3a3a;color:#fff}#t button:hover{background:#2c2c2c}#f{height:calc(100% - 44px)}iframe{width:100%;height:100%;border:0;display:none;background:#fff}iframe.on{display:block}</style></head><body><div id="t"></div><div id="f"></div><script>var ID='+JSON.stringify(id)+',L='+JSON.stringify(list)+';window.AppHost=parent.AppHost;var T=document.getElementById("t"),F=document.getElementById("f"),fr={},bt={};function show(i){L.forEach(function(x,j){if(bt[j])bt[j].classList.toggle("on",j===i);if(fr[j])fr[j].classList.toggle("on",j!==i?false:true)});if(!fr[i]){var f=document.createElement("iframe");f.setAttribute("allow","autoplay;fullscreen;clipboard-write");f.srcdoc=parent.AppHost.buildPage(ID,L[i].e);F.appendChild(f);fr[i]=f;f.classList.add("on")}}L.forEach(function(x,i){var b=document.createElement("button");b.textContent=x.n;b.onclick=function(){show(i)};T.appendChild(b);bt[i]=b});show(0);<\/script></body></html>';
  files['__merged__.html']=new TextEncoder().encode(h);
  var d=detect(files,list[0].e,nm);
  return installRec({id:id,name:nm,icon:d.icon,file:n,single:false,files:files,entry:'__merged__.html'},open)
}
function installFile(f,open){
  var n=f.name;
  if(/\.html?$/i.test(n))return f.text().then(function(t){return installText(n,t,open!==false)}).then(function(id){return id?[id]:[]});
  if(/\.zip$/i.test(n)){
    if(!window.DecompressionStream){msg('Can’t read zip','This browser can’t unzip files. Try an up-to-date Chrome, Edge or Safari.');return Promise.resolve()}
    return f.arrayBuffer().then(readZip).then(function(files){
      var htmls=Object.keys(files).filter(function(p){return /\.html?$/i.test(p)});
      if(!htmls.length){msg('No web page found','“'+n+'” doesn’t contain an HTML file, so there’s nothing to make into an app.');return []}
      htmls.sort(function(a,b){var da=a.split('/').length,db=b.split('/').length;if(da!==db)return da-db;var ia=/(^|\/)index\.html?$/i.test(a)?0:1,ib=/(^|\/)index\.html?$/i.test(b)?0:1;return ia-ib||a.localeCompare(b)});
      var isIdx=function(p){return /(^|\/)index\.html?$/i.test(p)};
      var topDepth=htmls[0].split('/').length,top=htmls.filter(function(p){return p.split('/').length===topDepth}),topIdx=top.filter(isIdx);
      var pick=htmls.length===1?Promise.resolve([htmls[0]]):choose(n,htmls);
      var ids=[];
      return pick.then(function(sel){
        if(!sel.length)return ids;
        if(sel.merge)return mergeInstall(n,files,sel,open!==false).then(function(id){return id?[id]:[]});
        return sel.reduce(function(p,entry,i){return p.then(function(){
          var file=entry.split('/').pop(),nm=isIdx(entry)?(dirOf(entry)?pretty(dirOf(entry).split('/').pop()):pretty(n)):pretty(file);
          var d=detect(files,entry,nm);return installRec({id:slug(d.name),name:d.name,icon:d.icon,file:n,single:false,files:files,entry:entry},open!==false&&i===0).then(function(id){ids.push(id)})})},Promise.resolve()).then(function(){return ids})
      })
    }).catch(function(e){msg('Couldn’t read zip',e.message||String(e))})
  }
  msg('Not an app','Only .html files and .zip files that contain one can become apps.');return Promise.resolve()
}
function askQuality(a){return new Promise(function(res){
  var K='app_q_'+a.rec.id,sv=null;try{sv=localStorage.getItem(K)}catch(e){}
  if(sv){res(sv);return}
  var light=document.documentElement.classList.contains('light'),bg=light?'#f9f9f9':'#202020',fg=light?'#111':'#fff';
  var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:99999999;background:rgba(0,0,0,.5);display:grid;place-items:center;font:14px "Segoe UI Variable Text","Segoe UI",system-ui,sans-serif';
  var bt='flex:1;padding:12px 8px;border-radius:8px;border:1px solid rgba(128,128,128,.4);background:rgba(128,128,128,.15);color:'+fg+';cursor:pointer;font:inherit';
  var nm=String(a.title).replace(/[<>&]/g,'');
  o.innerHTML='<div style="width:min(440px,92vw);background:'+bg+';color:'+fg+';border:1px solid rgba(128,128,128,.35);border-radius:12px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.6)"><h2 style="font-size:18px;font-weight:600;margin:0 0 6px">Graphics quality</h2><p style="margin:0 0 14px;opacity:.75;font-size:13px">'+(a.rec.fnf?'<b>Friday Night Funkin’ detected.</b> ':'')+'Pick how “'+nm+'” loads. This decides which game files are loaded first.'+((window.OSControllers&&OSControllers().length)?'<br>🎮 Controller detected: '+OSControllers()[0].name.replace(/[<>&]/g,''):'')+'</p><div style="display:flex;gap:8px"><button data-q="high" style="'+bt+'"><b>High</b><br><small>Loads all files<br>Full sharpness</small></button><button data-q="medium" style="'+bt+'"><b>Medium</b><br><small>Normal files<br>75% · 45 FPS</small></button><button data-q="low" style="'+bt+'"><b>Low</b><br><small>Essentials first<br>50% · 30 FPS</small></button></div><label style="display:flex;gap:8px;align-items:center;margin-top:14px;font-size:13px;opacity:.8"><input type="checkbox" id="qrem"> Remember for this app</label><div style="text-align:right;margin-top:10px"><button id="qx" style="padding:6px 14px;border-radius:6px;border:0;background:transparent;color:'+fg+';opacity:.7;cursor:pointer;font:inherit">Cancel</button></div></div>';
  document.body.appendChild(o);
  o.querySelector('#qx').onclick=function(){o.remove();res(null)};
  [].forEach.call(o.querySelectorAll('[data-q]'),function(b){b.onclick=function(){var q=b.dataset.q;if(o.querySelector('#qrem').checked){try{localStorage.setItem(K,q)}catch(e){}}o.remove();res(q)}})})}
/* loading screen: preload game files by quality tier. low = essentials only (rest loads on demand), medium = essentials + images/fonts, high = everything */
function preloadApp(a,q){return new Promise(function(res){
  var id=a.rec.id;loadFiles(id).then(function(files){
    if(!files){res();return}if(!mem[id])mem[id]=files;
    var keys=Object.keys(files),ES=/\.(html?|js|mjs|css|json|wasm|xml|txt|atlas|data)$/i,MD=/\.(png|jpe?g|gif|webp|svg|bmp|ico|woff2?|ttf|otf|fnt)$/i;
    var list=keys.filter(function(k){return q==='high'?true:q==='medium'?(ES.test(k)||MD.test(k)):ES.test(k)});
    list.sort(function(x,y){return(ES.test(x)?0:MD.test(x)?1:2)-(ES.test(y)?0:MD.test(y)?1:2)});
    var light=document.documentElement.classList.contains('light'),bg=light?'#f3f3f3':'#141414',fg=light?'#111':'#fff';
    var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:99999998;background:'+bg+';color:'+fg+';display:grid;place-items:center;font:14px "Segoe UI Variable Text","Segoe UI",system-ui,sans-serif';
    var ic=a.icon&&/^(data:|Icons\/|http)/.test(a.icon)?'<img src="'+a.icon+'" style="width:72px;height:72px;border-radius:16px;object-fit:cover">':'';
    o.innerHTML='<div style="text-align:center;width:min(360px,86vw)">'+ic+'<div style="font-size:20px;font-weight:600;margin:14px 0 4px">'+String(a.title).replace(/[<>&]/g,'')+'</div><div id="plq" style="opacity:.65;font-size:12px;margin-bottom:16px;text-transform:uppercase;letter-spacing:.08em">'+q+' quality</div><div style="height:4px;border-radius:3px;background:rgba(128,128,128,.3);overflow:hidden"><i id="plb" style="display:block;height:100%;width:0;background:var(--accent,#4cc2ff);transition:width .12s"></i></div><div id="plt" style="opacity:.7;font-size:12px;margin-top:10px;min-height:16px">Preparing…</div></div>';
    document.body.appendChild(o);
    var n=list.length,i=0,t0=Date.now();
    (function step(){var end=Date.now()+14;while(i<n&&Date.now()<end){var k=list[i++];try{vfs(id,k,'')}catch(e){}}
      o.querySelector('#plb').style.width=(n?Math.round(i/n*100):100)+'%';
      o.querySelector('#plt').textContent=n?('Loading files '+i+' / '+n+(q==='low'?' (essentials)':'')):'Starting…';
      if(i<n){setTimeout(step,0);return}
      setTimeout(function(){o.remove();res()},Math.max(250,700-(Date.now()-t0)))})()
  }).catch(function(){res()})})}
window.AppHost={loadFiles:function(id){return loadFiles(id)},buildPage:function(id,entry){return build(mem[id],entry,id)},readZip:readZip,fails:{},fail:function(id,u){(this.fails[id]=this.fails[id]||[]).push(String(u))},installFolder:function(name,files,entry,open,info){info=info||{};var d=detect(files,entry,pretty(name));var nm=info.fnf&&/^(index|untitled|app|game)?$/i.test(d.name.replace(/\s/g,''))?'Friday Night Funkin\u2019':d.name;
  return installRec({id:slug(nm),name:nm,icon:d.icon,file:name+'.zip',fnf:!!info.fnf,engine:info.engine||'',single:false,files:files,entry:entry},open!==false)},quality:function(id){return(APPS[id]&&APPS[id].q)||'high'},resetQuality:function(id){try{localStorage.removeItem('app_q_'+id)}catch(e){}},zipHasHtml:zipHasHtml,installFile:installFile,installText:installText,vfs:vfs,
  peek:function(name,text){var f={};f['index.html']=new TextEncoder().encode(text);return detect(f,'index.html',pretty(name))},
  uninstall:function(id){delete APPS[id];delete mem[id];Object.keys(vurls).forEach(function(k){if(k.indexOf(id+'|')===0){URL.revokeObjectURL(vurls[k]);delete vurls[k]}});if(window._INLINE_APPS)delete window._INLINE_APPS['user:'+id];return Promise.all([tx('readwrite',function(s){return s.delete(id)}),tx('readwrite',function(s){return s.delete(id)},'files')]).then(function(){try{closeWindow(id)}catch(e){}refreshUI()})}};
/* load installed apps on start */
tx('readonly',function(s){return s.getAll()}).then(function(all){var any=false;(all||[]).forEach(function(r){var ok=r.files?(mem[r.id]=r.files,register(r)):register(r,!r.single);if(ok)any=true});if(any)refreshUI()}).catch(function(){});
/* drop files straight onto the desktop */
document.addEventListener('dragover',function(e){if(e.dataTransfer&&Array.prototype.indexOf.call(e.dataTransfer.types||[],'Files')>-1)e.preventDefault()});
document.addEventListener('drop',function(e){var fs=e.dataTransfer&&e.dataTransfer.files;if(!fs||!fs.length)return;e.preventDefault();var rest=[];
  Promise.all(Array.prototype.map.call(fs,function(f){
    if(window.sysConfig&&sysConfig.classicExplorer){if(/\.html?$/i.test(f.name)){installFile(f,true);return}if(/\.zip$/i.test(f.name))return zipHasHtml(f).then(function(h){if(h)installFile(f,true);else rest.push(f)})}
    rest.push(f)})).then(function(){if(rest.length)FileStore.give(rest)})});
})();


/* =====================  MUSIC HOST  (opening a song launches the Music app as its own window/tab)  ===================== */
window.MusicHost={pending:null,
 open:function(tracks,i){this.pending={tracks:tracks,i:i||0};openWindow('music');
  var f=document.getElementById('frame-music');try{if(f&&f.contentWindow&&f.contentWindow.Music&&f.contentWindow.Music.ready)f.contentWindow.Music.consume()}catch(e){}},
 take:function(){var p=this.pending;this.pending=null;return p}};



/* =====================  EXPLORER HOST  (This PC / Recycle Bin open Files at a place)  ===================== */
window.ExplorerHost={pending:null,
 open:function(place){this.pending=place||null;var w=document.getElementById('win-explorer');
  if(!w)openWindow('explorer');else if(w.classList.contains('minimized')||activeWindowId!=='explorer')toggleApp('explorer');
  var f=document.getElementById('frame-explorer');try{if(f&&f.contentWindow&&f.contentWindow.Explorer&&f.contentWindow.Explorer.ready)f.contentWindow.Explorer.consume()}catch(e){}},
 take:function(){var p=this.pending;this.pending=null;return p}};
window.updateBinIcon=function(){var full=false;try{var r=JSON.parse(localStorage.getItem('win_fs_v1'));full=!!(r&&r.c&&r.c['Recycle Bin']&&Object.keys(r.c['Recycle Bin'].c||{}).length)}catch(e){}
 var im=document.querySelector('#d-bin img');if(im)im.src=full?'Icons/bin-full.svg':'Icons/bin.svg'};
window.updateBinIcon();window.addEventListener('storage',window.updateBinIcon);

/* =====================  BLANK-APP WATCHDOG  ===================== */
(function(){
var ow=window.openWindow;
function origin(html){var m=/saved from url=\(\d+\)\s*(https?:\/\/[^\s>]+)/i.exec(html)||/<link[^>]+rel=["']canonical["'][^>]+href=["'](https?:[^"']+)/i.exec(html)||/<meta[^>]+property=["']og:url["'][^>]+content=["'](https?:[^"']+)/i.exec(html)||/<base[^>]+href=["'](https?:[^"']+)/i.exec(html);return m?m[1]:''}
function check(id){
  var a=APPS[id],w=document.getElementById('win-'+id),f=document.getElementById('frame-'+id);if(!a||!w||!f||w.querySelector('.blank-note'))return;
  var d;try{d=f.contentDocument}catch(e){return}if(!d||!d.body)return;
  var txt=(d.body.innerText||'').trim(),shown=txt.length>25||d.querySelector('canvas,video,svg,iframe,img'),fl=(window.AppHost.fails[id]||[]);
  if(shown&&fl.length<3)return;
  var html=(window._INLINE_APPS&&window._INLINE_APPS[a.path])||'',site=origin(html),host='';try{host=fl.length?new URL(fl[0]).hostname:''}catch(e){}
  var n=document.createElement('div');n.className='blank-note';n.style.cssText='position:absolute;left:12px;right:12px;bottom:12px;z-index:5;background:#2b2b2b;color:#fff;border:1px solid #555;border-radius:10px;padding:12px 14px;font:13px "Segoe UI",system-ui,sans-serif;box-shadow:0 10px 30px #000a';
  n.innerHTML='<b>“'+a.title+'” looks blank.</b><div style="opacity:.75;margin:4px 0 10px;line-height:1.5">'+(fl.length?fl.length+' file'+(fl.length>1?'s':'')+' couldn’t load'+(host?' (from '+host.replace(/</g,'')+')':'')+'. ':'')+'This usually means it’s a saved copy of a website that needs its own servers or a login, or a site that blocks being opened inside another page (like Schoology).</div><button class="bn-o" style="padding:7px 12px;border-radius:6px;border:0;background:#4cc2ff;color:#000;cursor:pointer;font:inherit;margin-right:8px">Open in new tab</button><button class="bn-r" style="padding:7px 12px;border-radius:6px;border:0;background:#444;color:#fff;cursor:pointer;font:inherit;margin-right:8px">Reload</button><button class="bn-x" style="padding:7px 12px;border-radius:6px;border:0;background:transparent;color:#aaa;cursor:pointer;font:inherit">Dismiss</button>';
  var body=w.querySelector('.win-body')||w;body.style.position=body.style.position||'relative';body.appendChild(n);
  n.querySelector('.bn-o').onclick=function(){if(site){window.open(site,'_blank')}else{var u=URL.createObjectURL(new Blob([html],{type:'text/html'}));window.open(u,'_blank')}};
  n.querySelector('.bn-r').onclick=function(){n.remove();window.AppHost.fails[id]=[];f.srcdoc=f.srcdoc;setTimeout(function(){check(id)},5000)};
  n.querySelector('.bn-x').onclick=function(){n.remove()}}
window.openWindow=function(id){var had=document.getElementById('win-'+id),r=ow(id),a=APPS[id];
  if(!had&&a&&a.user)Promise.resolve(r).then(function(){setTimeout(function(){check(id)},6000)});return r};
})();

/* ===== CLICK FIX: first click inside an unfocused app window used to be swallowed ===== */
(function(){
function winOf(el){return el&&el.closest?el.closest('.window.os-win'):null}
function sync(){var a=document.activeElement;if(a&&a.tagName==='IFRAME'){var w=winOf(a);if(w&&!w.classList.contains('focused')&&!w.classList.contains('minimized'))window.wmFocus(w.id.replace('win-',''))}}
window.addEventListener('blur',function(){setTimeout(sync,0)});
setInterval(sync,120);
function hook(f){try{var d=f.contentWindow;if(d._wmh)return;d._wmh=1;d.addEventListener('pointerdown',function(){var w=winOf(f);if(w&&!w.classList.contains('focused'))window.wmFocus(w.id.replace('win-',''))},true)}catch(e){}}
document.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IFRAME')hook(e.target)},true);
setInterval(function(){document.querySelectorAll('.window.os-win iframe').forEach(hook)},500);
['pointerup','pointercancel','blur'].forEach(function(t){window.addEventListener(t,function(){document.body.classList.remove('wm-drag')},true)});
})();

/* ---- extra settings: high contrast, large cursor, do not disturb ---- */
(function(){
  var st=document.createElement('style');
  st.textContent='html.hc{filter:contrast(1.22) saturate(1.15)}html.bigcur,html.bigcur *{cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M4 2l14 9-6 1.5L9 19z\' fill=\'white\' stroke=\'black\' stroke-width=\'1.4\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 4 2,auto!important}';
  document.head.appendChild(st);
  function applyExtras(){var d=document.documentElement;d.classList.toggle('hc',!!sysConfig.hiContrast);d.classList.toggle('bigcur',!!sysConfig.bigCursor)}
  var u3=window.updateSysSetting;window.updateSysSetting=function(k,v){u3(k,v);if(k==='hiContrast'||k==='bigCursor')applyExtras()};
  applyExtras();
  if(typeof window.showNotification==='function'){var sn=window.showNotification;window.showNotification=function(){if(sysConfig.dnd)return;return sn.apply(this,arguments)}}
})();

/* =====================  MORE SETTINGS ENGINE  ===================== */
(function(){
var css=document.createElement('style');
css.textContent=[
'#os-dim{position:fixed;inset:0;background:#000;pointer-events:none;opacity:0;z-index:99997;transition:opacity .2s}',
'html[data-tbalign=left] #dock-container{justify-content:flex-start!important;padding:0 120px 0 12px!important}',
'html[data-tbsize=small] #dock-container,html[data-tbsize=small] #tray{height:40px!important}html[data-tbsize=small] .dock-item img{width:22px!important;height:22px!important}',
'html[data-tbsize=large] #dock-container,html[data-tbsize=large] #tray{height:58px!important}html[data-tbsize=large] .dock-item{height:48px!important;width:50px!important}html[data-tbsize=large] .dock-item img{width:32px!important;height:32px!important}',
'html[data-dsize=small] #desk-icons{zoom:.82}html[data-dsize=large] #desk-icons{zoom:1.3}',
'html.nolabels #desk-icons span{display:none}html.nodesk #desk-icons{display:none!important}html.nowid #wid-btn{display:none!important}',
'html[data-wpfit=contain] #bg-video,html[data-wpfit=contain] #bg-img,html[data-wpfit=contain] #lock-video,html[data-wpfit=contain] #lock-img{object-fit:contain!important;background:#000}',
'html[data-wpfit=fill] #bg-video,html[data-wpfit=fill] #bg-img,html[data-wpfit=fill] #lock-video,html[data-wpfit=fill] #lock-img{object-fit:fill!important}',
'html[data-toast=bl] #toast-container{right:auto;left:20px}html[data-toast=tr] #toast-container{bottom:auto;top:20px}html[data-toast=tl] #toast-container{bottom:auto;top:20px;right:auto;left:20px}'
].join('\n');
document.head.appendChild(css);
var dim=document.createElement('div');dim.id='os-dim';document.body.appendChild(dim);
function apply(){
  var c=sysConfig,h=document.documentElement;
  h.setAttribute('data-tbalign',c.tbAlign||'center');h.setAttribute('data-tbsize',c.tbSize||'medium');h.setAttribute('data-dsize',c.deskSize||'default');
  h.setAttribute('data-wpfit',c.wpFit||'cover');h.setAttribute('data-toast',c.toastPos||'br');
  h.classList.toggle('nolabels',c.deskLabels===false);h.classList.toggle('nodesk',c.deskIcons===false);h.classList.toggle('nowid',c.showWidgets===false);
  dim.style.opacity=String(Math.max(0,Math.min(.7,(100-(c.brightness==null?100:c.brightness))/100)));
  var n=document.getElementById('night-overlay');
  if(n&&c.nightLight!==undefined){var al=(c.nightStrength||16)/100;n.style.background='rgba(255,140,30,'+al+')';n.style.opacity=c.nightLight?'1':'0'}
}
var NK=['tbAlign','tbSize','deskSize','wpFit','toastPos','deskLabels','deskIcons','showWidgets','brightness','nightLight','nightStrength'];
var u4=window.updateSysSetting;window.updateSysSetting=function(k,v){u4(k,v);if(NK.indexOf(k)>-1)apply()};
apply();document.addEventListener('DOMContentLoaded',apply);
window.setMasterVolume=function(v){var q=document.getElementById('qs-vol');if(q){q.value=v;q.oninput&&q.oninput.call(q)}};
/* clock: seconds, date format, time zone, hide date */
function clk(){var c=sysConfig,t=document.getElementById('tc-time'),d=document.getElementById('tc-date');if(!t||!d)return;
  d.style.display=c.showDate===false?'none':'';
  if(!(c.showSeconds||(c.dateFormat&&c.dateFormat!=='mdy')||c.timeZone))return;
  var o={};try{new Intl.DateTimeFormat('en-US',{timeZone:c.timeZone||undefined,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date()).forEach(function(p){o[p.type]=p.value})}catch(e){return}
  var h=+o.hour%24,mm=o.minute,ss=o.second,tt;
  tt=c.clock24?('0'+h).slice(-2)+':'+mm:(h%12||12)+':'+mm;if(c.showSeconds)tt+=':'+ss;if(!c.clock24)tt+=h>=12?' PM':' AM';
  var mo=('0'+o.month).slice(-2),dy=('0'+o.day).slice(-2);
  t.textContent=tt;d.textContent=c.dateFormat==='dmy'?dy+'/'+mo+'/'+o.year:c.dateFormat==='ymd'?o.year+'-'+mo+'-'+dy:o.month+'/'+o.day+'/'+o.year}
setInterval(clk,500);
/* custom tab cloak */
try{Object.defineProperty(cloaks,'custom',{enumerable:true,get:function(){return{title:sysConfig.cloakTitle||'Document',icon:sysConfig.cloakIcon||''}}})}catch(e){}
var u5=window.updateSysSetting;window.updateSysSetting=function(k,v){u5(k,v);if((k==='cloakTitle'||k==='cloakIcon')&&sysConfig.cloak==='custom'&&window.applyCloak)applyCloak()};
/* open an app at startup */
if(sysConfig.startupApp){var iv=setInterval(function(){if(typeof isDesktopActive!=='undefined'&&isDesktopActive){clearInterval(iv);setTimeout(function(){try{openWindow(sysConfig.startupApp)}catch(e){}},900)}},500)}
})();

/* =====================  CUSTOMIZE APP (hidden), CUSTOM WALLPAPERS, FREE DESKTOP, WIN11 FLYOUTS  ===================== */
(function(){
window.openCustomize=function(tab){window.customizeTab=tab||'wp';try{var f=document.getElementById('frame-customize');if(f&&f.contentWindow&&f.contentWindow.showTab)f.contentWindow.showTab(window.customizeTab)}catch(e){}openWindow('customize')};
window.openWallpaperMenu=function(){openCustomize('wp')};
window.wpKinds={};
window.loadCustomWallpapers=function(){var l=sysConfig.customWallpapers||[];return Promise.all(l.map(function(w){return FileStore.url(w.id).then(function(u){if(!u)return;wpKinds[u]=w.kind;wallpaperRegistry[w.key]={id:w.key,name:w.name,url:u,locked:false,custom:true}})})).then(function(){if(l.some(function(w){return sysConfig.homeWallpaper===w.key||sysConfig.lockWallpaper===w.key})){try{initWallpapers()}catch(e){}}})};
window.addCustomWallpaper=function(file){var kind=/^image\//.test(file.type)?'img':'vid',key='cw_'+Date.now().toString(36),name=file.name.replace(/\.[^.]+$/,'').slice(0,28)||'My background',id='wp_'+key;return FileStore.put(id,file).then(function(){updateSysSetting('customWallpapers',(sysConfig.customWallpapers||[]).concat([{key:key,name:name,kind:kind,id:id}]));return loadCustomWallpapers().then(function(){return key})})};
window.removeCustomWallpaper=function(key){var l=sysConfig.customWallpapers||[],w=l.filter(function(x){return x.key===key})[0];if(!w)return Promise.resolve();FileStore.del(w.id);updateSysSetting('customWallpapers',l.filter(function(x){return x.key!==key}));delete wallpaperRegistry[key];if(sysConfig.homeWallpaper===key)updateSysSetting('homeWallpaper','Bloom');if(sysConfig.lockWallpaper===key)updateSysSetting('lockWallpaper','Bloom');try{initWallpapers()}catch(e){}return Promise.resolve()};
document.addEventListener('DOMContentLoaded',function(){loadCustomWallpapers()});

/* ---- desktop icons (This PC, Recycle Bin) can sit anywhere ---- */
var di=document.getElementById('desk-icons'),POS={};try{POS=JSON.parse(localStorage.getItem('cine_dico_pos'))||{}}catch(e){}
function dk(el){return el.id||el.dataset.place||el.dataset.app}
function place(){[].forEach.call(di.querySelectorAll('.d-ico'),function(el,i){var p=POS[dk(el)]||{x:10,y:14+i*104};el.style.position='fixed';el.style.left=p.x+'px';el.style.top=p.y+'px';el.style.touchAction='none'})}
place();
var drag=null;
di.addEventListener('pointerdown',function(e){var el=e.target.closest('.d-ico');if(!el||e.button>0)return;var r=el.getBoundingClientRect();drag={el:el,sx:e.clientX,sy:e.clientY,ox:r.left,oy:r.top,moved:false,id:e.pointerId}});
window.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(!drag.moved&&Math.abs(dx)+Math.abs(dy)<6)return;if(!drag.moved){drag.moved=true;drag.el.classList.add('sel');drag.el.style.zIndex=5;drag.el.style.transition='none'}
  var z=parseFloat(getComputedStyle(di).zoom)||1,x=Math.max(0,Math.min(innerWidth-70,drag.ox+dx))/z,y=Math.max(0,Math.min(innerHeight-130,drag.oy+dy))/z;drag.el.style.left=x+'px';drag.el.style.top=y+'px'});
window.addEventListener('pointerup',function(e){if(!drag||e.pointerId!==drag.id)return;if(drag.moved){POS[dk(drag.el)]={x:parseFloat(drag.el.style.left),y:parseFloat(drag.el.style.top)};try{localStorage.setItem('cine_dico_pos',JSON.stringify(POS))}catch(x){}drag.el.style.zIndex='';drag.el.style.transition=''}drag=null});

/* ---- accent contrast colour ---- */
function onAcc(){var a=sysConfig.accent||'#4cc2ff',m=/^#([0-9a-f]{6})$/i.exec(a),l=m?parseInt(m[1].slice(0,2),16)*.299+parseInt(m[1].slice(2,4),16)*.587+parseInt(m[1].slice(4),16)*.114:200;document.documentElement.style.setProperty('--onacc',l>150?'#000':'#fff')}
var aa0=window.applyAccent;window.applyAccent=function(){aa0();onAcc()};onAcc();

/* ---- Windows 11 quick settings: filled slider tracks ---- */
function fill(i){var v=(i.value-i.min)/(i.max-i.min)*100;i.style.setProperty('--v',v+'%')}
['qs-bright','qs-vol'].forEach(function(id){var i=document.getElementById(id);if(!i)return;fill(i);i.addEventListener('input',function(){fill(i)})});
/* ---- Windows 11 calendar flyout: seconds, arrows, agenda ---- */
var cp=document.getElementById('cal-panel'),pv=document.getElementById('cal-prev'),nx=document.getElementById('cal-next');
if(pv)pv.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>';
if(nx)nx.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
if(cp){var ag=document.createElement('div');ag.className='cal-agenda';ag.innerHTML='<span>No events today</span>';cp.appendChild(ag)}
setInterval(function(){var b=document.getElementById('cal-big');if(!b||!cp||!cp.classList.contains('open'))return;var tz=sysConfig.timeZone||undefined;try{b.textContent=new Date().toLocaleTimeString([],{timeZone:tz,hour:'numeric',minute:'2-digit',second:'2-digit',hour12:!sysConfig.clock24})}catch(e){}},500);
/* ---- Windows 11 widgets: weather card (Open-Meteo, no key) ---- */
var wp=document.getElementById('wid-panel'),hello=wp&&wp.querySelector('.wd-hello');
if(wp&&hello){
  var card=document.createElement('div');card.className='wd-card';card.id='wd-weather';card.innerHTML='<div class="wd-h">Weather</div><div class="wx"><div class="wx-i" id="wx-i"></div><div><b id="wx-t">--°</b><small id="wx-d">Tap to load</small></div></div>';
  hello.insertAdjacentElement('afterend',card);
  var IC={sun:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="9" fill="#ffc93c"/><g stroke="#ffc93c" stroke-width="3" stroke-linecap="round"><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.600 10.600l3.500 3.500M33.900 33.900l3.500 3.500M10.600 37.400l3.500-3.500M33.900 14.100l3.500-3.500"/></g></svg>',moon:'<svg viewBox="0 0 48 48"><path d="M30 8a16 16 0 1 0 10 28A14 14 0 0 1 30 8z" fill="#cdd6ff"/></svg>',cloud:'<svg viewBox="0 0 48 48"><path d="M14 36a8 8 0 0 1-.8-16A11 11 0 0 1 34 17a9.500 9.500 0 0 1 1 19z" fill="#d6dbe3"/></svg>',part:'<svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="7" fill="#ffc93c"/><path d="M16 38a7 7 0 0 1-.7-14A10 10 0 0 1 35 22a8.500 8.500 0 0 1 .8 16z" fill="#e4e8ef"/></svg>',rain:'<svg viewBox="0 0 48 48"><path d="M14 30a8 8 0 0 1-.8-16A11 11 0 0 1 34 11a9.500 9.500 0 0 1 1 19z" fill="#aeb8c7"/><g stroke="#4cc2ff" stroke-width="3" stroke-linecap="round"><path d="M15 36l-2 6M25 36l-2 6M35 36l-2 6"/></g></svg>',snow:'<svg viewBox="0 0 48 48"><path d="M14 30a8 8 0 0 1-.8-16A11 11 0 0 1 34 11a9.500 9.500 0 0 1 1 19z" fill="#c7cfdb"/><g fill="#fff"><circle cx="15" cy="38" r="2.500"/><circle cx="25" cy="41" r="2.500"/><circle cx="35" cy="38" r="2.500"/></g></svg>',storm:'<svg viewBox="0 0 48 48"><path d="M14 28a8 8 0 0 1-.8-16A11 11 0 0 1 34 9a9.500 9.500 0 0 1 1 19z" fill="#8d97a8"/><path d="M25 28l-6 10h5l-2 8 9-12h-5l3-6z" fill="#ffc93c"/></svg>',fog:'<svg viewBox="0 0 48 48"><g stroke="#c4cad4" stroke-width="3.500" stroke-linecap="round"><path d="M8 18h32M12 26h28M8 34h32"/></g></svg>'};
  function grp(c,day){if(c===0)return day?'sun':'moon';if(c<=2)return day?'part':'cloud';if(c===3)return'cloud';if(c===45||c===48)return'fog';if((c>=51&&c<=67)||(c>=80&&c<=82))return'rain';if((c>=71&&c<=77)||c===85||c===86)return'snow';if(c>=95)return'storm';return'cloud'}
  var NM={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Foggy',48:'Foggy',51:'Light drizzle',53:'Drizzle',55:'Drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm'};
  function unit(){return sysConfig.tempUnit||((navigator.language||'').toLowerCase()==='en-us'?'f':'c')}
  function show(w){document.getElementById('wx-i').innerHTML=IC[grp(w.code,w.day)];document.getElementById('wx-t').textContent=Math.round(w.temp)+'°'+(w.unit==='f'?'F':'C');document.getElementById('wx-d').textContent=(NM[w.code]||'Weather')+' · H '+Math.round(w.hi)+'° L '+Math.round(w.lo)+'°'}
  function msg(t){document.getElementById('wx-d').textContent=t}
  function load(force){var c=null;try{c=JSON.parse(localStorage.getItem('wx_cache'))}catch(e){}
    if(c&&c.unit===unit()&&!force&&Date.now()-c.t<600000){show(c);return}
    if(c&&c.unit===unit())show(c);
    if(!navigator.geolocation){msg('Location isn’t available');return}
    msg('Getting location…');
    navigator.geolocation.getCurrentPosition(function(p){var u=unit();fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.coords.latitude.toFixed(2)+'&longitude='+p.coords.longitude.toFixed(2)+'&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1&temperature_unit='+(u==='f'?'fahrenheit':'celsius')).then(function(r){return r.json()}).then(function(j){var w={t:Date.now(),unit:u,temp:j.current.temperature_2m,code:j.current.weather_code,day:!!j.current.is_day,hi:j.daily.temperature_2m_max[0],lo:j.daily.temperature_2m_min[0]};try{localStorage.setItem('wx_cache',JSON.stringify(w))}catch(e){}show(w)}).catch(function(){msg('Couldn’t load the weather')})},function(){msg('Allow location to see the weather')},{timeout:9000,maximumAge:600000})}
  card.onclick=function(){load(true)};
  new MutationObserver(function(){if(wp.classList.contains('open'))load(false)}).observe(wp,{attributes:true,attributeFilter:['class']});
}
})();

window.ytKey=function(){return sysConfig.youtubeApiKey||atob('b1JKci1KLXlZQV90Nk9PUkdzYjUzQUJJLWFRekdYWTdDeVNheklB').split('').reverse().join('')};
