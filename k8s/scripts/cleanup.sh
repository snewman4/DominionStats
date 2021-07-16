kubectl delete -f ../specs/foyer.yml

kubectl delete -f ../specs/load-balancer.yml

kubectl delete cm hostname-config --namespace dominion

kubectl delete -f ../specs/postgres.yml

kubectl delete -f ../specs/foyer-config.yml

kubectl delete -f ../specs/namespace.yml

