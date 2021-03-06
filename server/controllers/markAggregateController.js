import * as logger from 'winston';
import MarkAggregate from '../models/markAggregate';
import { distanceInKm, formatDistance } from '../util/mapUtils';
// import stringifyOnce from '../util/stringifyOnce';



// /GET /count - Get markAggregates count
// Input: conditions: json object with a filter condition (optional, default = no filter)
// Returns code 500 on network error
// Returns code 200 otherwise + { count: nnnn }
// Ex 1: http://localhost:8080/api/markAggregates/count
// Ex 2: http://localhost:8080/api/markAggregates/count?conditions={"markOverall":"5"}

export function getMarkAggregatesCount(req, res) {
  // LATER: query should return MarkAggregates of current user.
  const conditions = req.query.conditions ? JSON.parse(req.query.conditions) : {};
  MarkAggregate.countDocuments(conditions, (err, count) => {
    if (err) {
      logger.error('itemController.getMarkAggregatesCount returns err: ', err);
      res.status(500).send(err);
    } else {
      // Simulate json errors :) :
      // res.status(200).type('json').send('{"valid":"valid json but not what expected!"}'); // Should display error=01
      // res.status(200).type('json').send('{"invalid"}'); // Should display error=02
      // res.status(500).type('json').send('{"error": "message from server"}'); // Should display error=500
      res.json({ count });
      logger.info(`itemController.getMarkAggregatesCount returns ${count} with conditions ${req.query.conditions}`);
    }
  });
}



// /GET route - Get all markAggregates
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markAggregates }
// Note: markAggregates is an array that can be empty

export function getMarkAggregates(req, res) {
  MarkAggregate.find().sort('-since').exec((err, markAggregates) => {
    if (err) {
      logger.error('markAggregateController.getMarkAggregates returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ markAggregates });
      logger.info(`markAggregateController.getMarkAggregates length=${markAggregates.length}`);
    }
  });
}


// /GET /itemId/... route - Get all markAggregates for one or all item(s)
// Returns code 400 on missing parameter
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markAggregates }
// Note: markAggregates is an array that can be empty
// Note: to retreive all the items per distance, use 'all' for the itemId

export function getMarkAggregatesByItemIdAndDistance(req, res) {
  if (!req.params._itemId || req.params._itemId === 'undefined' || req.params._itemId === 'null') {
    const error = { status: 'error', message: 'markAggregateController.getMarkAggregatesByItemIdAndDistance failed - missing mandatory parameter: _itemId' };
    logger.error(error);
    res.status(400).json(error);
  } else {
    const findFilter = req.params._itemId === 'all' ? {} : { item: req.params._itemId };
    const query = MarkAggregate
      .find(findFilter) // find all the AGGREGATED markAggregates for one item
      .populate('place', 'name googleMapId googlePhotoUrl') // add a limitied place item (with name, googlePhotoUrl information (available with place.xxx))
      .sort({ markOverall: -1 }); // sort by rating (from best to worst)

    // If ask for any item ('all'), add the item name to every result
    if (req.params._itemId === 'all') {
      query
        .populate('item', 'name i18n'); // add a limited item object (only name & i18n)
    }

    if (req.params._maxDistance && req.params._maxDistance > 0 && req.params._lat && req.params._lng) {
      query
        // Restrict by distance (in metres) if asked
        .where('location')
        .near({
          center: {
            coordinates: [req.params._lng, req.params._lat],
            type: 'Point',
          },
          maxDistance: req.params._maxDistance,
          spherical: true,
        });
    }

    query
      .exec((err, markAggregates) => {
        if (err) {
          logger.error('markAggregateController.getMarkAggregatesByItemIdAndDistance returns err: ', err);
          res.status(500).send(err);
        } else {
          // Simulate json errors :) :
          // res.status(200).type('json').send('{"valid":"valid json but not what expected!"}'); // Should display error=03 (ok)
          // res.status(200).type('json').send('{"invalid"}'); // Should display error=04 (ok)
          // res.status(500).send('{"error": "message from server"}'); // Should display error=500 (ok)

          if (req.params._lat && req.params._lng) {
            const markAggregatesWithDistance = markAggregates.map((mark) => {
              const distance = distanceInKm(mark.location.coordinates[1], mark.location.coordinates[0], req.params._lat, req.params._lng);
              const distanceFormated = formatDistance(distance);
              const jsonMark = JSON.parse(JSON.stringify(mark));
              return Object.assign({}, jsonMark, { distance, distanceFormated });
            });

            res.json({ markAggregates: markAggregatesWithDistance });
            logger.info(`markAggregateController.getMarkAggregatesByItemIdAndDistance length=${markAggregatesWithDistance.length}`);
          } else {
            res.json({ markAggregates });
            logger.info(`markAggregateController.getMarkAggregatesByItemIdAndDistance length=${markAggregates.length}`);
          }
        }
      });
  }
}




