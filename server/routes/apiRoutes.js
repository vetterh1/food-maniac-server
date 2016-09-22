var express = require('express')
var ApiController = require('../controllers/apiController')
const router = new express.Router();

// Get all Users
router.route('/users').get(ApiController.getUsers);

// Add a new User
router.route('/users').post(ApiController.addUser);

// Get one user by cuid
router.route('/users/:cuid').get(ApiController.getUser);

// Delete a user by cuid
router.route('/users/:cuid').delete(ApiController.deleteUser);

module.exports = router;
