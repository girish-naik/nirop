# nirop - Marathi for message
A basic chat app built on nodejs. Work in progress right now.

## Features
As of 05/12/2020 the following features are available.
- Login through Auth0
- List contacts
- Start a conversation
- Send text with file upload
- Delete messages

Key missing features
- Notification
- Text search

## Tech Stack
* Language - written in Typescript which compiles to JavaScript(ES6)
* Platform - NodeJS
* Database - Amazon Dynamodb
* Container - Docker
* Container Orchestration - Kubernetes with kubeone
* Cloud Provider - AWS
* Provisioning - Terraform
* FrontEnd Framework - ReactJS
* Build - Yarn
* CI/CD - TravisCI

## About the codebase
The codebase is a mono-repo divided by functionality into the below products.

* _bill_ - User and contact management backend micro-service.
* _keel_ - Conversation/Chat management backend micro-service.
* _mantle_ - Messaging functionality backend micro-service.
* _sing_ - Reverseproxy mirco-service for backend micro-services.
* _crown_ - Frontend/UI micro-service.
* _tummy_ - core utilities library.
* _hatch_ - project build utilties.
* _nest_ - project deploy utilities.

## Setup Instructions
There are multiple configurations in which the project can be setup. The following steps will guide through common mandatory setup independent of specific configuration.

#### Environment variables

AWS_BUCKET=<s3 bucket name for storing attachments>
AWS_CREDENTIALS=<base64 encoded aws iam credentials file 
AWS_PROFILE=<aws profile to use>
AWS_REGION=<aws region to use>
CONVERSATION_TABLE_CID_IDX=<index1 name for conversation table>
CONVERSATION_TABLE_NAME=<table name for conversation table>  
CONVERSATION_TABLE_UDATE_IDX=<index2 name for conversation table>  
FRONTEND_URL=http://localhost:3000
JWKS_URL=<jwks url from auth0 website>
MESSAGE_TABLE_NAME=<message table name>  
MESSAGE_TABLE_UDATE_IDX=<mesage table index1 name>
NIROPSRC=<location of project src>
USER_TABLE_INDEX=<user table index1 name>  
USER_TABLE_NAME=<user table name>

#### Development environment setup
The following development software need to be setup - 

NodeJS (^12) - https://nodejs.org/en/download/
Yarn (^1.22.x) - https://classic.yarnpkg.com/en/docs/install/#mac-stable
AWS CLI (^2) - https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html. An AWS account is needed and an IAM user must be configured locally.
Docker (^2.2.x.x) - https://docs.docker.com/get-docker/. An account needs to be created on dockerhub.com
Bit - https://docs.bit.dev/docs/installation. An account needs to be created on bit.dev
Auth0 - An account needs to be created and an application needs to be configured for use. 

### Local development of independent services
This is the simplest configuration to run each service in dev mode.
1. Change below lines crown/src/config/config.ts. Do not commit this. This is only for local setup for other configuration the file should be left as is.
```javascript
export const billApiBase = "http://localhost:8080";
export const keelApiBase = "http://localhost:8080";
export const mantleApiBase = "http://localhost:8080";
```
to
```javascript
export const billApiBase = "http://localhost:8080";
export const keelApiBase = "http://localhost:8081";
export const mantleApiBase = "http://localhost:8082";
```
2. Download dynamodb-local docker image. This is a one time step. We are using this as our database for local development.
```bash
docker pull amazon/dynamodb-local
```
3. Execute each of the following code blocks in separate terminals starting at project root.