// /GET/:_id route - Get one markAggregate by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found

export function getMarkAggregate(req, res) {
  if (!req.params._id) {
    const error = { status: 'error', message: 'markAggregateController.getMarkAggregate failed - missing mandatory parameter: _id' };
    logger.error(error);
    res.status(400).json(error);
  } else {
    MarkAggregate.findById(req.params._id).lean().exec((err, markAggregate) => {
      if (err || !markAggregate) {
        logger.error(`markAggregateController.getMarkAggregate ${req.params._id} failed to find - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ markAggregate });
        logger.info(`markAggregateController.getMarkAggregate (_id=${req.params._id})`);
      }
    });
  }
}


// /POST/:_id route - Update a markAggregates by _id
// Returns code 400 on input parameters error (missing or update _id)
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found
// Note: markAggregate is the updated mark

export function updateMarkAggregate(req, res) {
  if (!req.params._id || !req.body || !req.body.markAggregate) {
    const error = { status: 'error', message: 'markAggregateController.updateMarkAggregate failed - missing mandatory fields/params: ' };
    if (!req.params._id) error.message += 'params._id ';
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.markAggregate) error.message += 'body.markAggregate ';
    logger.error(error);
    res.status(400).json(error);
  } else if (req.body && req.body.markAggregate && req.body.markAggregate._id) {
    const message = 'markAggregateController.updateMarkAggregate failed - _id cannot be changed';
    logger.error(message);
    res.status(400).json({ status: 'error', message });
  } else {
    MarkAggregate.findOneAndUpdate({ _id: req.params._id }, req.body.markAggregate, { new: true }, (err, markAggregate) => {
      if (err || !markAggregate) {
        logger.error(`markAggregateController.updateMarkAggregate ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ markAggregate });
        logger.info(`markAggregateController.updateMarkAggregate ${req.params._id}`);
      }
    });
  }
}



// /POST/bulkUpdates route - Bulk update of markAggregates by _conditions
// Input: conditions: json object with the condition (mandatory, {} will update all marks!)
// Input: changes: json object with the changes to perform (mandatory)
// Returns code 400 on input parameters error (missing)
// Returns code 500 on network error or not found
// Returns code 200 and no body if OK
// Ex 1: http://localhost:8080/api/markAggregates/bulkUpdates?conditions={"item": "592467e29148172dac4125a9"}&changes={"$set":{"markOverall":"4" }}
export function bulkUpdateMarkAggregate(req, res) {
  if (!req.query.conditions || !req.query.changes) {
    const error = { status: 'error', message: 'markAggregateController.bulkUpdateMarkAggregate failed - missing mandatory params: ' };
    if (!req.query.conditions) error.message += 'query.conditions ';
    if (!req.query.changes) error.message += 'query.changes ';
    logger.error(error);
    res.status(400).json(error);
  } else {
    const conditions = req.query.conditions ? JSON.parse(req.query.conditions) : {};
    const changes = req.query.changes ? JSON.parse(req.query.changes) : {};
    MarkAggregate.update(conditions, changes, { multi: true }, (err, raw) => {
      if (err) {
        logger.error(`markAggregateController.bulkUpdateMarkAggregate ${req.query.conditions} - ${req.query.changes} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        const nbOrphansBackedUp = raw.nModified;
        logger.info(`markAggregateController.bulkUpdateMarkAggregate: ${req.query.conditions} - ${req.query.changes} - nbOrphansBackedUp: ${nbOrphansBackedUp} - raw: ${JSON.stringify(raw)}`);
        res.status(200);
        res.json({ nbOrphansBackedUp });
      }
    });
  }
}



// /DELETE/:_id route - Delete a markAggregates by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error, delete error or not found
// Returns code 200 on success (no value returned)

export function deleteMarkAggregate(req, res) {
  if (!req.params._id) {
    const error = { status: 'error', message: 'markAggregateController.deleteMarkAggregate failed - missing mandatory parameter: _id' };
    logger.error(error);
    res.status(400).json(error);
  } else {
    MarkAggregate.findOne({ _id: req.params._id }).exec((err, markAggregate) => {
      if (err || !markAggregate) {
        logger.error(`placeController.deleteMarkAggregate ${req.params._id} failed to find - err = `, err);
        res.status(500).send(err);
      } else {
        markAggregate.remove(() => {
          if (err) {
            logger.error(`placeController.deleteMarkAggregate ${req.params._id} failed to remove - err = `, err);
            res.status(500).send(err);
          } else {
            res.status(200).end();
            logger.info(`placeController.deleteMarkAggregate ${req.params._id}`);
          }
        });
      }
    });
  }
}
