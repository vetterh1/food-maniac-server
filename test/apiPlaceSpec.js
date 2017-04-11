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
      const placesList = [
        { name: 'testPlace1', googleMapId: 'googleMapIdTestPlace1' },
        { name: 'testPlace2', googleMapId: 'googleMapIdTestPlace2' },
        { name: 'testPlace3', googleMapId: 'googleMapIdTestPlace3' },
        { name: 'testPlace4', googleMapId: 'googleMapIdTestPlace4' },
        { name: 'testPlace5', googleMapId: 'googleMapIdTestPlace5' },
        { name: 'testPlace6', googleMapId: 'googleMapIdTestPlace6' },
        { name: 'testPlace7', googleMapId: 'googleMapIdTestPlace7' },
        { name: 'testPlace8', googleMapId: 'googleMapIdTestPlace8' },
        { name: 'testPlace9', googleMapId: 'googleMapIdTestPlace9' },
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
        .send({ place: { name: 'testPostIncompletePlace' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a simple place', (done) => {
      const placeComplete = { name: 'testPostSimplePlace', googleMapId: 'googleMapIdTestPostSimplePlace' };
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
      const placeComplete = { name: 'testPostCompletePlace', googleMapId: 'googleMapIdTestPostCompletePlace', location: { type: 'Point', coordinates: [40.73061, -73.935242] } };
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
          res.body.place.location.should.have.property('coordinates').eql([40.73061, -73.935242]);
          done();
        });
    });

    it('it should fail creating an existing place', (done) => {
      const place = new Place({ googleMapId: 'googleMapIdTestPost2times', name: 'testPostname2times' });
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
        .send({ WRONG_place: { googleMapId: 'googleMapIdTestPostWrongInfo', name: 'testPostname' } })
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

    it('it should succeed creating a simple place', (done) => {
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
      const placeComplete = { name: 'testPostCompletePlace', googleMapId: 'googleMapIdTestPostCompletePlace', location: { type: 'Point', coordinates: [40.73061, -73.935242] } };
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
          res.body.place.location.should.have.property('coordinates').eql([40.73061, -73.935242]);
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
        .send({ WRONG_place: { googleMapId: 'googleMapIdTestAddOrUpdtWrong', name: 'testAddOrUpdtWrong' } })
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
      const placeOrig = new Place({ googleMapId: 'googleMapIdUpdate1', name: 'testnameUpdate1' });
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
      const placeOrig = new Place({ googleMapId: 'cuidUpdateCuid', name: 'testnameUpdateCuid' });
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
      const placeOrig = new Place({ googleMapId: 'cuidUpdateIncomplete', name: 'testNameUpdateIncomplete' });
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
      const place = new Place({ googleMapId: 'googleMapIdTestRetreive', name: 'testRetreiveName' });
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
      const place = new Place({ googleMapId: 'googleMapIdTestDelete', name: 'testDeleteName' });
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

