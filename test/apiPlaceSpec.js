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

import Place from '../server/models/place';


describe('API Places', () => {

	//Before each test we empty the database
	beforeEach( (done) => { 
		Place.remove( {}, () => { 
			done();         
		});     
	});


	/*
	* Test the /GET route
	*/
	describe('Places list', () => {

		it('it should return an empty list whent no place', (done) => {
			chai.request(app)
				.get('/api/places')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.places.should.be.a('array');
					res.body.places.length.should.be.eql(0);
					done();
				});
		});

		it('it should list all the places', (done) => {
			let placesList = [
				{name:'testPlace1', cuid: 'cuidTestPlace1'},
				{name:'testPlace2', cuid: 'cuidTestPlace2'},
				{name:'testPlace3', cuid: 'cuidTestPlace3'},
				{name:'testPlace4', cuid: 'cuidTestPlace4'},
				{name:'testPlace5', cuid: 'cuidTestPlace5'},
				{name:'testPlace6', cuid: 'cuidTestPlace6'},
				{name:'testPlace7', cuid: 'cuidTestPlace7'},
				{name:'testPlace8', cuid: 'cuidTestPlace8'},
				{name:'testPlace9', cuid: 'cuidTestPlace9'}
			];
			Place.create( placesList, () => {
				chai.request(app)
					.get('/api/places')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.places.should.be.a('array');
						res.body.places.length.should.be.eql(placesList.length);
						done();
					});
			});
		});

	});


	/*
	* Test the /POST route
	*/
	describe('Place Creation', () => {

		it('it should fail creating an incomplete place', (done) => {
			chai.request(app)
				.post('/api/places')
				.send({"place": {} })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should succeed creating a complete place', (done) => {
			let placeComplete = { name: "testPostName" };
			chai.request(app)
				.post('/api/places')
				.send({"place": placeComplete})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('place');
					res.body.place.should.be.a('object');
					res.body.place.should.have.property('name').eql(placeComplete.name);
					done();
				});
		});

		it('it should fail creating an existing place', (done) => {
			let place = new Place ({ cuid: "cuidTestPost2times", name: "testPostname2times" });
			place.save((err, place) => {
				chai.request(app)
					.post('/api/places')
					.send({"place": place})
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});

		it('it should fail creating with wrong place info', (done) => {
			chai.request(app)
				.post('/api/places')
				.send({"WRONG_place": { name: "testPostname" } })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

	});  /* End test the /POST route */


	/*
	* Test the /POST/:cuid route
	*/
	describe('Place Update', () => {

		it('it should succeed updating a complete place', (done) => {
			let placeOrig = new Place ({ cuid: "cuidUpdate1", name: "testnameUpdate1" });
			let placeUpdt = { name: "testnameUpdate1.2" };
			placeOrig.save(() => {
				chai.request(app)
					.post('/api/places/cuidUpdate1')
					.send({"place": placeUpdt})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('place');
						res.body.place.should.be.a('object');
						res.body.place.should.have.property('name').eql(placeUpdt.name);
						done();
					});
			});
		});

		it('it should fail updating the cuid', (done) => {
			let placeOrig = new Place ({ cuid: "cuidUpdateCuid", name: "testnameUpdateCuid" });
			placeOrig.save(() => {
				chai.request(app)
					.post('/api/places/cuidUpdateCuid')
					.send({"place": { cuid: "cuidUpdateCuid2" }})
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});

		it('it should fail updating an unknown place', (done) => {
			chai.request(app)
				.post('/api/places/cuidUpdateUnknownPlace')
				.send({"place": {name: "newname"}})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});
		
		it('it should fail updating with wrong place info', (done) => {
			let placeOrig = new Place ({ cuid: "cuidUpdateIncomplete", name: "testNameUpdateIncomplete" });
			placeOrig.save(() => {
				chai.request(app)
					.post('/api/places/cuidUpdateIncomplete')
					.send({"WRONG_place": {name: "newName"}})
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
	describe('Place Retrieval', () => {

		it('it should fail finding an unknown place', (done) => {
			chai.request(app)
				.get('/api/places/cuidTestUnknownPlace')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should find an existing place', (done) => {
			let place = new Place ({ cuid: "cuidTestRetreive", name: "testRetreiveName" });
			place.save((err, place) => {
				chai.request(app)
					.get('/api/places/cuidTestRetreive')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('place');
						res.body.place.should.be.a('object');
						res.body.place.should.have.property('name').eql(place.name);
						done();
					});
			});
		});
	});

	/*
	* Test the /DELETE/:cuid route
	*/
	describe('Place Deletion', () => {

		it('it should fail deleting an unknown place', (done) => {
			chai.request(app)
				.delete('/api/places/cuidTestDeleteUnknown')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should delete an existing place', (done) => {
			let place = new Place ({ cuid: "cuidTestDelete", name: "testDeleteName" });
			place.save(() => {
				chai.request(app)
					.delete('/api/places/cuidTestDelete')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});

});   /* Places */
