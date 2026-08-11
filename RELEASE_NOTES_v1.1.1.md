# Loki电子书转换器 v1.1.1

## Bug fix

- Fixed Windows drag-and-drop file importing.
- Uses Electron's official file path API so dropped files are correctly added to the conversion queue on Windows.
- Fixed Windows path separators in file names and conversion results.

## Download

Download `Loki.Setup.1.1.1.exe` and run the installer. The installer includes the official Calibre Windows MSI prerequisite and hides the conversion console window.

The Windows installer is currently unsigned, so Windows SmartScreen may require an explicit confirmation. macOS users should continue using the universal DMG from the `v1.0.0` release.
