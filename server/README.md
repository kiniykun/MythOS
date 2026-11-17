# MythOS server

Serves MythOS itself, checks Microsoft (Azure / Entra ID) sign-ins, and runs the Messages chat backend and usage info collector.
There are **no passwords on this server**: the OS signs in with Microsoft, sends the Microsoft access token here once, and the server
verifies it with Microsoft Graph (`/me`) and returns its own 30-day session token.

## Run it
Needs Node 18+ (no packages to install).

    cd server
    node server.js          # or: npm start

Open http://localhost:8080/. In the OS: **Settings > Accounts > Microsoft account > Sign in**, or "Sign in with Microsoft" during first-run setup.
Set up your Azure app registration first (see ../README.md, "Microsoft (Azure) account").

## What it stores
`server/data/users.json` (email + display name from Microsoft) and `sessions.json` (hashed session tokens). Never served over HTTP.

## Options (environment variables)
* `ALLOWED_EMAILS=a@x.com,b@y.com` only these Microsoft accounts can use Messages.
* `ALLOWED_TENANT=<directory id>` only accounts from this Azure tenant can use Messages.
* `DATA_DIR=/some/persistent/folder` keep data across redeploys.
* `ADMIN_KEY`, `COLLECT_USAGE=0` see ../DEPLOY.md.
Use HTTPS when hosted: `HOST=0.0.0.0 PORT=8080 node server.js` behind a certificate (Render gives you one).

## API
POST /api/ms-login {token: Microsoft Graph access token} -> {token,user}
GET /api/me (Bearer session token) / POST /api/logout

## Messages (chat servers inside the OS)
Signed-in users can create servers (up to 5 each), chat in near-real-time and delete the ones they own. A "MythOS Lounge" server exists by default.
Messages are plain text, up to 500 characters, last 500 kept per server. Data: `server/data/servers.json`.
Extra API: GET /api/status, GET/POST /api/servers, GET/POST /api/servers/:id/messages, POST /api/servers/:id/delete
