var User = require('../models/user')
var cuid = require('cuid') // https://github.com/ericelliott/cuid
var sanitizeHtml = require('sanitize-html')

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
function getUsers(req, res) {
  User.find().sort('-since').exec((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ users });
  });
}
module.exports.getUsers = getUsers;


/**
 * Add a user
 * @param req
 * @param res
 * @returns void
 */

function addUser(req, res) {
  console.log("{ userController.addUser");
  if (!req.body.user.login || !req.body.user.first || !req.body.user.last) {
    res.status(403).end();
  }

  const newUser = new User(req.body.user);

  // Let's sanitize inputs
  newUser.title = sanitizeHtml(newUser.title);
  newuser.cuid = cuid();
  newUser.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ user: saved });
    console.log("} userController.addUser");
  });
  console.log("{ !userController.addUser failed!");
}
module.exports.addUser = addUser;


/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
function getUser(req, res) {
  console.log("{ userController.getUser: ", req.params.cuid );

  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ user });
  });
}
module.exports.getUser = getUser;


/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
function deleteUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }

    user.remove(() => {
      res.status(200).end();
    });
  });
}
module.exports.deleteUser = deleteUser;
