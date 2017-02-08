 /* eslint-disable no-multiple-empty-lines */

const logger = require('./util/logger.js');

import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
// import IntlWrapper from '../client/modules/Intl/IntlWrapper';

import config from 'config';

if (!process.env.SERVER_NAME) console.error('! SERVER_NAME undefined !'); // eslint-disable-line no-console
if (!process.env.NODE_ENV) console.error('! NODE_ENV undefined !'); // eslint-disable-line no-console

const serverPort = config.get('server.BoServer.port');
logger.warn(`BoServer Port: ${serverPort}`);

if (process.env.PORT) {
  console.error(`! PORT env var defined, but use ${serverPort} from config file !`); // eslint-disable-line no-console
}






//
// ---------------------  INIT LOGGER  ---------------------
//

import FileStreamRotator from 'file-stream-rotator';
import morgan from 'morgan';

const logDirectory = `${__dirname}/log`;

// ensure log directory exists
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: `${logDirectory}/access-BoServer-%DATE%.log`,
  frequency: 'daily',
  verbose: false,
});




//
// ---------------------  INIT DB  ---------------------
//

import insertTestData from './testData';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
const databaseURL = config.get('storage.database.URL');
logger.warn(`Mongodb: ${databaseURL}`);
if (!config.has('storage.database.URL')) logger.error(`! No config defined for storage.database.URL for env ${process.env.NODE_ENV} !`);

const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
};
mongoose.connect(databaseURL, options, (error) => {
  if (error) {
    logger.error('Please make sure Mongodb is installed and running!');
    throw error;
  }

  // feed some dummy data in DB if empty
  if (process.env.NODE_ENV !== 'test') insertTestData();
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


//
// ---------------------  CREATE FOLDERS IN DON'T EXIST ---------------------
//


// Create dir recursively if it does not exist!
function mkdirReccursive(completePath) {
  const separator = completePath.indexOf('/') !== -1 ? '/' : '\\';
  completePath.split(separator).forEach((dir, index, splits) => {
    const parent = splits.slice(0, index).join('/');
    const dirPath = path.resolve(parent, dir);
    logger.debug(`mkdirReccursive: ${dirPath}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

const folderStatic = config.get('storage.static');
logger.warn(`Folder static: ${folderStatic}`);
if (!config.has('storage.static')) logger.error(`! No config defined for storage.static for env ${process.env.NODE_ENV} !`);
const folderPicturesItems = path.join(__dirname, folderStatic, '/pictures/items');
logger.warn(`Folder pictures items: ${folderPicturesItems}`);
mkdirReccursive(folderPicturesItems);



//
// ---------------------  CORS middleware  ---------------------
//

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}




//
// ---------------------  CREATE SERVER  ---------------------
//


// Initialize the Express App
const app = new Express();




//
// ---------------------  HOT RELOADING  ---------------------
//
/*
import webpack from 'webpack'; // eslint-disable-line import
import webpackConfig from '../webpack.config.hotreload';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

if (process.env.NODE_ENV === 'development') {
  logger.info('Setup hot reloading (Dev only mode)');
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
*/


//
// ---------------------  INIT SERVER  ---------------------
//

import apiRoutes from './routes/apiRoutes';

app.use(compression());
app.use(morgan('combined', { stream: accessLogStream })); // for logging
app.use(bodyParser.json({ limit: '5mb' })); // Mandatory to get body in post requests!
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(allowCrossDomain);


// Serve our mongo apis:
app.use('/api', apiRoutes);

// Serve static assets (pictures,...)
// app.use(Express.static(folderStatic));
const folderStaticAbsolute = path.join(__dirname, folderStatic);
logger.info(`BoServer serves static files from: ${folderStaticAbsolute} to /static.`);
app.use('/static', Express.static(folderStaticAbsolute));


// start app
app.listen(serverPort, (error) => {
  if (!error) {
    logger.info(`BoServer running on port: ${serverPort}`);
  } else {
    logger.error(`! Error, cannot run BoServer on port: ${serverPort}`);
  }
});

export default app;
