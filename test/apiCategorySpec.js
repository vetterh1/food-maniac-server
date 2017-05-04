// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

/* global describe it beforeEach */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }] */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/boServer';
import Category from '../server/models/category';

const should = chai.should();
chai.use(chaiHttp);


describe('API Categories', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    Category.remove({}, () => {
      done();
    });
  });


  /*
  * Test the /GET route
  */
  describe('Categories list', () => {
    it('it should return an empty list when no category', (done) => {
      chai.request(app)
        .get('/api/categories')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.categories.should.be.a('array');
          res.body.categories.length.should.be.eql(0);
          done();
        });
    });

    it('it should list all the categories', (done) => {
      const categoriesList = [
        { name: 'testName1' },
        { name: 'testName2' },
        { name: 'testName3' },
        { name: 'testName4' },
        { name: 'testName5' },
      ];
      Category.create(categoriesList, () => {
        chai.request(app)
          .get('/api/categories')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.categories.should.be.a('array');
            res.body.categories.length.should.be.eql(categoriesList.length);
            done();
          });
      });
    });
  });


  /*
  * Test the /POST route
  */
  describe('Category Creation', () => {
    it('it should fail creating an incomplete category', (done) => {
      chai.request(app)
        .post('/api/categories')
        .send({ category: { } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should succeed creating a complete category', (done) => {
      const categoryComplete = { name: 'testPostName' };
      chai.request(app)
        .post('/api/categories')
        .send({ category: categoryComplete })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('category');
          res.body.category.should.be.a('object');
          res.body.category.should.have.property('name').eql(categoryComplete.name);
          done();
        });
    });

    it('it should fail creating an existing category', (done) => {
      const category = new Category({ name: 'testPostName2times' });
      category.save((err, categorySaved) => {
        chai.request(app)
          .post('/api/categories')
          .send({ category: categorySaved })
          .end((err2, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    it('it should fail creating with wrong category info', (done) => {
      chai.request(app)
        .post('/api/categories')
        .send({ WRONG_category: { name: 'testPostName' } })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });  /* End test the /POST route */


  /*
  * Test the /POST/:cuid route
  */
  describe('Category Update', () => {
    it('it should succeed updating a complete category', (done) => {
      const categoryOrig = new Category({ name: 'testNameUpdate1' });
      const categoryUpdt = { name: 'testNameUpdate1.2' };
      categoryOrig.save((errSaving, categorySaved) => {
        chai.request(app)
          .post(`/api/categories/id/${categorySaved._id}`)
          .send({ category: categoryUpdt })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('category');
            res.body.category.should.be.a('object');
            res.body.category.should.have.property('name').eql(categoryUpdt.name);
            done();
          });
      });
    });

    it('it should fail updating _id', (done) => {
      const categoryOrig = new Category({ name: 'testNameUpdateCuid' });
      categoryOrig.save((errSaving, categorySaved) => {
        chai.request(app)
          .post(`/api/categories/id/${categorySaved._id}`)
          .send({ category: { _id: '58aaa000888555aaabdaf444' } })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    it('it should fail updating an unknown category', (done) => {
      chai.request(app)
        .post('/api/categories/id/58aaa000888555aaabdafddd')
        .send({ category: { name: 'newName' } })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should fail updating with wrong category info', (done) => {
      const categoryOrig = new Category({ cuid: 'cuidUpdateIncomplete', name: 'testNameUpdateIncomplete' });
      categoryOrig.save(() => {
        chai.request(app)
          .post('/api/categories/id/58aaa000888555aaabdafddd')
          .send({ WRONG_category: { name: 'newName' } })
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
  describe('Category Retrieval', () => {
    it('it should fail finding an unknown category', (done) => {
      chai.request(app)
        .get('/api/categories/id/58aaa000888555aaabdaf666')
        .send({})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should find an existing category', (done) => {
      const category = new Category({ name: 'testRetreiveName' });
      category.save((err, categorySaved) => {
        chai.request(app)
          .get(`/api/categories/id/${categorySaved._id}`)
          .end((err2, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('category');
            res.body.category.should.be.a('object');
            res.body.category.should.have.property('name').eql(category.name);
            done();
          });
      });
    });
  });

  /*
  * Test the /DELETE/:cuid route
  */
  describe('Category Deletion', () => {
    it('it should fail deleteing an unknown category', (done) => {
      chai.request(app)
        .delete('/api/categories/id/58aaa000888555aaabdafff9')
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('it should delete an existing category', (done) => {
      const category = new Category({ name: 'testDeleteName' });
      category.save((errSaving, categorySaved) => {
        chai.request(app)
          .delete(`/api/categories/id/${categorySaved._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});   /* Categories */
