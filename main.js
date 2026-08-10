const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 640,
    minWidth: 480,
    minHeight: 520,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

// --- Calibre detection ---

function findCalibreWorker() {
  if (process.platform === 'darwin') {
    const workerParts = [
      'CalibreWorker.app', 'Contents', 'ebook-viewer.app', 'Contents',
      'ebook-edit.app', 'Contents', 'headless.app', 'Contents', 'MacOS',
      'calibre-parallel-placeholder-for-codesigning',
    ];
    const bundledRoot = app.isPackaged ? process.resourcesPath : path.join(__dirname, 'runtime');
    const bundledWorker = path.join(bundledRoot, ...workerParts);
    if (fs.existsSync(bundledWorker)) return bundledWorker;

    const installedWorker = path.join(
      '/Applications/calibre.app/Contents/ebook-viewer.app/Contents/ebook-edit.app/Contents/headless.app/Contents/MacOS',
      'calibre-parallel-placeholder-for-codesigning'
    );
    if (fs.existsSync(installedWorker)) return installedWorker;
  }
  return findEbookConvert();
}

function findEbookConvert() {
  const bins = [];

  if (process.platform === 'darwin') {
    bins.push(path.join(os.homedir(), 'bin/calibre-wrapper/MacOS/ebook-convert'));
    bins.push(path.join(os.homedir(), 'bin/ebook-convert-run'));
    bins.push(path.join(os.homedir(), 'bin/ebook-convert'));
    bins.push('/opt/homebrew/bin/ebook-convert');
    bins.push('/usr/local/bin/ebook-convert');
    bins.push('/Applications/calibre.app/Contents/MacOS/ebook-convert');
  } else if (process.platform === 'win32') {
    bins.push('C:\\Program Files\\Calibre2\\ebook-convert.exe');
    bins.push(path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'calibre', 'ebook-convert.exe'));
  } else {
    bins.push('/usr/bin/ebook-convert');
  }

  for (const bin of bins) {
    if (fs.existsSync(bin)) return bin;
  }

  // Try PATH
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    return execSync(`${which} ebook-convert`, { encoding: 'utf-8' }).trim().split('\n')[0];
  } catch {
    return null;
  }
}

// --- Conversion ---

function getTargetFormats(sourceExt) {
  const ext = sourceExt.toLowerCase();
  const all = ['epub', 'mobi', 'pdf', 'azw3', 'docx', 'htmlz', 'txt', 'rtf', 'fb2', 'lit', 'lrf', 'pdb', 'snb', 'tcr'];
  return all.filter(f => f !== ext);
}

function convertFile(sourcePath, targetFormat, outputDir, mainWindow) {
  return new Promise((resolve, reject) => {
    const parsed = path.parse(sourcePath);
    const outDir = outputDir || parsed.dir;
    const outputPath = path.join(outDir, `${parsed.name}.${targetFormat}`);
    const worker = findCalibreWorker();

    if (!worker) return reject(new Error('未找到 Calibre 转换引擎'));

    const pythonCode = [
      'import sys',
      `sys.argv = ${JSON.stringify(['ebook-convert', sourcePath, outputPath])}`,
      'from calibre.ebooks.conversion.cli import main',
      'main()',
    ].join('; ');
    const args = process.platform === 'darwin'
      ? ['--pipe-worker', pythonCode]
      : [sourcePath, outputPath];
    const proc = spawn(worker, args);

    let stderr = '';
    const onOutput = (data) => {
      stderr += data.toString();
      const match = stderr.match(/(\d+)%/g);
      if (match && mainWindow) {
        const pct = parseInt(match[match.length - 1]);
        mainWindow.webContents.send('convert-progress', pct);
      }
    };
    proc.stderr.on('data', onOutput);
    proc.stdout.on('data', onOutput);

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ outputPath, format: targetFormat });
      } else {
        reject(new Error(stderr.slice(-500) || `ebook-convert exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

// --- Batch conversion ---
async function batchConvert(files, targetFormat, outputDir, mainWindow) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    mainWindow.webContents.send('batch-progress', {
      current: i + 1,
      total: files.length,
      file: path.basename(files[i]),
    });
    let item;
    try {
      const result = await convertFile(files[i], targetFormat, outputDir, mainWindow);
      item = { ...result, status: 'ok' };
    } catch (err) {
      item = { file: files[i], status: 'error', error: err.message };
    }
    results.push(item);
    mainWindow.webContents.send('batch-result', { ...item, current: i + 1, total: files.length });
  }
  return results;
}

// --- IPC handlers ---

ipcMain.handle('detect-calibre', () => {
  const bin = findCalibreWorker();
  return { found: !!bin, path: bin };
});

ipcMain.handle('get-formats', (_event, sourcePath) => {
  const ext = path.extname(sourcePath).replace('.', '').toLowerCase();
  return getTargetFormats(ext);
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '电子书文件', extensions: ['epub', 'mobi', 'pdf', 'azw3', 'docx', 'htmlz', 'txt', 'rtf', 'fb2', 'lit', 'lrf', 'pdb', 'snb', 'tcr', 'html'] },
    ],
  });
  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle('select-output-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('convert-single', async (_event, { sourcePath, targetFormat, outputDir }) => {
  try {
    return await convertFile(sourcePath, targetFormat, outputDir, mainWindow);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('convert-batch', async (_event, { files, targetFormat, outputDir }) => {
  try {
    return await batchConvert(files, targetFormat, outputDir, mainWindow);
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('reveal-in-finder', async (_event, filePath) => {
  shell.showItemInFolder(filePath);
});

// --- Install Calibre ---

ipcMain.handle('install-calibre', async () => {
  if (process.platform === 'darwin') {
    try {
      execSync('which brew', { encoding: 'utf-8' });
      const proc = spawn('brew', ['install', '--cask', 'calibre'], { stdio: 'pipe' });
      return new Promise((resolve) => {
        proc.on('close', (code) => {
          resolve({ success: code === 0 });
        });
        proc.on('error', () => resolve({ success: false }));
      });
    } catch {
      shell.openExternal('https://calibre-ebook.com/download_osx');
      return { success: false, fallback: true };
    }
  } else {
    shell.openExternal('https://calibre-ebook.com/download_windows');
    return { success: false, fallback: true };
  }
});

// --- App lifecycle ---

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
