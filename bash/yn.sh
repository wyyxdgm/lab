#!/bin/bash

echo "question?Y/n"           #参数-n的作用是不换行，echo默认是换行 
read  name
if [[ $name == 'Y' ]]; then
  echo 'you choosed: Y.'
  echo 'do ..'
else
  echo 'you choosed: n.'
  echo 'cancel ..'
fi