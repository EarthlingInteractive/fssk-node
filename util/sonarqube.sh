#!/usr/bin/env bash

# Only run in circleci environments
if [[ ${CIRCLECI} ]];
then
	printf "Circle PR URL: ${CIRCLE_PULL_REQUEST} \n"
	printf "Circle Branch: $CIRCLE_BRANCH \n"
	printf "Circle PR Number: ${CIRCLE_PR_NUMBER} \n"
	printf "Circle Job Name: ${CIRCLE_JOB} \n"

	echo "Looking for LCOV Files ..."
	if [ ! -f client/coverage/lcov.info ]; then
		echo "Could not find coverage file for client app."
		exit 1
	else
		echo "Found coverage files for client."
	fi

	if [ ! -f server/coverage/lcov.info ]; then
		echo "Could not find coverage file for server app."
		exit 1
	else
		echo "Found coverage files for server."
	fi

	if [[ ! "${CIRCLE_PULL_REQUEST}" =~ /pull/[0-9]+$ ]]; then
		echo "Not a pull request."
	else
		PR_NUMBER=`echo "${CIRCLE_PULL_REQUEST}" | sed -e 's/.*\///g'`

		echo "Converting LCOV files to have valid relative paths ..."
		sed -i.bak "s|SF:/root/${CIRCLE_PROJECT_REPONAME}/|SF:|g" client/coverage/lcov.info
		sed -i.bak "s|SF:/root/${CIRCLE_PROJECT_REPONAME}/|SF:|g" server/coverage/lcov.info

		echo "Copying sonar-scanner.properties to SonarScanner"
		cp sonar-scanner.properties /root/sonar-scanner/conf/sonar-scanner.properties

		echo "Running SonarQube Scanner ..."
		sonar-scanner \
			-X -Dsonar.analysis.mode=preview \
			-Dsonar.github.pullRequest=${PR_NUMBER}
	fi
else
  printf "SonarQube analysis step can only be run in Circle CI Environments. \n"
fi