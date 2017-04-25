import * as logger from 'winston';
import MarkIndividual from '../models/markIndividual';


/**
 * Get all markIndividuals
 */
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

/**
 * Get all markIndividuals for one item
 */


export function getMarkIndividualsByMarkAggregateId(req, res) {
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


/**
 * Helper functions for addMarkIndividual
 */



function addRegularMark({ req, res }) {
 // Return a new promise.
  return new Promise((resolve, reject) => {
    logger.info(`{ markIndividualController.addRegularMark (item: ${req.body.markIndividual.item}; item: ${req.body.markIndividual.place})`);

    const newMarkIndividual = new MarkIndividual(req.body.markIndividual);
    newMarkIndividual.save((err, saved) => {
      if (err) {
        logger.error(`markIndividualController.addRegularMark ${newMarkIndividual.markIndividual} failed - err = `, err);
        // res.status(500).send(err);
        reject(Error(err.message));
      } else {
        // res.json({ mark: saved });
        logger.info(`} markIndividualController.addRegularMark (_id=${saved._id})`);
        resolve({ req, res, individualMark: saved });
      }
    });
  });
}

function addOrUpdateAggregatedMark({ req, res, individualMark }) {
 // Return a new promise.
  return new Promise((resolve, reject) => {
    logger.info(`{ markIndividualController.addOrUpdateAggregatedMark (item: ${req.body.markIndividual.item}; item: ${req.body.markIndividual.place})`);

    // Search if an aggregate mark already exists for this item+place
    MarkIndividual.findOne({ item: req.body.markIndividual.item, place: req.body.markIndividual.place, aggregatedMark: true }).exec((err, foundAggregatedMark) => {
      if (err || !foundAggregatedMark) {
        // NO aggreagated mark found, need to create a new one:
        logger.info('markIndividualController.addOrUpdateAggregatedMark did not find an existing aggregate mark');

        const newAggregatedMark = new MarkIndividual(req.body.markIndividual);
        newAggregatedMarkIndividual.aggregatedMark = true;
        newAggregatedMarkIndividual.nbAggregatedMarksOverall = 1;
        newAggregatedMarkIndividual.nbAggregatedMarksFood = req.body.markIndividual.markFood ? 1 : null;
        newAggregatedMarkIndividual.nbAggregatedMarksPlace = req.body.markIndividual.markPlace ? 1 : null;
        newAggregatedMarkIndividual.nbAggregatedMarksStaff = req.body.markIndividual.markStaff ? 1 : null;
        newAggregatedMarkIndividual.save((errNew, aggregatedMark) => {
          if (errNew) {
            logger.error(`markIndividualController.addOrUpdateAggregatedMark creating new aggreagated mark failed - err = ${errNew}`);
            // res.status(500).send(errNew);
            reject(Error(errNew.message));
          } else {
            // res.json({ aggregatedMark: aggregatedMark });
            logger.info(`} markIndividualController.addOrUpdateAggregatedMark  creating new aggreagated mark (_id=${aggregatedMarkIndividual._id})`);
            resolve({ req, res, individualMark, aggregatedMark });
          }
        });
      } else {
        // Aggregated mark already exists: update it!
        logger.info('markIndividualController.addOrUpdateAggregatedMark found an existing aggregate mark - foundAggregatedMarkIndividual._id: ', foundAggregatedMarkIndividual._id);

        const newNbAggregatedMarksOverall = foundAggregatedMarkIndividual.nbAggregatedMarksOverall + 1;
        const newMarkOverall = ((foundAggregatedMarkIndividual.markOverall * foundAggregatedMarkIndividual.nbAggregatedMarksOverall) + req.body.markIndividual.markOverall) / newNbAggregatedMarksOverall;

        const updates = {
            nbAggregatedMarksOverall: newNbAggregatedMarksOverall,
            markOverall: newMarkOverall,
        };

        // update food marking...
        if (req.body.markIndividual.markFood) {
          updates.nbAggregatedMarksFood = foundAggregatedMarkIndividual.nbAggregatedMarksFood ? foundAggregatedMarkIndividual.nbAggregatedMarksFood + 1 : 1;
          updates.markFood = foundAggregatedMarkIndividual.markFood ? foundAggregatedMarkIndividual.markFood + ((req.body.markIndividual.markFood - foundAggregatedMarkIndividual.markFood) / updates.nbAggregatedMarksFood) : req.body.markIndividual.markFood;
        }
        // update Place marking...
        if (req.body.markIndividual.markPlace) {
          updates.nbAggregatedMarksPlace = foundAggregatedMarkIndividual.nbAggregatedMarksPlace ? foundAggregatedMarkIndividual.nbAggregatedMarksPlace + 1 : 1;
          updates.markPlace = foundAggregatedMarkIndividual.markPlace ? foundAggregatedMarkIndividual.markPlace + ((req.body.markIndividual.markPlace - foundAggregatedMarkIndividual.markPlace) / updates.nbAggregatedMarksPlace) : req.body.markIndividual.markPlace;
        }
        // update Staff marking...
        if (req.body.markIndividual.markStaff) {
          updates.nbAggregatedMarksStaff = foundAggregatedMarkIndividual.nbAggregatedMarksStaff ? foundAggregatedMarkIndividual.nbAggregatedMarksStaff + 1 : 1;
          updates.markStaff = foundAggregatedMarkIndividual.markStaff ? foundAggregatedMarkIndividual.markStaff + ((req.body.markIndividual.markStaff - foundAggregatedMarkIndividual.markStaff) / updates.nbAggregatedMarksStaff) : req.body.markIndividual.markStaff;
        }

        logger.info('markIndividualController.addOrUpdateAggregatedMark updates: ', updates);

        MarkIndividual
          .findOneAndUpdate(
          { _id: foundAggregatedMarkIndividual._id },
          { $set: updates },
          (errUpd, aggregatedMark) => {
            if (errUpd) {
              logger.error(`markIndividualController.addOrUpdateAggregatedMark updating existing aggregated mark failed - err = ${errUpd}`);
              // res.status(500).send(errUpd);
              reject(Error(errUpd.message));
            } else {
              // res.json({ aggregatedMark: raw });
              logger.info(`} markIndividualController.addOrUpdateAggregatedMark updating existing aggreagated mark (_id=${aggregatedMarkIndividual._id})`);
              resolve({ req, res, individualMark, aggregatedMark });
            }
          }
        );
      }
    });
  });
}


function sendResponseToBrowser({ req, res, aggregatedMark, individualMark }) {
  logger.info(`markIndividualController.sendResponseToBrowser (item: ${req.body.markIndividual.item}; item: ${req.body.markIndividual.place}; aggregatedMark: ${aggregatedMarkIndividual._id}; individualMark: ${individualMarkIndividual._id})`);
  res.json({ individualMark, aggregatedMark });
}



/**
 * Add a MarkIndividual
 */


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
    addRegularMark({ req, res })
    .then(addOrUpdateAggregatedMark)
    .then(sendResponseToBrowser)
    .catch((error) => {
      logger.error(`markIndividualController.addMarkIndividual (item: ${req.body.markIndividual.item}; item: ${req.body.markIndividual.place}) failed - error = `, error);
      res.status(500).send(error);
    });
  }
}



/**
 * Get a single markIndividual
 */
export function getMarkIndividual(req, res) {
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


/*
 * Update an existing markIndividual
 */
export function updateMarkIndividual(req, res) {
  if (!req.body || !req.body.markIndividual) {
    const error = { status: 'error', message: 'markIndividualController.updateMarkIndividual failed - missing mandatory fields: ' };
    if (!req.body) error.message += 'body ';
    if (req.body && !req.body.markIndividual) error.message += 'body.markIndividual ';
    res.status(400).json(error);
  } else if (req.body && req.body.markIndividual && req.body.markIndividual._id) {
    res.status(400).json({ status: 'error', message: 'markIndividualController.updateMarkIndividual failed - _id cannot be changed' });
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


/**
 * Delete a markIndividual
 */
export function deleteMarkIndividual(req, res) {
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
