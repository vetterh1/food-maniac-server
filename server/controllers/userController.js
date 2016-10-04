import User from '../models/user';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';


/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
export function getUsers(req, res) {
  User.find().sort('-since').exec((err, users) => {
    if (err) {
      console.log("! userController.getUsers returns err: ", err);
      res.status(500).send(err);
    }
    else
    {
      res.json({users});
      console.log(`userController.getUsers length=${users.length}`);
    }
  });
}


/**
 * Add a user
 * @param req
 * @param res
 * @returns void
 */

export function addUser(req, res) {
  if (!req.body.user.login || !req.body.user.first || !req.body.user.last) {
    console.log(`! userController.addUser ${req.body.user} failed! - missing mandatory fields`);
    res.status(403).end();
  }

  const newUser = new User(req.body.user);

  // Let's sanitize inputs
  newUser.login = sanitizeHtml(newUser.login);
  newUser.first = sanitizeHtml(newUser.first);
  newUser.last = sanitizeHtml(newUser.last);
  newUser.cuid = cuid();
  newUser.save((err, saved) => {
    if (err) {
      console.log(`! userController.addUser ${newUser.login} failed! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      res.json({ user: saved });
      console.log(`userController.addUser ${newUser.login}`);
    }
  });
}


/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      console.log(`! userController.getUser ${req.params.cuid} failed! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      res.json({ user });
      console.log(`userController.getUser ${req.params.cuid}`);
    }
  });
}


/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
export function deleteUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      console.log(`! userController.deleteUser ${req.params.cuid} failed! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      user.remove(() => {
        res.status(200).end();
        console.log(`userController.deleteUser ${req.params.cuid}`);
      });
    }
  });
}
