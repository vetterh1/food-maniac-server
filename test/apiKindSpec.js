/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Kind from '../server/models/kind';
import * as td from './testData';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const should = chai.should();
chai.use(chaiHttp);


describe('API Kinds', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    Kind.remove({}, () => {
      done();
    });
  });


  /*
  * Test the /GET route
  */
  describe('Kinds list', () => {
    it('it should return an empty list when no kind', (done) => {
      chai.request(app)
        .get('/api/kinds')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.kinds.should.be.a('array');
          res.body.kinds.length.should.be.eql(0);
          done();
        });
    });

    it('it should list all the kinds', (done) => {
      Kind.create(td.testKinds, () => {
        chai.request(app)
          .get('/api/kinds')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.kinds.should.be.a('array');
            res.body.kinds.length.should.be.eql(td.testKinds.length);
            done();
          });
      });
    });
  });


  /*
  * Test the /POST route
  */
  describe('Kind Creation', () => {
    it('it should fail creating an incomplete kind', (done) => {
      chai.request(app)
        .post('/api/kinds')
        .send({ kind: { } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a complete kind', (done) => {
      const kindComplete = td.testKinds[0];
      chai.request(app)
        .post('/api/kinds')
        .send({ kind: kindComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('kind');
          res.body.kind.should.be.a('object');
          res.body.kind.should.have.property('name').eql(kindComplete.name);
          done();
        });
    });

    it('it should fail creating an existing kind', (done) => {
      const kind = new Kind(td.testKinds[0]);
      kind.save(() => {
        chai.request(app)
          .post('/api/kinds')
          .send({ kind: td.testKinds[0] })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong kind info', (done) => {
      chai.request(app)
        .post('/api/kinds')
        .send({ WRONG_kind: td.testKinds[0] })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */


  /*
  * Test the /POST/:cuid route
  */
  describe('Kind Update', () => {
    it('it should succeed updating a complete kind', (done) => {
      const kindOrig = new Kind(td.testKinds[0]);
      const kindUpdt = { name: 'testNameUpdate1.2' };
      kindOrig.save((errSaving, kindSaved) => {
        chai.request(app)
          .post(`/api/kinds/id/${kindSaved._id}`)
          .send({ kind: kindUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('kind');
            res.body.kind.should.be.a('object');
            res.body.kind.should.have.property('name').eql(kindUpdt.name);
            done();
          });
      });
    });

    it('it should fail updating _id', (done) => {
      const kindOrig = new Kind(td.testKinds[0]);
      kindOrig.save((errSaving, kindSaved) => {
        chai.request(app)
          .post(`/api/kinds/id/${kindSaved._id}`)
          .send({ kind: { _id: '58aaa000888555aaabdaf444' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown kind', (done) => {
      chai.request(app)
        .post('/api/kinds/id/58aaa000888555aaabdafddd')
        .send({ kind: { name: 'newName' } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong kind info', (done) => {
      const kindOrig = new Kind(td.testKinds[0]);
      kindOrig.save(() => {
        chai.request(app)
          .post('/api/kinds/id/58aaa000888555aaabdafddd')
          .send({ WRONG_kind: { name: 'newName' } })
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
  describe('Kind Retrieval', () => {
    it('it should fail finding an unknown kind', (done) => {
      chai.request(app)
        .get('/api/kinds/id/58aaa000888555aaabdaf666')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing kind', (done) => {
      const kind = new Kind(td.testKinds[0]);
      kind.save((err, kindSaved) => {
        chai.request(app)
          .get(`/api/kinds/id/${kindSaved._id}`)
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('kind');
            res.body.kind.should.be.a('object');
            res.body.kind.should.have.property('name').eql(kind.name);
            done();
          });
      });
    });
  });

  /*
  * Test the /DELETE/:cuid route
  */
  describe('Kind Deletion', () => {
    it('it should fail deleteing an unknown kind', (done) => {
      chai.request(app)
        .delete('/api/kinds/id/58aaa000888555aaabdafff9')
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing kind', (done) => {
      const kind = new Kind(td.testKinds[0]);
      kind.save((errSaving, kindSaved) => {
        chai.request(app)
          .delete(`/api/kinds/id/${kindSaved._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Kinds */
