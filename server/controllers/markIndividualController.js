import * as logger from 'winston';
import MarkIndividual from '../models/markIndividual';
import MarkAggregate from '../models/markAggregate';


// /GET route - Get all markIndividuals
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markIndividuals }
// Note: markIndividuals is an array that can be empty

export function getMarkIndividuals(req, res) {
  MarkIndividual.find().sort('-since').exec((err, markIndividuals) => {
    if (err) {
      logger.error('markIndividualController.getMarkIndividuals returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ markIndividuals });
      logger.info(`markIndividualController.getMarkIndividuals length=${markIndividuals.length}`);
    }
  });
}


// /GET route - Get all markIndividuals for one aggregate
// Returns code 400 on missing parameter
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { markIndividuals }
// Note: markIndividuals is an array that can be empty

export function getMarkIndividualsByMarkAggregateId(req, res) {
  if (!req.params._markAggregatesId || req.params._markAggregatesId === 'undefined' || req.params._markAggregatesId === 'null') {
    const error = { status: 'error', message: 'markIndividualController.getMarkIndividualsByMarkAggregateId failed - missing mandatory parameter: _markAggregatesId' };
    logger.error(error);
    res.status(400).json(error);
  } else {
    const query = MarkIndividual
      .find({ markAggregate: req.params._markAggregatesId }) // find all the individual markIndividuals links to an aggregate
      .sort({ markOverall: -1 }); // sort by rating (from best to worst)

    query
      .exec((err, markIndividuals) => {
        if (err) {
          logger.error('markIndividualController.getMarkIndividualsByMarkAggregateId returns err: ', err);
          res.status(500).send(err);
        } else {
          res.json({ markIndividuals });
          logger.info(`markIndividualController.getMarkIndividualsByMarkAggregateId length=${markIndividuals.length}`);
        }
      });
  }
}


//
// Helper functions for addMarkIndividual
//

function addRegularMark({ req, res, markAggregate }) {
 // Return a new promise.
  return new Promise((resolve, reject) => {
    logger.info(`{ markIndividualController.addRegularMark (markAggregate: ${markAggregate._id})`);

    const newMarkIndividual = new MarkIndividual({
      markAggregate: markAggregate._id,
      user: req.body.markIndividual.user,
      markOverall: req.body.markIndividual.markOverall,
      markFood: req.body.markIndividual.markFood,
      markPlace: req.body.markIndividual.markPlace,
      markValue: req.body.markIndividual.markValue,
      markStaff: req.body.markIndividual.markStaff,
      comment: req.body.markIndividual.comment,
    });
    newMarkIndividual.save((err, markIndividual) => {
      if (err) {
        logger.error(`markIndividualController.addRegularMark ${newMarkIndividual.markIndividual} failed - err = `, err);
        // res.status(500).send(err);
        reject(Error(err.message));
      } else {
        // res.json({ mark: markIndividual });
        logger.info(`} markIndividualController.addRegularMark (_id=${markIndividual._id})`);
        resolve({ req, res, markIndividual, markAggregate });
      }
    });
  });
}

function addOrUpdateAggregatedMark({ req, res }) {
 // Return a new promise.
  return new Promise((resolve, reject) => {
    logger.info(`{ markIndividualController.addOrUpdateAggregatedMark (item: ${req.body.markIndividual.item}; item: ${req.body.markIndividual.place})`);

    // Search if an aggregate mark already exists for this item+place
    MarkAggregate.findOne({ item: req.body.markIndividual.item, place: req.body.markIndividual.place }).exec((err, foundMarkAggregate) => {
      if (err || !foundMarkAggregate) {
        // NO aggreagated mark found, need to create a new one:
        logger.info('markIndividualController.addOrUpdateAggregatedMark did not find an existing aggregate mark');

        const newMarkAggregate = new MarkAggregate({
          item: req.body.markIndividual.item,
          place: req.body.markIndividual.place,
          markOverall: req.body.markIndividual.markOverall,
          markFood: req.body.markIndividual.markFood,
          markPlace: req.body.markIndividual.markPlace,
          markValue: req.body.markIndividual.markValue,
          markStaff: req.body.markIndividual.nbMarksStaff,
          nbMarksOverall: 1,
          nbMarksFood: req.body.markIndividual.markFood ? 1 : null,
          nbMarksPlace: req.body.markIndividual.markPlace ? 1 : null,
          nbMarksValue: req.body.markIndividual.markValue ? 1 : null,
          nbMarksStaff: req.body.markIndividual.markStaff ? 1 : null,
          location: req.body.markIndividual.location,
        });

        newMarkAggregate.save((errNew, markAggregate) => {
          if (errNew) {
            logger.error(`markIndividualController.addOrUpdateAggregatedMark creating new aggregated mark failed - err = ${errNew}`);
            reject(Error(errNew.message));
          } else {
            logger.info(`} markIndividualController.addOrUpdateAggregatedMark  creating new aggregated mark (_id=${markAggregate._id})`);
            resolve({ req, res, markAggregate });
          }
        });
      } else {
        // Aggregated mark already exists: update it!
        logger.info(`markIndividualController.addOrUpdateAggregatedMark found an existing aggregate mark - foundMarkAggregate._id: ${foundMarkAggregate._id}`);

        const newNbMarksOverall = foundMarkAggregate.nbMarksOverall + 1;
        const newMarkOverall = ((foundMarkAggregate.markOverall * foundMarkAggregate.nbMarksOverall) + req.body.markIndividual.markOverall) / newNbMarksOverall;

        const updates = {
          nbMarksOverall: newNbMarksOverall,
          markOverall: newMarkOverall,
        };

        // update food marking...
        if (req.body.markIndividual.markFood) {
          updates.nbMarksFood = foundMarkAggregate.nbMarksFood ? foundMarkAggregate.nbMarksFood + 1 : 1;
          updates.markFood = foundMarkAggregate.markFood ? foundMarkAggregate.markFood + ((req.body.markIndividual.markFood - foundMarkAggregate.markFood) / updates.nbMarksFood) : req.body.markIndividual.markFood;
        }
        // update Place marking...
        if (req.body.markIndividual.markPlace) {
          updates.nbMarksPlace = foundMarkAggregate.nbMarksPlace ? foundMarkAggregate.nbMarksPlace + 1 : 1;
          updates.markPlace = foundMarkAggregate.markPlace ? foundMarkAggregate.markPlace + ((req.body.markIndividual.markPlace - foundMarkAggregate.markPlace) / updates.nbMarksPlace) : req.body.markIndividual.markPlace;
        }
        // update Value marking...
        if (req.body.markIndividual.markValue) {
          updates.nbMarksValue = foundMarkAggregate.nbMarksValue ? foundMarkAggregate.nbMarksValue + 1 : 1;
          updates.markValue = foundMarkAggregate.markValue ? foundMarkAggregate.markValue + ((req.body.markIndividual.markValue - foundMarkAggregate.markValue) / updates.nbMarksValue) : req.body.markIndividual.markValue;
        }
        // update Staff marking...
        if (req.body.markIndividual.markStaff) {
          updates.nbMarksStaff = foundMarkAggregate.nbMarksStaff ? foundMarkAggregate.nbMarksStaff + 1 : 1;
          updates.markStaff = foundMarkAggregate.markStaff ? foundMarkAggregate.markStaff + ((req.body.markIndividual.markStaff - foundMarkAggregate.markStaff) / updates.nbMarksStaff) : req.body.markIndividual.markStaff;
        }

        logger.info('markIndividualController.addOrUpdateAggregatedMark updates: ', updates);

        MarkAggregate
          .findOneAndUpdate(
          { _id: foundMarkAggregate._id },
          { $set: updates },
          { new: true },
          (errUpd, markAggregate) => {
            if (errUpd) {
              logger.error(`markIndividualController.addOrUpdateAggregatedMark updating existing aggregated mark failed - err = ${errUpd}`);
              reject(Error(errUpd.message));
            } else {
              logger.info(`} markIndividualController.addOrUpdateAggregatedMark updating existing aggregated mark (_id=${markAggregate._id})`);
              resolve({ req, res, markAggregate });
            }
          }
        );
      }
    });
  });
}


function sendResponseToBrowser({ req, res, markIndividual, markAggregate }) {
  logger.info(`markIndividualController.sendResponseToBrowser (item: ${req.body.markIndividual.item}; item: ${req.body.markIndividual.place}; markAggregate: ${markAggregate._id}; markIndividual: ${markIndividual._id})`);
  res.json({ markIndividual, markAggregate });
}



// /POST route - Add a new markIndividuals (and update/create corresponding aggregate)
// Returns code 400 on input parameters error
// Returns code 500 on saving error
// Returns code 200 otherwise + { markIndividual, markAggregate }

export function addMarkIndividual(req, res) {
  if (!req.body || !req.body.markIndividual || !req.body.markIndividual.markOverall || !req.body.markIndividual.item || !req.body.markIndividual.place) {
    const error = { status: 'error', message: 'markIndividualController.addMarkIndividual failed - missing mandatory fields: ' };
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.markIndividual) error.message += 'body.markIndividual ';
    if (req.body && req.body.markIndividual && !req.body.markIndividual.markOverall) error.message += 'body.markIndividual.markOverall ';
    if (req.body && req.body.markIndividual && !req.body.markIndividual.item) error.message += 'body.markIndividual.item ';
    if (req.body && req.body.markIndividual && !req.body.markIndividual.place) error.message += 'body.markIndividual.place ';
    logger.error(error);
    res.status(400).json(error);
  } else {
    addOrUpdateAggregatedMark({ req, res })
    .then(addRegularMark)
    .then(sendResponseToBrowser)
    .catch((error) => {
      logger.error(`markIndividualController.addMarkIndividual (item: ${req.body.markIndividual.item}; place: ${req.body.markIndividual.place}) failed - error = `, error);
      res.status(500).send(error);
    });
  }
}


