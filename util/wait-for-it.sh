#!/usr/bin/env sh

until pg_isready -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -d ${POSTGRES_DATABASE}; do
    echo "$(date) - waiting for postgres database ${POSTGRES_DATABASE} on ${POSTGRES_HOST}:${POSTGRES_PORT}..."
    sleep 1
done

echo "Postgres is ready - running migrations"

npm run migrate

echo "Postgres is ready - executing $@"

exec "$@"
