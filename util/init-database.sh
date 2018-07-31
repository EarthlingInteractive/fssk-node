#!/usr/bin/env bash

docker exec -it fssk-node-server npm run migrate && npm run seed
