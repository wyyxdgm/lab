#!/bin/bash

SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
cd $SHELL_FOLDER && cd ..

REPOSITORY=git@e.coding.net:yousails-dev/nature-website.git

cd dist/
git init
git remote add origin ${REPOSITORY}
rm -rf img/
git add .
git commit -m 'sync'
# git pull origin master
git push origin master -f
