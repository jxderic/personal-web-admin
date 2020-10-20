#!/bin/bash
echo "deploying"
git pull origin master
export PATH=/usr/local/node/12.19.0/bin:$PATH
npm config set registry https://registry.npm.taobao.org
npm install --no-lockfile
npm run build:prod
scp -r ./dist/* /usr/share/nginx/html
echo "deploy done"