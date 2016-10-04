//
// To debug:
//  - install node-inspector: npm install -g node-inspector
//  - launch it: node-inspector
//  - run the app: node --debug server.js
//  (to rebuild client if necessary: npm run build )


import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
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
if (config.has('DBHost'))
  var DBHost = config.get('DBHost');
else
	console.error("! No config defined for DBHost (or no NODE_ENV defined!) !"); // eslint-disable-line no-console
console.log(`Mongodb: ${DBHost}`); // eslint-disable-line no-console
let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 
mongoose.connect(DBHost, options, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }

  // feed some dummy data in DB if empty
  insertTestData();
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));





//
// ---------------------  INIT SERVER  ---------------------  
//


// Initialize the Express App
const app = new Express();

app.use(compression())

// Serve our mongo apis:
app.use('/api', apiRoutes);

// serve our static stuff like index.css
// explanations here: http://expressjs.com/en/starter/static-files.html
app.use(Express.static(path.resolve(__dirname, '../dist')));

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

var PORT = process.env.PORT || 8080
app.listen(PORT, function() {
  console.log('Node Express server running at localhost:' + PORT)
})

export default app;
