#!/bin/bash

SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
cd $SHELL_FOLDER && cd ..
cd dist/
git remote add origin git@git.dev.tencent.com:yousails/nature-website.git
git add .
git commit -m 'sync'
git push origin master