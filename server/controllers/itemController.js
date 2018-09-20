import * as logger from 'winston';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html'; // sanitizeHtml escapes &<>" : s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
import fs from 'fs';
import config from 'config';
import path from 'path';
import Item from '../models/item';
import * as GenerateThumbnails from '../util/generateThumbnails';


// /GET /count - Get items count
// Input conditions: json object with a filter condition (optional, default = no filter)
// Returns code 500 on network error
// Returns code 200 otherwise + { count: nnnn }
// Ex 1: http://localhost:8080/api/items/count
// Ex 2: http://localhost:8080/api/items/count?conditions={"category":"58f4dfff45dab98a840aa000"}

export function getItemsCount(req, res) {
  // LATER: query should return items of current user.
  const conditions = req.query.conditions ? JSON.parse(req.query.conditions) : {};
  Item.countDocuments(conditions, (err, count) => {
    if (err) {
      logger.error('itemController.getItemsCount returns err: ', err);
      res.status(500).send(err);
    } else {
      // Simulate json errors :) :
      // res.status(200).type('json').send('{"valid":"valid json but not what expected!"}'); // Should display error=01
      // res.status(200).type('json').send('{"invalid"}'); // Should display error=02
      // res.status(500).type('json').send('{"error": "message from server"}'); // Should display error=500
      res.json({ count });
      logger.info(`itemController.getItemsCount returns ${count} with conditions ${req.query.conditions}`);
    }
  });
}


// /GET route - Get all items with optional pagination, sorting & filters
// Optional inputs use Query parameters (?key1=value1&key2=value2)
// Input: 'offset' in the results (optional, default = 0)
// Input: 'limit' number of returned results (optional, default = 100)
// Input: 'sort' the results (optional, default = name (a-z))
// Input: 'query' can filter the results (optional, default = no filter)
// Returns code 500 on network error (NOT empty list)
// Returns code 200 otherwise + { items }
// Note: items is an array that can be empty
// Ex 1: http://localhost:8080/api/items?offset=1&limit=3
// Ex 2: http://localhost:8080/api/items?offset=1&limit=3&sort={"since":-1}&query={"category":"dish"}
// Ex 2: http://localhost:8080/api/items?query={"category":"dish"}

export function getItems(req, res) {

  logger.info(`itemController.getItems raw params: offset=${req.query.offset} - limit=${req.query.limit} - query=${req.query.query} - sort=${req.query.sort}`);

  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const query = req.query.query ? JSON.parse(req.query.query) : {};
  const sort = req.query.sort ? JSON.parse(req.query.sort) : { name: 1 };

  logger.info(`itemController.getItems computed params: offset=${offset} - limit=${limit} - query=${JSON.stringify(query)} - sort=${JSON.stringify(sort)}`);

  // LATER: query should return items of current user.

  const options = {
    // select: 'title date author',
    sort,
    // populate: 'author',
    lean: true,
    leanWithId: true, // adds id field with string representation of _id
    offset,
    limit,
  };

  Item.paginate(query, options, (err, items) => {
    if (err) {
      logger.error('itemController.getItems returns err: ', err);
      res.status(500).send(err);
    } else {
      // Simulate json errors :) :
      // res.status(200).type('json').send('{"valid":"valid json but not what expected!"}'); // Should display error=10 (ok)
      // res.status(200).type('json').send('{"invalid"}'); // Should display error=14 (ok)
      // res.status(500).type('json').send('{"error": "message from server"}'); // Should display error=500 (ok)
      res.json({ items: items.docs });
      logger.info(`itemController.getItems length=${items.docs.length}`);
      // logger.info('getItems:', JSON.stringify(items.docs));
    }
  });
}


/**
 * Add a item
 */

export function addItem(req, res) {
  // Simulate json errors :) :
  // res.status(400).end(); // Should display error=01 (ok)
  // res.status(500).type('json').send('{"error": "message from server"}'); // Should display error=01 (ok)

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
    newItem.picture = null;
    if (req.body.item.picture) newItem.picture = cuid(); // generate a random number for the file name
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
