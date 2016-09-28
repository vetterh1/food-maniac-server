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

import apiRoutes from './routes/apiRoutes';


//
// ---------------------  INIT DB  ---------------------  
//
// import dummyData from './dummyData'

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/food_maniac', (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }

  // feed some dummy data in DB.
  // dummyData();
});






//
// ---------------------  INIT SERVER  ---------------------  
//


// Initialize the Express App
const app = new Express();

app.use(compression())

// serve our static stuff like index.css
// explanations here: http://expressjs.com/en/starter/static-files.html
app.use(Express.static(path.resolve(__dirname, '../dist')));

// Serve our mongo apis:
app.use('/api', apiRoutes);


// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

var PORT = process.env.PORT || 8080
app.listen(PORT, function() {
  console.log('Node Express server running at localhost:' + PORT)
})

export default app;
