cd ./workspace/mapTest/
rm distFoServer/bundle.*
rm distFoServer/main.*
rm distFoServer/manifest.*
rm distFoServer/styles.*
rm distFoServer/vendor.*
pm2 stop all
pm2 delete boServer foServer
git pull
npm install
NODE_ENV=production  npm run BoServer:build:prod
NODE_ENV=production  npm run FoServer:build:prod
pm2 start pm2config.json --env production
