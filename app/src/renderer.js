const { ipcRenderer } = require('electron');

const dockerStatusText = document.getElementById('docker-status-text');
const containerStatusText = document.getElementById('container-status-text');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const openBtn = document.getElementById('open-btn');
const messageDiv = document.getElementById('message');

let dockerAvailable = false;
let containerRunning = false;

// メッセージを表示
function showMessage(text, type = 'info') {
  messageDiv.textContent = text;
  messageDiv.className = `message message-${type}`;
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }, 3000);
}

// Dockerの状態を確認
async function checkDocker() {
  try {
    const result = await ipcRenderer.invoke('check-docker');
    dockerAvailable = result.available;
    
    if (dockerAvailable) {
      dockerStatusText.textContent = '利用可能';
      dockerStatusText.className = 'status-text status-ok';
    } else {
      dockerStatusText.textContent = '未インストール';
      dockerStatusText.className = 'status-text status-error';
      showMessage('Dockerとdocker-composeがインストールされていません。Dockerをインストールしてください。', 'error');
    }
    
    updateButtonStates();
    return dockerAvailable;
  } catch (error) {
    dockerStatusText.textContent = 'エラー';
    dockerStatusText.className = 'status-text status-error';
    showMessage('Dockerの確認中にエラーが発生しました: ' + error.message, 'error');
    return false;
  }
}

// コンテナの状態を確認
async function checkContainerStatus() {
  try {
    const result = await ipcRenderer.invoke('check-status');
    containerRunning = result.isRunning;
    
    if (result.exists) {
      if (containerRunning) {
        containerStatusText.textContent = '実行中';
        containerStatusText.className = 'status-text status-ok';
      } else {
        containerStatusText.textContent = '停止中';
        containerStatusText.className = 'status-text status-warning';
      }
    } else {
      containerStatusText.textContent = '未作成';
      containerStatusText.className = 'status-text status-info';
    }
    
    updateButtonStates();
  } catch (error) {
    containerStatusText.textContent = 'エラー';
    containerStatusText.className = 'status-text status-error';
    showMessage('コンテナ状態の確認中にエラーが発生しました: ' + error.message, 'error');
  }
}

// ボタンの状態を更新
function updateButtonStates() {
  if (!dockerAvailable) {
    startBtn.disabled = true;
    stopBtn.disabled = true;
    openBtn.disabled = true;
    return;
  }
  
  startBtn.disabled = containerRunning;
  stopBtn.disabled = !containerRunning;
  openBtn.disabled = !containerRunning;
}

// 起動ボタン
startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  showMessage('コンテナを起動しています...', 'info');
  
  try {
    const result = await ipcRenderer.invoke('start-container');
    if (result.success) {
      showMessage('コンテナを起動しました', 'success');
      await checkContainerStatus();
    } else {
      showMessage('起動に失敗しました: ' + result.error, 'error');
      startBtn.disabled = false;
    }
  } catch (error) {
    showMessage('エラーが発生しました: ' + error.message, 'error');
    startBtn.disabled = false;
  }
});

// 停止ボタン
stopBtn.addEventListener('click', async () => {
  stopBtn.disabled = true;
  showMessage('コンテナを停止しています...', 'info');
  
  try {
    const result = await ipcRenderer.invoke('stop-container');
    if (result.success) {
      showMessage('コンテナを停止しました', 'success');
      await checkContainerStatus();
    } else {
      showMessage('停止に失敗しました: ' + result.error, 'error');
      stopBtn.disabled = false;
    }
  } catch (error) {
    showMessage('エラーが発生しました: ' + error.message, 'error');
    stopBtn.disabled = false;
  }
});

// 開くボタン
openBtn.addEventListener('click', async () => {
  try {
    const result = await ipcRenderer.invoke('open-n8n');
    if (result.success) {
      showMessage('n8nを開きました', 'success');
    } else {
      showMessage('開くのに失敗しました', 'error');
    }
  } catch (error) {
    showMessage('エラーが発生しました: ' + error.message, 'error');
  }
});

// 初期化
async function init() {
  const dockerOk = await checkDocker();
  if (dockerOk) {
    await checkContainerStatus();
    // 定期的に状態を更新
    setInterval(checkContainerStatus, 5000);
  }
}

init();

