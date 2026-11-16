# Putting the Windows 11 server online

The whole project (the OS, the Microsoft sign-in check, chat servers and the usage info collector) runs from one small Node server. No packages to install.

## Easiest: run it on your PC
Windows: double-click `start-server.bat`. Mac/Linux: `./start-server.sh`. Open http://localhost:8080/

## Hosted (so it works on any device and in about:blank)
1. Put this folder on GitHub (keep the repo **private**).
2. Make a free account on Render, press New > Blueprint and pick the repo. It reads `render.yaml` and gives you a web address like `https://windows11.onrender.com`.
3. Open that address. Windows 11, Microsoft sign-in and the chat servers all work from it.
4. In Azure (entra.microsoft.com > App registrations), add that same address (with a trailing /) as a **Single-page application** redirect URI, and put the Application (client) ID in `windope-config.js` as `WINDOPE_MS_CLIENT_ID`.
5. Look at your collected info at `https://YOUR-ADDRESS/insights/` using the ADMIN_KEY shown in Render > Environment.

Already hosting the OS somewhere else (zip-to-site)? Open `windope-config.js` and set `window.WINDOPE_SERVER` to your server address. Also add that site's address as a redirect URI in your Azure app registration.

Free hosts may sleep when idle (first load is slow) and some wipe files on restart, so the Render disk in `render.yaml` keeps accounts and info.

## Turning info collection off
- On the OS: Settings > System > Privacy > switch off "Send usage info". (Windows 11 also asks once on first start.)
- On the server: set the environment variable `COLLECT_USAGE=0` and it stores nothing, even if the OS sends it.

## On a phone (no computer)
The server needs a place to run. Easiest from a phone:
1. Open **replit.com** in your browser and sign in. Create a new **Node.js** app.
2. In the Files panel choose Upload and pick `Windows 11.zip` (get it from this chat first).
3. Open the **Shell** tab and run:
   `unzip -o Windows 11.zip && cd Windows 11 && HOST=0.0.0.0 ADMIN_KEY=pick-a-password node server/server.js`
4. Replit shows a web address for the running app. Open it: that is Windows 11 with working Microsoft sign-in, Messages and the insights page at `/insights/`.
5. To keep it running when the app is closed, use Replit's Deploy option (may be paid). Free runs stop when you leave.
Menus change over time, so follow Replit's current screens if they look different.

Free alternative later from a computer: GitHub (private repo) + Render using `render.yaml`, as above.
