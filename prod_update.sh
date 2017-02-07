cd ./workspace/mapTest/
pm2 stop all
pm2 delete boServer foServer
git pull
npm install
NODE_ENV=production  npm run BoServer:build:prod
NODE_ENV=production  npm run FoServer:build:prod
pm2 start pm2config.json --env production
