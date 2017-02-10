import * as logger from 'winston';
import Item from '../models/item';
import cuid from 'cuid';
import fs from 'fs';
import config from 'config';
import path from 'path';


/**
 * Regenerate all thumbnails
 */
export function regenerateAll(req, res) {
  // Process:
  // - delete content of thumbnails folder TODO
  // - read all the items
  // - for each item, generate thumbnail from its picture
  // - return stats

  Item.find().sort('-since').exec((err, items) => {
    if (err) {
      logger.error('! generateThumbnails.regenerateAll returns err: ', err);
      res.status(500).send(err);
    } else {
      res.json({ items });
      logger.info(`generateThumbnails.regenerateAll nbItems=${items.length}`);
    }
  });
}