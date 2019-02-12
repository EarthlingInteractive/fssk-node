#!/usr/bin/env bash

docker exec -it fssk-node-server npm run migrate
docker exec -it fssk-node-server npm run seed
