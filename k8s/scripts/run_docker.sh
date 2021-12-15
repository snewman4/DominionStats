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
kubectl delete -f ../specs/postgres.yml || true
kubectl delete cm postgres-config --namespace dominion || true
kubectl delete -f ../specs/namespace.yml || true

# Create infra from scratch
kubectl create -f ../specs/namespace.yml
kubectl create configmap postgres-config --namespace dominion --from-literal=postgres_db=dominion --from-literal=postgres_user=admin --from-literal=postgres_password=$(head -c 32 /dev/random | base64)
kubectl create -f ../specs/postgres.yml
kubectl wait --for=condition=ready pod -n dominion -l app=postgres
kubectl create configmap hostname-config --namespace dominion --from-literal=postgres_host=$(kubectl get svc postgres --namespace dominion -o jsonpath="{.spec.clusterIP}")
kubectl create configmap oauthapp --namespace dominion --from-literal=clientid=$(head -n 1 ../../creds.txt) --from-literal=clientsecret=$(tail -n 2 ../../creds.txt | head -n 1) --from-literal=allowlist=$(tail -n 1 ../../creds.txt) --from-literal=sessionsecret=localonly --from-literal=publicport=30001
kubectl create -f ../specs/local-deployment.yml
kubectl wait --for=condition=ready pod -n dominion -l app=dominion

echo "Please manually verify the app via GET localhost:30001"
echo "Useful commands:"
echo ""
echo "query the test_table as JSON"
echo "    curl localhost:30001/api/v1/testObjects"
echo ""
echo "check on the pod statuses"
echo "    kubectl get pods -n dominion"
echo ""
echo "follow app logs"
echo "    kubectl logs --follow \$(kubectl get pods -n dominion | grep '^dominion' | head -n 1 | awk '{print \$1}') -n dominion -c dominion"
echo ""
echo "run sql against the DB"
echo "    winpty kubectl exec -it \$(kubectl get pods -n dominion | grep '^postgres' | head -n 1 | awk '{print \$1}') -n dominion -c postgres -- env PGPASSWORD=\$(kubectl get configmap postgres-config -n dominion -o yaml | grep '\spostgres_password: ' | awk '{print \$2}') psql -U admin dominion"

kubectl logs --follow $(kubectl get pods -n dominion | grep '^dominion' | head -n 1 | awk '{print $1}') -n dominion -c dominion