var User = require('../models/user')
var cuid = require('cuid')
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
  });
}
module.exports.addUser = addUser;

