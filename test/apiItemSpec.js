// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

// import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Item from '../server/models/item';

const should = chai.should();
chai.use(chaiHttp);


describe('API Items', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    Item.remove({}, () => {
      done();
    });
  });


  /*
  * Test the /GET route
  */
  describe('Items list', () => {
    it('it should return an empty list whent no place', (done) => {
      chai.request(app)
        .get('/api/items')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.items.should.be.a('array');
          res.body.items.length.should.be.eql(0);
          done();
        });
    });

    it('it should list all the items', (done) => {
      const itemsList = [
        { name: 'testItem1', cuid: 'cuidTestItem1' },
        { name: 'testItem2', cuid: 'cuidTestItem2' },
        { name: 'testItem3', cuid: 'cuidTestItem3' },
        { name: 'testItem4', cuid: 'cuidTestItem4' },
        { name: 'testItem5', cuid: 'cuidTestItem5' },
        { name: 'testItem6', cuid: 'cuidTestItem6' },
        { name: 'testItem7', cuid: 'cuidTestItem7' },
        { name: 'testItem8', cuid: 'cuidTestItem8' },
        { name: 'testItem9', cuid: 'cuidTestItem9' },
        { name: 'testItem10', cuid: 'cuidTestItem10' },
        { name: 'testItem11', cuid: 'cuidTestItem11' },
        { name: 'testItem12', cuid: 'cuidTestItem12' },
      ];
      Item.create(itemsList, () => {
        chai.request(app)
          .get('/api/items')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.items.should.be.a('array');
            res.body.items.length.should.be.eql(itemsList.length);
            done();
          });
      });
    });
  });


  /*
  * Test the /POST route
  */
  describe('Item Creation', () => {
    it('it should fail creating an incompconste item', (done) => {
      chai.request(app)
        .post('/api/items')
        .send({ item: {} })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a compconste item', (done) => {
      const itemCompconste = { name: 'testPostName' };
      chai.request(app)
        .post('/api/items')
        .send({ item: itemCompconste })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('item');
          res.body.item.should.be.a('object');
          res.body.item.should.have.property('name').eql(itemCompconste.name);
          done();
        });
    });

    it('it should fail creating an existing item', (done) => {
      const item = new Item({ cuid: 'cuidTestPost2times', name: 'testPostname2times' });
      item.save((err, item2) => {
        chai.request(app)
          .post('/api/items')
          .send({ item: item2 })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong item info', (done) => {
      chai.request(app)
        .post('/api/items')
        .send({ WRONG_item: { name: 'testPostname' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */


  /*
  * Test the /POST/:cuid route
  */
  describe('Item Update', () => {
    it('it should succeed updating a compconste item', (done) => {
      const itemOrig = new Item({ cuid: 'cuidUpdate1', name: 'testnameUpdate1' });
      const itemUpdt = { name: 'testnameUpdate1.2' };
      itemOrig.save(() => {
        chai.request(app)
          .post('/api/items/cuidUpdate1')
          .send({ item: itemUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('item');
            res.body.item.should.be.a('object');
            res.body.item.should.have.property('name').eql(itemUpdt.name);
            done();
          });
      });
    });

    it('it should fail updating the cuid', (done) => {
      const itemOrig = new Item({ cuid: 'cuidUpdateCuid', name: 'testnameUpdateCuid' });
      itemOrig.save(() => {
        chai.request(app)
          .post('/api/items/cuidUpdateCuid')
          .send({ item: { cuid: 'cuidUpdateCuid2' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown item', (done) => {
      chai.request(app)
        .post('/api/items/cuidUpdateUnknownItem')
        .send({ item: { name: 'newname' } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong item info', (done) => {
      const itemOrig = new Item({ cuid: 'cuidUpdateIncompconste', name: 'testNameUpdateIncompconste' });
      itemOrig.save(() => {
        chai.request(app)
          .post('/api/items/cuidUpdateIncompconste')
          .send({ WRONG_item: { name: 'newName' } })
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
  describe('Item Retrieval', () => {
    it('it should fail finding an unknown item', (done) => {
      chai.request(app)
        .get('/api/items/cuidTestUnknownItem')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing item', (done) => {
      const item = new Item({ cuid: 'cuidTestRetreive', name: 'testRetreiveName' });
      item.save(() => {
        chai.request(app)
          .get('/api/items/cuidTestRetreive')
          .send({})
          .end((err2, res2) => {
            res2.should.have.status(200);
            res2.body.should.be.a('object');
            res2.body.should.have.property('item');
            res2.body.item.should.be.a('object');
            res2.body.item.should.have.property('name').eql(item.name);
            done();
          });
      });
    });
  });



  /*
  * Test the /DELETE/:cuid route
  */
  describe('Item Deletion', () => {
    it('it should fail deleting an unknown item', (done) => {
      chai.request(app)
        .delete('/api/items/cuidTestDeleteUnknown')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing item', (done) => {
      const item = new Item({ cuid: 'cuidTestDelete', name: 'testDeleteName' });
      item.save(() => {
        chai.request(app)
          .delete('/api/items/cuidTestDelete')
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Items */
