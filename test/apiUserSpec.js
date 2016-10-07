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

import User from '../server/models/user';
import Place from '../server/models/place';
import Item from '../server/models/item';


describe('API Users', () => {

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
					res.should.have.status(400);
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
					res.body.user.should.have.property('login').eql(userComplete.login);
					res.body.user.should.have.property('first').eql(userComplete.first);
					res.body.user.should.have.property('last').eql(userComplete.last);
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

		it('it should fail creating with wrong user info', (done) => {
			chai.request(app)
				.post('/api/users')
				.send({"WRONG_user": { login: "testPostLogin", first: "testPostFirst", last: "testPostLast" } })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

	});  /* End test the /POST route */


	/*
	* Test the /POST/:cuid route
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
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('user');
						res.body.user.should.be.a('object');
						res.body.user.should.have.property('login').eql(userUpdt.login);
						res.body.user.should.have.property('first').eql(userUpdt.first);
						res.body.user.should.have.property('last').eql(userUpdt.last);
						done();
					});
			});
		});

		it('it should fail updating the cuid', (done) => {
			let userOrig = new User ({ cuid: "cuidUpdateCuid", login: "testLoginUpdateCuid", first: "testFirstUpdateCuid", last: "testLastUpdateCuid" });
			userOrig.save(() => {
				chai.request(app)
					.post('/api/users/cuidUpdateCuid')
					.send({"user": { cuid: "cuidUpdateCuid2" }})
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
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
		
		it('it should fail updating with wrong user info', (done) => {
			let userOrig = new User ({ cuid: "cuidUpdateIncomplete", login: "testLoginUpdateIncomplete", first: "testFirstUpdateIncomplete", last: "testLastUpdateIncomplete" });
			userOrig.save(() => {
				chai.request(app)
					.post('/api/users/cuidUpdateIncomplete')
					.send({"WRONG_user": {login: "newLogin"}})
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
			let user = new User ({ cuid: "cuidTestRetreive", login: "testRetreiveLogin", first: "testRetreiveFirst", last: "testRetreiveLast" });
			user.save((err, user) => {
				chai.request(app)
					.get('/api/users/cuidTestRetreive')
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

	/*
	* Test the /DELETE/:cuid route
	*/
	describe('User Deletion', () => {

		it('it should fail deleteing an unknown user', (done) => {
			chai.request(app)
				.delete('/api/users/cuidTestDeleteUnknown')
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should delete an existing user', (done) => {
			let user = new User ({ cuid: "cuidTestDelete", login: "testDeleteLogin", first: "testDeleteFirst", last: "testDeleteLast" });
			user.save(() => {
				chai.request(app)
					.delete('/api/users/cuidTestDelete')
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});

});   /* Users */

