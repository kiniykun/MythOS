# Putting the MythOS server online

The whole project (the OS, the Microsoft sign-in check, chat servers and the usage info collector) runs from one small Node server. No packages to install.

## Easiest: run it on your PC
Windows: double-click `start-server.bat`. Mac/Linux: `./start-server.sh`. Open http://localhost:8080/

## Hosted (so it works on any device and in about:blank)
1. Put this folder on GitHub (keep the repo **private**).
2. Make a free account on Render, press New > Blueprint and pick the repo. It reads `render.yaml` and gives you a web address like `https://mythos.onrender.com`.
3. Open that address. MythOS, Microsoft sign-in and the chat servers all work from it.
4. In Azure (entra.microsoft.com > App registrations), add that same address (with a trailing /) as a **Single-page application** redirect URI, and put the Application (client) ID in `windope-config.js` as `WINDOPE_MS_CLIENT_ID`.
5. Look at your collected info at `https://YOUR-ADDRESS/insights/` using the ADMIN_KEY shown in Render > Environment.

Already hosting the OS somewhere else (zip-to-site)? Open `windope-config.js` and set `window.WINDOPE_SERVER` to your server address. Also add that site's address as a redirect URI in your Azure app registration.

Free hosts may sleep when idle (first load is slow) and some wipe files on restart, so the Render disk in `render.yaml` keeps accounts and info.

## Updating from a zip (unpack workflow)
`.github/workflows/unpack.yml` unpacks a new `MythOS.zip` into your GitHub repo for you, so you never have to upload files one by one (handy on a phone).
1. In your repo, use Add file > Upload files and upload the new `MythOS.zip` to the top level (not inside a folder).
2. The **Unpack MythOS** workflow runs by itself, copies everything into the repo and commits it. Render then redeploys.
3. To run it by hand: Actions tab > Unpack MythOS > Run workflow. You can choose whether to delete old files that are no longer in the zip and whether to delete the zip afterwards.
The workflow stops with an error if the zip is missing or has no `index.html`.

## Turning info collection off
- On the OS: Settings > System > Privacy > switch off "Send usage info". (MythOS also asks once on first start.)
- On the server: set the environment variable `COLLECT_USAGE=0` and it stores nothing, even if the OS sends it.

## On a phone (no computer)
The server needs a place to run. Easiest from a phone:
1. Open **replit.com** in your browser and sign in. Create a new **Node.js** app.
2. In the Files panel choose Upload and pick `MythOS.zip` (get it from this chat first).
3. Open the **Shell** tab and run:
   `unzip -o MythOS.zip && cd MythOS && HOST=0.0.0.0 ADMIN_KEY=pick-a-password node server/server.js`
4. Replit shows a web address for the running app. Open it: that is MythOS with working Microsoft sign-in, Messages and the insights page at `/insights/`.
5. To keep it running when the app is closed, use Replit's Deploy option (may be paid). Free runs stop when you leave.
Menus change over time, so follow Replit's current screens if they look different.

Free alternative later from a computer: GitHub (private repo) + Render using `render.yaml`, as above.
