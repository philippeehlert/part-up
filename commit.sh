#!/bin/bash


STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "js$")

PREFIX="app/"

cd app
if [ "$STAGED_FILES" != "" ]
then
	for FILE in $STAGED_FILES
	do
		meteor npm run lint ${FILE#$PREFIX}
	done
fi
cd ../

git-cz