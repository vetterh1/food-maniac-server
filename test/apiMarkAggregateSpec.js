/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import MarkAggregate from '../server/models/markAggregate';
// import Item from '../server/models/item';
// import Place from '../server/models/place';
import * as td from './testData';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const should = chai.should();
chai.use(chaiHttp);

global.items = [];
global.places = [];

describe('API MarkAggregate', () => {
  // Before each test we empty the database & fill it with test data
  beforeEach((done) => { td.loadTestData(done); });


  /*
  * Test the /GET route
  */
  describe('MarkAggregates list', () => {
    it('should return an empty list when no markAggregates', (done) => {
      chai.request(app)
        .get('/api/markAggregates')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.markAggregates.should.be.a('array');
          res.body.markAggregates.length.should.be.eql(0);
          done();
        });
    });

    it('should list all the markAggregates', (done) => {
      MarkAggregate.create(td.testMarkAggregates, () => {
        chai.request(app)
          .get('/api/markAggregates')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.markAggregates.should.be.a('array');
            res.body.markAggregates.length.should.be.eql(td.testMarkAggregates.length);
            // Verify that the virtuals are added to this schema (the_schema.set('toJSON', { virtuals: true, });)
            res.body.markAggregates[0].id.should.be.eql(res.body.markAggregates[0]._id);
            done();
          });
      });
    });
  });



  /*
  * Test the /POST/:_id route
  */
  describe('MarkAggregate Update', () => {
    it('should succeed updating a complete markAggregate', (done) => {
      const markOrig = new MarkAggregate(td.testMarkAggregates[0]);
      const markUpdt = { markOverall: 1 };
      markOrig.save((errSaving, markSaved) => {
        chai.request(app)
          .post(`/api/markAggregates/id/${markSaved._id}`)
          .send({ markAggregate: markUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('markAggregate');
            res.body.markAggregate.should.be.a('object');
            res.body.markAggregate.should.have.property('markOverall').eql(markUpdt.markOverall);
            res.body.markAggregate.markOverall.should.be.a('number');
            done();
          });
      });
    });

    it('should fail updating the _id', (done) => {
      const markOrig = new MarkAggregate(td.testMarkAggregates[0]);
      markOrig.save((errSaving, markSaved) => {
        chai.request(app)
          .post(`/api/markAggregates/id/${markSaved._id}`)
          .send({ markAggregate: { _id: '58aaa000888555aaabda2227' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('should fail updating an unknown markAggregate', (done) => {
      chai.request(app)
        .post('/api/markAggregates/id/58aaa000888555aaabda2221')
        .send({ markAggregate: { markOverall: 1 } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should fail updating with wrong markAggregate info', (done) => {
      const markOrig = new MarkAggregate(td.testMarkAggregates[0]);
      markOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/markAggregates/id/${itemSaved._id}`)
          .send({ WRONG_mark: td.testMarkAggregates[0] })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
  });  /* End test the /POST/:_id route */


  /*
  * Test the /GET/:_id route
  */
  describe('MarkAggregate Retrieval', () => {
    it('should fail finding an unknown markAggregate', (done) => {
      chai.request(app)
        .get('/api/markAggregates/id/58aaa000888555aaabdafbbb')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should find an existing markAggregate', (done) => {
      const mark = new MarkAggregate(td.testMarkAggregates[0]);
      mark.save((err, markSaved) => {
        chai.request(app)
          .get(`/api/markAggregates/id/${markSaved._id}`)
          .send({})
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('markAggregate');
            res.body.markAggregate.should.be.a('object');
            res.body.markAggregate.should.have.property('markOverall').eql(markSaved.markOverall);
            res.body.markAggregate.markOverall.should.be.a('number');
            done();
          });
      });
    });
  });


  /*
  * Test the /GET /itemId/... route
  */
  describe('MarkAggregate Retrieval by Item and Distance', () => {
    it('should fail finding markAggregate for an unknown item (no distance check)', (done) => {
      chai.request(app)
        .get('/api/markAggregates/itemId/59004d52def0000000000000/maxDistance/0/lat/0/lng/0')
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('markAggregates');
          res.body.markAggregates.should.be.an('array');
          res.body.markAggregates.length.should.be.eql(0);
          done();
        });
    });

    it('should find 2 aggregated marks for two items with different item+place marks (no distance check)', (done) => {
      const markIndividualTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 2 },
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, markPlace: 4 },
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markIndividualTests[0] })
        .end((err, savedMarkIndividual1) => {
          // console.log('savedMarkIndividual1 err: ', err);
          // console.log('savedMarkIndividual1.body: ', savedMarkIndividual1.body);
          markIndividualTests[0].aggregatedId = savedMarkIndividual1.body.markAggregate._id;
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markIndividualTests[1] })
            .end((er2, savedMarkIndividual2) => {
              markIndividualTests[1].aggregatedId = savedMarkIndividual2.body.markAggregate._id;
              chai.request(app)
                .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/0/lat/0/lng/0`)
                .send({})
                .end((err3, res) => {
                  markIndividualTests[0].aggregatedId.should.not.be.equal(markIndividualTests[1].aggregatedId);
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('markAggregates');
                  res.body.markAggregates.should.be.an('array');
                  res.body.markAggregates.length.should.be.eql(2);
                  res.body.markAggregates[0].should.be.a('object');
                  res.body.markAggregates[0].should.have.property('_id').to.be.oneOf([markIndividualTests[0].aggregatedId, markIndividualTests[1].aggregatedId]);
                  res.body.markAggregates[0].should.have.property('markOverall').to.be.oneOf([markIndividualTests[0].markOverall, markIndividualTests[1].markOverall]);
                  res.body.markAggregates[0].markOverall.should.be.a('number');
                  done();
                });
            });
        });
    });

    it('should find only one aggregated mark for 2 markAggregates of the same item+place (no distance check)', (done) => {
      const markIndividualTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 4 },
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 5, markFood: 2, markPlace: 3 },
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markIndividualTests[0] })
        .end((err, savedMarkIndividual1) => {
          // console.log('savedMarkIndividual1.body=', savedMarkIndividual1.body);
          markIndividualTests[0].aggregatedId = savedMarkIndividual1.body.markAggregate._id;
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markIndividualTests[1] })
            .end((err2, savedMarkIndividual2) => {
              // console.log('savedMarkIndividual1.body=', savedMarkIndividual2.body);
              markIndividualTests[1].aggregatedId = savedMarkIndividual2.body.markAggregate._id;
              chai.request(app)
                .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/0/lat/0/lng/0`)
                .send({})
                .end((err3, res) => {
                  // console.log('res.body=', res.body);
                  markIndividualTests[0].aggregatedId.should.be.equal(markIndividualTests[1].aggregatedId);
                  res.should.have.status(200);
                  res.body.markAggregates.length.should.be.eql(1);
                  res.body.markAggregates[0].markOverall.should.be.a('number').equal(4);
                  res.body.markAggregates[0].markFood.should.be.a('number').equal(3);
                  res.body.markAggregates[0].markPlace.should.be.a('number').equal(3);
                  res.body.markAggregates[0].should.have.property('_id').to.be.equal(markIndividualTests[0].aggregatedId);
                  done();
                });
            });
        });
    });

    it('should find only close restaurants (one out of two - range: 10m)', (done) => {
      const markIndividualTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0651635000000397, 50.6403954] } }, // restaurant Papa Raffaele
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 3, location: { type: 'Point', coordinates: [3.0653016999999636, 50.6402057] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markIndividualTests[0] })
        .end((err, resMarkAggregate1) => {
          // console.log('resMarkAggregate1.body=', resMarkAggregate1.body);
          markIndividualTests[0].aggregatedId = resMarkAggregate1.body.markAggregate._id;
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markIndividualTests[1] })
            .end((err2, resMarkAggregate2) => {
              // console.log('resMarkAggregate2.body=', resMarkAggregate2.body);
              markIndividualTests[1].aggregatedId = resMarkAggregate2.body.markAggregate._id;
              chai.request(app)
                .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/10/lat/50.6403954/lng/3.0651635000000397`) // at Papa Raffaele
                .send({})
                .end((err3, res) => {
                  // console.log('res.body=', res.body);
                  res.should.have.status(200);
                  res.body.markAggregates.length.should.be.eql(1);
                  res.body.markAggregates[0].should.have.property('_id').to.be.equal(markIndividualTests[0].aggregatedId);
                  res.body.markAggregates[0].should.have.property('markOverall').to.be.equal(5);
                  done();
                });
            });
        });
    });

    it('should find no result if too far and max distance too short (800m)', (done) => {
      const markIndividualTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, location: { type: 'Point', coordinates: [3.0177912000000333, 50.5750322] } }, // restaurant Les Rois Fainéants
        { item: global.items[1]._id, place: global.places[0]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0326840000000175, 50.5577246] } }, // restaurant l'Expresso
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0653016999999636, 50.6402057] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markIndividualTests[0] })
        .end(() => {
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markIndividualTests[1] })
            .end(() => {
              chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual: markIndividualTests[2] })
                .end(() => {
                  chai.request(app)
                    .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/800/lat/50.5679449/lng/3.0237092999999997`) // Worldline LP3 (btw the 2 first restaurants)
                    .send({})
                    .end((err4, res) => {
                      // console.log('res.body=', res.body);
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('markAggregates');
                      res.body.markAggregates.should.be.an('array');
                      res.body.markAggregates.length.should.be.eql(0);
                      done();
                    });
                });
            });
        });
    });

    it('should now find 2 markAggregates when max distance increased (7000m)', (done) => {
      const markIndividualTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, location: { type: 'Point', coordinates: [3.0177912000000333, 50.5750322] } }, // restaurant Les Rois Fainéants
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0326840000000175, 50.5577246] } }, // restaurant l'Expresso
        { item: global.items[0]._id, place: global.places[2]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0653016999999636, 50.6402057] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markIndividualTests[0] })
        .end(() => {
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markIndividualTests[1] })
            .end(() => {
              chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual: markIndividualTests[2] })
                .end(() => {
                  chai.request(app)
                    .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/7000/lat/50.5679449/lng/3.0237092999999997`) // Worldline LP3 (btw the 2 first restaurants)
                    .send({})
                    .end((err4, res) => {
                      res.should.have.status(200);
                      res.body.markAggregates.length.should.be.eql(2);
                      done();
                    });
                });
            });
        });
    });

    it('should find all (3) markAggregates if max distance increased (10000m)', (done) => {
      const markIndividualTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, location: { type: 'Point', coordinates: [3.0177912000000333, 50.5750322] } }, // restaurant Les Rois Fainéants
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0326840000000175, 50.5577246] } }, // restaurant l'Expresso
        { item: global.items[0]._id, place: global.places[2]._id, markOverall: 5, location: { type: 'Point', coordinates: [3.0653016999999636, 50.6402057] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markIndividualTests[0] })
        .end(() => {
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markIndividualTests[1] })
            .end(() => {
              chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual: markIndividualTests[2] })
                .end(() => {
                  chai.request(app)
                    .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/10000/lat/50.5679449/lng/3.0237092999999997`) // Worldline LP3 (btw the 2 first restaurants)
                    .send({})
                    .end((err4, res) => {
                      res.should.have.status(200);
                      res.body.markAggregates.length.should.be.eql(3);
                      done();
                    });
                });
            });
        });
    });
  });


  /*
  * Test the /DELETE/:_id route
  */
  describe('MarkAggregate Deletion', () => {
    it('should fail deleting an unknown mark', (done) => {
      chai.request(app)
        .delete('/api/markAggregates/id/58aaa000888555aaabdaf555')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should delete an existing mark', (done) => {
      const mark = new MarkAggregate(td.testMarkAggregates[0]);
      mark.save((errSaving, markSaved) => {
        chai.request(app)
          .delete(`/api/markAggregates/id/${markSaved._id}`)
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* MarkAggregates */