- dynamodb-local
```bash
docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

- bill
```bash
cd bill && yarn && yarn dev
```

- keel
```bash
cd keel && yarn && yarn dev
```

- mantle
```bash
cd mantle && yarn && yarn dev
```

- crown
```bash
cd crown && yarn && yarn start
```
With the last step, http://localhost:3000 will be opened in your default browser. \

### Docker containers with dynamodb-local

This needs dynamodb local. Pull the docker image using below command if not done already.

```bash
docker pull amazon/dynamodb-local
```

1. Install docker-compose. https://docs.docker.com/compose/install/

2. To build images we have automated the process using a bash script.
```bash
hatch/bin/build.sh
```

3. To run the images as containers.
```bash
docker-compose -f nest/docker/docker-compose.yaml up
```

Once all steps are done http://localhost:3000 should serve the app.

### Container orchrestation using Kubernetes
This configuration can be done in 2 different ways. Both however need dynamodb configured. Follow below common steps.

1. Install terraform > https://learn.hashicorp.com/terraform/getting-started/install.html

2. Execute the below script to create tables. Precise configuration can be done by creating `terraform.tfvars` and override terraform variable values.
```bash
cd nest/dynamodb && terraform apply
```

#### Kubebernetes cluster on docker desktop.
1. Enabled kubernetes on docker desktop.
Docker desktop app > Preferences(Settings on windows) > Kubernetes > Check "Enable Kubernetes"

Verify running the below command on terminal
`kubectl cluster-info`

2. The process to startup is automated. 
```bash
nest/k8s/kube_deploy.sh
```
3. Run below command to setup port-forwarding.
```bash
nest/k8s/port-forward.sh
```
To stop/undeploy

4. To stop port-forwarding.
```bash
nest/k8s/port-forward-kill.sh
```
5. To delete k8s deployments.
```bash
nest/k8s/kube_undeploy.sh
```

#### Kubernetes cluster on AWS - This needs money
We are using terraform to provision AWS resources and kubeone to install kubernetes cluster on AWS.

1. Install kubeone and setup credentials - https://github.com/kubermatic/kubeone

2. Provision the hardware and setup kubernetes cluster using kubeone - https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md
Alternatively, the terraform config from `nest/ec2/` can be used and overrides can be put in `nest/ec2/terraform.tfvars` and `nest/kubeone/config.yaml` can be used to install k8s.

3. To deploy on the AWS k8s cluster the below variable needs to be set.
```bash
export KUBECONFIG=nest/kubeone/<cluster_name>-kubeconfig
```

4. The process to startup is automated. 
```bash
nest/k8s/kube_deploy.sh
```
5. Run below command to setup port-forwarding.
```bash
nest/k8s/port-forward.sh
```
To stop/undeploy

6. To stop port-forwarding.
```bash
nest/k8s/port-forward-kill.sh
```
7. To delete k8s deployments.
```bash
nest/k8s/kube_undeploy.sh
```

#### Building and Deploying through Travis CI

Set up the following environment variables in TRAVIS CI.

AWS_BUCKET=<s3 bucket name for storing attachments>
AWS_CREDENTIALS=<base64 encoded aws iam credentials file 
AWS_PROFILE=<aws profile to use>
AWS_REGION=<aws region to use>
BIT_TOKEN=<login token for bit.dev>
CONVERSATION_TABLE_CID_IDX=<index1 name for conversation table>
CONVERSATION_TABLE_NAME=<table name for conversation table>  
CONVERSATION_TABLE_UDATE_IDX=<index2 name for conversation table>  
DOCKER_PASSWORD=<docker hub password>  
DOCKER_USERNAME=<docker hub username>  
FRONTEND_URL=http://localhost:3000
JWKS_URL_ENC=<base64 encoded jwks url from auth0 website>
KUBE_CONFIG=<base64 encoded kubeconfig file generated in previous step - nest/kubeone/<cluster_name>-kubeconfig>
MESSAGE_TABLE_NAME=<message table name>  
MESSAGE_TABLE_UDATE_IDX=<mesage table index1 name>
NIROPSRC=.
USER_TABLE_INDEX=<user table index1 name>  
USER_TABLE_NAME=<user table name>
  
### Docker images

https://hub.docker.com/repository/docker/girishnaik/nirop-bill
https://hub.docker.com/repository/docker/girishnaik/nirop-keel
https://hub.docker.com/repository/docker/girishnaik/nirop-mantle
https://hub.docker.com/repository/docker/girishnaik/nirop-sing
https://hub.docker.com/repository/docker/girishnaik/nirop-crown
