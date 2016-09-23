var express = require('express')
var userController = require('../controllers/userController')
const router = new express.Router();

// Get all Users
router.route('/users').get(userController.getUsers);

// Add a new User
router.route('/users').post(userController.addUser);

// Get one user by cuid
router.route('/users/:cuid').get(userController.getUser);

// Delete a user by cuid
router.route('/users/:cuid').delete(userController.deleteUser);

module.exports = router;
