# Windows 11

Open `index.html` (best served over https or http://localhost).

## Setup again
Settings > About > Recovery > Run setup again.

## Apps from HTML
Upload an `.html` file (Files > Upload, Settings > Apps > Upload, or drag it onto the desktop) and it opens as an app, pinned to the taskbar and Start.
Upload a `.zip` and it's searched for HTML files. One page (or one `index.html`) installs straight away; several let you pick. CSS, JS, images and fonts in the zip are wired up automatically. Uninstall from Settings > Apps.

## New
- **Files tabs:** Music, Videos, Pictures, Documents, Apps. Uploads sort themselves into the right tab.
- **Music app:** double-click a song and it opens in its own Music window (queue, seek, volume, shuffle, repeat, visualizer, cover art).
- **MP4 icon** on video files. HTML/zip apps keep their file name and icon in Files > Apps.
- **Games (e.g. FNF web builds):** upload the build as a .zip (must contain index.html). Asset paths are served from the zip. A High/Medium/Low quality picker shows before a zip app opens.

## Settings (rebuilt)
Pages: System, Personalization, Apps, Accounts, Accessibility, Time & language, Privacy & security, Integrations, Backup & reset, About. The search box finds any setting.
New: do not disturb, custom accent color, editable name/email/device name, 20 avatars, high contrast, large cursor, settings export/import, reset settings only.

## YouTube app
Built-in access, nothing to set up. Pick a **Server** (Automatic, YouTube, Invidious, Piped) and a **Player** in the top bar or Settings > Integrations. Automatic falls back to the next server if one fails or runs out of quota. Paste any YouTube link in the search bar to play it directly. Serve the OS over http://localhost or https.

## Customize app (hidden)
Backgrounds, fonts and colors live in a separate Customize app. It is not pinned or listed anywhere; it opens when you change the background (desktop right-click), from Settings > Personalization, or when you change the font. You can upload your own pictures/videos and fonts there.

## Desktop
Apps and icons can be dragged and dropped anywhere on the desktop, not just a grid. Drag an app from the app list onto the desktop to place it.

## Music sources
Music > Find searches two full-song catalogs (no previews):
- **Audius**: works with no key.
- **Jamendo**: 600,000+ free, legal full tracks. Get a free client ID at devportal.jamendo.com and paste it in Settings > Integrations.
Both have a "Load more songs" button. No API offers literally every song in existence.

## Microsoft (Azure) account
Windows 11 signs in with a real Microsoft account (OAuth2 + PKCE, name, email and photo come from Microsoft Graph).
1. Go to https://entra.microsoft.com > Entra ID > App registrations > New registration.
2. Name it anything. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**.
3. Redirect URI: platform **Single-page application (SPA)**, value = your Windows 11 address, e.g. `https://windows11.onrender.com/` (the exact address is shown in Settings > Accounts; add `http://localhost:8080/` too for testing).
4. Register, then copy the **Application (client) ID**.
5. Paste it into `windope-config.js` (`window.WINDOPE_MS_CLIENT_ID`) so everybody gets one-click sign-in, or paste it in Settings > Accounts.
If you picked "this organization only" in step 2, also set `window.WINDOPE_MS_TENANT` in `windope-config.js` to your Directory (tenant) ID.
Must run from http://localhost or https (not file://).

## Profile picture
Upload only. Choose it during setup or in Settings > Accounts.

Re-run `python3 build-inline.py` after editing any app.

## Running Windows 11 with its servers
Install Node 18+, then run `start-server.bat` (Windows) or `./start-server.sh` and open http://localhost:8080/.
That one process serves Windows 11 itself plus the Microsoft sign-in check and the Messages chat backend. See `server/README.md`.
