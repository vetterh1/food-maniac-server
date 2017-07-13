import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as ItemController from '../controllers/itemController';
import * as PlaceController from '../controllers/placeController';
import * as KindController from '../controllers/kindController';
import * as CategoryController from '../controllers/categoryController';
import * as MarkAggregateController from '../controllers/markAggregateController';
import * as MarkIndividualController from '../controllers/markIndividualController';

const router = new Router();


// ----------------  USERS ----------------

// Get all Items
router.route('/users').get(UserController.getUsers);

// Get one item by _id
router.route('/users/id/:_id').get(UserController.getUser);

// Add a new Item
router.route('/users').post(UserController.addUser);

// Update a item by _id
router.route('/users/id/:_id').post(UserController.updateUser);

// Delete a item by _id
router.route('/users/id/:_id').delete(UserController.deleteUser);




// ----------------  KINDS ----------------

// Get all kinds
router.route('/kinds').get(KindController.getKinds);

// Get one kind by _id
router.route('/kinds/id/:_id').get(KindController.getKind);

// Add a new kind
router.route('/kinds').post(KindController.addKind);

// Update a kind by _id
router.route('/kinds/id/:_id').post(KindController.updateKind);

// Delete a kind by _id
router.route('/kinds/id/:_id').delete(KindController.deleteKind);


// ----------------  CATEGORIES ----------------

// Get all categories
router.route('/categories').get(CategoryController.getCategories);

// Get one category by _id
router.route('/categories/id/:_id').get(CategoryController.getCategory);

// Add a new category
router.route('/categories').post(CategoryController.addCategory);

// Update a category by _id
router.route('/categories/id/:_id').post(CategoryController.updateCategory);

// Delete a category by _id
router.route('/categories/id/:_id').delete(CategoryController.deleteCategory);



// ----------------  ITEMS ----------------

// /GET /count - Get items count
// Input conditions: json object with a filter condition (optional, default = no filter)
// Returns code 500 on network error
// Returns code 200 otherwise + { count: nnnn }
// Ex 1: http://localhost:8080/api/items/count
// Ex 2: http://localhost:8080/api/items/count?conditions={"category":"58f4dfff45dab98a840aa000"}
router.route('/items/count').get(ItemController.getItemsCount);

// Get one item by _id
router.route('/items/id/:_id').get(ItemController.getItem);

// /GET route - Get all items with optional pagination, sorting & filters
// Optional inputs use Query parameters (?key1=value1&key2=value2)
// Input: 'offset' in the results (optional, default = 0)
// Input: 'limit' number of returned results (optional, default = 100)
// Input: 'sort' the results (optional, default = creation date, most recent 1st)
// Input: 'query' can filter the results (optional, default = no filter)
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { items }
// Note: items is an array that can be empty
// Ex 1: http://localhost:8080/api/items?offset=1&limit=3
// Ex 2: http://localhost:8080/api/items?offset=1&limit=3&sort={"name":1}&query={"category":"dish"}
// Ex 2: http://localhost:8080/api/items?query={"category":"dish"}
router.route('/items').get(ItemController.getItems);
// router.route('/items/:offset?/:limit?/:sort?/:query?').get(ItemController.getItems);

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

//
// Various admin batches
//

//  Batch update to get the right google id (place_id, not id!)
//  Should be called for every type of place (see options)
//  Options (see ex below):
//  - proxy: (default=none)
//  - type: place type. currently supported types are: restaurant, bakery, bar, cafe
//  Ex 1: http://localhost:8080/api/places/updateGoogleId
//  Ex 2: http://localhost:8080/api/places/updateGoogleId?options={"type":"bakery"}
//  Ex 3: http://localhost:8080/api/places/updateGoogleId?options={"type":"bakery", "proxy":"http://proxy:3128"}
router.route('/places/updateGoogleId').get(PlaceController.batchUpdatePlacesWithWrongGoogleId);

//  Batch update to get the right photo id if null
//  Options (see ex below):
//  - proxy: (default=none)
//  - maxwidth: maximum google image width  (default=250)
//    Note: if default is changed from 250, please update:
//    - placeController.batchUpdatePlacesWithGooglePhoto method (plus apiRoutes) on server side
//    - RetreiveLocations.componentWillReceiveProps method on Client side
//    - .result-item-picture in index.css on Client side
//  - forceall: update only places with empty googlePhotoUrl. If set to false, ALL places will be updated (default=false)
//  Ex 1: http://localhost:8080/api/places/updateGooglePhoto
//  Ex 2: http://localhost:8080/api/places/updateGooglePhoto?options={"proxy":"http://proxy:3128"}
//  Ex 3: http://localhost:8080/api/places/updateGooglePhoto?options={"maxwidth":"400", "forceall":"true", "proxy":"http://proxy:3128"}
router.route('/places/updateGooglePhoto').get(PlaceController.batchUpdatePlacesWithGooglePhoto);





// ----------------  markAggregates ----------------

// /GET /count - Get markAggregates count
// Input: conditions: json object with a filter condition (optional, default = no filter)
// Returns code 500 on network error
// Returns code 200 otherwise + { count: nnnn }
// Ex 1: http://localhost:8080/api/markAggregates/count
// Ex 2: http://localhost:8080/api/markAggregates/count?condition={"markOverall":"5"}
router.route('/markAggregates/count').get(MarkAggregateController.getMarkAggregatesCount);

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
// ex: http://localhost:8080/api/markAggregates/id/592d74e8761d1229e05078ef
router.route('/markAggregates/id/:_id').get(MarkAggregateController.getMarkAggregate);

// /POST/:_id route - Update a markAggregates by _id
// Returns code 400 on input parameters error (missing or update _id)
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found
// Note: markAggregate is the updated mark
router.route('/markAggregates/id/:_id').post(MarkAggregateController.updateMarkAggregate);

// /POST/bulkUpdates route - Bulk update of markAggregates by _conditions
// Input conditions: json object with the condition (mandatory, {} will update all marks!)
// Input changes: json object with the changes to perform (mandatory)
// Returns code 400 on input parameters error (missing)
// Returns code 500 on network error or not found
// Returns code 200 and no body if OK
// Ex 1: http://localhost:8080/api/markAggregates/bulkUpdates?conditions={"item": "592467e29148172dac4125a9"}&changes={"$set":{"markOverall":"4" }}
router.route('/markAggregates/bulkUpdates').post(MarkAggregateController.bulkUpdateMarkAggregate);

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
