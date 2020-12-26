ZONE=${GCE_INSTANCE_ZONE}
LOCAL_TAG=${GCE_INSTANCE}-image:$(GITHUB_SHA)
REMOTE_TAG=gcr.io/${PROJECT_ID}/$(LOCAL_TAG)
LOCAL_TAG_SCRAPPER=${GCE_INSTANCE}scrapper-image:$(GITHUB_SHA)
REMOTE_TAG_SCRAPPER=gcr.io/${PROJECT_ID}/$(LOCAL_TAG_SCRAPPER)
CONTAINER_NAME=app-container
SCRAPPER_CONTAINER_NAME=scrapper-container
NETWORK_NAME=my-net
SCRAPPER_PORT=4557

ssh-cmd:
	@gcloud --quiet compute ssh \
		--zone $(ZONE) ${GCE_INSTANCE} --command "$(CMD)"


build-scrapper:
	docker build -f "./Dockerfile.scrapper" -t $(LOCAL_TAG_SCRAPPER) .

push-scrapper:
	docker tag $(LOCAL_TAG_SCRAPPER) $(REMOTE_TAG_SCRAPPER)
	docker push $(REMOTE_TAG_SCRAPPER)

publish-scrapper:
	$(MAKE) build-scrapper
	$(MAKE) push-scrapper

build:
	docker build -t $(LOCAL_TAG) .

push:
	docker tag $(LOCAL_TAG) $(REMOTE_TAG)
	docker push $(REMOTE_TAG)

create:
	@gcloud compute instances create ${GCE_INSTANCE} \
		--image-project cos-cloud \
		--image cos-stable-85-13310-1041-28 \
		--zone $(ZONE) \
		--service-account ${SERVICE_ACCOUNT} \
		--tags http-server \
		--machine-type e2-medium

create-firewall-rule:
	@gcloud compute firewall-rules create default-allow-http-${SERVER_PORT} \
		--allow tcp:${SERVER_PORT} \
		--source-ranges 0.0.0.0/0 \
		--target-tags http-server \
		--description "Allow port ${SERVER_PORT} access to http-server"

remove-env:
	$(MAKE) ssh-cmd CMD='rm .env'

remove-images:
	@$(MAKE) ssh-cmd CMD='docker image prune -a -f'


start-app:
	@$(MAKE) ssh-cmd CMD='\
		docker run -d --name=$(CONTAINER_NAME) \
			--restart=unless-stopped \
			--network=$(NETWORK_NAME) \
			-e DB_HOST=${DB_HOST} \
			-e DB_NAME=${DB_NAME} \
			-e DB_USER=${DB_USER} \
			-e DB_PASS=${DB_PASS} \
			-e SERVER_PORT=${SERVER_PORT} \
			--env-file=.env \
			-p ${SERVER_PORT}:${SERVER_PORT} \
			$(REMOTE_TAG) \
			'

start-scrapper:
	@$(MAKE) ssh-cmd CMD='\
		docker run -d --name=$(SCRAPPER_CONTAINER_NAME) \
			--restart=unless-stopped \
			--network=$(NETWORK_NAME) \
			-p ${SCRAPPER_PORT}:${SCRAPPER_PORT} \
			$(REMOTE_TAG_SCRAPPER) \
			'

network-init:
	$(MAKE) ssh-cmd CMD='docker network create $(NETWORK_NAME)'

initialize:
	@echo "configuring vm to use docker commands"
	$(MAKE) ssh-cmd CMD='docker-credential-gcr configure-docker'
	@echo "creating network..."
	$(MAKE) network-init

deploy: 
	@echo "pulling app image..."
	$(MAKE) ssh-cmd CMD='docker pull $(REMOTE_TAG)'
	@echo "pulling scrapper image..."
	$(MAKE) ssh-cmd CMD='docker pull $(REMOTE_TAG_SCRAPPER)'
	@echo "stopping old container..."
	-$(MAKE) ssh-cmd CMD='docker container stop $(SCRAPPER_CONTAINER_NAME)'
	@echo "removing old container..."
	-$(MAKE) ssh-cmd CMD='docker container rm $(SCRAPPER_CONTAINER_NAME)'
	@echo "starting new scrapper container"
	$(MAKE) start-scrapper
	@echo "stopping old container..."
	-$(MAKE) ssh-cmd CMD='docker container stop $(CONTAINER_NAME)'
	@echo "removing old container..."
	-$(MAKE) ssh-cmd CMD='docker container rm $(CONTAINER_NAME)'
	@echo "starting new container..."
	@$(MAKE) start-app
	@echo "Good Job Deploy Succeded !"
	$(MAKE) remove-images
	@echo "Good Job Deploy Succeded !"