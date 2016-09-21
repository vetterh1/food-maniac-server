var User = require('./models/user')
var Item = require('./models/item')
var Place = require('./models/place')
var Mark = require('./models/mark')

function dummyData() {

	// Create a new test user after removing any existing one
	const newUser = new User({login:'testUser', first:'testFirst', last:'testLast', mark: 0});
	User.find().remove({login: 'testUser'}).exec()
		.then( User.create([newUser]) )
		.then( function() { User.find(function (err, results) {
		if (err) return console.error(err);
		console.log('User list:', results)
		})}
	);

	// Create a new test item after removing any existing one
	const newItem = new Item({name:'testItem', picture:''});
	Item.find().remove({name: 'testItem'}).exec()
		.then( Item.create([newUser]) )
		.then( function() { Item.find(function (err, results) {
		if (err) return console.error(err);
		console.log('Item list:', results)
		})}
	);

	// Create a new test place after removing any existing one
	const newPlace = new Place({name:'testPlace', items: [newItem]});
	Place.find().remove({name: 'testPlace'}).exec()
		.then( Place.create([newUser]) )
		.then( function() { Place.find(function (err, results) {
		if (err) return console.error(err);
		console.log('Place list:', results)
		})}
	);


}

module.exports = dummyData;
