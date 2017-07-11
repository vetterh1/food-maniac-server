import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html'; // sanitizeHtml escapes &<>" : s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
import request from 'request';
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
    // NO!  transforms & in place names into &amp
    // newPlace.name = sanitizeHtml(newPlace.name);

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







/**
 * Batch update to fill the google default photo in every place without it
 */
export function batchUpdatePlacesWithoutGooglePhoto(req, res) {
  Place.find({ googlePhotoUrl: null }).exec((err, places) => {
    if (err) {
      logger.error('placeController.batchUpdatePlacesWithoutGooglePhoto returns err: ', err);
      res.status(500).send(err);
    } else {
      logger.info(`placeController.batchUpdatePlacesWithoutGooglePhoto length=${places.length}`);
      for (const place of places) {
// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
// https://maps.googleapis.com/maps/api/place/details/json?placeid=67463f0c1dba4c2cb784632442a4eb842f83f0d7&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
// KO if taken from result from details query: https://lh3.googleusercontent.com/p/CmRaAAAAuS3s-7tmk3-VryvlTEDXs8j9oC9shWW5qxj6ShQIw0Uyo_RnslOjBj6ZbroK3_-CHaD_VG87TkluLw_pXleOW6b2chk0qlDsbuyfdUa_nStVX42o0h-PmsrAdmFvo9U4EhBE3vsxR9d6_kL9ItAOKE7pGhQTEtKRMt9THmB-fw-HJ2dm1l-HKg
// OK when generated by Places service... but how??? https://lh3.googleusercontent.com/p/AF1QipMIevEw_klE7idV2Vyw_EEDfs3nxV9GBLntymTV=w1024-k
// https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAuS3s-7tmk3-VryvlTEDXs8j9oC9shWW5qxj6ShQIw0Uyo_RnslOjBj6ZbroK3_-CHaD_VG87TkluLw_pXleOW6b2chk0qlDsbuyfdUa_nStVX42o0h-PmsrAdmFvo9U4EhBE3vsxR9d6_kL9ItAOKE7pGhQTEtKRMt9THmB-fw-HJ2dm1l-HKg&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0

        // 1) Call the Place details api of this place
        const queryDetails = `https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJjW4Yx3cqw0cRrWPPeXg7iDM&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0`;
        console.log ('queryDetails: ', queryDetails);
        request(queryDetails,
          (error, response, body) => {
            if (!error && response.statusCode === 200) {
              console.log(body); // Print the google web page.
              res.status(200).end();
            } else {
              logger.error('placeController.batchUpdatePlacesWithoutGooglePhoto returns err: ', error);
              res.status(500).send(error);
            }
          }
        );

        // 2) Get the photo_reference from the details
        // 3) Call the Photo api with this ref (and size) to get the url in return
      }
    }
  });
}
