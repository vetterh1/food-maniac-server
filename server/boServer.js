/* eslint-disable no-multiple-empty-lines */
/* eslint-disable import/first */

const logger = require('./util/logger.js');

import express from 'express';
import helmet from 'helmet';
import http from 'http';
import SocketIO from 'socket.io';
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
logger.info(`BoServer Port: ${serverPort}`);

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

import insertInitialData from './initialData';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;



// MongoDB Connection

mongoose.set('debug', (coll, method, query, doc) => {
  logger.debug('Mongo query executed:', coll, method, query, doc);
});

if (!config.has('storage.database.URL')) logger.error(`! No config defined for storage.database.URL for env ${process.env.NODE_ENV} !`);
const databaseURL = config.get('storage.database.URL');
logger.info(`Mongodb server: ${databaseURL}`);

// SSL to connect to mongo or not
let sslMode = true;
if (!config.has('storage.database.sslMode')) {
  sslMode = false;
  logger.error('! Mongo SSL config NOT defined for db. Connection will NOT be secured!');
} else {
  sslMode = config.get('storage.database.sslMode');
  if (sslMode === false) {
    logger.error('! Mongo SSL for db is DISABLED. Connection will NOT be secured!');
  } else {
    logger.info('Mongo SSL enabled. Connections should be secure :)');
  }
}

// If SSL mode, get key & certificate
let sslKey = '';
let sslCert = '';
if (sslMode) {
  // Path to SLL key (used if SSL mode ON)
  let sslKeyPath = '';
  if (!config.has('storage.database.sslKeyPath')) {
    logger.error('! Mongo SSL key path missing for db secure connection!');
  } else {
    sslKeyPath = config.get('storage.database.sslKeyPath');
    if (!sslKeyPath || sslKeyPath.length <= 0) {
      logger.error('! Mongo SSL key path empty or invalid for db secure connection!');
    } else {
      // Read key content
      sslKey = fs.readFileSync(sslKeyPath);
      if (!sslKey || sslKey.length <= 0) {
        logger.error(`! Mongo SSL key missing or invalid file: ${sslKeyPath}`);
      } else {
        logger.info(`Mongo SSL key loaded: ${sslKeyPath}`);
      }
    }
  }

  // Path to SLL certificate (used if SSL mode ON)
  let sslCertPath = '';
  if (!config.has('storage.database.sslCertPath')) {
    logger.error('! Mongo SSL certificate path missing for db secure connection!');
  } else {
    sslCertPath = config.get('storage.database.sslCertPath');
    if (!sslCertPath || sslCertPath.length <= 0) {
      logger.error('! Mongo SSL certificate path empty or invalid for db secure connection!');
    } else {
      // Read certificate content
      sslCert = fs.readFileSync(sslCertPath);
      if (!sslCert || sslCert.length <= 0) {
        logger.error(`! Mongo SSL certificate missing or invalid file: ${sslCertPath}`);
      } else {
        logger.info(`Mongo SSL certificate loaded: ${sslCertPath}`);
      }
    }
  }
}

const sslOptions = {
  ssl: sslMode,
  sslValidate: false,
  sslKey,
  sslCert,
};

const options = {
  autoIndex: false, // Don't build indexes
  keepAlive: 1,
  connectTimeoutMS: 30000,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 2000,
  bufferCommands: false, // Disable buffering of mongoose commands
  poolSize: 10, // Maintain up to 10 socket connections
  user: 'food',
  pass: 'maniac',
  ...sslOptions,
};

mongoose.connect(databaseURL, options).then(
  () => {
    logger.info('Mongodb is installed and running!');

    //
    // ADD INITIAL DATA IN DB
    // WARNING:  DELETES ANY EXISTING DATA PRIOR TO 1968-12-21
    //
    if (process.env.NODE_ENV !== 'test' && process.env.INSERT_INITIAL_DATA) {
      logger.warn('Insert initial data requested');
      insertInitialData();
    }
  },
  (error) => {
    if (error) {
      logger.error('Please make sure Mongodb is installed and running!');
      throw error;
    }
  }
);

const db = mongoose.connection;
db.on('error', logger.error.bind(console, '! Mongoose connection error !'));


//
// ---------------------  CREATE FOLDERS IN DON'T EXIST ---------------------
//


