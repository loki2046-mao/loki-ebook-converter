const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  detectCalibre: () => ipcRenderer.invoke('detect-calibre'),
  getFormats: (path) => ipcRenderer.invoke('get-formats', path),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectOutputDir: () => ipcRenderer.invoke('select-output-dir'),
  convertSingle: (opts) => ipcRenderer.invoke('convert-single', opts),
  convertBatch: (opts) => ipcRenderer.invoke('convert-batch', opts),
  revealInFinder: (path) => ipcRenderer.invoke('reveal-in-finder', path),
  installCalibre: () => ipcRenderer.invoke('install-calibre'),
  onProgress: (cb) => ipcRenderer.on('convert-progress', (_e, pct) => cb(pct)),
  onBatchProgress: (cb) => ipcRenderer.on('batch-progress', (_e, data) => cb(data)),
  onBatchResult: (cb) => ipcRenderer.on('batch-result', (_e, data) => cb(data)),
});
