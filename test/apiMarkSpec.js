/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Mark from '../server/models/mark';
import Item from '../server/models/item';
import Place from '../server/models/place';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const should = chai.should();
chai.use(chaiHttp);

global.item1 = null;

describe('API Marks', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    Mark.remove({})
    .then(() => { return Item.remove({}); }, () => { console.log('error on removing marks'); })
    .then(() => { return Place.remove({}); }, () => { console.log('error on removing items'); })
    .then(() => { return Item.create({ category: 'testCat1', kind: 'testKind1', name: 'globalItem1', cuid: 'cuidGlobalItem1' }); },
      () => { console.log('error on removing places'); })
    .then((item1) => { global.item1 = item1; return Place.create({ name: 'globalPlace1', cuid: 'cuidGlobalPlace1' }); },
      () => { console.log('error on creating global item'); })
    .then((place1) => {
      global.place1 = place1;
      // console.log('global.item1=', global.item1);
      // console.log('global.place1=', global.place1);
      return done();
    }, () => { console.log('error on creating global place'); });
  });


  /*
  * Test the /GET route
  */
  describe('Marks list', () => {
    it('it should return an empty list whent no place', (done) => {
      chai.request(app)
        .get('/api/marks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.marks.should.be.a('array');
          res.body.marks.length.should.be.eql(0);
          done();
        });
    });

    it('it should list all the marks', (done) => {
      const marksList = [
        { item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }], cuid: 'cuidTestMark1' },
        { item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }], cuid: 'cuidTestMark2' },
        { item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }], cuid: 'cuidTestMark3' },
        { item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }], cuid: 'cuidTestMark4' },
      ];
      Mark.create(marksList, () => {
        chai.request(app)
          .get('/api/marks')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.marks.should.be.a('array');
            res.body.marks.length.should.be.eql(marksList.length);
            done();
          });
      });
    });
  });


  /*
  * Test the /POST route
  */
  describe('Mark Creation', () => {
    it('it should fail creating an incomplete mark', (done) => {
      chai.request(app)
        .post('/api/marks')
        .send({ mark: {} })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a complete mark', (done) => {
      const markComplete = { item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] };
      chai.request(app)
        .post('/api/marks')
        .send({ mark: markComplete })
        .end((err, res) => {
          // console.log('res.body.mark=', res.body.mark);
          // console.log('res.body.mark.marks[0]=', res.body.mark.marks[0]);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('mark');
          res.body.mark.should.be.a('object');
          res.body.mark.should.have.property('marks');
          res.body.mark.marks.should.be.a('array');
          res.body.mark.marks.length.should.be.eql(markComplete.marks.length);          
          res.body.mark.marks[0].should.have.property('name').eql(markComplete.marks[0].name);
          done();
        });
    });

    it('it should fail creating an existing mark', (done) => {
      const mark = new Mark({ cuid: 'cuidTestPost2times', item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] });
      mark.save((err, markSaved) => {
        chai.request(app)
          .post('/api/marks')
          .send({ mark: markSaved })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong mark info', (done) => {
      chai.request(app)
        .post('/api/marks')
        .send({ WRONG_mark: { item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */


  /*
  * Test the /POST/:cuid route
  */
  describe('Mark Update', () => {
    it('it should succeed updating a complete mark', (done) => {
      const markOrig = new Mark({ cuid: 'cuidUpdate1', item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] });
      const markUpdt = { marks: [{ name: 'markOverall', value: 1 }] };
      markOrig.save(() => {
        chai.request(app)
          .post('/api/marks/cuidUpdate1')
          .send({ mark: markUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('mark');
            res.body.mark.should.be.a('object');
            res.body.mark.should.have.property('marks');
            res.body.mark.marks[0].should.have.property('name').eql(markUpdt.marks[0].name);
            res.body.mark.marks.length.should.be.eql(markUpdt.marks.length);
            done();
          });
      });
    });

    it('it should fail updating the cuid', (done) => {
      const markOrig = new Mark({ cuid: 'cuidUpdateCuid', marks: [{ name: 'markOverall', value: 1 }] });
      markOrig.save(() => {
        chai.request(app)
          .post('/api/marks/cuidUpdateCuid')
          .send({ mark: { cuid: 'cuidUpdateCuid2' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown mark', (done) => {
      chai.request(app)
        .post('/api/marks/cuidUpdateUnknownMark')
        .send({ mark: { marks: [{ name: 'markOverall', value: 1 }] } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong mark info', (done) => {
      const markOrig = new Mark({ cuid: 'cuidUpdateIncomplete', item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] });
      markOrig.save(() => {
        chai.request(app)
          .post('/api/marks/cuidUpdateIncomplete')
          .send({ WRONG_mark: { marks: [{ name: 'markOverall', value: 1 }] } })
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
  describe('Mark Retrieval', () => {
    it('it should fail finding an unknown mark', (done) => {
      chai.request(app)
        .get('/api/marks/cuidTestUnknownMark')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing mark', (done) => {
      const mark = new Mark({ cuid: 'cuidTestRetreive', item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] });
      mark.save((err, markSaved) => {
        chai.request(app)
          .get('/api/marks/cuidTestRetreive')
          .send({})
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('mark');
            res.body.mark.should.be.a('object');
            res.body.mark.should.have.property('marks');
            res.body.mark.marks[0].should.have.property('name').eql(markSaved.marks[0].name);
            res.body.mark.marks.length.should.be.eql(markSaved.marks.length);            
            done();
          });
      });
    });
  });


  /*
  * Test the /DELETE/:cuid route
  */
  describe('Mark Deletion', () => {
    it('it should fail deleting an unknown mark', (done) => {
      chai.request(app)
        .delete('/api/marks/cuidTestDeleteUnknown')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing mark', (done) => {
      const mark = new Mark({ cuid: 'cuidTestDelete', item: global.item1._id, place: global.place1._id, marks: [{ name: 'markOverall', value: 3 }] });
      mark.save(() => {
        chai.request(app)
          .delete('/api/marks/cuidTestDelete')
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Marks */
