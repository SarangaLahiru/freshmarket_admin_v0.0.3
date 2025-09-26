# Grocery Store Admin Dashboard - Makefile
.PHONY: help dev build start lint test clean docker-build docker-run

# Colors for output
GREEN := \033[0;32m
]
YELLOW := \033[1;33m
]
RED := \033[0;31m
]
NC := \033[0m # No Color
]

# Default target
help: ## Show this help message
	@echo "$(GREEN)Grocery Store Admin Dashboard$(NC)"
	@echo "$(YELLOW)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$\' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-12s$(NC) %s\n", $$1, $$2}'

# Development
dev: ## Start development server
	@echo "$(GREEN)Starting development server...$(NC)"
	npm run dev

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

# Build and Production
build: ## Build the application for production
	@echo "$(GREEN)Building application...$(NC)"
	npm run build

start: ## Start production server
	@echo "$(GREEN)Starting production server...$(NC)"
	npm run start

# Quality Assurance
lint: ## Run linter
	@echo "$(GREEN)Running linter...$(NC)"
	npm run lint

lint-fix: ## Fix linting issues
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	npm run lint -- --fix

type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running TypeScript type checking...$(NC)"
	npx tsc --noEmit

test: ## Run tests (placeholder for future implementation)
	@echo "$(YELLOW)Tests not implemented yet$(NC)"

# Docker
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t grocery-admin-dashboard .

docker-run: ## Run Docker container
	@echo "$(GREEN)Running Docker container...$(NC)"
	docker run -p 3000:3000 --name grocery-admin grocery-admin-dashboard

docker-stop: ## Stop Docker container
	@echo "$(YELLOW)Stopping Docker container...$(NC)"
	docker stop grocery-admin || true
	docker rm grocery-admin || true

docker-clean: ## Remove Docker image and container
	@echo "$(RED)Cleaning up Docker resources...$(NC)"
	docker stop grocery-admin || true
	docker rm grocery-admin || true
	docker rmi grocery-admin-dashboard || true

# Development utilities
clean: ## Clean build artifacts and node_modules
	@echo "$(RED)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf node_modules
	rm -rf dist
	rm -rf out

fresh-install: clean install ## Clean install dependencies
	@echo "$(GREEN)Fresh install completed$(NC)"

# Environment setup
setup: ## Initial project setup
	@echo "$(GREEN)Setting up project...$(NC)"
	npm install
	@echo "$(GREEN)Setup completed! Run 'make dev' to start development server$(NC)"

# Database utilities (for future backend integration)
db-generate: ## Generate database types (placeholder)
	@echo "$(YELLOW)Database type generation not implemented yet$(NC)"

db-migrate: ## Run database migrations (placeholder)
	@echo "$(YELLOW)Database migrations not implemented yet$(NC)"

# Deployment
deploy-build: build ## Build for deployment
	@echo "$(GREEN)Application built for deployment$(NC)"

# Monitoring and logs
logs: ## Show application logs (for Docker)
	@echo "$(GREEN)Showing application logs...$(NC)"
	docker logs -f grocery-admin || echo "$(RED)Container not running$(NC)"

# Security
audit: ## Run security audit
	@echo "$(GREEN)Running security audit...$(NC)"
	npm audit

audit-fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities...$(NC)"
	npm audit fix

# Code formatting
format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	npx prettier --write .

format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(NC)"
	npx prettier --check .

# Git utilities
git-hooks: ## Setup git hooks
	@echo "$(GREEN)Setting up git hooks...$(NC)"
	npx husky install

# Project info
info: ## Show project information
	@echo "$(GREEN)Project Information:$(NC)"
	@echo "  Name: Grocery Store Admin Dashboard"
	@echo "  Framework: Next.js 13+"
	@echo "  Language: TypeScript"
	@echo "  UI Library: shadcn/ui + Tailwind CSS"
	@echo "  State Management: React Hooks + Context"
	@echo "  Authentication: JWT"
	@echo "  Charts: Recharts"
	@echo ""
	@echo "$(YELLOW)Quick Start:$(NC)"
	@echo "  1. make install"
	@echo "  2. make dev"
	@echo "  3. Open http://localhost:3000"
	@echo ""
	@echo "$(YELLOW)Default Login:$(NC)"
	@echo "  Email: admin@freshmarket.com"
	@echo "  Password: admin123"

# All-in-one commands
all: clean install build ## Clean, install, and build
	@echo "$(GREEN)Complete build process finished$(NC)"

dev-setup: install git-hooks ## Setup development environment
	@echo "$(GREEN)Development environment setup completed$(NC)"