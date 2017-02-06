cd ./workspace/mapTest/
pm2 stop ecosystem.json
git pull
npm install
NODE_ENV=production  npm run BoServer:build:prod
NODE_ENV=production  npm run FoServer:build:prod
pm2 start ecosystem.json