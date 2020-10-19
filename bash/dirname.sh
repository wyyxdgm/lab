#!/bin/bash

#check project dir
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd $DIR
echo dir: [`pwd`]

# do