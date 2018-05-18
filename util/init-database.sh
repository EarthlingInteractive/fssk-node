#!/usr/bin/env bash

docker exec -it fssk-server npm run migrate && npm run seed
