const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const dockerCommands = require('../docker-commands');

const execAsync = promisify(exec);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

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

// Dockerコマンドを実行するヘルパー関数
async function executeDockerCommand(command, cwd = process.cwd()) {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return { success: true, output: stdout.trim(), error: stderr };
  } catch (error) {
    return { success: false, output: '', error: error.message };
  }
}

// Dockerが利用可能かチェック
ipcMain.handle('check-docker', async () => {
  try {
    await execAsync('docker --version');
    // docker-composeもチェック
    await execAsync('docker-compose --version');
    return { available: true };
  } catch (error) {
    return { available: false, error: error.message };
  }
});

// コンテナの状態を確認
ipcMain.handle('check-status', async () => {
  // docker-compose psで状態を確認
  const result = await executeDockerCommand(
    dockerCommands.commands.status()
  );
  
  // 実行中かどうかを確認
  const isRunning = result.success && result.output.includes('Up');
  const exists = result.success && result.output.length > 0;
  
  return { isRunning, exists };
});

// コンテナを起動
ipcMain.handle('start-container', async () => {
  const result = await executeDockerCommand(
    dockerCommands.commands.start()
  );
  return result;
});

// コンテナを停止
ipcMain.handle('stop-container', async () => {
  const result = await executeDockerCommand(
    dockerCommands.commands.stop()
  );
  return result;
});

// n8nを開く
ipcMain.handle('open-n8n', async () => {
  const { port } = dockerCommands;
  const url = dockerCommands.getUrl(port);
  const { shell } = require('electron');
  await shell.openExternal(url);
  return { success: true, url };
});

