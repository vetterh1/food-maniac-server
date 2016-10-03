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
  console.log("{ userController.getUsers");
  User.find().sort('-since').exec((err, users) => {
    if (err) {
      console.log("     userController.getUsers returns err: ", err);
      res.status(500).send(err);
    }
    res.json({users});
    console.log("     userController.getUsers length= ", users.length);
  });
  console.log("} userController.getUsers");
}


/**
 * Add a user
 * @param req
 * @param res
 * @returns void
 */

export function addUser(req, res) {
  console.log("{ userController.addUser");
  if (!req.body.user.login || !req.body.user.first || !req.body.user.last) {
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
      res.status(500).send(err);
    }
    res.json({ user: saved });
    console.log("} userController.addUser");
  });
  console.log("{ !userController.addUser failed!");
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
      res.status(500).send(err);
    }
    res.json({ user });
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
      res.status(500).send(err);
    }

    user.remove(() => {
      res.status(200).end();
    });
  });
}
