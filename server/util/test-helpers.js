var mongoose = require('mongoose')

function connectDB(t, done) {
	console.log("{ connectDB");
    mongoose.createConnection('mongodb://localhost:27017/food_maniac', err => {
      console.log("createConnection: ", err);
      if (err) t.fail('Unable to connect to test database');
      done();
    });
  	console.log("} connectDB");
}
module.exports.connectDB = connectDB;

function dropDB(t) {
  console.log("{ dropDB");
  mongoose.disconnect(err => {
    console.log("   mongoose.disconnect");
    if (err) t.fail('Unable to mongoose.disconnect');
  });
  console.log("} dropDB");
}
module.exports.dropDB = dropDB;