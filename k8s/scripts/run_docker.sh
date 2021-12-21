#!/bin/bash

set -x  # show commands being ran
set -e  # error if anything fails
set -o pipefail # error on pipe fails too

# ensure this doesn't accidentally run in prod
kubectl config use-context docker-desktop

current_version="latest"
image_name="dominionstats:${current_version}"

echo "Building the docker image"

# build the docker image
docker build -t "$image_name" ../../.

echo "Starting the app with kubernetes using local-deployment.yml file for configuration"

# Cleanup
kubectl delete -f ../specs/local-deployment.yml || true
kubectl delete cm hostname-config --namespace dominion || true
kubectl delete cm oauthapp --namespace dominion || true
kubectl delete -f ../specs/postgres.yml || true
kubectl delete cm postgres-config --namespace dominion || true
kubectl delete -f ../specs/namespace.yml || true

# Create infra from scratch
kubectl create -f ../specs/namespace.yml
kubectl create configmap postgres-config --namespace dominion --from-literal=postgres_db=dominion --from-literal=postgres_user=admin --from-literal=postgres_password=$(head -c 32 /dev/random | base64)
kubectl create -f ../specs/postgres.yml
kubectl wait --for=condition=ready pod -n dominion -l app=postgres

./refresh_docker.sh
