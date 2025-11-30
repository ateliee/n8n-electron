# n8n Docker Manager

Electronアプリケーションでn8nをDocker Composeで起動・管理するためのMac/Windowsアプリです。

## 機能

- Docker Composeコンテナの起動・停止
- n8nの状態確認
- n8nをブラウザで開く
- Docker Composeコマンドのカスタマイズ可能

## 前提条件

- Docker Desktop（Mac/Windowsで別途インストールが必要）
- docker-compose（Docker Desktopに含まれています）
- Make（オプション、Makefileを使用する場合）

## セットアップ

このプロジェクトでは、すべてのnpmコマンドをDocker環境内で実行します。

### Makefileを使用する方法（推奨）

```bash
# 利用可能なコマンドを確認
make help

# Electron開発環境を起動
make up

# 依存関係をインストール
make install

# Electronアプリを起動（Docker内、GUIは表示されません）
make start

# Electronアプリをビルド
make build

# Mac用にビルド
make build-mac

# Windows用にビルド
make build-win

# 全プラットフォーム用にビルド
make build-all

# Dockerコンテナのシェルにアクセス
make shell

# カスタムコマンドを実行（例: npm test）
make exec CMD='npm test'

# 開発環境を停止
make down

# node_modulesを削除
make clean
```

### Docker Composeを直接使用する方法

```bash
# Electron開発環境用のDocker Composeを起動
docker-compose -f docker-compose.dev.yml up -d

# コンテナ内で依存関係をインストール
docker-compose -f docker-compose.dev.yml exec electron-dev sh -c "cd /workspace/app && npm install"

# コンテナ内でビルド
docker-compose -f docker-compose.dev.yml exec electron-dev sh -c "cd /workspace/app && npm run build"

# コンテナ内でシェルにアクセス
docker-compose -f docker-compose.dev.yml exec electron-dev sh

# 開発環境を停止
docker-compose -f docker-compose.dev.yml down
```

**注意**: ElectronはGUIアプリケーションのため、Dockerコンテナ内で直接実行することはできません。Docker Composeは開発環境（依存関係のインストール、ビルドなど）に使用します。実際のアプリケーション実行は、ビルドされた成果物を使用してホストマシンで行います。

## ビルド

Makefileを使用してビルドします：

```bash
# 開発環境を起動（初回のみ）
make up

# 依存関係をインストール（初回のみ）
make install

# Mac用にビルド
make build-mac

# Windows用にビルド
make build-win

# 全プラットフォーム用にビルド
make build-all
```

## Docker Composeの構成

このプロジェクトでは、2つのDocker Composeファイルを使用しています：

1. **`app/docker-compose.yml`** - n8n用のDocker Compose設定
   - Electronアプリケーションから起動・管理されるn8nコンテナの設定
   - ポート: 5678

2. **`docker-compose.dev.yml`** - Electron開発環境用のDocker Compose設定
   - Electronアプリケーションの開発環境を構築するための設定
   - Node.js環境を提供し、依存関係のインストールやビルドに使用

## Docker Composeコマンドのカスタマイズ

`app/docker-commands.js`ファイルを編集することで、Docker Composeコマンドを変更できます。

`app/docker-compose.yml`ファイルを編集することで、n8nの設定（ポート、ボリュームなど）を変更できます。

`docker-compose.dev.yml`ファイルを編集することで、Electron開発環境の設定を変更できます。

## Makefileのカスタマイズ

`Makefile`を編集することで、コマンドを追加・変更できます。各ターゲットは`docker-compose`コマンドを実行して、Dockerコンテナ内でnpmコマンドを実行します。

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
├── docker-compose.dev.yml       # Electron開発環境用のDocker Compose設定
├── Makefile                      # 開発コマンドのショートカット
├── .dockerignore                # Docker用の除外ファイル
└── README.md
```

## GitHub Actions

mainブランチにプッシュすると、自動的にMac/Windows用のビルドが実行され、成果物がコミットされます。

## ライセンス

MIT

