# Loki电子书转换器

A small macOS desktop app for converting ebook formats with Calibre's conversion engine.

## For users

Do not download the repository ZIP for normal use. Download the latest `.dmg` from the GitHub Releases page.

1. Open the DMG.
2. Drag `Loki电子书转换器` to `Applications`.
3. Double-click `Loki电子书转换器.app` from Applications.
4. Add one or more ebook files, choose the output format and output folder, then start the conversion.

The release DMG contains the Calibre conversion runtime. Users do not need to install Node.js, npm, Electron or Calibre separately. The current release is a universal build for both Apple Silicon and Intel Macs.

This project currently publishes unsigned builds because it does not use an Apple Developer signing identity. macOS may block the first launch, but you only need to approve this app once:

1. If double-clicking shows an unidentified-developer warning, close the warning. In Finder, right-click `Loki电子书转换器.app`, choose `Open`, then click `Open` in the confirmation dialog. This is normally enough; you do not need to change System Settings as well.
2. If the right-click `Open` route is unavailable or macOS still blocks the app, open `System Settings > Privacy & Security`. Scroll to the `Security` section, find the message saying that `Loki电子书转换器` was blocked, click `Open Anyway`, authenticate if prompted, and then launch the app again from Applications.

This approval is for this app only. Do not disable Gatekeeper globally and do not run terminal commands to weaken macOS security.

A public release should eventually be signed and notarized with an Apple Developer account so that users can open it without this one-time approval.

## Install With an Agent

Give an Agent this instruction:

```text
Open the latest release of loki2046-mao/loki-ebook-converter on GitHub. Download the universal DMG, mount it, copy Loki电子书转换器.app to /Applications, and launch it. If macOS blocks the first launch, right-click the app and choose Open, then confirm Open. If that does not work, use System Settings > Privacy & Security > Open Anyway for this app only.
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

Loki电子书转换器's original source code is licensed under [MIT](LICENSE). The bundled Calibre runtime remains subject to Calibre's GPL license; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution and source information.
