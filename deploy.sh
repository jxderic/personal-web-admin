#!/bin/bash
echo "deploying"
cd /eric/personal-web/personal-web-admin
git pull origin master
npm config set registry https://registry.npm.taobao.org
npm install --no-lockfile
npm run build:prod
scp -r ./dist/* /usr/share/nginx/html
echo "deploy done"