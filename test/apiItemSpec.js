//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */

import 'babel-polyfill'
let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
import app from '../server/server';
let should = chai.should();
chai.use(chaiHttp);

import Item from '../server/models/item';


describe('API Items', () => {

	//Before each test we empty the database
	beforeEach( (done) => { 
		Item.remove( {}, () => { 
			done();         
		});     
	});


	/*
	* Test the /GET route
	*/
	describe('Items list', () => {

		it('it should return an empty list whent no place', (done) => {
			chai.request(app)
				.get('/api/items')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.items.should.be.a('array');
					res.body.items.length.should.be.eql(0);
					done();
				});
		});

		it('it should list all the items', (done) => {
			let itemsList = [
				{name:'testItem1', cuid: 'cuidTestItem1'},
				{name:'testItem2', cuid: 'cuidTestItem2'},
				{name:'testItem3', cuid: 'cuidTestItem3'},
				{name:'testItem4', cuid: 'cuidTestItem4'},
				{name:'testItem5', cuid: 'cuidTestItem5'},
				{name:'testItem6', cuid: 'cuidTestItem6'},
				{name:'testItem7', cuid: 'cuidTestItem7'},
				{name:'testItem8', cuid: 'cuidTestItem8'},
				{name:'testItem9', cuid: 'cuidTestItem9'},
				{name:'testItem10', cuid: 'cuidTestItem10'},
				{name:'testItem11', cuid: 'cuidTestItem11'},
				{name:'testItem12', cuid: 'cuidTestItem12'}
			];
			Item.create( itemsList, () => {
				chai.request(app)
					.get('/api/items')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.items.should.be.a('array');
						res.body.items.length.should.be.eql(itemsList.length);
						done();
					});
			});
		});

	});


	/*
	* Test the /POST route
	*/
	describe('Item Creation', () => {

		it('it should fail creating an incomplete item', (done) => {
			chai.request(app)
				.post('/api/items')
				.send({"item": {} })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should succeed creating a complete item', (done) => {
			let itemComplete = { name: "testPostName" };
			chai.request(app)
				.post('/api/items')
				.send({"item": itemComplete})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('item');
					res.body.item.should.be.a('object');
					res.body.item.should.have.property('name').eql(itemComplete.name);
					done();
				});
		});

		it('it should fail creating an existing item', (done) => {
			let item = new Item ({ cuid: "cuidTestPost2times", name: "testPostname2times" });
			item.save((err, item) => {
				chai.request(app)
					.post('/api/items')
					.send({"item": item})
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});

		it('it should fail creating with wrong item info', (done) => {
			chai.request(app)
				.post('/api/items')
				.send({"WRONG_item": { name: "testPostname" } })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

	});  /* End test the /POST route */


	/*
	* Test the /POST/:cuid route
	*/
	describe('Item Update', () => {

		it('it should succeed updating a complete item', (done) => {
			let itemOrig = new Item ({ cuid: "cuidUpdate1", name: "testnameUpdate1" });
			let itemUpdt = { name: "testnameUpdate1.2" };
			itemOrig.save(() => {
				chai.request(app)
					.post('/api/items/cuidUpdate1')
					.send({"item": itemUpdt})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('item');
						res.body.item.should.be.a('object');
						res.body.item.should.have.property('name').eql(itemUpdt.name);
						done();
					});
			});
		});

		it('it should fail updating the cuid', (done) => {
			let itemOrig = new Item ({ cuid: "cuidUpdateCuid", name: "testnameUpdateCuid" });
			itemOrig.save(() => {
				chai.request(app)
					.post('/api/items/cuidUpdateCuid')
					.send({"item": { cuid: "cuidUpdateCuid2" }})
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});

		it('it should fail updating an unknown item', (done) => {
			chai.request(app)
				.post('/api/items/cuidUpdateUnknownItem')
				.send({"item": {name: "newname"}})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});
		
		it('it should fail updating with wrong item info', (done) => {
			let itemOrig = new Item ({ cuid: "cuidUpdateIncomplete", name: "testNameUpdateIncomplete" });
			itemOrig.save(() => {
				chai.request(app)
					.post('/api/items/cuidUpdateIncomplete')
					.send({"WRONG_item": {name: "newName"}})
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});

	});  /* End test the /POST/:cuid route */


	/*
	* Test the /GET/:cuid route
	*/
	describe('Item Retrieval', () => {

		it('it should fail finding an unknown item', (done) => {
			chai.request(app)
				.get('/api/items/cuidTestUnknownItem')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should find an existing item', (done) => {
			let item = new Item ({ cuid: "cuidTestRetreive", name: "testRetreiveName" });
			item.save((err, item) => {
				chai.request(app)
					.get('/api/items/cuidTestRetreive')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('item');
						res.body.item.should.be.a('object');
						res.body.item.should.have.property('name').eql(item.name);
						done();
					});
			});
		});
	});



	/*
	* Test the /DELETE/:cuid route
	*/
	describe('Item Deletion', () => {

		it('it should fail deleting an unknown item', (done) => {
			chai.request(app)
				.delete('/api/items/cuidTestDeleteUnknown')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should delete an existing item', (done) => {
			let item = new Item ({ cuid: "cuidTestDelete", name: "testDeleteName" });
			item.save(() => {
				chai.request(app)
					.delete('/api/items/cuidTestDelete')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});   /* Items */
