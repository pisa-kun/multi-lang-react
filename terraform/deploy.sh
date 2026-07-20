#!/bin/sh
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <aws-region> <ecr-repository-url>"
  exit 1
fi

REGION="$1"
REPO_URL="$2"
IMAGE_TAG=latest

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REPO_URL"

docker build -t "$REPO_URL:$IMAGE_TAG" ..

docker push "$REPO_URL:$IMAGE_TAG"
