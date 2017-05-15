/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import MarkIndividual from '../server/models/markIndividual';
// import Item from '../server/models/item';
// import Place from '../server/models/place';
import * as td from './testData';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const should = chai.should();
chai.use(chaiHttp);

global.items = [];
global.places = [];

describe('API MarkIndividual', () => {
  // Before each test we empty the database & fill it with test data
  beforeEach((done) => { td.loadTestData(done); });


  /*
  * Test the /GET route
  */
  describe('MarkIndividual list', () => {
    it('should return an empty list when no MarkIndividual', (done) => {
      chai.request(app)
        .get('/api/markIndividuals')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.markIndividuals.should.be.a('array');
          res.body.markIndividuals.length.should.be.eql(0);
          done();
        });
    });

    it('should list all the markIndividuals', (done) => {
      MarkIndividual.create(td.testMarkIndividuals, () => {
        chai.request(app)
          .get('/api/markIndividuals')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.markIndividuals.should.be.a('array');
            res.body.markIndividuals.length.should.be.eql(td.testMarkIndividuals.length);
            // Verify that the virtuals are added to this schema (the_schema.set('toJSON', { virtuals: true, });)
            res.body.markIndividuals[0].id.should.be.eql(res.body.markIndividuals[0]._id);
            done();
          });
      });
    });
  });




  /*
  * Test the /POST route
  */
  describe('MarkIndividual Creation', () => {
    it('should fail creating an incomplete mark', (done) => {
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: {} })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should succeed creating an individual mark (no test on aggregate)', (done) => {
      const markIndividualTest = { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 2, location: { type: 'Point', coordinates: [40.73061, -73.935242] } };
      chai.request(app)
          .post('/api/markIndividuals')
          .send({ markIndividual: markIndividualTest })
          .end((err, res) => {
            // console.log('res.body.markIndividual=', res.body.markIndividual);
            // console.log('res.body.markAggregate=', res.body.markAggregate);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('markIndividual');
            res.body.should.have.property('markAggregate');
            res.body.markIndividual.should.be.a('object');
            res.body.markIndividual.should.have.property('markOverall').eql(markIndividualTest.markOverall);
            res.body.markIndividual.markOverall.should.be.a('number');
            res.body.markAggregate.should.be.a('object');
            res.body.markAggregate.should.have.property('markOverall').eql(markIndividualTest.markOverall);
            res.body.markAggregate.should.have.property('location');
            res.body.markAggregate.markOverall.should.be.a('number');
            done();
          });
    });

    it('should not fail creating a mark twice, aggregate should have nbMarksOverall = 2', (done) => {
      const markIndividual = { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 2 };
      chai.request(app)
          .post('/api/markIndividuals')
          .send({ markIndividual })
          .end(() => {
            chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual })
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('markIndividual');
                  res.body.should.have.property('markAggregate');
                  res.body.markIndividual.should.be.a('object');
                  res.body.markIndividual.should.have.property('markOverall').eql(markIndividual.markOverall);
                  res.body.markIndividual.markOverall.should.be.a('number');
                  res.body.markAggregate.should.be.a('object');
                  res.body.markAggregate.should.have.property('markOverall').eql(markIndividual.markOverall);
                  res.body.markAggregate.should.have.property('nbMarksOverall').equal(2);
                  done();
                });
          });
    });

    it('should fail creating with wrong mark info', (done) => {
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ WRONG_mark: { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3 } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */





  /*
  * Test the /POST/:_id route
  */

  describe('Mark Update', () => {
    it('should succeed updating a complete mark', (done) => {
      const markOrig = new MarkIndividual({ markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3, location: { type: 'Point', coordinates: [40.73061, -73.935242] } });
      const markUpdt = { markOverall: 1 };
      markOrig.save((errSaving, markSaved) => {
        chai.request(app)
          .post(`/api/markIndividuals/id/${markSaved._id}`)
          .send({ markIndividual: markUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('markIndividual');
            res.body.markIndividual.should.be.a('object');
            res.body.markIndividual.should.have.property('markOverall').eql(markUpdt.markOverall);
            res.body.markIndividual.markOverall.should.be.a('number');
            done();
          });
      });
    });

    it('should fail updating the _id', (done) => {
      const markOrig = new MarkIndividual({ markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3, location: { type: 'Point', coordinates: [40.73061, -73.935242] } });
      markOrig.save((errSaving, markSaved) => {
        chai.request(app)
          .post(`/api/markIndividuals/id/${markSaved._id}`)
          .send({ markIndividual: { _id: '58aaa000888555aaabda2227' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('should fail updating an unknown mark', (done) => {
      chai.request(app)
        .post('/api/markIndividuals/id/58aaa000888555aaabda2221')
        .send({ markIndividual: { markOverall: 1 } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should fail updating with wrong mark info', (done) => {
      const markOrig = new MarkIndividual({ markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3, location: { type: 'Point', coordinates: [40.73061, -73.935242] } });
      markOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/markIndividuals/id/${itemSaved._id}`)
          .send({ WRONG_mark: { markOverall: 1 } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
  });  /* End test the /POST/:_id route */


  /*
  * Test the /DELETE/:_id route
  */
  describe('Mark Deletion', () => {
    it('should fail deleting an unknown mark', (done) => {
      chai.request(app)
        .delete('/api/markIndividuals/id/58aaa000888555aaabdaf555')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should delete an existing mark', (done) => {
      const mark = new MarkIndividual({ markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3, location: { type: 'Point', coordinates: [40.73061, -73.935242] } });
      mark.save((errSaving, markSaved) => {
        chai.request(app)
          .delete(`/api/markIndividuals/id/${markSaved._id}`)
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });


});   /* MarkIndividual */
