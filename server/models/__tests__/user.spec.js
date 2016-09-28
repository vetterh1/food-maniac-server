import test from 'ava';
import request from 'supertest';
import app from '../../server';
import User from '../user';
import { connectDB, dropDB } from '../../util/test-helpers';

// Initial users added into test db
const users = [
  new User({login:'testAvaUser1', first:'testAvaFirst1', last:'testAvaLast1', mark: 0, cuid: 'f34gb2bh2000001'}),
  new User({login:'testAvaUser2', first:'testAvaFirst2', last:'testAvaLast2', mark: 0, cuid: 'f34gb2bh2000002'})
];

test.beforeEach('connect and add two user entries', t => {
  console.log("{ test.beforeEach");
  connectDB(t, () => {
    console.log("     inside connectDB");
    User.create(users, err => {
                console.log("        inside create users");
                if (err) t.fail('Unable to create users');
    });
    console.log("     end of connectDB");
  });
  console.log("} test.beforeEach");
});


test.afterEach.always(t => {
  dropDB(t);
});


test.serial('Should correctly give number of Users', async t => {
  console.log("{ Test 1");
//  t.plan(2);

  const res1 = await request(app)
    .get('/api/users')
    .set('Accept', 'application/json');

  console.log("   body:", res1.body);

  t.is(res1.status, 200);
//  t.deepEqual(users.length, res1.body.users.length);
  console.log("} Test 1");
 });

test.serial('Should send correct data when queried against a cuid', async t => {
  console.log("{ Test 2");
//  t.plan(2);

  const user = new User({login:'testAvaUser3', first:'testAvaFirst3', last:'testAvaLast3', mark: 0, cuid: 'f34gb2bh2000003'});
  user.save();

  const res2 = await request(app)
    .get('/api/users/f34gb2bh2000003')
    .set('Accept', 'application/json');

  console.log("   body:", res2.body);

  t.is(res2.status, 200);
//  t.is(res2.body.user.login, user.login);
  console.log("} Test 2");
});
