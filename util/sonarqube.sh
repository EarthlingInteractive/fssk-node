#!/usr/bin/env bash

function covert_lcov_files {
	echo "Converting LCOV files to have valid relative paths ..."
	sed -i.bak "s|SF:/home/circleci/${CIRCLE_PROJECT_REPONAME}/|SF:|g" client/coverage/lcov.info
	sed -i.bak "s|SF:/home/circleci/${CIRCLE_PROJECT_REPONAME}/|SF:|g" server/coverage/lcov.info
}

function copy_configuration {
	echo "Copying sonar-scanner.properties to SonarScanner"
	cp sonar-scanner.properties /root/sonar-scanner/conf/sonar-scanner.properties
}

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

	# IF this is not a pull request
	if [[ ! "${CIRCLE_PULL_REQUEST}" =~ /pull/[0-9]+$ ]]; then
		# Detect the CircleCI job that is running to determine if we need to update
		# SonarQube with coverage data
		if [ "$CIRCLE_JOB" == "nightly_coverage" ]
		then
			covert_lcov_files
			copy_configuration

			echo "Running SonarQube Scanner ..."
			sonar-scanner
		else
			echo "Not doing full SonarQube Scan because not a pull request, or a nightly job."
		fi	
		
	else
		# This is a pull request - so get the PR number from the PR Url
		PR_NUMBER=`echo "${CIRCLE_PULL_REQUEST}" | sed -e 's/.*\///g'`

		covert_lcov_files
		copy_configuration

		echo "Running SonarQube Scanner for pull request #${PR_NUMBER} ..."
		sonar-scanner \
			-X -Dsonar.analysis.mode=preview \
			-Dsonar.github.pullRequest=${PR_NUMBER}
	fi
else
  printf "SonarQube analysis can only be run in Circle CI Environments. \n"
fi
