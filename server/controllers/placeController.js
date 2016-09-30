import Place from '../models/place';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';


/**
 * Get all places
 * @param req
 * @param res
 * @returns void
 */
export function getPlaces(req, res) {
  Place.find().sort('-since').exec((err, places) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ places });
  });
}


/**
 * Add a place
 * @param req
 * @param res
 * @returns void
 */

export function addPlace(req, res) {
  console.log("{ placeController.addPlace");
  if (!req.body.place.name) {
    res.status(403).end();
  }

  const newPlace = new Place(req.body.place);

  // Let's sanitize inputs
  newPlace.name = sanitizeHtml(newPlace.name);
  newPlace.cuid = cuid();
  newPlace.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ place: saved });
    console.log("} placeController.addPlace");
  });
  console.log("{ !placeController.addPlace failed!");
}


/**
 * Get a single place
 * @param req
 * @param res
 * @returns void
 */
export function getPlace(req, res) {
  Place.findOne({ cuid: req.params.cuid }).exec((err, place) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ place });
  });
}


/**
 * Delete a place
 * @param req
 * @param res
 * @returns void
 */
export function deletePlace(req, res) {
  Place.findOne({ cuid: req.params.cuid }).exec((err, place) => {
    if (err) {
      res.status(500).send(err);
    }

    place.remove(() => {
      res.status(200).end();
    });
  });
}
