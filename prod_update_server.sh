cd ./workspace/food-maniac-server/
pm2 stop boServer
pm2 delete boServer
git pull
npm install
NODE_ENV=production  npm run build:prod
pm2 start pm2config.json --env production
