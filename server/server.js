 /* eslint-disable no-multiple-empty-lines */

const logger = require('./util/logger.js');

import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
// import IntlWrapper from '../client/modules/Intl/IntlWrapper';

import config from 'config';

if (!process.env.NODE_ENV) console.error('! NODE_ENV undefined !'); // eslint-disable-line no-console

const serverPort = config.get('server.port');
logger.warn(`Server Port: ${serverPort}`);

if (process.env.PORT) {
  console.error(`! PORT env var defined, but use ${serverPort} from config file !`); // eslint-disable-line no-console
}






//
// ---------------------  INIT LOGGER  ---------------------
//

import FileStreamRotator from 'file-stream-rotator';
import fs from 'fs';
import morgan from 'morgan';

const logDirectory = `${__dirname}/log`;

// ensure log directory exists
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: `${logDirectory}/access-%DATE%.log`,
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
const databaseURL = config.get('database.URL');
logger.warn(`Mongodb: ${databaseURL}`);
if (!config.has('database.URL')) logger.error(`! No config defined for database.URL for env ${process.env.NODE_ENV} !`);

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
// ---------------------  CREATE SERVER  ---------------------
//


// Initialize the Express App
const app = new Express();




//
// ---------------------  HOT RELOADING  ---------------------
//

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



//
// ---------------------  INIT SERVER  ---------------------
//

import apiRoutes from './routes/apiRoutes';

app.use(compression());
app.use(morgan('combined', { stream: accessLogStream })); // for logging
app.use(bodyParser.json()); // Mandatory to get body in post requests!

// Serve our mongo apis:
app.use('/api', apiRoutes);

// serve our static stuff like index.css
// explanations here: http://expressjs.com/en/starter/static-files.html
app.use(Express.static(path.resolve(__dirname, '../dist')));

// send all requests to index.html so browserHistory works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// start app
app.listen(serverPort, (error) => {
  if (!error) {
    logger.info(`Server running on port: ${serverPort}`);
  } else {
    logger.error(`! Error, cannot run server on port: ${serverPort}`);
  }
});

export default app;
