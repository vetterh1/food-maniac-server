var expect = require("chai").expect;
var request = require("request");

describe("REST API tests", function() {
	describe("User", function() {
		describe("Get users list", function() {

			var url = "http://localhost:8080/api/users";

			it("returns status 200", function() {
				request(url, function(error, response, body) {
					expect(response.statusCode).to.equal(200);
					done();
				});
			});
			it("get 3 users", function() {
					request(url, function(error, response, body) {
					expect(body.users.length).to.equal(3);
					done();
				});
			});
		});
	});

	describe("Item", function() {

	});

	describe("Place", function() {

	});

	describe("Mark", function() {

	});

});