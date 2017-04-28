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
        { category: 'testCat1', kind: 'testKind1', name: 'testItem1' },
        { category: 'testCat1', kind: 'testKind1', name: 'testItem2' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem3' },
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
        { category: 'testCat1', kind: 'testKind1', name: 'testItem1', since: '2017-01-01T00:00:01' },
        { category: 'testCat1', kind: 'testKind1', name: 'testItem2', since: '2017-01-01T00:00:02' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem3', since: '2017-01-01T00:00:03' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem4', since: '2017-01-01T00:00:04' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem5', since: '2017-01-01T00:00:05' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem6', since: '2017-01-01T00:00:06' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem7', since: '2017-01-01T00:00:07' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem8', since: '2017-01-01T00:00:08' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem9', since: '2017-01-01T00:00:09' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem10', since: '2017-01-01T00:00:10' },
        { category: 'testCat2', kind: 'testKind3', name: 'testItem11', since: '2017-01-01T00:00:11' },
        // Index 0 (first) in results as it's order by most recent
        { category: 'testCat2', kind: 'testKind3', name: 'testItem12', since: '2017-01-01T00:00:12' },
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

    it('it should return paginated items with sort and filter', (done) => {
      const itemsList = [
        { category: 'testCat1', kind: 'testKind1', name: 'testItem01', since: '2017-01-01T00:00:01' },
        { category: 'testCat1', kind: 'testKind1', name: 'testItem02', since: '2017-01-01T00:00:02' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem03', since: '2017-01-01T00:00:03' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem04', since: '2017-01-01T00:00:04' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem05', since: '2017-01-01T00:00:05' },
        { category: 'testCat1', kind: 'testKind3', name: 'testItem06', since: '2017-01-01T00:00:06' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem07', since: '2017-01-01T00:00:07' },
        { category: 'testCat2', kind: 'testKind1', name: 'testItem08', since: '2017-01-01T00:00:08' },
        { category: 'testCat1', kind: 'testKind2', name: 'testItem09', since: '2017-01-01T00:00:09' },
        { category: 'testCat2', kind: 'testKind2', name: 'testItem10', since: '2017-01-01T00:00:10' },
        // /api/items/2/3 : Results start here and goes 'up' for 3 items
        { category: 'testCat2', kind: 'testKind3', name: 'testItem11', since: '2017-01-01T00:00:11' },
        { category: 'testCat2', kind: 'testKind3', name: 'testItem12', since: '2017-01-01T00:00:12' },
      ];
      Item.create(itemsList, () => {
        chai.request(app)
          .get('/api/items?offset=2&limit=3&sort={"name":-1}&query={"category":"testCat2"}')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.items.should.be.a('array');
            res.body.items.length.should.be.eql(3);
            res.body.items[0].name.should.be.eql('testItem10');
            // NOT testItem8 as its category is testCat1
            res.body.items[1].name.should.be.eql('testItem08');
            res.body.items[2].name.should.be.eql('testItem07');
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
      const item = new Item({ category: 'testCat1', kind: 'testKind1', name: 'testPostname2times' });
      item.save((err, itemSaved) => {
        chai.request(app)
          .post('/api/items')
          .send({ item: itemSaved })
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
      const itemOrig = new Item({ category: 'testCat1', kind: 'testKind1', name: 'testnameUpdate1' });
      const itemUpdt = { name: 'testnameUpdate1.2' };
      itemOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/items/id/${itemSaved._id}`)
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

    it('it should fail updating the _id', (done) => {
      const itemOrig = new Item({ category: 'testCat1', kind: 'testKind1', name: 'testnameUpdateId' });
      itemOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/items/id/${itemSaved._id}`)
          .send({ item: { _id: '58aaa000888555aaabdaf777' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown item', (done) => {
      chai.request(app)
        .post('/api/items/id/58aaa000888555aaabdaf888')
        .send({ item: { name: 'newname' } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong item info', (done) => {
      const itemOrig = new Item({ category: 'testCat1', kind: 'testKind1', name: 'testNameUpdateincomplete' });
      itemOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/items/id/${itemSaved._id}`)
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
        .get('/api/items/id/58aaa000888555aaabdafda0')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing item', (done) => {
      const item = new Item({ category: 'testCat1', kind: 'testKind1', name: 'testRetreiveName' });
      item.save((errSaving, itemSaved) => {
        chai.request(app)
          .get(`/api/items/id/${itemSaved._id}`)
          .send({})
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('item');
            res.body.item.should.be.a('object');
            res.body.item.should.have.property('category').eql(item.category);
            res.body.item.should.have.property('kind').eql(item.kind);
            res.body.item.should.have.property('name').eql(item.name);
            done();
          });
      });
    });
  });  /* End test the /GET/:cuid route */


  /*
  * Test the /DELETE/:cuid route
  */
  describe('Item Deletion', () => {
    it('it should fail deleting an unknown item', (done) => {
      chai.request(app)
        .delete('/api/items/id/58aaa000888555aaabdafda0')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing item', (done) => {
      const item = new Item({ category: 'testCat1', kind: 'testKind1', name: 'testDeleteName' });
      item.save((errSaving, itemSaved) => {
        chai.request(app)
          .delete(`/api/items/id/${itemSaved._id}`)
          .send({})
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Items */

