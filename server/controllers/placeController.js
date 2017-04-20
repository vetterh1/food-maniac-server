import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html';
import Place from '../models/place';


/**
 * Get all places
 */
export function getPlaces(req, res) {
  Place.find().sort('-since').exec((err, places) => {
    if (err) {
      logger.error('placeController.getPlaces returns err: ', err);
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
  if (!req.body || !req.body.place || !req.body.place.name || !req.body.place.googleMapId) {
    logger.error('placeController.addPlace failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.place) logger.error('... no req.body.place!');
    if (req.body && req.body.place && !req.body.place.name) logger.error('... no req.body.place.name!');
    if (req.body && req.body.place && !req.body.place.googleMapId) logger.error('... no req.body.place.googleMapId!');
    res.status(400).end();
  } else {
    const newPlace = new Place(req.body.place);

    // Let's sanitize inputs
    newPlace.name = sanitizeHtml(newPlace.name);

    newPlace.save((err, saved) => {
      if (err) {
        logger.error(`placeController.addPlace ${newPlace.name} (googleMapId=${newPlace.googleMapId}) failed - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ place: saved });
        logger.info(`placeController.addPlace ${newPlace.name} (googleMapId=${saved.googleMapId}) (_id=${saved._id})`);
      }
    });
  }
}



/**
 * Add a place (or update if already exists)
 */

export function addOrUpdatePlaceByGoogleMapId(req, res) {
  if (!req.body || !req.body.place || !req.body.place.name || !req.body.place.googleMapId) {
    logger.error('placeController.addOrUpdatePlaceByGoogleMapId failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.place) logger.error('... no req.body.place!');
    if (req.body && req.body.place && !req.body.place.name) logger.error('... no req.body.place.name!');
    if (req.body && req.body.place && !req.body.place.googleMapId) logger.error('... no req.body.place.googleMapId!');
    res.status(400).end();
  } else {
    const newPlace = Object.assign({}, req.body.place, { lastModif: new Date() });

    // Let's sanitize inputs
    newPlace.name = sanitizeHtml(newPlace.name);

    Place.findOneAndUpdate({ googleMapId: newPlace.googleMapId }, newPlace, { new: true, upsert: true }, (err, place) => {
      if (err || !place) {
        logger.error(`placeController.addOrUpdatePlaceByGoogleMapId ${newPlace.name} (googleMapId=${newPlace.googleMapId}) failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ place });
        logger.info(`placeController.addOrUpdatePlaceByGoogleMapId ${place.name} (googleMapId=${place.googleMapId}) (_id=${place._id})`);
      }
    });
  }
}


/**
 * Get a single place
 */
export function getPlace(req, res) {
  Place.findById(req.params._id).exec((err, place) => {
    if (err || !place) {
      logger.error(`placeController.getPlace ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ place });
      logger.info(`placeController.getPlace ${place.name} (_id=${req.params._id})`);
    }
  });
}

/**
 * Get a single place by Google Map Id
 */
export function getPlaceByGoogleMapId(req, res) {
  Place.findOne({ googleMapId: req.params.googleMapId }).exec((err, place) => {
    if (err || !place) {
      logger.error(`placeController.getPlaceByGoogleMapId ${req.params.googleMapId} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ place });
      logger.info(`placeController.getPlaceByGoogleMapId ${req.params.googleMapId}`);
    }
  });
}


/*
 * Update an existing place
 */
export function updatePlace(req, res) {
  if (!req.body || !req.body.place) {
    const error = { status: 'error', message: 'placeController.updatePlace failed - no body or place' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.place) error.message += '... no req.body.place!';
    res.status(400).json(error);
  } else if (req.body && req.body.place && req.body.place._id) {
    res.status(400).json({ status: 'error', message: 'placeController.updatePlace failed - _id cannot be changed' });
  } else {
    const placeUpdate = Object.assign({}, req.body.place, { lastModif: new Date() });

    // Let's sanitize inputs
    if (placeUpdate.name) placeUpdate.name = sanitizeHtml(placeUpdate.name);

    Place.findOneAndUpdate({ _id: req.params._id }, placeUpdate, { new: true }, (err, place) => {
      if (err || !place) {
        logger.error(`placeController.updatePlace ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ place });
        logger.info(`placeController.updatePlace ${req.params._id}`);
      }
    });
  }
}



/**
 * Delete a place
 */
export function deletePlace(req, res) {
  Place.findOne({ _id: req.params._id }).exec((err, place) => {
    if (err || !place) {
      logger.error(`placeController.deletePlace ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      place.remove(() => {
        if (err) {
          logger.error(`placeController.deletePlace ${req.params._id} failed to remove - err = `, err);
          res.status(500).send(err);
        } else {
          res.status(200).end();
          logger.info(`placeController.deletePlace ${req.params._id}`);
        }
      });
    }
  });
}
