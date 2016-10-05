//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */

import 'babel-polyfill'
let mongoose = require("mongoose");
import User from '../server/models/user';
let chai = require('chai');
let chaiHttp = require('chai-http');
import app from '../server/server';
let should = chai.should();

chai.use(chaiHttp);


describe('Users', () => {

	//Before each test we empty the database
	beforeEach( (done) => { 
		User.remove( {}, () => { 
			done();         
		});     
	});


	/*
	* Test the /GET route
	*/
	describe('Users list', () => {

		it('it should return an empty list whent no user', (done) => {
			chai.request(app)
				.get('/api/users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.users.should.be.a('array');
					res.body.users.length.should.be.eql(0);
					done();
				});
		});

		it('it should list all the users', (done) => {
			let usersList = [
				{ cuid: "cuid1", login: "testLogin1", first: "testFirst1", last: "testLast1" },
				{ cuid: "cuid2", login: "testLogin2", first: "testFirst2", last: "testLast2" },
				{ cuid: "cuid3", login: "testLogin3", first: "testFirst3", last: "testLast3" },
				{ cuid: "cuid4", login: "testLogin4", first: "testFirst4", last: "testLast4" },
				{ cuid: "cuid5", login: "testLogin5", first: "testFirst5", last: "testLast5" }
			];
			User.create( usersList, () => {
				chai.request(app)
					.get('/api/users')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.users.should.be.a('array');
						res.body.users.length.should.be.eql(usersList.length);
						done();
					});
			});
		});

	});


	/*
	* Test the /POST route
	*/
	describe('User Creation', () => {
		it('it should fail creating an incomplete user', (done) => {
			chai.request(app)
				.post('/api/users')
				.send({"user": { login: "testPostLogin", first: "testPostFirst" } })
				.end((err, res) => {
					res.should.have.status(403);
					done();
				});
		});

		it('it should succeed creating a complete user', (done) => {
			let userComplete = { login: "testPostLogin", first: "testPostFirst", last: "testPostLast" };
			chai.request(app)
				.post('/api/users')
				.send({"user": userComplete})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					res.body.user.should.be.a('object');
					res.body.user.should.have.property('login');
					res.body.user.should.have.property('first');
					res.body.user.should.have.property('last');
					done();
				});
		});

		it('it should fail creating an existing user', (done) => {
			let user = new User ({ cuid: "cuidTestPost2times", login: "testPostLogin2times", first: "testPostFirst2times", last: "testPostLast2times" });
			user.save((err, user) => {
				chai.request(app)
					.post('/api/users')
					.send({"user": user})
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});

	});  /* End test the /POST route */


	/*
	* Test the /POST/:id route
	*/
	describe('User Update', () => {

		it('it should succeed updating a complete user', (done) => {
			let userOrig = new User ({ cuid: "cuidUpdate1", login: "testLoginUpdate1", first: "testFirstUpdate1", last: "testLastUpdate1" });
			let userUpdt = { login: "testLoginUpdate1.2", first: "testFirstUpdate1.2", last: "testLastUpdate1.2" };
			userOrig.save(() => {
				chai.request(app)
					.post('/api/users/cuidUpdate1')
					.send({"user": userUpdt})
					.end((err, res) => {
						console.log("upd: res body",  res.body)
						res.should.have.status(200);
						done();
					});
			});
		});

		it('it should fail updating the cuid', (done) => {
			done();
		});

		it('it should fail updating an unknown user', (done) => {
			chai.request(app)
				.post('/api/users/cuidUpdateUnknownUser')
				.send({"user": {login: "newLogin"}})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

	});  /* End test the /POST route */


	/*
	* Test the /GET/:id route
	*/
	describe('User Retrieval', () => {

		it('it should fail finding an unknown user', (done) => {
			chai.request(app)
				.get('/api/users/cuidTestUnknownUser')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should find an existing user', (done) => {
			let user = new User ({ cuid: "cuidTestPostFind", login: "testPostLoginFind", first: "testPostFirstFind", last: "testPostLastFind" });
			user.save((err, user) => {
				chai.request(app)
					.get('/api/users/cuidTestPostFind')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('user');
						res.body.user.should.be.a('object');
						res.body.user.should.have.property('login').eql(user.login);
						res.body.user.should.have.property('first').eql(user.first);
						res.body.user.should.have.property('last').eql(user.last);
						done();
					});
			});
		});
	});



});   /* Users */


/*
var request = require("request");

describe("REST API tests", () => {

	describe("User", () => {

		var nbUsers = 0;

		describe("Get users list", () => {

			var url = "http://localhost:8080/api/users";

			it("returns status 200", (done) => {
				request({url: url, json: true}, (error, response, body) => {
					expect(response.statusCode).to.be.equal(200);
					nbUsers = body.users.length;
					done();
				});
			});
			it("get at least 3 users", () => {
				expect(nbUsers).to.be.at.least(3);
			});
		});

		describe("Add user", () => {

			var url = "http://localhost:8080/api/user";

			it("returns status 200", (done) => {
				request({url: url, json: true}, (error, response) => {
					expect(response.statusCode).to.be.equal(200);
					done();
				});
			});
			it("get at least 3 users", (done) => {
					request({url: url, json: true}, (error, response, body) => {
					nbUsers = body.users.length;
					expect(body.users.length).to.be.at.least(3);
					done();
				});
			});
			it("add a new user", (done) => {
					request({url: url, json: true}, (error, response, body) => {
					expect(body.users.length).to.be.at.least(3);
					done();
				});
			});
		});

	});

	describe("Item", function() {
		describe("Get items list", () => {

			var url = "http://localhost:8080/api/items";

			it("returns status 200", (done) => {
				request({url: url, json: true}, (error, response) => {
					expect(response.statusCode).to.be.equal(200);
					done();
				});
			});
			it("get at least 6 items", (done) => {
					request({url: url, json: true}, (error, response, body) => {
					expect(body.items.length).to.be.at.least(6);
					done();
				});
			});
		});
	});

	describe("Place", function() {
		describe("Get places list", () => {

			var url = "http://localhost:8080/api/places";

			it("returns status 200", (done) => {
				request({url: url, json: true}, (error, response) => {
					expect(response.statusCode).to.be.equal(200);
					done();
				});
			});
			it("get at least 9 places", (done) => {
					request({url: url, json: true}, (error, response, body) => {
					expect(body.places.length).to.be.at.least(9);
					done();
				});
			});
		});
	});

	describe("Mark", function() {

	});

});
*/