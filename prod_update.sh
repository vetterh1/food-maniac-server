cd ./workspace/mapTest/
pm2 stop all
pm2 delete boServer foServer
git pull
npm install
pm2 start pm2config.json --env production
