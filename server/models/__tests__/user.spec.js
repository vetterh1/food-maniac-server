import test from 'ava';
import request from 'supertest';
import app from '../../server';
import User from '../user';
import { connectDB, dropDB } from '../../util/test-helpers';
import { testUsers } from '../../dummyData';



test.beforeEach('connect and add two user entries', t => {
  connectDB(t, () => {
    // ????? Never arrives here !!!!
    console.log("     inside connectDB");
  });
});


test.afterEach.always(t => {
  dropDB(t);
});


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

  const user = new User({login:'testAvaUser3', first:'testAvaFirst3', last:'testAvaLast3', mark: 0, cuid: 'f34gb2bh2000003'});
  user.save();

  const res2 = await request(app)
    .get('/api/users/f34gb2bh2000003')
    .set('Accept', 'application/json');

  t.is(res2.status, 200);
  t.is(res2.body.user.login, user.login);
});
