/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */
/* eslint-disable max-len */

// import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Item from '../server/models/item';
import * as td from './testData';

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
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('count').eql(0);
          done();
        });
    });

    it('it should count the items', (done) => {
      Item.create(td.testItems, () => {
        chai.request(app)
          .get('/api/items/count')
          .end((err, res) => {
            should.not.exist(err);
            res.body.should.be.a('object');
            res.body.should.have.property('count').eql(td.testItems.length);
            done();
          });
      });
    });

    it('it should count with filter', (done) => {
      Item.create(td.testItems, () => {
        const category = '58f4dfff45dab98a840aa002';
        const kind = '58f4dfff45dab98a840ab001';
        chai.request(app)
          .get(`/api/items/count?conditions={"category":"${category}","kind": "${kind}"}`)
          .end((err, res) => {
            should.not.exist(err);
            res.body.should.be.a('object');
            res.body.should.have.property('count').eql(td.testItems.filter(item => item.category === category && item.kind === kind).length);
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
          should.not.exist(err);
          res.should.have.status(200);
          res.body.items.should.be.a('array');
          res.body.items.length.should.be.eql(0);
          done();
        });
    });

    it('it should list all the items & output should include virtuals like id', (done) => {
      Item.create(td.testItems, () => {
        chai.request(app)
          .get('/api/items')
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            res.body.items.should.be.a('array');
            res.body.items.length.should.be.eql(td.testItems.length);
            res.body.items[0].name.should.be.eql('Margarita');
            // Verify that the virtuals are added to this schema (the_schema.set('toJSON', { virtuals: true, });)
            res.body.items[0].id.should.be.eql(res.body.items[0]._id);
            done();
          });
      });
    });

    it('it should return paginated items with sort and filter', (done) => {
      Item.create(td.testItems, () => {
        chai.request(app)
          .get('/api/items?offset=2&limit=3&sort={"since":-1}&query={"category":"58f4dfff45dab98a840aa000"}')
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            res.body.items.should.be.a('array');
            res.body.items.length.should.be.eql(3);
            res.body.items[0].name.should.be.eql('Shrimp Croquettes');
            res.body.items[1].name.should.be.eql('Taco');
            res.body.items[2].name.should.be.eql('Burrito');
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
      const itemcomplete = { category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab005', name: 'testPostName' };
      chai.request(app)
        .post('/api/items')
        .send({ item: itemcomplete })
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('item');
          res.body.item.should.be.a('object');
          res.body.item.should.have.property('name').eql(itemcomplete.name);
          done();
        });
    });

    it('it should fail creating an existing item', (done) => {
      const item = new Item(td.testItems[0]);
      item.save(() => {
        chai.request(app)
          .post('/api/items')
          .send({ item: td.testItems[0] })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong item info', (done) => {
      chai.request(app)
        .post('/api/items')
        .send({ WRONG_item: td.testItems[0] })
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
      const itemOrig = new Item(td.testItems[0]);
      const itemUpdt = { name: 'testnameUpdate1.2' };
      itemOrig.save((errSaving, itemSaved) => {
        chai.request(app)
          .post(`/api/items/id/${itemSaved._id}`)
          .send({ item: itemUpdt })
          .end((err, res) => {
            should.not.exist(err);
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
      const itemOrig = new Item(td.testItems[0]);
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
      const itemOrig = new Item(td.testItems[0]);
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
      const item = new Item(td.testItems[0]);
      item.save((errSaving, itemSaved) => {
        chai.request(app)
          .get(`/api/items/id/${itemSaved._id}`)
          .send({})
          .end((err2, res) => {
            should.not.exist(err2);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('item');
            res.body.item.should.be.a('object');
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
      const item = new Item(td.testItems[0]);
      item.save((errSaving, itemSaved) => {
        chai.request(app)
          .delete(`/api/items/id/${itemSaved._id}`)
          .send({})
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Items */

