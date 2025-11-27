# GitHub Actions FAQ

### Common github actions
This document provides answers to common questions about GitHub Actions, including how they work, how to configure workflows, and how to deploy Docker applications to Azure AKS.

### Our internal implementation technologies

Currentlly, we are supporting only the following code languages and build tools:
java / maven
nodejs / npm
Python / build (PyPA)

### Unsupported technologies (and will not be supported in the future)
Ansible is not supported and not approved for github actions.
Ansible should be migrage to Helm
ant is not supported and not approved for github actions.
ant should be migrated to maven
pnpm is not supported and not approved for github actions.
pnpm should be migrated to npm



## FAQ

1. What are GitHub Actions?

GitHub Actions is CI/CD (Continuous Integration and Continuous Deployment) service built directly into GitHub. It lets you automate workflows such as building, testing, and deploying your code whenever certain events occur (push, pull request, schedule, manual trigger, etc.).

How can I lean more about Github action, and understand better the concepts of github actions?
Use this free for AT&T training in Linkedin learning: https://www.linkedin.com/learning/learning-github-actions-event-driven-automation-for-your-codebase
 

2. What is a Workflow?

A workflow is a YAML file located in .github/workflows/ in your repository. It defines:
	•	Triggers (events such as push, PR, schedule)
	•	Jobs (a set of steps that run on a runner)
	•	Steps (commands or pre-made actions)


3. What is a Runner?

A runner is a server that executes your workflow jobs. Types:
	•	GitHub-hosted runners (Ubuntu, Windows, macOS)
	•	Self-hosted runners (you manage the hardware)


4. What are Actions?

Actions are prebuilt reusable tasks you can include in your workflows, such as:
	•	Checking out code
	•	Logging into Azure
	•	Building Docker images
	•	Deploying to cloud providers


Configuration Examples

### Example 1: Simple CI Workflow (Node.js)

name: Node CI

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test


### Example 2: Build and Push Docker Image to GitHub Container Registry (GHCR)

name: Docker Build and Push

on:
  push:
    branches: [ main ]

jobs:
  docker-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}/myapp:latest

### Deploying Docker to Azure AKS (Azure Kubernetes Service)

Below is a complete example showing:
	•	Build Docker image
	•	Push to Azure Container Registry (ACR)
	•	Deploy to AKS

Prerequisites

You must define the following GitHub Secrets:
	•	AZURE_CREDENTIALS (from Azure Service Principal)
	•	REGISTRY_LOGIN_SERVER
	•	REGISTRY_USERNAME
	•	REGISTRY_PASSWORD
	•	AKS_RESOURCE_GROUP
	•	AKS_CLUSTER_NAME

### FAQ Cont

5. How do I store secrets in GitHub Actions?

Go to:
Repo → Settings → Secrets and Variables → Actions → New Secret

Store passwords, tokens, and API keys securely.


6. How do I manually trigger a workflow?

on:
  workflow_dispatch:

Then you can run the workflow from the GitHub UI.
