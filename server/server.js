//
// To debug:
//  - install node-inspector: npm install -g node-inspector
//  - launch it: node-inspector
//  - run the app: node --debug server.js
//  (to rebuild client if necessary: npm run build )



var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var compression = require('compression')
var mongoose = require('mongoose')

var apiRoutes = require('./routes/apiRoutes')



//
// ---------------------  INIT DB  ---------------------  
//

var dummyData = require('./dummyData')

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/food_maniac', (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }

  // feed some dummy data in DB.
  dummyData();
});






//
// ---------------------  INIT SERVER  ---------------------  
//


var app = express()

app.use(compression())

// serve our static stuff like index.css
// explanations here: http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/api', apiRoutes);



//
// ---------------------  USERS  ---------------------  
//

var userData = [
  {id: 1, priority: 'P1', status:'Open', owner:'Ravan', title:'App crashes on open'},
  {id: 2, priority: 'P2', status:'New', owner:'Eddie', title:'Misaligned border on panel'}
];


app.get('/api/users', function(req, res) {
  res.json(userData);
});

app.use(bodyParser.json());
app.post('/api/users/', function(req, res) {
	console.log( "userData (1): ", userData);
  console.log("/api/users/ - Req body:", req.body);
  var newUser = req.body;
  newUser.id = userData.length + 1;
  userData.push(newUser);
  res.json(newUser);
	console.log( "userData (2): ", userData);
});






// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

var PORT = process.env.PORT || 8080
app.listen(PORT, function() {
  console.log('Node Express server running at localhost:' + PORT)
})