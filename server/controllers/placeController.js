import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html'; // sanitizeHtml escapes &<>" : s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
import request from 'request';
import eachSeries from 'async/eachSeries';
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
 * Batch update to get the right google id (place_id, not id!)
 *
 * Should be called for every type of place (restaurant, bakery, bar, cafe)
 *
 * Ex 1: http://localhost:8080/api/places/updateGoogleId
 * Ex 2: http://localhost:8080/api/places/updateGoogleId?options={"type":"bakery"}
 * Ex 3: http://localhost:8080/api/places/updateGoogleId?options={"type":"bakery", "proxy":"http://proxy:3128"}
 */

export function batchUpdatePlacesWithWrongGoogleId(req, res) {
  const options = req.query.options ? JSON.parse(req.query.options) : {};
  if (!options.type) options.type = 'restaurant';
  if (!options.proxy) options.proxy = null;

  Place.find().exec((err, places) => {
    if (err) {
      logger.error('placeController.batchUpdatePlacesWithWrongGoogleId returns err: ', err);
      res.status(500).send(err);
    } else {
      logger.info(`placeController.batchUpdatePlacesWithWrongGoogleId length=${places.length}`);

      const resultsArray = [];
      let resultsOK = 0;
      let resultsKO = 0;

      eachSeries(places, (place, callback) => {
        // 1) Get the closest locations from google
        const placeName = place.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
        const oldPlaceId = place.googleMapId;
        const lat = place.location.coordinates[1];
        const lng = place.location.coordinates[0];
        const queryNearbyPlaces = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&type=${options.type}&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0`;

        // console.log('queryNearbyPlaces: ', queryNearbyPlaces);
        request({ url: queryNearbyPlaces, proxy: options.proxy },
          (error, response, body) => {
            if (error || response.statusCode !== 200) {
              const msg = `${place._id} (${placeName}) failed to update googleMapId from ${oldPlaceId} - error = ${error}`;
              resultsArray.push(msg);
              resultsKO += 1;
              logger.error(`placeController.batchUpdatePlacesWithWrongGoogleId ${msg}`);
              callback();
            } else {
              // 2) From these results, find the one with same name
              const jsonBody = JSON.parse(body); // should have a non-empty results array
              if (!jsonBody) {
                const msg = `${place._id} (${placeName}) Could not find place!`;
                resultsArray.push(msg);
                resultsKO += 1;
                logger.error(`placeController.batchUpdatePlacesWithWrongGoogleId ${msg}`);
                callback();
              } else {
                const thePlace = jsonBody.results.find(placeInResults => placeInResults.name === placeName);
                if (!thePlace) {
                  const googlePlaces = jsonBody.results.reduce((resReduce, crt) => { return resReduce.concat(crt.name, ' - '); }, '');
                  const msg = `${place._id} (${placeName}) Could not find place with same name in google results (${googlePlaces})`;
                  resultsArray.push(msg);
                  resultsKO += 1;
                  logger.error(`placeController.batchUpdatePlacesWithWrongGoogleId ${msg}`);
                  callback();
                } else {
                  // 3) Retreive his place_id and update the Mongo record with it
                  const placeId = thePlace.place_id;
                  if (!placeId) {
                    const msg = `${place._id} (${placeName}) Could not find place_id in google results`;
                    resultsArray.push(msg);
                    resultsKO += 1;
                    logger.error(`placeController.batchUpdatePlacesWithWrongGoogleId ${msg}`);
                    callback();
                  } else {
                    const placeUpdate = Object.assign({}, { googleMapId: placeId, lastModif: new Date() });
                    Place.findOneAndUpdate({ _id: place._id }, placeUpdate, { new: true }, (errUpdt, placeUpdt) => {
                      if (errUpdt || !placeUpdt) {
                        const msg = `${place._id} (${placeName}) failed to update googleMapId from ${oldPlaceId} to ${placeId} - err = ${err}`;
                        resultsArray.push(msg);
                        resultsKO += 1;
                        logger.error(`placeController.batchUpdatePlacesWithWrongGoogleId ${msg}`);
                        callback();
                      } else {
                        const msg = `${place._id} (${placeName}) updated googleMapId from ${oldPlaceId} to ${placeId}`;
                        resultsArray.push(msg);
                        resultsOK += 1;
                        logger.info(`placeController.batchUpdatePlacesWithWrongGoogleId ${msg}`);
                        callback();
                      }
                    });
                  }
                }
              }
            }
          }
        );
      }, (errEachSeries) => {
        const summary = { type: options.type, statistics: { total: resultsArray.length, ok: resultsOK, ko: resultsKO }, results: resultsArray };
        logger.info(`placeController.batchUpdatePlacesWithWrongGoogleId statistics: ${JSON.stringify(summary.statistics)}`);
        if (errEachSeries) res.status(500).json(summary);
        res.status(200).json(summary);
      });
    }
  });
}




/**
 * Batch update to fill the google default photo in every place without it
 */
export function batchUpdatePlacesWithoutGooglePhoto(req, res) {
  const options = req.query.options ? JSON.parse(req.query.options) : {};
  if (!options.proxy) options.proxy = null;

  Place.find({ googlePhotoUrl: { $exists: false } }).exec((err, places) => {
    if (err) {
      logger.error('placeController.batchUpdatePlacesWithoutGooglePhoto returns err: ', err);
      res.status(500).send(err);
    } else {
      logger.info(`placeController.batchUpdatePlacesWithoutGooglePhoto length=${places.length}`);

      const resultsArray = [];
      let resultsOK = 0;
      let resultsKO = 0;
      eachSeries(places, (place, callback) => {
        // 1) Call the Place details api of this place
        const placeName = place.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
        const queryDetails = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.googleMapId}&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0`;
        // Call example for via istambul: https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJi-duuGTTwkcRbDZlCrFuYHA&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0

        request({ url: queryDetails, proxy: options.proxy },
          (error, response, body) => {
          // console.log('response:', response.toJSON());
          if (error || response.statusCode !== 200) {
              const msg = `${place._id} (${placeName}) failed to find details for googleMapId=${place.googleMapId} - error = ${error}`;
              resultsArray.push(msg);
              resultsKO += 1;
              logger.error(`placeController.batchUpdatePlacesWithoutGooglePhoto ${msg}`);
              callback();
            } else {
              // 2) Get the photo_reference from the details
              const jsonBody = JSON.parse(body); // should have a non-empty results array
              if (!jsonBody) {
                const msg = `${place._id} (${placeName}) Could not find json details for googleMapId=${place.googleMapId}`;
                resultsArray.push(msg);
                resultsKO += 1;
                logger.error(`placeController.batchUpdatePlacesWithoutGooglePhoto ${msg}`);
                callback();
              } else {
                if (!jsonBody.result.photos || jsonBody.result.photos.length < 1 || !jsonBody.result.photos[0].photo_reference) {
                  const msg = `${place._id} (${placeName}) No photos in google details for googleMapId=${place.googleMapId}`;
                  resultsArray.push(msg);
                  resultsKO += 1;
                  logger.error(`placeController.batchUpdatePlacesWithoutGooglePhoto ${msg}`);
                  callback();
                } else {
                  const photoReference = jsonBody.result.photos[0].photo_reference;

                  // 3) Call the Photo api with this ref (and size) to get the url in return
                  const queryPhotoApi = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0`;
                  // Call example for via istambul: https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=CmRaAAAA5U6Pz0DeS0xe-x5KqI2YeOj3Ub0M0TyT0oeJd_lUZtcrCieI7d6QSTjRHfgwf1EdhTpPW_X6uKhl5Xr5IuKjFy_TsGthBLwTMAoayc3AZp7v_oBm5w6ZEwe-AoFd_pBmEhBUVcj39_zDWDHcHHSS5VcrGhR3hl4p-JVQ69NoDnI6kOn5FYDW4g&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
                
                  request({ url: queryPhotoApi, proxy: options.proxy },
                    (errorQueryPhoto, responseQueryPhoto) => {
                      if (errorQueryPhoto || responseQueryPhoto.statusCode !== 200) {
                        const msg = `${place._id} (${placeName}) failed to get photo url for googleMapId=${place.googleMapId} - errorQueryPhoto = ${errorQueryPhoto}`;
                        resultsArray.push(msg);
                        resultsKO += 1;
                        logger.error(`placeController.batchUpdatePlacesWithoutGooglePhoto ${msg}`);
                        callback();
                      } else {
                        const href = responseQueryPhoto.request.uri.href;
                        // console.log('href:', href);


                        // 4) Update the Mongo record with the url
                        const placeUpdate = Object.assign({}, { googlePhotoUrl: href, lastModif: new Date() });
                        Place.findOneAndUpdate({ _id: place._id }, placeUpdate, { new: true }, (errUpdt, placeUpdt) => {
                          if (errUpdt || !placeUpdt) {
                            const msg = `${place._id} (${placeName}) failed to update googlePhotoUrl to ${href} - err = ${err}`;
                            resultsArray.push(msg);
                            resultsKO += 1;
                            logger.error(`placeController.batchUpdatePlacesWithoutGooglePhoto ${msg}`);
                            callback();
                          } else {
                            const msg = `${place._id} (${placeName}) updated googlePhotoUrl to ${href}`;
                            resultsArray.push(msg);
                            resultsOK += 1;
                            logger.info(`placeController.batchUpdatePlacesWithoutGooglePhoto ${msg}`);
                            callback();
                          }
                        });

                      }
                    }
                  );
                }
              } /* else !jsonBody */
            } /* else error || response.statusCode !== 200 */
          } /* end callback request */
        ); /* end request */
      }, (errEachSeries) => {
        const summary = { type: options.type, statistics: { total: resultsArray.length, ok: resultsOK, ko: resultsKO }, results: resultsArray };
        logger.info(`placeController.batchUpdatePlacesWithoutGooglePhoto statistics: ${JSON.stringify(summary.statistics)}`);
        if (errEachSeries) res.status(500).json(summary);
        res.status(200).json(summary);
      });
    }
  });
}

// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
// https://maps.googleapis.com/maps/api/place/details/json?placeid=67463f0c1dba4c2cb784632442a4eb842f83f0d7&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
// KO if taken from result from details query: https://lh3.googleusercontent.com/p/CmRaAAAAuS3s-7tmk3-VryvlTEDXs8j9oC9shWW5qxj6ShQIw0Uyo_RnslOjBj6ZbroK3_-CHaD_VG87TkluLw_pXleOW6b2chk0qlDsbuyfdUa_nStVX42o0h-PmsrAdmFvo9U4EhBE3vsxR9d6_kL9ItAOKE7pGhQTEtKRMt9THmB-fw-HJ2dm1l-HKg
// OK when generated by Places service... but how??? https://lh3.googleusercontent.com/p/AF1QipMIevEw_klE7idV2Vyw_EEDfs3nxV9GBLntymTV=w1024-k
// https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAuS3s-7tmk3-VryvlTEDXs8j9oC9shWW5qxj6ShQIw0Uyo_RnslOjBj6ZbroK3_-CHaD_VG87TkluLw_pXleOW6b2chk0qlDsbuyfdUa_nStVX42o0h-PmsrAdmFvo9U4EhBE3vsxR9d6_kL9ItAOKE7pGhQTEtKRMt9THmB-fw-HJ2dm1l-HKg&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
// via istambul: https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJi-duuGTTwkcRbDZlCrFuYHA&key=AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0
