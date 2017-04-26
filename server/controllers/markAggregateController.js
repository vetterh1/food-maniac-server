import * as logger from 'winston';
import MarkAggregate from '../models/markAggregate';


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


// /GET /itemId/... route - Get all markAggregates for one item
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markAggregates }
// Note: markAggregates is an array that can be empty

export function getMarkAggregatesByItemIdAndDistance(req, res) {
  const query = MarkAggregate
    .find({ item: req.params._itemId }) // find all the AGGREGATED markAggregates for one item
    .populate('place', 'name') // add the place information (available with place.xxx)
    .sort({ markOverall: -1 }); // sort by rating (from best to worst)

  if (req.params._maxDistance && req.params._maxDistance > 0 && req.params._lat && req.params._lng) {
    query
      // Restrict by distance (in metres) if asked
      .where('location')
      .near({
        center: {
          coordinates: [req.params._lat, req.params._lng],
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
        res.json({ markAggregates });
        logger.info(`markAggregateController.getMarkAggregatesByItemIdAndDistance length=${markAggregates.length}`);
      }
    });
}




// /GET/:_id route - Get one markAggregate by _id
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found

export function getMarkAggregate(req, res) {
  MarkAggregate.findById(req.params._id).exec((err, markAggregate) => {
    if (err || !markAggregate) {
      logger.error(`markAggregateController.getMarkAggregate ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ markAggregate });
      logger.info(`markAggregateController.getMarkAggregate (_id=${req.params._id})`);
    }
  });
}


// /POST/:_id route - Update a markAggregates by _id
// Returns code 400 on input parameters error (missing or update _id)
// Returns code 500 on network error or not found
// Returns code 200 + { markAggregate } if found
// Note: markAggregate is the updated mark

export function updateMarkAggregate(req, res) {
  if (!req.body || !req.body.markAggregate) {
    const error = { status: 'error', message: 'markAggregateController.updateMarkAggregate failed - missing mandatory fields: ' };
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.markAggregate) error.message += 'body.markAggregate ';
    res.status(400).json(error);
  } else if (req.body && req.body.markAggregate && req.body.markAggregate._id) {
    res.status(400).json({ status: 'error', message: 'markAggregateController.updateMarkAggregate failed - _id cannot be changed' });
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


// /DELETE/:_id route - Delete a markAggregates by _id
// Returns code 500 on network error, delete error or not found
// Returns code 200 on success (no value returned)

export function deleteMarkAggregate(req, res) {
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
