import * as logger from 'winston';
import Mark from '../models/mark';


/**
 * Get all marks
 */
export function getMarks(req, res) {
  Mark.find().sort('-since').exec((err, marks) => {
    if (err) {
      logger.error('markController.getMarks returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ marks });
      logger.info(`markController.getMarks length=${marks.length}`);
    }
  });
}

/**
 * Get all marks for one item
 */

// TODO: add unit tests
// TODO: restrict by location

export function getAggregatedMarksByItemIdAndDistance(req, res) {
  const query = Mark
    .find({ item: req.params._itemId, aggregatedMark: true }) // find all the AGGREGATED marks for one item
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
    .exec((err, marks) => {
      if (err) {
        logger.error('markController.getMarksByItemId returns err: ', err);
        res.status(500).send(err);
      } else {
        res.json({ marks });
        logger.info(`markController.getMarksByItemId length=${marks.length}`);
      }
    });
}


/**
 * Helper functions for Add a mark
 */



function addRegularMark({ req, res }) {
 // Return a new promise.
  return new Promise((resolve, reject) => {
    logger.info(`{ markController.addRegularMark (item: ${req.body.mark.item}; item: ${req.body.mark.place})`);

    const newMark = new Mark(req.body.mark);
    newMark.save((err, saved) => {
      if (err) {
        logger.error(`markController.addRegularMark ${newMark.mark} failed - err = `, err);
        // res.status(500).send(err);
        reject(Error(err.message));
      } else {
        // res.json({ mark: saved });
        logger.info(`} markController.addRegularMark (_id=${saved._id})`);
        resolve({ req, res, regularMark: saved });
      }
    });
  });
}

function addOrUpdateAggregatedMark({ req, res, regularMark }) {
 // Return a new promise.
  return new Promise((resolve, reject) => {
    logger.info(`{ markController.addOrUpdateAggregatedMark (item: ${req.body.mark.item}; item: ${req.body.mark.place})`);

    // Search if an aggregate mark already exists for this item+place
    Mark.findOne({ item: req.body.mark.item, place: req.body.mark.place, aggregatedMark: true }).exec((err, foundAggregatedMark) => {
      if (err || !foundAggregatedMark) {
        // NO aggreagated mark found, need to create a new one:
        logger.info('markController.addOrUpdateAggregatedMark did not find an existing aggregate mark');

        const newAggregatedMark = new Mark(req.body.mark);
        newAggregatedMark.aggregatedMark = true;
        newAggregatedMark.nbAggregatedMarksOverall = 1;
        newAggregatedMark.nbAggregatedMarksFood = req.body.mark.markFood ? 1 : null;
        newAggregatedMark.nbAggregatedMarksPlace = req.body.mark.markPlace ? 1 : null;
        newAggregatedMark.nbAggregatedMarksStaff = req.body.mark.markStaff ? 1 : null;
        newAggregatedMark.save((errNew, aggregatedMark) => {
          if (errNew) {
            logger.error(`markController.addOrUpdateAggregatedMark creating new aggreagated mark failed - err = ${errNew}`);
            // res.status(500).send(errNew);
            reject(Error(errNew.message));
          } else {
            // res.json({ aggregatedMark: aggregatedMark });
            logger.info(`} markController.addOrUpdateAggregatedMark  creating new aggreagated mark (_id=${aggregatedMark._id})`);
            resolve({ req, res, regularMark, aggregatedMark });
          }
        });
      } else {
        // Aggregated mark already exists: update it!
        logger.info('markController.addOrUpdateAggregatedMark found an existing aggregate mark - foundAggregatedMark._id: ', foundAggregatedMark._id);

        const newNbAggregatedMarksOverall = foundAggregatedMark.nbAggregatedMarksOverall + 1;
        const newMarkOverall = ((foundAggregatedMark.markOverall * foundAggregatedMark.nbAggregatedMarksOverall) + req.body.mark.markOverall) / newNbAggregatedMarksOverall;

        const updates = {
            nbAggregatedMarksOverall: newNbAggregatedMarksOverall,
            markOverall: newMarkOverall,
        };

        // update food marking...
        if (req.body.mark.markFood) {
          updates.nbAggregatedMarksFood = foundAggregatedMark.nbAggregatedMarksFood ? foundAggregatedMark.nbAggregatedMarksFood + 1 : 1;
          updates.markFood = foundAggregatedMark.markFood ? foundAggregatedMark.markFood + ((req.body.mark.markFood - foundAggregatedMark.markFood) / updates.nbAggregatedMarksFood) : req.body.mark.markFood;
        }
        // update Place marking...
        if (req.body.mark.markPlace) {
          updates.nbAggregatedMarksPlace = foundAggregatedMark.nbAggregatedMarksPlace ? foundAggregatedMark.nbAggregatedMarksPlace + 1 : 1;
          updates.markPlace = foundAggregatedMark.markPlace ? foundAggregatedMark.markPlace + ((req.body.mark.markPlace - foundAggregatedMark.markPlace) / updates.nbAggregatedMarksPlace) : req.body.mark.markPlace;
        }
        // update Staff marking...
        if (req.body.mark.markStaff) {
          updates.nbAggregatedMarksStaff = foundAggregatedMark.nbAggregatedMarksStaff ? foundAggregatedMark.nbAggregatedMarksStaff + 1 : 1;
          updates.markStaff = foundAggregatedMark.markStaff ? foundAggregatedMark.markStaff + ((req.body.mark.markStaff - foundAggregatedMark.markStaff) / updates.nbAggregatedMarksStaff) : req.body.mark.markStaff;
        }

        logger.info('markController.addOrUpdateAggregatedMark updates: ', updates);

        Mark
          .findOneAndUpdate(
          { _id: foundAggregatedMark._id },
          { $set: updates },
          (errUpd, aggregatedMark) => {
            if (errUpd) {
              logger.error(`markController.addOrUpdateAggregatedMark updating existing aggregated mark failed - err = ${errUpd}`);
              // res.status(500).send(errUpd);
              reject(Error(errUpd.message));
            } else {
              // res.json({ aggregatedMark: raw });
              logger.info(`} markController.addOrUpdateAggregatedMark updating existing aggreagated mark (_id=${aggregatedMark._id})`);
              resolve({ req, res, regularMark, aggregatedMark });
            }
          }
        );
      }
    });
  });
}


function sendResponseToBrowser({ req, res, aggregatedMark, regularMark }) {
  logger.info(`markController.sendResponseToBrowser (item: ${req.body.mark.item}; item: ${req.body.mark.place}; aggregatedMark: ${aggregatedMark._id}; regularMark: ${regularMark._id})`);
  res.json({ regularMark, aggregatedMark });
}



/**
 * Add a mark
 */


export function addMark(req, res) {
  if (!req.body || !req.body.mark || !req.body.mark.markOverall || !req.body.mark.item || !req.body.mark.place) {
    const error = { status: 'error', message: 'markController.addMark failed - missing mandatory fields: ' };
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.mark) error.message += 'body.mark ';
    if (req.body && req.body.mark && !req.body.mark.markOverall) error.message += 'body.mark.markOverall ';
    if (req.body && req.body.mark && !req.body.mark.item) error.message += 'body.mark.item ';
    if (req.body && req.body.mark && !req.body.mark.place) error.message += 'body.mark.place ';
    logger.error(error);
    res.status(400).json(error);
  } else {
    addRegularMark({ req, res })
    .then(addOrUpdateAggregatedMark)
    .then(sendResponseToBrowser)
    .catch((error) => {
      logger.error(`markController.addMark (item: ${req.body.mark.item}; item: ${req.body.mark.place}) failed - error = `, error);
      res.status(500).send(error);
    });
  }
}



