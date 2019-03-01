import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html'; // sanitizeHtml escapes &<>" : s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
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
  if (!req.body || !req.body.user || !req.body.user.id || !req.body.user.displayedName) {
    logger.error('userController.addUser failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.user) logger.error('... no req.body.user!');
    if (req.body && req.body.user && !req.body.user.id) logger.error('... no req.body.user.id!');
    if (req.body && req.body.user && !req.body.user.displayedName) logger.error('... no req.body.user.displayedName!');
    res.status(400).end();
  } else {
    const newUser = new User(req.body.user);

    // Let's sanitize inputs
    newUser.displayedName = sanitizeHtml(newUser.displayedName);
    newUser.save((err, saved) => {
      if (err) {
        logger.error(`userController.addUser ${newUser.id} failed - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ user: saved });
        logger.info(`userController.addUser ${newUser.id} (_id=${saved._id})`);
      }
    });
  }
}



/*
 * Add a user (or update if already exists)
 */ 
export function addOrUpdateByAuthId(req, res) {
  if (!req.body || !req.body.user || !req.body.user.authId || !req.body.user.displayedName) {
    const error = { status: 'error', message: 'userController.updateUser failed - no body or user or user mandatory info' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.user) error.message += '... no req.body.user!';
    if (req.body && !req.body.user.authId) error.message += '... no req.body.user.authId!';
    if (req.body && !req.body.user.displayedName) error.message += '... no req.body.user.displayedName!';
    res.status(400).json(error);
  } else if (req.body && req.body.user && req.body.user._id) {
    res.status(400).json({ status: 'error', message: 'userController.updateUser failed - _id cannot be changed' });
  } else {
    User.findOneAndUpdate({ authId: req.body.user.authId }, { authId: req.body.user.authId, displayedName: req.body.user.displayedName }, { new: true, upsert: true }, (err, user) => {
      if (err || !user) {
        logger.error(`userController.updateUser ${req.body.user.authId} / ${req.body.user.displayedName} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ user });
        logger.info(`userController.updateUser ${req.body.user.authId} /  ${req.body.user.displayedName}`);
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
