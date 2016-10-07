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

import Mark from '../server/models/mark';


describe('API Marks', () => {

	//Before each test we empty the database
	beforeEach( (done) => { 
		Mark.remove( {}, () => { 
			done();         
		});     
	});


	/*
	* Test the /GET route
	*/
	describe('Marks list', () => {

		it('it should return an empty list whent no place', (done) => {
			chai.request(app)
				.get('/api/marks')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.marks.should.be.a('array');
					res.body.marks.length.should.be.eql(0);
					done();
				});
		});

		it('it should list all the marks', (done) => {
			let marksList = [
				{mark:1, cuid: 'cuidTestMark1'},
				{mark:2, cuid: 'cuidTestMark2'},
				{mark:3, cuid: 'cuidTestMark3'},
				{mark:4, cuid: 'cuidTestMark4'}
			];
			Mark.create( marksList, () => {
				chai.request(app)
					.get('/api/marks')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.marks.should.be.a('array');
						res.body.marks.length.should.be.eql(marksList.length);
						done();
					});
			});
		});

	});


	/*
	* Test the /POST route
	*/
	describe('Mark Creation', () => {

		it('it should fail creating an incomplete mark', (done) => {
			chai.request(app)
				.post('/api/marks')
				.send({"mark": {} })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should succeed creating a complete mark', (done) => {
			let markComplete = { mark: 18 };
			chai.request(app)
				.post('/api/marks')
				.send({"mark": markComplete})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('mark');
					res.body.mark.should.be.a('object');
					res.body.mark.should.have.property('mark').eql(markComplete.mark);
					done();
				});
		});

		it('it should fail creating an existing mark', (done) => {
			let mark = new Mark ({ cuid: "cuidTestPost2times", mark: 25 });
			mark.save((err, mark) => {
				chai.request(app)
					.post('/api/marks')
					.send({"mark": mark})
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
		});

		it('it should fail creating with wrong mark info', (done) => {
			chai.request(app)
				.post('/api/marks')
				.send({"WRONG_mark": { mark: 32 } })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

	});  /* End test the /POST route */


	/*
	* Test the /POST/:cuid route
	*/
	describe('Mark Update', () => {

		it('it should succeed updating a complete mark', (done) => {
			let markOrig = new Mark ({ cuid: "cuidUpdate1", mark: 40 });
			let markUpdt = { mark: 50 };
			markOrig.save(() => {
				chai.request(app)
					.post('/api/marks/cuidUpdate1')
					.send({"mark": markUpdt})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('mark');
						res.body.mark.should.be.a('object');
						res.body.mark.should.have.property('mark').eql(markUpdt.mark);
						done();
					});
			});
		});

		it('it should fail updating the cuid', (done) => {
			let markOrig = new Mark ({ cuid: "cuidUpdateCuid", mark: 64 });
			markOrig.save(() => {
				chai.request(app)
					.post('/api/marks/cuidUpdateCuid')
					.send({"mark": { cuid: "cuidUpdateCuid2" }})
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});

		it('it should fail updating an unknown mark', (done) => {
			chai.request(app)
				.post('/api/marks/cuidUpdateUnknownMark')
				.send({"mark": {mark: 75}})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});
		
		it('it should fail updating with wrong mark info', (done) => {
			let markOrig = new Mark ({ cuid: "cuidUpdateIncomplete", mark: 82 });
			markOrig.save(() => {
				chai.request(app)
					.post('/api/marks/cuidUpdateIncomplete')
					.send({"WRONG_mark": {mark: 86}})
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
	describe('Mark Retrieval', () => {

		it('it should fail finding an unknown mark', (done) => {
			chai.request(app)
				.get('/api/marks/cuidTestUnknownMark')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should find an existing mark', (done) => {
			let mark = new Mark ({ cuid: "cuidTestRetreive", mark: 92 });
			mark.save((err, mark) => {
				chai.request(app)
					.get('/api/marks/cuidTestRetreive')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('mark');
						res.body.mark.should.be.a('object');
						res.body.mark.should.have.property('mark').eql(mark.mark);
						done();
					});
			});
		});
	});


	/*
	* Test the /DELETE/:cuid route
	*/
	describe('Mark Deletion', () => {

		it('it should fail deleting an unknown mark', (done) => {
			chai.request(app)
				.delete('/api/marks/cuidTestDeleteUnknown')
				.send({})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});

		it('it should delete an existing mark', (done) => {
			let mark = new Mark ({ cuid: "cuidTestDelete", mark: 92 });
			mark.save(() => {
				chai.request(app)
					.delete('/api/marks/cuidTestDelete')
					.send({})
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});

});   /* Marks */
