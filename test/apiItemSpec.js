/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

// import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Item from '../server/models/item';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

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
  * Test the /GET/COUNT route
  */
  describe('Counts', () => {
    it('it should return a 0 count at start', (done) => {
      chai.request(app)
        .get('/api/items/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('count').eql(0);
          done();
        });
    });

    it('it should count the items', (done) => {
      const itemsList = [
        { category: 'testCat1', kind: 'testKind1', name: 'testItem1', cuid: 'cuidTestItem1' },
        { category: 'testCat1', kind: 'testKind1', name: 'testItem2', cuid: 'cuidTestItem2' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem3', cuid: 'cuidTestItem3' },
      ];
      Item.create(itemsList, () => {
        chai.request(app)
          .get('/api/items/count')
          .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.have.property('count').eql(itemsList.length);
            done();
          });
      });
    });
  });  /* End test the /GET/COUNT route */


  /*
  * Test the /GET route
  */
  describe('Items list', () => {
    it('it should return an empty list at start', (done) => {
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
        // Index 11 (last) in results as it's order by most recent
        { category: 'testCat1', kind: 'testKind1', name: 'testItem1', cuid: 'cuidTestItem1', since: '2017-01-01T00:00:01' },
        { category: 'testCat1', kind: 'testKind1', name: 'testItem2', cuid: 'cuidTestItem2', since: '2017-01-01T00:00:02' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem3', cuid: 'cuidTestItem3', since: '2017-01-01T00:00:03' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem4', cuid: 'cuidTestItem4', since: '2017-01-01T00:00:04' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem5', cuid: 'cuidTestItem5', since: '2017-01-01T00:00:05' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem6', cuid: 'cuidTestItem6', since: '2017-01-01T00:00:06' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem7', cuid: 'cuidTestItem7', since: '2017-01-01T00:00:07' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem8', cuid: 'cuidTestItem8', since: '2017-01-01T00:00:08' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem9', cuid: 'cuidTestItem9', since: '2017-01-01T00:00:09' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem10', cuid: 'cuidTestItem10', since: '2017-01-01T00:00:10' },
        { category: 'testCat2', kind: 'testKind3', name: 'testItem11', cuid: 'cuidTestItem11', since: '2017-01-01T00:00:11' },
        // Index 0 (first) in results as it's order by most recent
        { category: 'testCat2', kind: 'testKind3', name: 'testItem12', cuid: 'cuidTestItem12', since: '2017-01-01T00:00:12' },
      ];
      Item.create(itemsList, () => {
        chai.request(app)
          .get('/api/items')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.items.should.be.a('array');
            res.body.items.length.should.be.eql(itemsList.length);
            res.body.items[0].name.should.be.eql('testItem12');
            done();
          });
      });
    });

    it('it should return paginated items', (done) => {
      const itemsList = [
        { category: 'testCat1', kind: 'testKind1', name: 'testItem1', cuid: 'cuidTestItem1', since: '2017-01-01T00:00:01' },
        { category: 'testCat1', kind: 'testKind1', name: 'testItem2', cuid: 'cuidTestItem2', since: '2017-01-01T00:00:02' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem3', cuid: 'cuidTestItem3', since: '2017-01-01T00:00:03' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem4', cuid: 'cuidTestItem4', since: '2017-01-01T00:00:04' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem5', cuid: 'cuidTestItem5', since: '2017-01-01T00:00:05' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem6', cuid: 'cuidTestItem6', since: '2017-01-01T00:00:06' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem7', cuid: 'cuidTestItem7', since: '2017-01-01T00:00:07' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem8', cuid: 'cuidTestItem8', since: '2017-01-01T00:00:08' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem9', cuid: 'cuidTestItem9', since: '2017-01-01T00:00:09' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem10', cuid: 'cuidTestItem10', since: '2017-01-01T00:00:10' },
        // /api/items/2/3 : Pagination starts at here and goes 'up' as it's order by most recent (and only for 3 items)
        { category: 'testCat2', kind: 'testKind3', name: 'testItem11', cuid: 'cuidTestItem11', since: '2017-01-01T00:00:11' },
        { category: 'testCat2', kind: 'testKind3', name: 'testItem12', cuid: 'cuidTestItem12', since: '2017-01-01T00:00:12' },
      ];
      Item.create(itemsList, () => {
        chai.request(app)
          .get('/api/items/2/3')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.items.should.be.a('array');
            res.body.items.length.should.be.eql(3);
            res.body.items[0].name.should.be.eql('testItem10');
            done();
          });
      });
    });
  });  /* End test the /GET & /GET/COUNT route */


  /*
  * Test the /POST route
  */
  describe('Item Creation', () => {
    it('it should fail creating an incomplete item', (done) => {
      chai.request(app)
        .post('/api/items')
        .send({ item: {} })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a complete item', (done) => {
      const itemcomplete = { category: 'testCat1', kind: 'testKind1', name: 'testPostName' };
      chai.request(app)
        .post('/api/items')
        .send({ item: itemcomplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('item');
          res.body.item.should.be.a('object');
          res.body.item.should.have.property('name').eql(itemcomplete.name);
          done();
        });
    });

    it('it should fail creating an existing item', (done) => {
      const item = new Item({ cuid: 'cuidTestPost2times', category: 'testCat1', kind: 'testKind1', name: 'testPostname2times' });
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
        .send({ WRONG_item: { category: 'testCat1', kind: 'testKind1', name: 'testPostname' } })
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
    it('it should succeed updating a complete item', (done) => {
      const itemOrig = new Item({ cuid: 'cuidUpdate1', category: 'testCat1', kind: 'testKind1', name: 'testnameUpdate1' });
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
      const itemOrig = new Item({ cuid: 'cuidUpdateincomplete', name: 'testNameUpdateincomplete' });
      itemOrig.save(() => {
        chai.request(app)
          .post('/api/items/cuidUpdateincomplete')
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
          res.should.have.status(200);
          res.body.items.should.be.a('array');
          res.body.items.length.should.be.eql(0);
          done();
        });
    });

    it('it should find an existing item', (done) => {
      const item = new Item({ cuid: 'cuidTestRetreive', category: 'testCat1', kind: 'testKind1', name: 'testRetreiveName' });
      item.save(() => {
        chai.request(app)
          .get('/api/items/cuidTestRetreive')
          .send({})
          .end((err2, res2) => {
            res2.should.have.status(200);
            res2.body.items.should.be.a('array');
            res2.body.items.length.should.be.eql(1);
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
      const item = new Item({ cuid: 'cuidTestDelete', category: 'testCat1', kind: 'testKind1', name: 'testDeleteName' });
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
