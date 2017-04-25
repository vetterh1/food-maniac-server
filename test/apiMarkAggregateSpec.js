/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import MarkAggregate from '../server/models/markAggregate';
import Item from '../server/models/item';
import Place from '../server/models/place';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const should = chai.should();
chai.use(chaiHttp);

global.items = [];
global.places = [];

describe('API MarkAggregates', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    MarkAggregate.remove({})
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
      const marksList = [
        { item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 },
        { item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 },
        { item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 },
        { item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 },
      ];
      MarkAggregate.create(marksList, () => {
        chai.request(app)
          .get('/api/markAggregates')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.markAggregates.should.be.a('array');
            res.body.markAggregates.length.should.be.eql(marksList.length);
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
      const markOrig = new MarkAggregate({ item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 });
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
      const markOrig = new MarkAggregate({ item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 });
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
      const markOrig = new MarkAggregate({ item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 });
      markOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/markAggregates/id/${itemSaved._id}`)
          .send({ WRONG_mark: { markOverall: 1 } })
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
      const mark = new MarkAggregate({ item: global.items[0]._id, place: global.places[0]._id, nbMarksOverall: 1, markOverall: 3 });
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
  * Test the /GET /itemId/:_itemId/maxDistance/:_maxDistance/lat/:_lat/lng/:_lng route
  */
  describe('MarkAggregate Retrieval by Item and Distance', () => {
    it('should fail finding markAggregate for an unknown item (no distance check)', (done) => {
      chai.request(app)
        .get('/api/markAggregates/itemId/123456789/maxDistance/0/lat/0/lng/0')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should find 2 aggregated marks for two items with different item+place marks (no distance check)', (done) => {
      const markTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3 },
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5 },
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markTests[0] })
        .end((err, savedMarkAggregate1) => {
          markTests[0].aggregatedId = savedMarkAggregate1.body.aggregatedMarkAggregate._id;
          // console.log('savedMarkAggregate1.body.aggregatedMarkAggregate=', savedMarkAggregate1.body.aggregatedMarkAggregate);
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markTests[1] })
            .end((er2, savedMarkAggregate2) => {
              markTests[1].aggregatedId = savedMarkAggregate2.body.aggregatedMarkAggregate._id;
              chai.request(app)
                .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/0/lat/0/lng/0`)
                .send({})
                .end((err3, res) => {
                  // console.log('res.body.markAggregates[0]._id=', res.body.markAggregates[0]._id);
                  // console.log('markTests[0].aggregatedId=', markTests[0].aggregatedId);
                  // console.log('markTests[1].aggregatedId=', markTests[1].aggregatedId);
                  markTests[0].aggregatedId.should.not.be.equal(markTests[1].aggregatedId);
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('markAggregates');
                  res.body.markAggregates.should.be.an('array');
                  res.body.markAggregates.length.should.be.eql(2);
                  res.body.markAggregates[0].should.be.a('object');
                  res.body.markAggregates[0].should.have.property('_id').to.be.oneOf([markTests[0].aggregatedId, markTests[1].aggregatedId]);
                  res.body.markAggregates[0].should.have.property('markOverall').to.be.oneOf([markTests[0].markOverall, markTests[1].markOverall]);
                  res.body.markAggregates[0].markOverall.should.be.a('number');
                  done();
                });
            });
        });
    });

    it('should find only one aggregated mark for 2 markAggregates of the same item+place (no distance check)', (done) => {
      const markTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, markFood: 4 },
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 5, markFood: 2, markPlace: 3 },
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markTests[0] })
        .end((err, resMarkAggregate1) => {
          console.log('resMarkAggregate1.body=', resMarkAggregate1.body);
          markTests[0].aggregatedId = resMarkAggregate1.body.aggregatedMarkAggregate._id;
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markTests[1] })
            .end((err2, resMarkAggregate2) => {
              console.log('resMarkAggregate2.body=', resMarkAggregate2.body);
              markTests[1].aggregatedId = resMarkAggregate2.body.aggregatedMarkAggregate._id;
              chai.request(app)
                .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/0/lat/0/lng/0`)
                .send({})
                .end((err3, res) => {
                  console.log('res.body=', res.body);
                  markTests[0].aggregatedId.should.be.equal(markTests[1].aggregatedId);
                  res.should.have.status(200);
                  res.body.markAggregates.length.should.be.eql(1);
                  res.body.markAggregates[0].markOverall.should.be.a('number').equal(4);
                  res.body.markAggregates[0].markFood.should.be.a('number').equal(3);
                  res.body.markAggregates[0].markPlace.should.be.a('number').equal(3);
                  res.body.markAggregates[0].should.have.property('_id').to.be.equal(markTests[0].aggregatedId);
                  done();
                });
            });
        });
    });

    it('should find only close restaurants (one out of two - range: 10m)', (done) => {
      const markTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.6403954, 3.0651635000000397] } }, // restaurant Papa Raffaele
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 3, location: { type: 'Point', coordinates: [50.6402057, 3.0653016999999636] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markTests[0] })
        .end((err, resMarkAggregate1) => {
          console.log('resMarkAggregate1.body=', resMarkAggregate1.body);
          markTests[0].aggregatedId = resMarkAggregate1.body.aggregatedMarkAggregate._id;
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markTests[1] })
            .end((err2, resMarkAggregate2) => {
              console.log('resMarkAggregate2.body=', resMarkAggregate2.body);
              markTests[1].aggregatedId = resMarkAggregate2.body.aggregatedMarkAggregate._id;
              chai.request(app)
                .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/10/lat/50.6403954/lng/3.0651635000000397`) // at Papa Raffaele
                .send({})
                .end((err3, res) => {
                  // console.log('res.body=', res.body);
                  res.should.have.status(200);
                  res.body.markAggregates.length.should.be.eql(1);
                  res.body.markAggregates[0].should.have.property('_id').to.be.equal(markTests[0].aggregatedId);
                  res.body.markAggregates[0].should.have.property('markOverall').to.be.equal(5);
                  done();
                });
            });
        });
    });

    it('should find no result if too far and max distance too short (1000m)', (done) => {
      const markTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, location: { type: 'Point', coordinates: [50.5750322, 3.0177912000000333] } }, // restaurant Les Rois Fainéants
        { item: global.items[1]._id, place: global.places[0]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.5577246, 3.0326840000000175] } }, // restaurant l'Expresso
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.6402057, 3.0653016999999636] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markTests[0] })
        .end((err, resMarkAggregate1) => {
          console.log('resMarkAggregate1.body=', resMarkAggregate1.body);
          markTests[0].aggregatedId = resMarkAggregate1.body.aggregatedMarkAggregate._id;
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markTests[1] })
            .end((err2, resMarkAggregate2) => {
              console.log('resMarkAggregate2.body=', resMarkAggregate2.body);
              markTests[1].aggregatedId = resMarkAggregate2.body.aggregatedMarkAggregate._id;
              chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual: markTests[2] })
                .end((err3, resMarkAggregate3) => {
                  console.log('resMarkAggregate3.body=', resMarkAggregate3.body);
                  markTests[2].aggregatedId = resMarkAggregate3.body.aggregatedMarkAggregate._id;
                  chai.request(app)
                    .get(`/api/markAggregates/itemId/${global.items[0]._id}/maxDistance/1000/lat/50.5679449/lng/3.0237092999999997`) // Worldline LP3 (btw the 2 first restaurants)
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
      const markTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, location: { type: 'Point', coordinates: [50.5750322, 3.0177912000000333] } }, // restaurant Les Rois Fainéants
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.5577246, 3.0326840000000175] } }, // restaurant l'Expresso
        { item: global.items[0]._id, place: global.places[2]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.6402057, 3.0653016999999636] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markTests[0] })
        .end(() => {
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markTests[1] })
            .end(() => {
              chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual: markTests[2] })
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
      const markTests = [
        { item: global.items[0]._id, place: global.places[0]._id, markOverall: 3, location: { type: 'Point', coordinates: [50.5750322, 3.0177912000000333] } }, // restaurant Les Rois Fainéants
        { item: global.items[0]._id, place: global.places[1]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.5577246, 3.0326840000000175] } }, // restaurant l'Expresso
        { item: global.items[0]._id, place: global.places[2]._id, markOverall: 5, location: { type: 'Point', coordinates: [50.6402057, 3.0653016999999636] } }, // restaurant Douss Creolin
      ];
      chai.request(app)
        .post('/api/markIndividuals')
        .send({ markIndividual: markTests[0] })
        .end(() => {
          chai.request(app)
            .post('/api/markIndividuals')
            .send({ markIndividual: markTests[1] })
            .end(() => {
              chai.request(app)
                .post('/api/markIndividuals')
                .send({ markIndividual: markTests[2] })
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
      const mark = new MarkAggregate({ item: global.items[0]._id, place: global.places[0]._id, markOverall: 3 });
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
