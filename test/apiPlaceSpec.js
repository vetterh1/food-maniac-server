/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Place from '../server/models/place';
import * as td from './testData';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

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
    it('it should return an empty list when no place', (done) => {
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
      Place.create(td.testPlaces, () => {
        chai.request(app)
          .get('/api/places')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.places.should.be.a('array');
            res.body.places.length.should.be.eql(td.testPlaces.length);
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
        .send({ place: { name: 'testPostIncompletePlace' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a simple place', (done) => {
      const placeComplete = td.testPlaces[0];
      chai.request(app)
        .post('/api/places')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('googleMapId').and.to.be.a('string');
          res.body.place.should.have.property('googleMapId').eql(placeComplete.googleMapId);
          done();
        });
    });

    it('it should succeed creating a complete place (with coordinates)', (done) => {
      const placeComplete = td.testPlaces[0];
      chai.request(app)
        .post('/api/places')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('googleMapId').and.to.be.a('string');
          res.body.place.should.have.property('googleMapId').eql(placeComplete.googleMapId);
          res.body.place.should.have.property('location').and.to.be.an('object');
          res.body.place.location.should.have.property('type').eql('Point');
          res.body.place.location.should.have.property('coordinates').eql([placeComplete.location.coordinates[0], placeComplete.location.coordinates[1]]);
          done();
        });
    });

    it('it should fail creating an existing place', (done) => {
      const place = new Place(td.testPlaces[0]);
      place.save(() => {
        chai.request(app)
          .post('/api/places')
          .send({ place: td.testPlaces[0] })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong place info', (done) => {
      chai.request(app)
        .post('/api/places')
        .send({ WRONG_place: td.testPlaces[0] })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */



  /*
  * Test the /POST addOrUpdatePlaceByGoogleMapId route
  */
  describe('Place Add Or Update', () => {
    it('it should fail creating an incomplete place', (done) => {
      chai.request(app)
        .post('/api/places/addOrUpdatePlaceByGoogleMapId')
        .send({ place: { name: 'testPostIncompletePlace' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a simple place (no coordinates)', (done) => {
      const placeComplete = { name: 'testPostSimplePlace', googleMapId: 'googleMapIdTestPostSimplePlace' };
      chai.request(app)
        .post('/api/places/addOrUpdatePlaceByGoogleMapId')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('googleMapId').and.to.be.a('string');
          res.body.place.should.have.property('googleMapId').eql(placeComplete.googleMapId);
          done();
        });
    });

    it('it should succeed creating a complete place (with coordinates)', (done) => {
      const placeComplete = td.testPlaces[0];
      chai.request(app)
        .post('/api/places/addOrUpdatePlaceByGoogleMapId')
        .send({ place: placeComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('place');
          res.body.place.should.be.a('object');
          res.body.place.should.have.property('name').eql(placeComplete.name);
          res.body.place.should.have.property('googleMapId').and.to.be.a('string');
          res.body.place.should.have.property('googleMapId').eql(placeComplete.googleMapId);
          res.body.place.should.have.property('location').and.to.be.an('object');
          res.body.place.location.should.have.property('type').eql('Point');
          res.body.place.location.should.have.property('coordinates').eql([placeComplete.location.coordinates[0], placeComplete.location.coordinates[1]]);
          done();
        });
    });

    it('it should succeed creating an existing place', (done) => {
      const place = new Place({ googleMapId: 'googleMapIdTestAddOrUpdt2times', name: 'testAddOrUpdtname2times' });
      const placeUpdt = { googleMapId: 'googleMapIdTestAddOrUpdt2times', name: 'testAddOrUpdtname2times.2' };
      place.save(() => {
        chai.request(app)
          .post('/api/places/addOrUpdatePlaceByGoogleMapId')
          .send({ place: placeUpdt })
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('place');
            res.body.place.should.be.a('object');
            res.body.place.should.have.property('name').eql(placeUpdt.name);
            res.body.place.should.have.property('googleMapId').eql(placeUpdt.googleMapId);
            done();
          });
      });
    });

    it('it should fail creating with wrong place info', (done) => {
      chai.request(app)
        .post('/api/places/addOrUpdatePlaceByGoogleMapId')
        .send({ WRONG_place: td.testPlaces[0] })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST addOrUpdatePlaceByGoogleMapId route */



  /*
  * Test the /POST/:googleMapId route
  */
  describe('Place Update', () => {
    it('it should succeed updating a complete place', (done) => {
      const placeOrig = new Place(td.testPlaces[0]);
      const placeUpdt = { name: 'testnameUpdate1.2' };
      placeOrig.save((errSaving, placeSaved) => {
        chai.request(app)
          .post(`/api/places/id/${placeSaved._id}`)
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

    it('it should fail updating the _id', (done) => {
      const placeOrig = new Place(td.testPlaces[0]);
      placeOrig.save((errSaving, placeSaved) => {
        chai.request(app)
          .post(`/api/places/id/${placeSaved._id}`)
          .send({ place: { _id: 'cuidUpdateId2' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown place (default behavior)', (done) => {
      chai.request(app)
        .post('/api/places/id/58aaa000888555aaabdafda2')
        .send({ place: { name: 'newname' } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong place info', (done) => {
      const placeOrig = new Place(td.testPlaces[0]);
      placeOrig.save((errSaving, placeSaved) => {
        chai.request(app)
          .post(`/api/places/id/${placeSaved._id}`)
          .send({ WRONG_place: { name: 'newName' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
  });  /* End test the /POST/:googleMapId route */


  /*
  * Test the /GET/:cuid route
  */
  describe('Place Retrieval', () => {
    it('it should fail finding an unknown place', (done) => {
      chai.request(app)
        .get('/api/places/id/58aaa000888555aaabdafda9')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing place', (done) => {
      const place = new Place(td.testPlaces[0]);
      place.save((err, placeSaved) => {
        chai.request(app)
          .get(`/api/places/id/${placeSaved._id}`)
          .send({})
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('place');
            res.body.place.should.be.a('object');
            res.body.place.should.have.property('googleMapId').eql(place.googleMapId);
            res.body.place.should.have.property('name').eql(place.name);
            done();
          });
      });
    });
  });  /* End test the /GET/:cuid route */


  /*
  * Test the /DELETE/:cuid route
  */
  describe('Place Deletion', () => {
    it('it should fail deleting an unknown place', (done) => {
      chai.request(app)
        .delete('/api/places/id/58aaa000888555aaabdafda9')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing place', (done) => {
      const place = new Place(td.testPlaces[0]);
      place.save((errSaving, placeSaved) => {
        chai.request(app)
          .delete(`/api/places/id/${placeSaved._id}`)
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Places */

