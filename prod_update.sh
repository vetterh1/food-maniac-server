cd ./workspace/mapTest/
git pull
pm2 stop boServer foServer
npm run BoServer:build:prod
npm run FoServer:build:prod
pm2 start boServer foServer
