import * as logger from 'winston';
import sanitizeHtml from 'sanitize-html';
import Kind from '../models/kind';


/*
 * Get all kinds
 */
export function getKinds(req, res) {
  Kind.find().sort('name').exec((err, kinds) => {
    if (err) {
      logger.error('kindController.getKinds returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ kinds });
      logger.info(`kindController.getKinds length=${kinds.length}`);
    }
  });
}


/*
 * Add a kind
 */

export function addKind(req, res) {
  if (!req.body || !req.body.kind || !req.body.kind.name) {
    logger.error('kindController.addKind failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.kind) logger.error('... no req.body.kind!');
    if (req.body && req.body.kind && !req.body.kind.name) logger.error('... no req.body.kind.name!');
    res.status(400).end();
  } else {
    const newKind = new Kind(req.body.kind);

    // Let's sanitize inputs
    newKind.name = sanitizeHtml(newKind.name);

    newKind.save((err, saved) => {
      if (err) {
        logger.error(`kindController.addKind ${newKind.name} failed - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ kind: saved });
        logger.info(`kindController.addKind ${newKind.name} (_id=${saved._id})`);
      }
    });
  }
}


/*
 * Get a single kind
 */
export function getKind(req, res) {
  Kind.findById(req.params._id).exec((err, kind) => {
    if (err || !kind) {
      logger.error(`kindController.getKind ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ kind });
      logger.info(`kindController.getKind ${kind.last} (_id=${req.params._id})`);
    }
  });
}


/*
 * Update an existing kind
 */
export function updateKind(req, res) {
  if (!req.body || !req.body.kind) {
    const error = { status: 'error', message: 'kindController.updateKind failed - no body or kind' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.kind) error.message += '... no req.body.kind!';
    res.status(400).json(error);
  } else if (req.body && req.body.kind && req.body.kind._id) {
    res.status(400).json({ status: 'error', message: 'kindController.updateKind failed - _id cannot be changed' });
  } else {
    Kind.findOneAndUpdate({ _id: req.params._id }, req.body.kind, { new: true }, (err, kind) => {
      if (err || !kind) {
        logger.error(`kindController.updateKind ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ kind });
        logger.info(`kindController.updateKind ${req.params._id}`);
      }
    }); 
  }
}



/*
 * Delete an existing kind
 */
export function deleteKind(req, res) {
  Kind.findOne({ _id: req.params._id }).exec((err, kind) => {
    if (err || !kind) {
      logger.error(`kindController.deleteKind ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    }
    else
    {
      kind.remove(() => {
        if (err) {
          logger.error(`kindController.deleteKind ${req.params._id} failed to remove - err = `, err);
          res.status(500).send(err);
        }
        else {
          res.status(200).end();
          logger.info(`kindController.deleteKind ${req.params._id}`);
        }
      });
    }
  });
}
