import * as logger from 'winston';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';
import Place from '../models/place';


/**
 * Get all places
 */
export function getPlaces(req, res) {
  Place.find().sort('-since').exec((err, places) => {
    if (err) {
      logger.error('! placeController.getPlaces returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ places });
      logger.info(`placeController.getPlaces length=${places.length}`);
    }
  });
}


/**
 * Add a place
 */

export function addPlace(req, res) {
  if (!req.body || !req.body.place || !req.body.place.name) {
    logger.error('! placeController.addPlace failed! - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.place) logger.error('... no req.body.place!');
    if (req.body && req.body.place && !req.body.place.name) logger.error('... no req.body.place.name!');
    res.status(400).end();
  } else {
    const newPlace = new Place(req.body.place);

    // Let's sanitize inputs
    newPlace.name = sanitizeHtml(newPlace.name);

    // If no id provided, generate one
    // Note: normally, a google map id should be provided
    if (!newPlace.cuid) newPlace.cuid = cuid();

    newPlace.save((err, saved) => {
      if (err) {
        logger.error(`! placeController.addPlace ${newPlace.name} failed! - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ place: saved });
        logger.info(`placeController.addPlace ${newPlace.name} (cuid=${newPlace.cuid})`);
      }
    });
  }
}



/**
 * Add a place (or update if already exists)
 */

export function addOrUpdatePlace(req, res) {
  if (!req.body || !req.body.place || !req.body.place.name) {
    logger.error('! placeController.addOrUpdatePlace failed! - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.place) logger.error('... no req.body.place!');
    if (req.body && req.body.place && !req.body.place.name) logger.error('... no req.body.place.name!');
    res.status(400).end();
  } else {
    const newPlace = Object.assign({}, req.body.place, { lastModif: new Date() });

    // Let's sanitize inputs
    newPlace.name = sanitizeHtml(newPlace.name);

    // If no id provided, generate one
    // Note: normally, a google map id should be provided
    if (!newPlace.cuid) newPlace.cuid = cuid();

    Place.findOneAndUpdate({ cuid: newPlace.cuid }, newPlace, { new: true, upsert: true }, (err, place) => {
      if (err || !place) {
        logger.error(`! placeController.addOrUpdatePlace ${newPlace.cuid} failed to update! - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ place });
        logger.info(`placeController.addOrUpdatePlace ${newPlace.cuid}`);
      }
    });
  }
}


/**
 * Get a single place
 */
export function getPlace(req, res) {
  Place.findOne({ cuid: req.params.cuid }).exec((err, place) => {
    if (err || !place) {
      logger.error(`! placeController.getPlace ${req.params.cuid} failed to find! - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ place });
      logger.info(`placeController.getPlace ${req.params.cuid}`);
    }
  });
}


/*
 * Update an existing place
 */
export function updatePlace(req, res) {
  if (!req.body || !req.body.place) {
    const error = { status: 'error', message: '! placeController.updatePlace failed! - no body or place' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.place) error.message += '... no req.body.place!';
    res.status(400).json(error);
  } else if (req.body && req.body.place && req.body.place.cuid) {
    res.status(400).json({ status: 'error', message: '! placeController.updatePlace failed! - cuid cannot be changed' });
  } else {
    const placeUpdate = Object.assign({}, req.body.place, { lastModif: new Date() });

    // Let's sanitize inputs
    if (placeUpdate.name) placeUpdate.name = sanitizeHtml(placeUpdate.name);

    Place.findOneAndUpdate({ cuid: req.params.cuid }, placeUpdate, { new: true }, (err, place) => {
      if (err || !place) {
        logger.error(`! placeController.updatePlace ${req.params.cuid} failed to update! - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ place });
        logger.info(`placeController.updatePlace ${req.params.cuid}`);
      }
    });
  }
}



/**
 * Delete a place
 */
export function deletePlace(req, res) {
  Place.findOne({ cuid: req.params.cuid }).exec((err, place) => {
    if (err || !place) {
      logger.error(`! placeController.deletePlace ${req.params.cuid} failed to find! - err = `, err);
      res.status(500).send(err);
    } else {
      place.remove(() => {
        if (err) {
          logger.error(`! placeController.deletePlace ${req.params.cuid} failed to remove! - err = `, err);
          res.status(500).send(err);
        } else {
          res.status(200).end();
          logger.info(`placeController.deletePlace ${req.params.cuid}`);
        }
      });
    }
  });
}
