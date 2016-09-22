var User = require('./models/user')
var Item = require('./models/item')
var Place = require('./models/place')
var Mark = require('./models/mark')

function dummyData() {

	var newUser = new User({login:'testUser', first:'testFirst', last:'testLast', mark: 0});
	var newItem = new Item({name:'testItem'});

	// Create a new test user after removing any existing one
	User.find().remove({login: 'testUser'}).exec()
		.then( User.create(newUser) )

	// Create a new test item after removing any existing one
		.then( Item.find().remove({name: 'testItem'}).exec() )
		.then( Item.create(newItem) )

	// Create a new test place after removing any existing one
		.then( Place.find().remove({name: 'testPlace'}).exec() )
		.then( Place.create(new Place({name:'testPlace', items: [newItem._id]})) )

	// Display collections
		.then( function() { 
			User.find(function (err, results) {
				if (err) return console.error(err);
				console.log('User list:', results)
			});
			Item.find(function (err, results) {
				if (err) return console.error(err);
				console.log('Item list:', results)
			})
			Place.find(function (err, results) {
				if (err) return console.error(err);
				console.log('Place list:', results)
			})
		});
}

module.exports = dummyData;
