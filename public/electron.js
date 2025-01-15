const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const dataFilePath = path.join(app.getPath('documents'),'diary','entries.json');

async function createWindow() {
  const isDev = (await import('electron-is-dev')).default;

  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers

ipcMain.handle('get-entries', async () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading entries:', error);
    return [];
  }
});

ipcMain.handle('save-entries', async (event, entries) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(entries), 'utf8');
  } catch (error) {
    console.error('Error saving entries:', error);
  }
});

ipcMain.handle('clear-entries', async () => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
  } catch (error) {
    console.error('Error clearing entries:', error);
  }
});