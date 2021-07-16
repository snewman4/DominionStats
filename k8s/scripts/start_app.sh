DATABASE_USER=admin
DATABASE_PASSWORD=$(head -c 32 /dev/random | base64)	# Checking in credentials is a security risk
DATABASE_NAME=dominion
kubectl create -f ../specs/namespace.yml

kubectl create -f ../specs/foyer-config.yml

kubectl create configmap database-config --namespace dominion --from-literal=database_user=$DATABASE_USER --from-literal=database_password=$DATABASE_PASSWORD

kubectl create -f ../specs/postgres.yml

kubectl create configmap hostname-config --namespace dominion --from-literal=database_url=postgres://$DATABASE_USER:$DATABASE_PASSWORD@$(kubectl get svc postgres --namespace dominion -o jsonpath="{.spec.clusterIP}")/$DATABASE_NAME

kubectl create -f ../specs/dominion-app.yml

kubectl create -f ../specs/load-balancer.yml

kubectl get svc dominion-app --namespace dominion
