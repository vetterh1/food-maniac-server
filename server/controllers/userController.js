import User from '../models/user';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';


/*
 * Get all users
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


/*
 * Add a user
 */

export function addUser(req, res) {
  
  if (!req.body || !req.body.user || !req.body.user.login || !req.body.user.first || !req.body.user.last) {
    console.log("! userController.addUser failed! - missing mandatory fields");
    if (!req.body )
      console.log("... no req.body!");
    if (req.body && !req.body.user )
      console.log("... no req.body.user!");
    if (req.body && req.body.user && !req.body.user.login )
      console.log("... no req.body.user.login!");
    if (req.body && req.body.user && !req.body.user.first )
      console.log("... no req.body.user.first!");
    if (req.body && req.body.user && !req.body.user.last )
      console.log("... no req.body.user.last!");
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


/*
 * Get a single user
 */
export function getUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err || !user) {
      console.log(`! userController.getUser ${req.params.cuid} failed to find! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      res.json({ user: user });
      console.log(`userController.getUser ${req.params.cuid}`);
    }
  });
}


/*
 * Update an existing user
 */
export function updateUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if(err) {
      console.log(`! userController.updateUser ${req.params.cuid} failed to find! - err = `, err);
      res.send(err);
    }
    Object.assign(user, req.body).save((err, user) => {
      if(err){
          console.log(`! userController.updateUser ${req.params.cuid} failed to save! - err = `, err);
          res.send(err);
      }
      res.json({ user: user });
      console.log(`userController.updateUser ${req.params.cuid}`);
    }); 
  });
}



/*
 * Delete an existing user
 */
export function deleteUser(req, res) {
  User.findOne({ cuid: req.params.cuid }).exec((err, user) => {
    if (err) {
      console.log(`! userController.deleteUser ${req.params.cuid} failed to find! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      user.remove((err) => {
        if (err) {
          console.log(`! userController.deleteUser ${req.params.cuid} failed to remove! - err = `, err);
          res.status(500).send(err);
        }
        else {
          res.status(200).end();
          console.log(`userController.deleteUser ${req.params.cuid}`);
        }
      });
    }
  });
}
