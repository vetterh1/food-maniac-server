import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as ItemController from '../controllers/itemController';
const router = new Router();


// ----------------  USERS ---------------- 

// Get all Items
router.route('/users').get(UserController.getUsers);

// Get one user by cuid
router.route('/users/:cuid').get(UserController.getUsers);

// Add a new Item
router.route('/users').post(UserController.addUser);

// Delete a user by cuid
router.route('/users/:cuid').delete(UserController.deleteUser);


// ----------------  ITEMS ---------------- 

// Get all Items
router.route('/items').get(ItemController.getItems);

// Get one item by cuid
router.route('/items/:cuid').get(ItemController.getItem);

// Add a new Item
router.route('/items').post(ItemController.addItem);

// Delete a item by cuid
router.route('/items/:cuid').delete(ItemController.deleteItem);



export default router;
