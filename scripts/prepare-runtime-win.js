const fs = require('fs');
const path = require('path');
const https = require('https');

const version = '9.13.0';
const url = `https://github.com/kovidgoyal/calibre/releases/download/v${version}/calibre-64bit-${version}.msi`;
const projectRoot = path.resolve(__dirname, '..');
const destination = path.join(projectRoot, 'runtime', 'windows', `calibre-64bit-${version}.msi`);

function download(sourceUrl, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(sourceUrl, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        download(response.headers.location, outputPath).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Calibre download failed with HTTP ${response.statusCode}`));
        return;
      }

      const output = fs.createWriteStream(outputPath);
      response.pipe(output);
      output.on('finish', () => output.close(resolve));
      output.on('error', reject);
      response.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination) && fs.statSync(destination).size > 10 * 1024 * 1024) {
    console.log(`Calibre Windows installer already prepared: ${destination}`);
    return;
  }

  console.log(`Downloading Calibre ${version} Windows installer...`);
  await download(url, destination);
  console.log(`Prepared Calibre Windows installer: ${destination}`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
