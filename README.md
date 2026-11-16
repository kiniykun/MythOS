# Windows 11 Changelog

## 2026-11-16
### Added
- Setup screen now asks "How would you like to sign in?" with a choice of Microsoft account (recommended) or Local account.
- Sign up / sign in with a real Microsoft account (Azure / Entra ID), including name, email and photo.
- Server checks Microsoft sign-ins with Microsoft Graph, so Messages works with Microsoft accounts and no passwords are stored.
- Optional server limits: `ALLOWED_EMAILS` and `ALLOWED_TENANT`.
- Free hosting setup for Render (no disk needed).
- Automatic update workflow: upload a zip to GitHub and it unpacks itself.

### Changed
- Everything is now named Windows 11.
- Setup and Settings wording rewritten to be clearer and more professional.
- Azure client ID is set once in `windope-config.js` and no longer shown in the OS.
- License updated to all rights reserved, with no reuse of the code.

### Removed
- Microsoftie accounts, sign-up pages and local fake accounts.
- Cine-OS name and references.