// /GET/:_id route - Get one markIndividual by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error or not found
// Returns code 200 + { markIndividual } if found

export function getMarkIndividual(req, res) {
  if (!req.params._id) {
    const error = { status: 'error', message: 'markIndividualController.getMarkIndividual failed - missing mandatory parameter: _id' };
    logger.error(error);
    res.status(400).json(error);
  } else {
    MarkIndividual.findById(req.params._id).exec((err, markIndividual) => {
      if (err || !markIndividual) {
        logger.error(`markIndividualController.getMarkIndividual ${req.params._id} failed to find - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ markIndividual });
        logger.info(`markIndividualController.getMarkIndividual (_id=${req.params._id})`);
      }
    });
  }
}


// /POST/:_id route - Update a markIndividuals by _id
// Returns code 400 on input parameters error (missing or update _id)
// Returns code 500 on network error or not found
// Returns code 200 + { markIndividual } if found
// Note: markIndividual is the updated mark
// Note: NO update of corresponding aggregate

export function updateMarkIndividual(req, res) {
  if (!req.params._id || !req.body || !req.body.markIndividual) {
    const error = { status: 'error', message: 'markIndividualController.updateMarkIndividual failed - missing mandatory fields/params: ' };
    if (!req.params._id) error.message += 'params._id ';
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.markIndividual) error.message += 'body.markIndividual ';
    logger.error(error);
    res.status(400).json(error);
  } else if (req.body && req.body.markIndividual && req.body.markIndividual._id) {
    const message = 'markIndividualController.updateMarkIndividual failed - _id cannot be changed';
    logger.error(message);
    res.status(400).json({ status: 'error', message });
  } else {
    MarkIndividual.findOneAndUpdate({ _id: req.params._id }, req.body.markIndividual, { new: true }, (err, markIndividual) => {
      if (err || !markIndividual) {
        logger.error(`markIndividualController.updateMarkIndividual ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ markIndividual });
        logger.info(`markIndividualController.updateMarkIndividual ${req.params._id}`);
      }
    });
  }
}


// /DELETE/:_id route - Delete a markIndividuals by _id
// Returns code 400 on missing parameter
// Returns code 500 on network error, delete error or not found
// Returns code 200 on success (no value returned)
// Note: NO update of corresponding aggregate

export function deleteMarkIndividual(req, res) {
  if (!req.params._id) {
    const error = { status: 'error', message: 'markIndividualController.deleteMarkIndividual failed - missing mandatory parameter: _id' };
    logger.error(error);
    res.status(400).json(error);
  } else {
    MarkIndividual.findOne({ _id: req.params._id }).exec((err, markIndividual) => {
      if (err || !markIndividual) {
        logger.error(`placeController.deleteMark ${req.params._id} failed to find - err = `, err);
        res.status(500).send(err);
      } else {
        markIndividual.remove(() => {
          if (err) {
            logger.error(`placeController.deleteMark ${req.params._id} failed to remove - err = `, err);
            res.status(500).send(err);
          } else {
            res.status(200).end();
            logger.info(`placeController.deleteMark ${req.params._id}`);
          }
        });
      }
    });
  }
}
