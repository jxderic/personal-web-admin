#!/bin/bash
echo "deploying"
npm config set registry https://registry.npm.taobao.org
npm install --no-lockfile
npm run build:prod
scp -r ./dist/* /usr/share/nginx/html
echo "deploy done"