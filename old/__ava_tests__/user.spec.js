import test from 'ava';
import request from 'supertest';
import app from '../../server';
import User from '../user';
import { connectDB, dropDB } from '../../util/test-helpers';
import { testUsers } from '../../dummyData';


/*
test.beforeEach('connect and add two user entries', t => {
  connectDB(t, () => {
    // ????? Never arrives here !!!!
    console.log("     inside connectDB");
  });
});


test.afterEach.always(t => {
  dropDB(t);
});
*/

test.serial('Should correctly give number of Users', async t => {
  t.plan(2);

  const res1 = await request(app)
    .get('/api/users')
    .set('Accept', 'application/json');

  t.is(res1.status, 200);
  t.deepEqual(testUsers.length, res1.body.users.length);
 });

test.serial('Should send correct data when queried against a cuid', async t => {
  t.plan(2);

  const user = new User({login:'testUserAdd1', first:'testAddFirst1', last:'testAddLast1', mark: 0, cuid: 'cuidTestAddUser1'});
  testUsers.push( user );
  user.save();

  const res2 = await request(app)
    .get('/api/users/cuidTestAddUser1')
    .set('Accept', 'application/json');

    console.log("res2.body.user:", res2.body.user);

  t.is(res2.status, 200);
  t.is(res2.body.user.login, user.login);
});
