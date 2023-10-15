.PHONY: build
build:
	@echo "Building..."
	@npm run build

.PHONY: image
image:
	@docker buildx build --platform linux/amd64 -t registry.i.siriusfrk.ru/swiss-knife-frontend:latest -f deploy/Dockerfile .

.PHONY: push
push:
	@docker push registry.i.siriusfrk.ru/swiss-knife-frontend:latest

.PHONY: deploy
deploy:
	cd deploy && terraform init -backend-config=backend-config.tfvars
	cd deploy && terraform apply -var-file=backend-config.tfvars  -auto-approve

.PHONY: all
all: build image push deploy
