#!/bin/bash 
set -x # echo on

git add .
git commit -S -m "0.0.5"
git tag -s v0.0.5 -m 'signed 0.0.5 tag'

git push --force --tags com.github.gusenov.web-store-js master:master

#npm login
npm publish
