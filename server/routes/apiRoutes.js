import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as ItemController from '../controllers/itemController';
import * as PlaceController from '../controllers/placeController';
import * as MarkController from '../controllers/markController';

const router = new Router();


// ----------------  USERS ----------------

// Get all Items
router.route('/users').get(UserController.getUsers);

// Get one user by _id
router.route('/users/id/:_id').get(UserController.getUser);

// Add a new Item
router.route('/users').post(UserController.addUser);

// Update a user by _id
router.route('/users/id/:_id').post(UserController.updateUser);

// Delete a user by _id
router.route('/users/id/:_id').delete(UserController.deleteUser);


// ----------------  ITEMS ----------------

// Get items count
router.route('/items/count').get(ItemController.getItemsCount);

// Get one item by _id
router.route('/items/id/:_id').get(ItemController.getItem);

// Get all Items
router.route('/items/:offset?/:limit?').get(ItemController.getItems);

// Add a new Item
router.route('/items').post(ItemController.addItem);

// Update a user by _id
router.route('/items/id/:_id').post(ItemController.updateItem);

// Delete a item by _id
router.route('/items/id/:_id').delete(ItemController.deleteItem);


// ----------------  PLACES ----------------
// Note: _id is currently the google id

// Get all places
router.route('/places').get(PlaceController.getPlaces);

// Get one place by _id
router.route('/places/id/:_id').get(PlaceController.getPlace);

// Get one place by googleMapId
router.route('/places/googleMapId/:googleMapId').get(PlaceController.getPlaceByGoogleMapId);

// Add a new place
router.route('/places').post(PlaceController.addPlace);

// Add a new place (or update if already exists)
router.route('/places/addOrUpdatePlaceByGoogleMapId').post(PlaceController.addOrUpdatePlaceByGoogleMapId);

// Update a place by _id
router.route('/places/id/:_id').post(PlaceController.updatePlace);

// Delete a place by _id
router.route('/places/id/:_id').delete(PlaceController.deletePlace);


// ----------------  MARKS ----------------

// Get all marks
router.route('/marks').get(MarkController.getMarks);

// Get one mark by _id
router.route('/marks/id/:_id').get(MarkController.getMark);

// Add a new mark
router.route('/marks').post(MarkController.addMark);

// Update a user by _id
router.route('/marks/id/:_id').post(MarkController.updateMark);

// Delete a mark by _id
router.route('/marks/id/:_id').delete(MarkController.deleteMark);



export default router;
