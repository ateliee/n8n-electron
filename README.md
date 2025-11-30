# n8n Docker Manager

Electronアプリケーションでn8nをDocker Composeで起動・管理するためのMac/Windowsアプリです。

## 機能

- Docker Composeコンテナの起動・停止
- n8nの状態確認
- n8nをブラウザで開く
- Docker Composeコマンドのカスタマイズ可能

## 前提条件

- Node.js 18以上
- npm（Node.jsに含まれています）
- Make（オプション、Makefileを使用する場合）
- Docker Desktop（Mac/Windowsで別途インストールが必要）
- docker compose（Docker Desktopに含まれています）

## セットアップ

### 方法1: Makefileを使用する方法（推奨）

```bash
# 利用可能なコマンドを確認
make help

# 依存関係をインストール
make install

# アプリケーションを起動
make start

# Mac用にビルド
make build-mac

# Windows用にビルド
make build-win

# 全プラットフォーム用にビルド
make build-all

# node_modulesを削除
make clean
```

### 方法2: 直接npmコマンドを使用する方法

```bash
# appディレクトリに移動
cd app

# 依存関係をインストール
npm install

# アプリケーションを起動
npm start

# Mac用にビルド
npm run build:mac

# Windows用にビルド
npm run build:win

# 全プラットフォーム用にビルド
npm run build:all
```

## Docker Composeの構成

このプロジェクトでは、n8n用のDocker Composeファイルを使用しています：

- **`app/docker-compose.yml`** - n8n用のDocker Compose設定
  - Electronアプリケーションから起動・管理されるn8nコンテナの設定
  - ポート: 5678

## Docker Composeコマンドのカスタマイズ

`app/docker-commands.js`ファイルを編集することで、Docker Composeコマンドを変更できます。

`app/docker-compose.yml`ファイルを編集することで、n8nの設定（ポート、ボリュームなど）を変更できます。

## プロジェクト構造

```
n8n-electron/
├── app/                          # Electronアプリケーション
│   ├── src/                     # ソースコード
│   │   ├── main.js              # メインプロセス
│   │   ├── renderer.js          # レンダラープロセス
│   │   ├── index.html           # UI
│   │   └── styles.css           # スタイル
│   ├── package.json             # Electronアプリの依存関係とスクリプト
│   ├── docker-commands.js       # Docker Composeコマンド定義
│   └── docker-compose.yml       # n8n用のDocker Compose設定
├── Makefile                     # 開発コマンドのショートカット
└── README.md
```

## GitHub Actions

mainブランチにプッシュすると、自動的にMac/Windows用のビルドが実行され、成果物がコミットされます。

## ライセンス

MIT