// Create dir recursively if it does not exist!
function mkdirReccursive(completePath) {
  const separator = completePath.indexOf('/') !== -1 ? '/' : '\\';
  completePath.split(separator).forEach((dir, index, splits) => {
    const parent = splits.slice(0, index).join('/');
    const dirPath = path.resolve(parent, dir);
    // logger.debug(`mkdirReccursive: ${dirPath}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

const folderStatic = config.get('storage.static');
logger.info(`Folder static: ${folderStatic}`);
if (!config.has('storage.static')) logger.error(`! No config defined for storage.static for env ${process.env.NODE_ENV} !`);

// Items Pictures
const folderPicturesItems = path.join(__dirname, folderStatic, '/pictures/items');
logger.info(`Folder pictures items: ${folderPicturesItems}`);
mkdirReccursive(folderPicturesItems);

// Pictures Thumbnails
const folderThumbnails = path.join(__dirname, folderStatic, '/thumbnails');
logger.info(`Folder thumbnails: ${folderThumbnails}`);
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
const app = express();
const server = http.Server(app);
const io = new SocketIO(server);

// Save the socket io reference in express
// so it can be used in other places
// ex: var io = req.app.get('socketio'); io.emit('hi!');
app.set('socketio', io);



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
// ---------------------  JSON Web Tokens  ---------------------
//

import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://foodmaniac.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://food-maniac.com/api',
  issuer: 'https://foodmaniac.eu.auth0.com/',
  algorithms: ['RS256']
});

// TODO: re-enable once docker ok
// app.use(jwtCheck);

app.get('/authorized', (req, res) => {
  res.send('Secured Resource');
});





//
// ---------------------  INIT SERVER  ---------------------
//

// security
app.use(allowCrossDomain);
app.use(helmet());
app.use(helmet.xssFilter({ setOnOldIE: true }));

import apiRoutes from './routes/apiRoutes';
import utilRoutes from './routes/utilRoutes';

// app.enable('trust proxy');  // used to get callers IP address (use req.ip)
app.set('trust proxy', '127.0.0.1');

app.use(compression());
app.use(morgan('combined', { stream: accessLogStream })); // for logging
app.use(bodyParser.json({ limit: '5mb' })); // Mandatory to get body in post requests!
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


/*
 *   ------------------ IMPORTANT NOTE ON ADDING PATHS TO THE SERVER ------------------
 *
 * Whenever ADDING a PATH, server configurations & proxy configuration MUST be UPDATED:
 *
 * - Development environment running webpack dev server:
 *    add a section to webpack in the devServer / proxy section
 *
 *    config ex:
        proxy: {
          ...
          '/util': {
          target: 'http://localhost:8085',
          secure: false,
          },
          ...
        }
 *
 * - Production environment
 *
 *      - ngInx proxy server:
 *
 *          Edit usefull.txt file - section: --------- File: ...default ------
 *          to add a section to the config file
 *          then restart :
 *            commands:
 *              sudo nano /etc/nginx/sites-available/default
 *              /etc/init.d/nginx restart
 *
 *            config ex:
                # Pass requests for /util to localhost:8085:
                location /util/ {
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header X-NginX-Proxy true;
                        proxy_pass http://localhost:8085/util/;
                        proxy_ssl_session_reuse off;
                        proxy_set_header Host $http_host;
                        proxy_cache_bypass $http_upgrade;
                        proxy_redirect off;
                }
 *
 *
 *      - Node server:
 *
 *
 *
 * - Code
 *
 *          add a route below & a route file in the routes folder
 */


// Serve our mongo apis:
app.use('/api', apiRoutes);

// Serve our utility functions:
app.use('/util', utilRoutes);

// Serve static assets (pictures,...)
// app.use(Express.static(folderStatic));
const folderStaticAbsolute = path.join(__dirname, folderStatic);
logger.info(`BoServer serves static files from: ${folderStaticAbsolute} to /static.`);
app.use('/static', express.static(folderStaticAbsolute));


// Logs route: are visible here:  http://yourhost:port/logs/show
require('./util/winstonDisplay')(app, logger.default);

// Save logs comming from here:  http://yourhost:port/logs/save
require('./util/logsFromBrowser')(app);


// start app
server.listen(serverPort, (error) => {
  if (!error) {
    logger.info(`BoServer running on port: ${serverPort}`);
  } else {
    logger.error(`! Error, cannot run BoServer on port: ${serverPort}`);
  }
});

export default app;
