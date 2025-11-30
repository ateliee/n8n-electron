.PHONY: help install start build build-mac build-win build-all clean

# appディレクトリのパス
APP_DIR = app

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo "  make install     - 依存関係をインストール"
	@echo "  make start       - Electronアプリを起動"
	@echo "  make build       - Electronアプリをビルド"
	@echo "  make build-mac   - Mac用にビルド"
	@echo "  make build-win   - Windows用にビルド"
	@echo "  make build-all   - 全プラットフォーム用にビルド"
	@echo "  make clean       - node_modulesを削除"

# 依存関係をインストール
install:
	cd $(APP_DIR) && npm install

# Electronアプリを起動
start:
	cd $(APP_DIR) && npm start

# Electronアプリをビルド
build:
	cd $(APP_DIR) && npm run build

# Mac用にビルド
build-mac:
	cd $(APP_DIR) && npm run build:mac

# Windows用にビルド
build-win:
	cd $(APP_DIR) && npm run build:win

# 全プラットフォーム用にビルド
build-all:
	cd $(APP_DIR) && npm run build:all

# node_modulesを削除
clean:
	rm -rf $(APP_DIR)/node_modules

