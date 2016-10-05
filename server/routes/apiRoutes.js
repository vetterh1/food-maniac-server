import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as ItemController from '../controllers/itemController';
import * as PlaceController from '../controllers/placeController';
const router = new Router();


// ----------------  USERS ---------------- 

// Get all Items
router.route('/users').get(UserController.getUsers);

// Get one user by cuid
router.route('/users/:cuid').get(UserController.getUser);

// Add a new Item
router.route('/users').post(UserController.addUser);

// Update a user by cuid
router.route('/users/:cuid').post(UserController.updateUser);

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


// ----------------  PLACES ---------------- 

// Get all Items
router.route('/places').get(PlaceController.getPlaces);

// Get one place by cuid
router.route('/places/:cuid').get(PlaceController.getPlaces);

// Add a new Item
router.route('/places').post(PlaceController.addPlace);

// Delete a place by cuid
router.route('/places/:cuid').delete(PlaceController.deletePlace);




export default router;
