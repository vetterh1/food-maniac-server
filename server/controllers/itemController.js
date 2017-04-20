import * as logger from 'winston';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';
import fs from 'fs';
import config from 'config';
import path from 'path';
import Item from '../models/item';
import * as GenerateThumbnails from '../util/generateThumbnails';


/**
 * Get nb items
 */
export function getItemsCount(req, res) {
  // TODO: query should return items of current user.
  const query = {};
  Item.count(query, (err, count) => {
    if (err) {
      logger.error('itemController.getItemsCount returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ count });
      logger.info(`itemController.getItemsCount returns ${count}`);
    }
  });
}


/**
 * Get all items
 */
export function getItems(req, res) {
  const offset = req.params.offset ? Number(req.params.offset) : 0;
  const limit = req.params.limit ? Number(req.params.limit) : 100;

  // TODO: query should return items of current user.
  const query = {};
  const options = {
    // select: 'title date author',
    sort: { since: -1 },
    // populate: 'author',
    lean: true,
    offset,
    limit,
  };

  Item.paginate(query, options, (err, items) => {
    if (err) {
      logger.error('itemController.getItems returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ items: items.docs });
      logger.info(`itemController.getItems length=${items.docs.length}`);
      // logger.info(JSON.stringify(items.docs));
    }
  });
}


/**
 * Add a item
 */

export function addItem(req, res) {
  if (!req.body || !req.body.item || !req.body.item.name || !req.body.item.category || !req.body.item.kind) {
    logger.error('itemController.addItem failed - missing mandatory fields');
    if (!req.body) logger.error('... no req.body!');
    if (req.body && !req.body.item) logger.error('... no req.body.item!');
    if (req.body && req.body.item && !req.body.item.name) logger.error('... no req.body.item.name!');
    if (req.body && req.body.item && req.body.item.name && req.body.item.name.length <= 0) logger.error('... req.body.item.name empty!');
    if (req.body && req.body.item && !req.body.item.category) logger.error('... no req.body.item.category!');
    if (req.body && req.body.item && req.body.item.category && req.body.item.category.length <= 0) logger.error('... req.body.item.category empty!');
    if (req.body && req.body.item && !req.body.item.kind) logger.error('... no req.body.item.kind!');
    if (req.body && req.body.item && req.body.item.kind && req.body.item.kind.length <= 0) logger.error('... req.body.item.kind empty!');
    res.status(400).end();
  } else {
    const newItem = new Item(req.body.item);

    // Let's sanitize inputs
    newItem.category = sanitizeHtml(newItem.category).toLowerCase();
    newItem.kind = sanitizeHtml(newItem.kind).toLowerCase();
    newItem.name = sanitizeHtml(newItem.name);
    newItem.picture = cuid(); // generate a random number for the file name
    newItem.save((err, saved) => {
      if (err) {
        logger.error(`itemController.addItem ${newItem.name} failed - _id: ${newItem._id} - name: ${newItem.name} - category: ${newItem.category} - kind: ${newItem.kind} - err:`, err);
        res.status(500).send(err);
      } else {
        res.json({ item: saved });
        logger.info(`itemController.addItem ${newItem.name} - saved in DB OK - _id: ${newItem._id}`);
      }
    });

    // Save image directly in a file on the server
    if (req.body.item.picture) {
      logger.info(`itemController.addItem ${newItem.name} - saving image ${newItem.picture} (size: ${Math.floor(req.body.item.picture.length / 1024)}KB)`);

      // need to strip the beginning of the pic by removing 'data:image/jpeg;base64,'
      // and save the remaining using the 'base64' encoding option
      const data = req.body.item.picture.replace(/^data:image\/\w+;base64,/, '');

      const folderStatic = config.get('storage.static');
      // const folderPicturesItems = path.join(__dirname, '..', folderStatic, '/pictures/items');
      const filePath = path.join(__dirname, '..', folderStatic, '/pictures/items', `${newItem.picture}.jpg`);
      fs.writeFile(
        filePath,
        // `${folderPicturesItems}/${newItem.picture}.jpg`,
        data, { encoding: 'base64' },
        (err) => {
          if (err) {
            logger.error(`itemController.addItem ${newItem.name} - saving image FAILED - _id: ${newItem._id} - Picture id: ${newItem.picture} (path: ${filePath}) !`);
          } else {
            logger.info(`itemController.addItem ${newItem.name} - saved image OK - _id: ${newItem._id} - Picture id: ${newItem.picture} (path: ${filePath})`);
            // const folderStatic = config.get('storage.static');
            const folderThumbnails = path.join(__dirname, '..', folderStatic, '/thumbnails');
            GenerateThumbnails.generateThumbnail(filePath, folderThumbnails, null, () => {
              logger.info(`itemController.addItem ${newItem.name} - saved thumbnail OK`);
            });
          }
        });
    }
  }
}


/**
 * Get a single item
 */
export function getItem(req, res) {
  Item.findById(req.params._id).exec((err, item) => {
    if (err || !item) {
      logger.error(`itemController.getItem ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      res.json({ item });
      logger.info(`itemController.getItem ${item.name} (_id=${req.params._id})`);
    }
  });
}


/*
 * Update an existing item
 */
export function updateItem(req, res) {
  if (!req.body || !req.body.item) {
    const error = { status: 'error', message: 'itemController.updateItem failed - no body or item' };
    if (!req.body) error.message += '... no req.body!';
    if (req.body && !req.body.item) error.message += '... no req.body.item!';
    res.status(400).json(error);
  } else if (req.body && req.body.item && req.body.item._id) {
    res.status(400).json({ status: 'error', message: 'itemController.updateItem failed - _id cannot be changed' });
  } else {
    Item.findOneAndUpdate({ _id: req.params._id }, req.body.item, { new: true }, (err, item) => {
      if (err || !item) {
        logger.error(`itemController.updateItem ${req.params._id} failed to update - err = `, err);
        res.status(500).send(err);
      } else {
        res.json({ item });
        logger.info(`itemController.updateItem ${req.params._id}`);
      }
    });
  }
}


/**
 * Delete a item
 */
export function deleteItem(req, res) {
  Item.findOne({ _id: req.params._id }).exec((err, item) => {
    if (err || !item) {
      logger.error(`placeController.deleteItem ${req.params._id} failed to find - err = `, err);
      res.status(500).send(err);
    } else {
      item.remove(() => {
        if (err) {
          logger.error(`placeController.deleteItem ${req.params._id} failed to remove - err = `, err);
          res.status(500).send(err);
        } else {
          res.status(200).end();
          logger.info(`placeController.deleteItem ${req.params._id}`);
        }
      });
    }
  });
}
