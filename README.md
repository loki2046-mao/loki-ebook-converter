# Loki MD

A small macOS desktop app for converting ebook formats with Calibre's conversion engine.

## For users

Do not download the repository ZIP for normal use. Download the latest `.dmg` from the GitHub Releases page.

1. Open the DMG.
2. Drag `Loki MD` to `Applications`.
3. Double-click `Loki MD.app` from Applications.
4. Add one or more ebook files, choose the output format and output folder, then start the conversion.

The release DMG contains the Calibre conversion runtime. Users do not need to install Node.js, npm, Electron or Calibre separately. The current release is a universal build for both Apple Silicon and Intel Macs.

This project currently publishes unsigned builds because it does not use an Apple Developer signing identity. On the first launch, macOS may show an unidentified-developer warning. To open it, right-click `Loki MD.app` and choose `Open`, then confirm. If macOS has already blocked it, open `System Settings > Privacy & Security`, scroll to the security message and click `Open Anyway`. This is a per-app approval; do not disable Gatekeeper globally.

A public release should eventually be signed and notarized with an Apple Developer account so that users can open it without this one-time approval.

## Install With an Agent

Give an Agent this instruction:

```text
Open the latest release of loki2046-mao/loki-md on GitHub. Download Loki MD's universal DMG, mount it, copy Loki MD.app to /Applications, and launch it. If macOS blocks the unsigned app on first launch, use right-click > Open or System Settings > Privacy & Security > Open Anyway.
```

## Development

Requirements:

- macOS
- Node.js 20 or newer
- npm
- Calibre installed at `/Applications/calibre.app`

Install dependencies and start the development app:

```bash
npm install
npm start
```

The development app uses Calibre's background-only worker. It does not open the Calibre GUI during conversion.

## Build a DMG

The macOS build prepares a self-contained Calibre worker from the local Calibre installation, then packages it outside the Electron `app.asar` archive. It produces a universal DMG that runs on both Apple Silicon and Intel Macs:

```bash
npm run build:mac
```

The DMG is written to `dist/`.

The worker is intentionally ignored by Git because it is about 1.1 GB with Calibre's Python runtime, plugins, fonts and framework files. A release DMG contains it; a source checkout recreates it with `npm run prepare:mac` when Calibre is installed locally.

## Architecture

- `main.js`: Electron main process, Calibre detection, conversion and IPC handlers
- `preload.js`: isolated renderer bridge
- `renderer/index.html`: drag-and-drop UI and progress display
- `scripts/prepare-runtime.js`: prepares the macOS background worker for packaging
- `runtime/`: generated local build input, excluded from Git

## Third-party component

The bundled conversion runtime is based on Calibre, which is licensed under the GNU GPL. Calibre source and license information are available at:

- https://github.com/kovidgoyal/calibre
- https://calibre-ebook.com/about#license

Loki MD's original source code is licensed under [MIT](LICENSE). The bundled Calibre runtime remains subject to Calibre's GPL license; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution and source information.
