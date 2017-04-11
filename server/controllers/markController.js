import * as logger from 'winston';
import Mark from '../models/mark';


/**
 * Get all marks
 */
export function getMarks(req, res) {
  Mark.find().sort('-since').exec((err, marks) => {
    if (err) {
      logger.error('! markController.getMarks returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ marks });
      logger.info(`markController.getMarks length=${marks.length}`);
    }
  });
}


/**
 * Add a mark
 */

export function addMark(req, res) {
  if (!req.body || !req.body.mark || !req.body.mark.marks) {
    logger.error('! markController.addMark failed! - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.mark) logger.error('... no req.body.mark!');
    if (req.body && req.body.mark && !req.body.mark.marks) logger.error('... no req.body.mark.marks!');
    res.status(400).end();
  } else {
    const newMark = new Mark(req.body.mark);

    newMark.save((err, saved) => {
      if (err) {
        logger.error(`! markController.addMark ${newMark.mark} failed! - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ mark: saved });
        logger.info(`markController.addMark (_id=${saved._id})`);
      }
    });
  }
}


/**
 * Get a single mark
 */
export function getMark(req, res) {
  Mark.findById(req.params._id).exec((err, mark) => {
    if (err || !mark) {
      logger.error(`! markController.getMark ${req.params._id} failed to find! - err = `, err);
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
    const error = { status: 'error', message: '! markController.updateMark failed! - no body or mark' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.mark) error.message += '... no req.body.mark!';
    res.status(400).json(error);
  } else if (req.body && req.body.mark && req.body.mark._id) {
    res.status(400).json({ status: 'error', message: '! markController.updateMark failed! - _id cannot be changed' });
  } else {
    Mark.findOneAndUpdate({ _id: req.params._id }, req.body.mark, { new: true }, (err, mark) => {
      if (err || !mark) {
        logger.error(`! markController.updateMark ${req.params._id} failed to update! - err = `, err);
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
      logger.error(`! placeController.deleteMark ${req.params._id} failed to find! - err = `, err);
      res.status(500).send(err);
    } else {
      mark.remove(() => {
        if (err) {
          logger.error(`! placeController.deleteMark ${req.params._id} failed to remove! - err = `, err);
          res.status(500).send(err);
        } else {
          res.status(200).end();
          logger.info(`placeController.deleteMark ${req.params._id}`);
        }
      });
    }
  });
}
