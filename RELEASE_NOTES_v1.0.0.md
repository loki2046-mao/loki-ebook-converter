# Loki电子书转换器 v1.0.0

Loki电子书转换器 is a clean macOS front end for Calibre's ebook conversion engine.

## Features

- Convert EPUB, MOBI, PDF, AZW3, DOCX and TXT formats
- Convert multiple files in one batch
- Show total progress and current-file progress
- Choose a custom output folder
- Use Calibre's conversion engine without launching its legacy GUI
- Run on both Apple Silicon and Intel Macs with one universal DMG

## Install

1. Download `Loki-Ebook-Converter-1.0.0-universal.dmg` below.
2. Open the DMG and drag `Loki电子书转换器.app` to `Applications`.
3. Launch Loki电子书转换器 from Applications.

This release is unsigned. If macOS blocks the first launch, right-click `Loki电子书转换器.app` in Finder, choose `Open`, and then confirm `Open`. This is normally enough and is a one-time approval. If that route does not work, open `System Settings > Privacy & Security`, find the security message for `Loki电子书转换器`, click `Open Anyway`, authenticate if prompted, and launch the app again. Do not disable Gatekeeper globally.

## Included Component

The DMG bundles the Calibre conversion runtime. Calibre is GPL-licensed; see `THIRD_PARTY_NOTICES.md` in the repository for its source and license information.
