import mongoose from 'mongoose';
import Item from './models/item';
import Place from './models/place';
import User from './models/user';
import Mark from './models/mark';

export var testUsers = [
	new User({login:'testUser1', first:'testFirst1', last:'testLast1', mark: 0, cuid: 'cuidTestUser1'}),
	new User({login:'testUser2', first:'testFirst2', last:'testLast2', mark: 0, cuid: 'cuidTestUser2'}),
	new User({login:'testUser3', first:'testFirst3', last:'testLast3', mark: 0, cuid: 'cuidTestUser3'})
];

export var testItems = [
	new Item({name:'testItem1', cuid: 'cuidTestItem1'}),
	new Item({name:'testItem2', cuid: 'cuidTestItem2'}),
	new Item({name:'testItem3', cuid: 'cuidTestItem3'}),
	new Item({name:'testItem4', cuid: 'cuidTestItem4'})
];

export var testPlaces = [
	new Place({name:'testPlace1', cuid: 'cuidTestPlace1'}),
	new Place({name:'testPlace2', cuid: 'cuidTestPlace2'}),
	new Place({name:'testPlace3', cuid: 'cuidTestPlace3'}),
	new Place({name:'testPlace4', cuid: 'cuidTestPlace4'})
];

export default function dummyData() {

	console.log('{   dummyData()');

  	User.count().exec((err, count) => {
	    if (count > 0) {
			console.log('       no need to add dummy data: nb users=' + count);
			console.log('}   dummyData()');
	      return;
	    }
	});

	

	console.log('       Add dummy data');

	// Create test users after removing any existing one
	User.find().remove({login: '/^testUser/'}).exec()
		.then( User.create(testUsers, function (err) {
						if(err)
							console.log('    User.create err=', err);
					}
				)
		)

	// Create new test items after removing any existing one
		.then( Item.find().remove({name: '/^testItem/'}).exec() )
		.then( Item.create(testItems, function (err) {
						if(err)
							console.log('    Item.create err=', err);
					}
				)
		)

	// Create new test places after removing any existing one
		.then( Place.find().remove({name: '/^testPlace/'}).exec() )
//		.then( Place.create(new Place({name:'testPlace', items: [newItem._id]})) )
		.then( Place.create(testPlaces, function (err) {
						if(err)
							console.log('    Place.create err=', err);
					}
				)
		)

	// Display collection counts
		.then( function() { 
			User.find().count(function (err, results) {
				if (err) return console.error(err);
				console.log('# Users:', results)
			});
			Item.find().count(function (err, results) {
				if (err) return console.error(err);
				console.log('# Items:', results)
			});
			Place.find().count(function (err, results) {
				if (err) return console.error(err);
				console.log('# Places:', results)
			})
		});

	console.log('}   dummyData()');
}
