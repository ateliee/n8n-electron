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
    start: () => 
      `docker-compose -f ${path.join(__dirname, 'docker-compose.yml')} up -d`,

    // コンテナを停止するコマンド
    stop: () => 
      `docker-compose -f ${path.join(__dirname, 'docker-compose.yml')} down`,

    // コンテナの状態を確認するコマンド
    status: () => 
      `docker-compose -f ${path.join(__dirname, 'docker-compose.yml')} ps`
  },

  // n8nのURL
  getUrl: (port) => `http://localhost:${port}`
};

