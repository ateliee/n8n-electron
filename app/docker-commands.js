/**
 * Docker Composeコマンド定義ファイル
 * このファイルを編集することで、Docker Composeコマンドを変更できます
 */

const path = require('path');

module.exports = {
  // docker-compose.ymlのパス（appディレクトリ）
  composeFile: path.join(__dirname, 'docker-compose.yml'),

  // n8nポート
  port: '5678',

  // Docker Composeコマンド定義
  commands: {
    // コンテナを起動するコマンド
    dockerVersion: () => 
      `docker --version`,

    // docker composeもチェック
    dockerComposeVersion: () => 
      `docker compose --version`,

    // コンテナを起動するコマンド
    start: () => {
      const composeFile = path.join(__dirname, 'docker-compose.yml');
      return `docker compose -f "${composeFile}" up -d`;
    },

    // コンテナを停止するコマンド
    stop: () => {
      const composeFile = path.join(__dirname, 'docker-compose.yml');
      return `docker compose -f "${composeFile}" down`;
    },

    // コンテナの状態を確認するコマンド
    status: () => {
      const composeFile = path.join(__dirname, 'docker-compose.yml');
      return `docker compose -f "${composeFile}" ps`;
    }
  },

  // n8nのURL
  getUrl: (port) => `http://localhost:${port}`
};

