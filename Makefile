.PHONY: help up down install start build build-mac build-win build-all shell exec clean

# Docker Composeファイルのパス
COMPOSE_FILE = docker-compose.dev.yml
SERVICE = app

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo "  make up          - Electron開発環境を起動"
	@echo "  make down        - Electron開発環境を停止"
	@echo "  make install     - 依存関係をインストール"
	@echo "  make start       - Electronアプリを起動（Docker内）"
	@echo "  make build       - Electronアプリをビルド"
	@echo "  make build-mac   - Mac用にビルド"
	@echo "  make build-win   - Windows用にビルド"
	@echo "  make build-all   - 全プラットフォーム用にビルド"
	@echo "  make shell       - Dockerコンテナのシェルにアクセス"
	@echo "  make exec CMD=   - カスタムコマンドを実行（例: make exec CMD='npm test')"
	@echo "  make clean       - node_modulesを削除"

# Docker Composeを起動
up:
	docker-compose -f $(COMPOSE_FILE) up -d

# Docker Composeを停止
down:
	docker-compose -f $(COMPOSE_FILE) down

# 依存関係をインストール
install:
	docker-compose -f $(COMPOSE_FILE) exec -T $(SERVICE) sh -c "npm install"

# Electronアプリを起動（Docker内、ヘッドレスモード）
start:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh -c "npm run start"

# Electronアプリをビルド
build:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh -c "npm run build"

# Mac用にビルド
build-mac:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh -c "npm run build:mac"

# Windows用にビルド
build-win:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh -c "npm run build:win"

# 全プラットフォーム用にビルド
build-all:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh -c "npm run build:all"

# Dockerコンテナのシェルにアクセス
shell:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh

# カスタムコマンドを実行
exec:
	@if [ -z "$(CMD)" ]; then \
		echo "エラー: CMDパラメータを指定してください。例: make exec CMD='npm test'"; \
		exit 1; \
	fi
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh -c "$(CMD)"

# node_modulesを削除
clean:
	rm -rf $(APP_DIR)/node_modules

