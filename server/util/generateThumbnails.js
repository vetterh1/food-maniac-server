import * as logger from 'winston';
import Item from '../models/item';
// import cuid from 'cuid';
import fs from 'fs';
import config from 'config';
import path from 'path';
import Jimp from 'jimp';


/* eslint-disable no-plusplus */


//
// Recursive and parallel walk of a folder and all its sub-folders
// Calls the callback fn (doneCallbackFn) EVERY time a folder is scanned
//

function walk(dir, doneCallbackFn) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return doneCallbackFn(err);
    let pending = list.length;
    if (!pending) return doneCallbackFn(null, results);
    list.forEach((file) => {
      // loop on all the files of the CURRENT folder (dir)
      const fileResolved = path.resolve(dir, file);
      fs.stat(fileResolved, (errStat, stat) => {
        // stat is async, check if folder or file
        if (stat && stat.isDirectory()) {
          // folder: recursive call
          walk(fileResolved, (errWalk, res) => {
            // callback function: add the retreived children files to the parent results
            results = results.concat(res);
            // call the callback with results if all the folder files are processed
            if (!--pending) doneCallbackFn(null, results);
          });
        } else {
          // file: add it to the results array
          results.push(fileResolved);
            // call the callback with results if all the folder files are processed
          if (!--pending) doneCallbackFn(null, results);
        }
      });
    });
  });
}


/**
 * Regenerate all thumbnails
 */

//
// TODO  To change: use the walk() function above to retreive ALL the pictures
// from ALL the subfolders of /pictures (instead of querying the db for items...)
//

export function regenerateAll(req, res) {
  const folderStatic = config.get('storage.static');
  const folderPictures = path.join(__dirname, '..', folderStatic, '/pictures');
  const folderThumbnails = path.join(__dirname, '..', folderStatic, '/thumbnails');
  const folderThumbnailsBackup = path.join(__dirname, '..', folderStatic, `/thumbnails.save`);

  // Delete backup
  try {
    fs.rmdirSync(folderThumbnailsBackup);
    logger.info(`generateThumbnails.regenerateAll deleted ${folderThumbnailsBackup}...`);
  } catch (err) {
    logger.error(`generateThumbnails.regenerateAll failed to delete ${folderThumbnailsBackup}: ${err}`);
  }

  // Rename thumbnails folder
  try {
    fs.renameSync(folderThumbnails, folderThumbnailsBackup);
    logger.info(`generateThumbnails.regenerateAll renamed ${folderThumbnails} to ${folderThumbnailsBackup}...`);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      logger.info(`generateThumbnails.regenerateAll could not rename ${folderThumbnails} to ${folderThumbnailsBackup}: source does not exist!`);
    } else {
      logger.error(`generateThumbnails.regenerateAll failed to rename ${folderThumbnails} to ${folderThumbnailsBackup}: ${err.code}`);
    }
  }

  // Recreate thumbnails folder
  try {
    fs.mkdirSync(folderThumbnails);
  } catch (err) {
    logger.error(`generateThumbnails.regenerateAll re-create ${folderThumbnails}: ${err}`);
  }


  // Loop on all the Items pictures
  Item.find().sort('-since').exec((err, items) => {
    if (err) {
      logger.error('! generateThumbnails.regenerateAll returns err: ', err);
      res.status(500).send(err);
    } else {
      const pictureFileObjects = [];
      for (const item of items) {
        if (item.picture) pictureFileObjects.push({ name: item.picture, _id: item.picture });
      }
      res.json({ items: pictureFileObjects });
      logger.info(`generateThumbnails.regenerateAll nbItems=${pictureFileObjects.length}`);

      for (const pictureFileObject of pictureFileObjects) {
        Jimp.read(path.join(folderPictures, '/items', `${pictureFileObject.name}.jpg`)).then((picture) => {
          picture.scaleToFit(256, 256)            // resize
           .quality(60)                 // set JPEG quality
           .write(path.join(folderThumbnails, `${pictureFileObject.name}.jpg`));
          logger.info('generateThumbnails.regenerateAll generating thumbnail: ', path.join(folderThumbnails, `${pictureFileObject.name}.jpg`));
        }).catch((errJimp) => {
          logger.error('! generateThumbnails.regenerateAll returns err (2): ', errJimp);
        });
      }
    }
  });
}