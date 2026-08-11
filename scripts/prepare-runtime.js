const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const source = '/Applications/calibre.app';
const destination = path.join(projectRoot, 'runtime', 'CalibreWorker.app');
const worker = path.join(
  destination,
  'Contents', 'ebook-viewer.app', 'Contents', 'ebook-edit.app', 'Contents',
  'headless.app', 'Contents', 'MacOS',
  'calibre-parallel-placeholder-for-codesigning'
);

if (process.platform !== 'darwin') {
  console.log('Calibre runtime preparation is only needed on macOS.');
  process.exit(0);
}

if (fs.existsSync(worker)) {
  console.log(`Calibre worker already prepared: ${destination}`);
  process.exit(0);
}

if (!fs.existsSync(source)) {
  console.error('Calibre.app was not found at /Applications/calibre.app.');
  console.error('Install Calibre first, then run npm run prepare:mac again.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, {
  recursive: true,
  // Preserve Calibre's relative links. Resolving them creates machine-specific
  // /Applications paths and prevents reliable universal-app packaging.
  verbatimSymlinks: true,
  filter: (current) => current !== path.join(source, 'Contents', 'Info.plist'),
});

const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>ebook-convert</string>
<key>CFBundleIdentifier</key><string>com.loki.ebook-converter.worker</string>
<key>CFBundleName</key><string>EbookConverterWorker</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>LSBackgroundOnly</key><true/>
</dict></plist>
`;
fs.writeFileSync(path.join(destination, 'Contents', 'Info.plist'), infoPlist);

const result = spawnSync('codesign', ['--force', '--deep', '--sign', '-', destination], { stdio: 'inherit' });
if (result.status !== 0) {
  console.error('Failed to ad-hoc sign the prepared Calibre worker.');
  process.exit(result.status || 1);
}

console.log(`Prepared and signed Calibre worker: ${destination}`);
