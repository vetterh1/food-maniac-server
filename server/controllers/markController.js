import Mark from '../models/mark';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';


/**
 * Get all marks
 * @param req
 * @param res
 * @returns void
 */
export function getMarks(req, res) {
  Mark.find().sort('-since').exec((err, marks) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ marks });
  });
}


/**
 * Add a mark
 * @param req
 * @param res
 * @returns void
 */

export function addMark(req, res) {
  console.log("{ markController.addMark");
  if (!req.body.mark.mark || !req.body.mark.item || !req.body.mark.place || !req.body.mark.user) {
    res.status(403).end();
  }

  const newMark = new Mark(req.body.mark);

  newMark.cuid = cuid();
  newMark.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ mark: saved });
    console.log("} markController.addMark");
  });
  console.log("{ !markController.addMark failed!");
}


/**
 * Get a single mark
 * @param req
 * @param res
 * @returns void
 */
export function getMark(req, res) {
  Mark.findOne({ cuid: req.params.cuid }).exec((err, mark) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ mark });
  });
}


/**
 * Delete a mark
 * @param req
 * @param res
 * @returns void
 */
export function deleteMark(req, res) {
  Mark.findOne({ cuid: req.params.cuid }).exec((err, mark) => {
    if (err) {
      res.status(500).send(err);
    }

    mark.remove(() => {
      res.status(200).end();
    });
  });
}