/**
 * Get a single mark
 */
export function getMark(req, res) {
  Mark.findById(req.params._id).exec((err, mark) => {
    if (err || !mark) {
      logger.error(`markController.getMark ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ mark });
      logger.info(`markController.getMark (_id=${req.params._id})`);
    }
  });
}


/*
 * Update an existing mark
 */
export function updateMark(req, res) {
  if (!req.body || !req.body.mark) {
    const error = { status: 'error', message: 'markController.updateMark failed - missing mandatory fields: ' };
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.mark) error.message += 'body.mark ';
    res.status(400).json(error);
  } else if (req.body && req.body.mark && req.body.mark._id) {
    res.status(400).json({ status: 'error', message: 'markController.updateMark failed - _id cannot be changed' });
  } else {
    Mark.findOneAndUpdate({ _id: req.params._id }, req.body.mark, { new: true }, (err, mark) => {
      if (err || !mark) {
        logger.error(`markController.updateMark ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ mark });
        logger.info(`markController.updateMark ${req.params._id}`);
      }
    });
  }
}


/**
 * Delete a mark
 */
export function deleteMark(req, res) {
  Mark.findOne({ _id: req.params._id }).exec((err, mark) => {
    if (err || !mark) {
      logger.error(`placeController.deleteMark ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      mark.remove(() => {
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
