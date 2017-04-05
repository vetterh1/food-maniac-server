// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Place from '../server/models/place';

const should = chai.should();
chai.use(chaiHttp);



describe('API Places', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    Place.remove({}, () => {
      done();
    });
  });


  /*
  * Test the /GET route
  */
  describe('Places list', () => {
    it('it should return an empty list whent no place', (done) => {
      chai.request(app)
        .get('/api/places')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.places.should.be.a('array');
          res.body.places.length.should.be.eql(0);
          done();
        });
    });

    it('it should list all the places', (done) => {
      const placesList = [
        { name: 'testPlace1', cuid: 'cuidTestPlace1' },
        { name: 'testPlace2', cuid: 'cuidTestPlace2' },
        { name: 'testPlace3', cuid: 'cuidTestPlace3' },
        { name: 'testPlace4', cuid: 'cuidTestPlace4' },
        { name: 'testPlace5', cuid: 'cuidTestPlace5' },
        { name: 'testPlace6', cuid: 'cuidTestPlace6' },
        { name: 'testPlace7', cuid: 'cuidTestPlace7' },
        { name: 'testPlace8', cuid: 'cuidTestPlace8' },
        { name: 'testPlace9', cuid: 'cuidTestPlace9' },
      ];
      Place.create(placesList, () => {
        chai.request(app)
          .get('/api/places')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.places.should.be.a('array');
            res.body.places.length.should.be.eql(placesList.length);
            done();
          });
      });
    });
  });


  /*
  * Test the /POST route
  */
  describe('Place Creation', () => {
    it('it should fail creating an incomplete place', (done) => {
      chai.request(app)
        .post('/api/places')
        .send({ place: {} })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a complete place (without id)', (done) => {
      const placeComplete = { name: 'testPostNameNoId' };
      chai.request(app)
        .post('/api/places')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('cuid').and.to.be.a('string');
          done();
        });
    });

    it('it should succeed creating a complete place (with id)', (done) => {
      const placeComplete = { name: 'testPostNameWithId', cuid: 'cuidTestPostNameWithId' };
      chai.request(app)
        .post('/api/places')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('cuid').eql(placeComplete.cuid);
          done();
        });
    });

    it('it should fail creating an existing place', (done) => {
      const place = new Place({ cuid: 'cuidTestPost2times', name: 'testPostname2times' });
      place.save((err, placeSaved) => {
        chai.request(app)
          .post('/api/places')
          .send({ place: placeSaved })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong place info', (done) => {
      chai.request(app)
        .post('/api/places')
        .send({ WRONG_place: { name: 'testPostname' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */



  /*
  * Test the /POST addOrUpdatePlace route
  */
  describe('Place Add Or Update', () => {
    it('it should fail creating an incomplete place', (done) => {
      chai.request(app)
        .post('/api/places/addOrUpdatePlace')
        .send({ place: {} })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a complete place (without id)', (done) => {
      const placeComplete = { name: 'testAddOrUpdtNameNoId' };
      chai.request(app)
        .post('/api/places/addOrUpdatePlace')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('cuid').and.to.be.a('string');
          done();
        });
    });

    it('it should succeed creating a complete place (with id)', (done) => {
      const placeComplete = { name: 'testAddOrUpdtNameWithId', cuid: 'cuidtestAddOrUpdtNameWithId' };
      chai.request(app)
        .post('/api/places/addOrUpdatePlace')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('cuid').eql(placeComplete.cuid);
          done();
        });
    });

    it('it should succeed creating an existing place', (done) => {
      const place = new Place({ cuid: 'cuidTestAddOrUpdt2times', name: 'testAddOrUpdtname2times' });
      const placeUpdt = { cuid: 'cuidTestAddOrUpdt2times', name: 'testAddOrUpdtname2times.2' };
      place.save(() => {
        chai.request(app)
          .post('/api/places/addOrUpdatePlace')
          .send({ place: placeUpdt })
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('place');
            res.body.place.should.be.a('object');
            res.body.place.should.have.property('name').eql(placeUpdt.name);
            res.body.place.should.have.property('cuid').eql(placeUpdt.cuid);
            done();
          });
      });
    });

    it('it should fail creating with wrong place info', (done) => {
      chai.request(app)
        .post('/api/places/addOrUpdatePlace')
        .send({ WRONG_place: { name: 'testAddOrUpdtname' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST addOrUpdatePlace route */



  /*
  * Test the /POST/:cuid route
  */
  describe('Place Update', () => {
    it('it should succeed updating a complete place', (done) => {
      const placeOrig = new Place({ cuid: 'cuidUpdate1', name: 'testnameUpdate1' });
      const placeUpdt = { name: 'testnameUpdate1.2' };
      placeOrig.save(() => {
        chai.request(app)
          .post('/api/places/cuidUpdate1')
          .send({ place: placeUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('place');
            res.body.place.should.be.a('object');
            res.body.place.should.have.property('name').eql(placeUpdt.name);
            done();
          });
      });
    });

    it('it should fail updating the cuid', (done) => {
      const placeOrig = new Place({ cuid: 'cuidUpdateCuid', name: 'testnameUpdateCuid' });
      placeOrig.save(() => {
        chai.request(app)
          .post('/api/places/cuidUpdateCuid')
          .send({ place: { cuid: 'cuidUpdateCuid2' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown place (default behavior)', (done) => {
      chai.request(app)
        .post('/api/places/cuidUpdateUnknownPlace')
        .send({ place: { name: 'newname' } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong place info', (done) => {
      const placeOrig = new Place({ cuid: 'cuidUpdateIncomplete', name: 'testNameUpdateIncomplete' });
      placeOrig.save(() => {
        chai.request(app)
          .post('/api/places/cuidUpdateIncomplete')
          .send({ WRONG_place: { name: 'newName' } })
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
  describe('Place Retrieval', () => {
    it('it should fail finding an unknown place', (done) => {
      chai.request(app)
        .get('/api/places/cuidTestUnknownPlace')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing place', (done) => {
      const place = new Place({ cuid: 'cuidTestRetreive', name: 'testRetreiveName' });
      place.save((err, placeSaved) => {
        chai.request(app)
          .get('/api/places/cuidTestRetreive')
          .send({})
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('place');
            res.body.place.should.be.a('object');
            res.body.place.should.have.property('name').eql(placeSaved.name);
            done();
          });
      });
    });
  });

  /*
  * Test the /DELETE/:cuid route
  */
  describe('Place Deletion', () => {
    it('it should fail deleting an unknown place', (done) => {
      chai.request(app)
        .delete('/api/places/cuidTestDeleteUnknown')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing place', (done) => {
      const place = new Place({ cuid: 'cuidTestDelete', name: 'testDeleteName' });
      place.save(() => {
        chai.request(app)
          .delete('/api/places/cuidTestDelete')
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Places */

