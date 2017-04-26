/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import MarkIndividual from '../server/models/markIndividual';
import Item from '../server/models/item';
import Place from '../server/models/place';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const should = chai.should();
chai.use(chaiHttp);

global.items = [];
global.places = [];

describe('API MarkIndividual', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    MarkIndividual.remove({})
    .then(() => { return Item.remove({}); }, () => { console.log('error on removing marks'); })
    .then(() => { return Place.remove({}); }, () => { console.log('error on removing items'); })
    .then(
      // Create fake items for use in marks
      () => {
        return Item.create([
          { category: 'testCat1', kind: 'testKind1', name: 'item1 location is FR seclin atos', location: { type: 'Point', coordinates: [50.5679449, 3.0237092999999997] } },
          { category: 'testCat1', kind: 'testKind1', name: 'item2 location is FR lille home', location: { type: 'Point', coordinates: [50.6403954, 3.0651635000000397] } },
        ]);
      },
      () => { console.log('error on removing places'); }
    )
    .then(
      // Create fake places for use in marks
      (items) => {
        global.items = items; // save created items in global variable for access in tests
        return Place.create([
          { name: 'globalPlace1', googleMapId: 'googleMapIdGlobalPlace1', location: { type: 'Point', coordinates: [40.73061, -73.935242] } },
          { name: 'globalPlace2', googleMapId: 'googleMapIdGlobalPlace2', location: { type: 'Point', coordinates: [38.73061, -73.935242] } },
          { name: 'globalPlace3', googleMapId: 'googleMapIdGlobalPlace3', location: { type: 'Point', coordinates: [36.73061, -73.935242] } },
        ]);
      },
      () => { console.log('error on creating global item'); }
    )
    .then((places) => {
      global.places = places; // save created places in global variable for access in tests
      return done();
    }, () => { console.log('error on creating global places'); });
  });


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
      const marksList = [
        { markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3 },
        { markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3 },
        { markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3 },
        { markAggregate: '58aaa000888555aaabd00000', user: '58aaa000888555aaabd00001', markOverall: 3 },
      ];
      MarkIndividual.create(marksList, () => {
        chai.request(app)
          .get('/api/markIndividuals')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.markIndividuals.should.be.a('array');
            res.body.markIndividuals.length.should.be.eql(marksList.length);
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
      const markIndividualTest = { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 2 };
      chai.request(app)
          .post('/api/markIndividuals')
          .send({ markIndividual: markIndividualTest })
          .end((err, res) => {
          // console.log('res.body.mark=', res.body.mark);
          // console.log('res.body.mark.marks[0]=', res.body.mark.marks[0]);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('markIndividual');
          res.body.should.have.property('markAggregate');
          res.body.markIndividual.should.be.a('object');
          res.body.markIndividual.should.have.property('markOverall').eql(markIndividualTest.markOverall);
          res.body.markIndividual.markOverall.should.be.a('number');
          res.body.markAggregate.should.be.a('object');
          res.body.markAggregate.should.have.property('markOverall').eql(markIndividualTest.markOverall);
          res.body.markAggregate.markOverall.should.be.a('number');
          done();
        });
    });

    it('should not fail creating a mark twice, aggregate should have nbMarksOverall = 2', (done) => {
      const markIndividual = { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 2 };
      chai.request(app)
          .post('/api/markIndividuals')
          .send({ markIndividual })
          .end((err, res1) => {
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

});   /* MarkIndividual */
