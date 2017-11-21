#!/usr/bin/env bash

echo "Starting database in daemon mode";
docker-compose -f docker-compose.yml up -d;

echo "Starting client";
(cd client && npm install && pm2 start npm -- start)

echo "Starting server";
(cd server && npm install && pm2 start npm -- start)

$SHELL
