/* global describe it */

import 'babel-polyfill'
import {expect} from 'chai';
var request = require("request");


describe("REST API tests", () => {
	describe("User", () => {
		describe("Get users list", () => {

			var url = "http://localhost:8080/api/users";

			it("returns status 200", (done) => {
				request(url, (error, response) => {
					expect(response.statusCode).to.be.equal(200);
					done();
				});
			});
			it("get at least 3 users", (done) => {
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
				request(url, (error, response) => {
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
				request(url, (error, response) => {
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