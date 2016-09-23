var ava = require('ava')
const test = ava.test
var request = require('supertest') // https://github.com/visionmedia/supertest
var app = require('../../server')
var User = require('../user')
var helpers = require('../../util/test-helpers')


// Initial users added into test db
const users = [
  new User({login:'testAvaUser1', first:'testAvaFirst1', last:'testAvaLast1', mark: 0, cuid: 'f34gb2bh2000001'}),
  new User({login:'testAvaUser2', first:'testAvaFirst2', last:'testAvaLast2', mark: 0, cuid: 'f34gb2bh2000002'})
];

test.beforeEach('connect and add two user entries', t => {
  helpers.connectDB(t, () => {
    User.find().remove({}).exec()
      .then(  User.create(users, err => {
                if (err) t.fail('Unable to create users');
              })
      );
  });
});


test.afterEach.always(t => {
  helpers.dropDB(t);
});


test('foo', t => {
    t.pass();
});




test.serial('Should correctly give number of Users', async t => {
  console.log("{ Test 1");
  t.plan(4);

  const res1 = await request(app)
    .get('/api/users')
    .set('Accept', 'application/json');

  console.log("   body:", res1.body);

  t.is(res1.status, 200);
  t.deepEqual(users.length, res1.body.users.length);
  console.log("} Test 1");
// });

// test.serial('Should send correct data when queried against a cuid', async t => {
  console.log("{ Test 2");
  // t.plan(2);

  const user = new User({login:'testAvaUser3', first:'testAvaFirst3', last:'testAvaLast3', mark: 0, cuid: 'f34gb2bh2000003'});
  user.save();

  const res2 = await request(app)
    .get('/api/users/f34gb2bh2000003')
    .set('Accept', 'application/json');

  console.log("   body:", res2.body);

  t.is(res2.status, 200);
  t.is(res2.body.user.login, user.login);
  console.log("} Test 2");
});

/*
test.serial('Should correctly add a user', async t => {
  t.plan(2);

  const res = await request(app)
    .post('/api/users')
    .send({ user: {login:'testAvaUser5', first:'testAvaFirst5', last:'testAvaLast5', mark: 0, cuid: 'f34gb2bh2000005'} })
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const savedUser = await User.findOne({ first:'testAvaFirst5' }).exec();
  t.is(savedUser.login, 'testAvaUser5');
});

test.serial('Should correctly delete a user', async t => {
  t.plan(2);

  const user = new User({login:'testAvaUser4', first:'testAvaFirst4', last:'testAvaLast4', mark: 0, cuid: 'f34gb2bh2000004'});
  user.save();

  const res = await request(app)
    .delete(`/api/users/${user.cuid}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedUser = await User.findOne({ cuid: user.cuid }).exec();
  t.is(queriedUser, null);
});
*/