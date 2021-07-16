# uisf-foyer on kubernetes

These scripts can be used to deploy foyer + postgres to k8s cluster

*To test locally (SAS team):*

## prerequisites
- Docker Desktop
- Enable Kubernetes Cluster in Docker Desktop: https://docs.docker.com/desktop/kubernetes/
- Verify that you can see the `docker-desktop` cluster: `kubectl config view`

## deploy foyer/postgres
From: `cd uisf-foyer/k8s/scripts/`
Run deploy script: `./start_app.sh` 
(To cleanup the resources): `./cleanup.sh`

## Quickstart command reference
### view deployed pods
`kubectl get pods -n uisf`

### view load balancer IP and port information
`kubectl get svc uisf-foyer -n uisf`

### view foyer logs
`kubectl logs -l app=uisf-foyer -n uisf`

### verify that the service executes /manage/health
See: https://github.com/slackcrm/uisf-foyer#testing-response--db-connection
Note: Make sure that you execute the curl test against the proper port. (See above for viewing the port information)
