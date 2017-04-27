import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as ItemController from '../controllers/itemController';
import * as PlaceController from '../controllers/placeController';
import * as MarkAggregateController from '../controllers/markAggregateController';
import * as MarkIndividualController from '../controllers/markIndividualController';

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


// ----------------  markAggregates ----------------

// /GET route - Get all markAggregates
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markAggregates }
// Note: markAggregates is an array that can be empty
router.route('/markAggregates').get(MarkAggregateController.getMarkAggregates);

// /GET /itemId/... route - Get all markAggregates for one item (option: by distance)
// Returns code 400 on missing parameter
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markAggregates }
// Note: markAggregates is an array that can be empty
router.route('/markAggregates/itemId/:_itemId/maxDistance/:_maxDistance/lat/:_lat/lng/:_lng').get(MarkAggregateController.getMarkAggregatesByItemIdAndDistance);

// /GET/:_id route - Get one markAggregate by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found
router.route('/markAggregates/id/:_id').get(MarkAggregateController.getMarkAggregate);

// /POST/:_id route - Update a markAggregates by _id
// Returns code 400 on input parameters error (missing or update _id)
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found
// Note: markAggregate is the updated mark
router.route('/markAggregates/id/:_id').post(MarkAggregateController.updateMarkAggregate);

// /DELETE/:_id route - Delete a markAggregates by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error, delete error or not found
// Returns code 200 on success (no value returned)
router.route('/markAggregates/id/:_id').delete(MarkAggregateController.deleteMarkAggregate);


// ----------------  markIndividuals ----------------

// /GET route - Get all markIndividuals
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markIndividuals }
// Note: markIndividuals is an array that can be empty
router.route('/markIndividuals').get(MarkIndividualController.getMarkIndividuals);

// /GET route - Get all markIndividuals for one aggregate
// Returns code 400 on missing parameter
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markIndividuals }
// Note: markIndividuals is an array that can be empty
router.route('/markIndividuals/markAggregateId/:_markAggregatesId').get(MarkIndividualController.getMarkIndividualsByMarkAggregateId);

// /GET/:_id route - Get one markIndividual by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error or not found
// Returns code 200 + { markIndividual } if found
router.route('/markIndividuals/id/:_id').get(MarkIndividualController.getMarkIndividual);

// /POST route - Add a new markIndividuals (and update/create corresponding aggregate)
// Returns code 400 on input parameters error
// Returns code 500 on saving error
// Returns code 200 otherwise + { markIndividual, markAggregate }
router.route('/markIndividuals').post(MarkIndividualController.addMarkIndividual);

// /POST/:_id route - Update a markIndividuals by _id
// Returns code 400 on input parameters error (missing or update _id)
// Returns code 500 on network error or not found
// Returns code 200 + { markIndividual } if found
// Note: markIndividual is the updated mark
// Note: NO update of corresponding aggregate
router.route('/markIndividuals/id/:_id').post(MarkIndividualController.updateMarkIndividual);

// /DELETE/:_id route - Delete a markIndividuals by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error, delete error or not found
// Returns code 200 on success (no value returned)
// Note: NO update of corresponding aggregate
router.route('/markIndividuals/id/:_id').delete(MarkIndividualController.deleteMarkIndividual);



export default router;
