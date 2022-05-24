# DominionStats

Here will be some information about the app.

## Build

-   use node version 14.18.\* (for now)
-   `yarn install`
-   `yarn build`

## How to start?

Option 1: Database + live app

-   `cd k8s/scripts/`
-   `./run_database.sh`
-   `cd ../../`
-   `./start.sh`

Option 2: Database + solidified app

-   `cd k8s/scripts`
-   `./run_docker.sh`

## Source info

The source files are located in the [`src`](./src) folder. All web components are within the [`src/client/modules`](./src/modules) folder. The folder hierarchy also represents the naming structure of the web components. The entry file for the custom Express configuration can be found in the ['src/server'](./src/server) folder.

Find more information on the main repo on [GitHub](https://github.com/muenzpraeger/create-lwc-app).
