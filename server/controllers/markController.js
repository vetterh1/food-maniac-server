import * as logger from 'winston';
import cuid from 'cuid';
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

    newMark.cuid = cuid();
    newMark.save((err, saved) => {
      if (err) {
        logger.error(`! markController.addMark ${newMark.mark} failed! - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ mark: saved });
        logger.info(`markController.addMark cuid=${saved.cuid}`);
      }
    });
  }
}


/**
 * Get a single mark
 */
export function getMark(req, res) {
  Mark.findOne({ cuid: req.params.cuid }).exec((err, mark) => {
    if (err || !mark) {
      logger.error(`! markController.getMark ${req.params.cuid} failed to find! - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ mark });
      logger.info(`markController.getMark ${req.params.cuid}`);
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
  } else if (req.body && req.body.mark && req.body.mark.cuid) {
    res.status(400).json({ status: 'error', message: '! markController.updateMark failed! - cuid cannot be changed' });
  } else {
    Mark.findOneAndUpdate({ cuid: req.params.cuid }, req.body.mark, { new: true }, (err, mark) => {
      if (err || !mark) {
        logger.error(`! markController.updateMark ${req.params.cuid} failed to update! - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ mark });
        logger.info(`markController.updateMark ${req.params.cuid}`);
      }
    });
  }
}


/**
 * Delete a mark
 */
export function deleteMark(req, res) {
  Mark.findOne({ cuid: req.params.cuid }).exec((err, mark) => {
    if (err || !mark) {
      logger.error(`! placeController.deleteMark ${req.params.cuid} failed to find! - err = `, err);
      res.status(500).send(err);
    } else {
      mark.remove(() => {
        if (err) {
          logger.error(`! placeController.deleteMark ${req.params.cuid} failed to remove! - err = `, err);
          res.status(500).send(err);
        } else {
          res.status(200).end();
          logger.info(`placeController.deleteMark ${req.params.cuid}`);
        }
      });
    }
  });
}
