/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "mongoose" }]*/

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
	new Item({name:'testItem4', cuid: 'cuidTestItem4'}),
	new Item({name:'testItem5', cuid: 'cuidTestItem5'}),
	new Item({name:'testItem6', cuid: 'cuidTestItem6'})
];

export var testPlaces = [
	new Place({name:'testPlace1', cuid: 'cuidTestPlace1'}),
	new Place({name:'testPlace2', cuid: 'cuidTestPlace2'}),
	new Place({name:'testPlace3', cuid: 'cuidTestPlace3'}),
	new Place({name:'testPlace4', cuid: 'cuidTestPlace4'}),
	new Place({name:'testPlace5', cuid: 'cuidTestPlace5'}),
	new Place({name:'testPlace6', cuid: 'cuidTestPlace6'}),
	new Place({name:'testPlace7', cuid: 'cuidTestPlace7'}),
	new Place({name:'testPlace8', cuid: 'cuidTestPlace8'}),
	new Place({name:'testPlace9', cuid: 'cuidTestPlace9'})
];

export default function insertTestData() {

	console.log('{   insertTestData()');

	User.count().exec((err, count) => {

		// if (count > 0) {
		// 	console.log('       no need to add test data: nb users=' + count);
		// 	console.log('}   insertTestData()');
		// 	return;
		// }

		console.log('       Add test data');

		// Create test users after removing any existing one
		User.find({login: /^testUser/}).remove().exec()
			.then( User.create(testUsers, function (err) {
							if(err)
								console.log('    User.create err=', err);
						}
					)
			)

		// Create new test items after removing any existing one
			.then( Item.find({name: /^testItem/}).remove().exec() )
			.then( Item.create(testItems, function (err) {
							if(err)
								console.log('    Item.create err=', err);
						}
					)
			)

		// Create new test places after removing any existing one
			.then( Place.find({name: /^testPlace/}).remove().exec() )
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

		console.log('}   insertTestData()');
	});
}
