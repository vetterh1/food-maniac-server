import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as ItemController from '../controllers/itemController';
import * as PlaceController from '../controllers/placeController';
import * as MarkController from '../controllers/markController';

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

// Get items count
router.route('/items/count').get(ItemController.getItemsCount);

// Get all Items
router.route('/items/:offset?/:limit?').get(ItemController.getItems);

// Get one item by cuid
router.route('/items/:cuid').get(ItemController.getItem);

// Add a new Item
router.route('/items').post(ItemController.addItem);

// Update a user by cuid
router.route('/items/:cuid').post(ItemController.updateItem);

// Delete a item by cuid
router.route('/items/:cuid').delete(ItemController.deleteItem);


// ----------------  PLACES ----------------
// Note: cuid is currently the google id

// Get all places
router.route('/places').get(PlaceController.getPlaces);

// Get one place by cuid
router.route('/places/:cuid').get(PlaceController.getPlace);

// Add a new place
router.route('/places').post(PlaceController.addPlace);

// Add a new place (or update if already exists)
router.route('/places/addOrUpdatePlace').post(PlaceController.addOrUpdatePlace);

// Update a place by cuid
router.route('/places/:cuid').post(PlaceController.updatePlace);

// Delete a place by cuid
router.route('/places/:cuid').delete(PlaceController.deletePlace);


// ----------------  MARKS ----------------

// Get all marks
router.route('/marks').get(MarkController.getMarks);

// Get one mark by cuid
router.route('/marks/:cuid').get(MarkController.getMark);

// Add a new mark
router.route('/marks').post(MarkController.addMark);

// Update a user by cuid
router.route('/marks/:cuid').post(MarkController.updateMark);

// Delete a mark by cuid
router.route('/marks/:cuid').delete(MarkController.deleteMark);



export default router;
