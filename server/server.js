//
// To debug:
//  - install node-inspector: npm install -g node-inspector
//  - launch it: node-inspector
//  - run the app: node --debug server.js
//  (to rebuild client if necessary: npm run build )

var logger = require('./util/logger.js');  

import Express from 'express';
import compression from 'compression';
import FileStreamRotator from 'file-stream-rotator';
import fs from 'fs';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

import config from 'config';
if( !process.env.NODE_ENV )
	console.error("! NODE_ENV undefined !"); // eslint-disable-line no-console

import apiRoutes from './routes/apiRoutes';



//
// ---------------------  INIT DB  ---------------------  
//

import insertTestData from './testData';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
if (config.has('database.URL'))
  var databaseURL = config.get('database.URL');
else
	console.error("! No config defined for database.URL (or no NODE_ENV defined!) !"); // eslint-disable-line no-console
console.log(`Mongodb: ${databaseURL}`); // eslint-disable-line no-console
let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 
mongoose.connect(databaseURL, options, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }

  	// feed some dummy data in DB if empty
	if( process.env.NODE_ENV != "test")
  		insertTestData();
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));






//
// ---------------------  INIT LOGGER  ---------------------  
//


var logDirectory = __dirname + '/log'

// ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
 
// create a rotating write stream 
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})
 




//
// ---------------------  CREATE SERVER  ---------------------  
//


// Initialize the Express App
const app = new Express();




//
// ---------------------  HOT RELOADING  ---------------------  
//

import webpack from 'webpack';
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

app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}))		// for logging
app.use(bodyParser.json());		// Mandatory to get body in post requests!

// Serve our mongo apis:
app.use('/api', apiRoutes);

// serve our static stuff like index.css
// explanations here: http://expressjs.com/en/starter/static-files.html
app.use(Express.static(path.resolve(__dirname, '../dist')));

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

if (config.has('server.port'))
  var PORT = config.get('server.port');
else
	console.error("! No config defined for server.port (or no NODE_ENV defined!) !"); // eslint-disable-line no-console

app.listen(PORT, function() {
  console.log('Node Express server running at localhost:' + PORT)
})

export default app;
