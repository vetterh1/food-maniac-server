import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html';
import User from '../models/user';


/*
 * Get all users
 */
export function getUsers(req, res) {
  User.find().sort('-since').exec((err, users) => {
    if (err) {
      logger.error('userController.getUsers returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ users });
      logger.info(`userController.getUsers length=${users.length}`);
    }
  });
}


/*
 * Add a user
 */

export function addUser(req, res) {
  if (!req.body || !req.body.user || !req.body.user.login || !req.body.user.first || !req.body.user.last) {
    logger.error('userController.addUser failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.user) logger.error('... no req.body.user!');
    if (req.body && req.body.user && !req.body.user.login) logger.error('... no req.body.user.login!');
    if (req.body && req.body.user && !req.body.user.first) logger.error('... no req.body.user.first!');
    if (req.body && req.body.user && !req.body.user.last) logger.error('... no req.body.user.last!');
    res.status(400).end();
  } else {
    const newUser = new User(req.body.user);

    // Let's sanitize inputs
    newUser.login = sanitizeHtml(newUser.login);
    newUser.first = sanitizeHtml(newUser.first);
    newUser.last = sanitizeHtml(newUser.last);
    newUser.save((err, saved) => {
      if (err) {
        logger.error(`userController.addUser ${newUser.login} failed - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ user: saved });
        logger.info(`userController.addUser ${newUser.login} (_id=${saved._id})`);
      }
    });
  }
}


/*
 * Get a single user
 */
export function getUser(req, res) {
  User.findById(req.params._id).exec((err, user) => {
    if (err || !user) {
      logger.error(`userController.getUser ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ user });
      logger.info(`userController.getUser ${user.last} (_id=${req.params._id})`);
    }
  });
}


/*
 * Update an existing user
 */
export function updateUser(req, res) {
  if (!req.body || !req.body.user) {
    const error = { status: 'error', message: 'userController.updateUser failed - no body or user' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.user) error.message += '... no req.body.user!';
    res.status(400).json(error);
  } else if (req.body && req.body.user && req.body.user._id) {
    res.status(400).json({ status: 'error', message: 'userController.updateUser failed - _id cannot be changed' });
  } else {
    User.findOneAndUpdate({ _id: req.params._id }, req.body.user, { new: true }, (err, user) => {
      if (err || !user) {
        logger.error(`userController.updateUser ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ user });
        logger.info(`userController.updateUser ${req.params._id}`);
      }
    }); 
  }
}



/*
 * Delete an existing user
 */
export function deleteUser(req, res) {
  User.findOne({ _id: req.params._id }).exec((err, user) => {
    if (err || !user) {
      logger.error(`userController.deleteUser ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      user.remove(() => {
        if (err) {
          logger.error(`userController.deleteUser ${req.params._id} failed to remove - err = `, err);
          res.status(500).send(err);
        }
        else {
          res.status(200).end();
          logger.info(`userController.deleteUser ${req.params._id}`);
        }
      });
    }
  });
}
