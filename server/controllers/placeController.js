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
      console.log("! placeController.getPlaces returns err: ", err);
      res.status(500).send(err);
    }
    else
    {
      res.json({ places });
      console.log(`placeController.getPlaces length=${places.length}`);
    }
  });
}


/**
 * Add a place
 * @param req
 * @param res
 * @returns void
 */

export function addPlace(req, res) {
  if (!req.body.place.name) {
    console.log(`! placeController.addPlace ${req.body.place} failed! - missing mandatory fields`);
    res.status(403).end();
  }

  const newPlace = new Place(req.body.place);

  // Let's sanitize inputs
  newPlace.name = sanitizeHtml(newPlace.name);
  newPlace.cuid = cuid();
  newPlace.save((err, saved) => {
    if (err) {
      console.log(`! placeController.addPlace ${newPlace.name} failed! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      res.json({ place: saved });
      console.log(`placeController.addPlace ${newPlace.name}`);
    }
  });
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
      console.log(`! placeController.getPlace ${req.params.cuid} failed! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      res.json({ place });
      console.log(`placeController.getPlace ${req.params.cuid}`);
    }
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
      console.log(`! placeController.deletePlace ${req.params.cuid} failed! - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      place.remove(() => {
        res.status(200).end();
        console.log(`placeController.deletePlace ${req.params.cuid}`);
      });
    }
  });
}
