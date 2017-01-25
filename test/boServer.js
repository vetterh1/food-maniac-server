// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';

const should = chai.should();
chai.use(chaiHttp);

describe('BoServer', () => {
  it('should return 404 (only APIs)', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});