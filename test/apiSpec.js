//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */

import 'babel-polyfill'
//import {expect} from 'chai';


let mongoose = require("mongoose");
//let User = require('../server/models/user');
import User from '../server/models/user';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
//let server = require('../server/server');
import app from '../server/server';

let should = chai.should();

chai.use(chaiHttp);


describe('Users', () => {

	//Before each test we empty the database
    beforeEach( (done) => { 
        User.remove( {}, (err) => { 
           done();         
        });     
    });
/*
  * Test the /GET route
  */
  describe('/GET users', () => {
      it('it should GET all the users', (done) => {
        chai.request(app)
            .get('/api/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.users.should.be.a('array');
                res.body.users.length.should.be.eql(0);
              done();
            });
      });
  });

});


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