import test from 'ava';
import request from 'supertest';
import app from '../../server';
import Item from '../item';
import { connectDB, dropDB } from '../../util/test-helpers';
import { testItems } from '../../dummyData';


/*
test.beforeEach('connect and add two item entries', t => {
  connectDB(t, () => {
    // ????? Never arrives here !!!!
    console.log("     inside connectDB");
  });
});


test.afterEach.always(t => {
  dropDB(t);
});
*/

test.serial('Should correctly give number of Items', async t => {
  t.plan(2);

  const res1 = await request(app)
    .get('/api/items')
    .set('Accept', 'application/json');

  t.is(res1.status, 200);
  t.deepEqual(testItems.length, res1.body.items.length);
 });

test.serial('Should send correct data when queried against a cuid', async t => {
  t.plan(2);

  const item = new Item({name:'testItemAdd1', cuid: 'cuidTestAddItem1'});
  testItems.push( item );
  item.save();

  const res2 = await request(app)
    .get('/api/items/cuidTestAddItem1')
    .set('Accept', 'application/json');

  t.is(res2.status, 200);
  t.is(res2.body.item.login, item.login);
});
