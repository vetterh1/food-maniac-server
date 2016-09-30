import Item from '../models/item';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';


/**
 * Get all items
 * @param req
 * @param res
 * @returns void
 */
export function getItems(req, res) {
  Item.find().sort('-since').exec((err, items) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ items });
  });
}


/**
 * Add a item
 * @param req
 * @param res
 * @returns void
 */

export function addItem(req, res) {
  console.log("{ itemController.addItem");
  if (!req.body.item.name) {
    res.status(403).end();
  }

  const newItem = new Item(req.body.item);

  // Let's sanitize inputs
  newItem.name = sanitizeHtml(newItem.name);
  newItem.cuid = cuid();
  newItem.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ item: saved });
    console.log("} itemController.addItem");
  });
  console.log("{ !itemController.addItem failed!");
}


/**
 * Get a single item
 * @param req
 * @param res
 * @returns void
 */
export function getItem(req, res) {
  Item.findOne({ cuid: req.params.cuid }).exec((err, item) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ item });
  });
}


/**
 * Delete a item
 * @param req
 * @param res
 * @returns void
 */
export function deleteItem(req, res) {
  Item.findOne({ cuid: req.params.cuid }).exec((err, item) => {
    if (err) {
      res.status(500).send(err);
    }

    item.remove(() => {
      res.status(200).end();
    });
  });
}
