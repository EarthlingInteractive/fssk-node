#!/usr/bin/env bash

echo "Looking for LCOV Files ..."
if [ ! -f client/coverage/lcov.info ]; then
	echo "Could not find coverage files for client app."
	exit 1
else
	echo "Found coverage files for client."
fi

if [ ! -f server/coverage/lcov.info ]; then
	echo "Could not find coverage files for server app."
	exit 1
else
	echo "Found coverage files for server."
fi

echo "Converting LCOV files to have valid paths ..."
sed -i.bak 's|SF:/opt/src/src|SF:client/src|g' client/coverage/lcov.info
sed -i.bak 's|SF:/opt/src/src|SF:server/src|g' server/coverage/lcov.info

echo "Running SonarQube Scanner ..."
docker run -it \
	-v $(pwd):/root/src \
	-v $(pwd)/sonar-scanner.properties:/root/sonar-scanner/conf/sonar-scanner.properties \
	-e SONARQUBE_LOGIN_TOKEN=$SONARQUBE_LOGIN_TOKEN \
	-e SONARQUBE_GITHUB_OAUTH=$SONARQUBE_GITHUB_OAUTH \
	fssk-node_sonarqube-scanner sonar-scanner