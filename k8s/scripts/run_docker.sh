#!/bin/bash

set -x  # show commands being ran
set -e  # error if anything fails
set -o pipefail # error on pipe fails too

current_version="latest"
image_name="dominionstats:${current_version}"

echo "Building the docker image"

# build the docker image
docker build -t "$image_name" ../../.

echo "Starting the app with kubernetes using local-deployment.yaml file for configuration"

kubectl delete -f ../specs/local-deployment.yaml || true

kubectl apply -f ../specs/local-deployment.yaml

echo "Please manually verify the app via GET localhost:30001"
