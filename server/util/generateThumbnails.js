import * as logger from 'winston';
import fs from 'fs-extra';
import config from 'config';
import path from 'path';
import Jimp from 'jimp';
import klaw from 'klaw';

let io = null;
let _timeStart = null;
let _timeStartProcessing = null;

export function regenerateAll(req, res) {
  _timeStart = Date.now();

  io = req.app.get('socketio');
  // console.log('socket io req response: ', io);

  //
  // ---------------------   Real time sockets  ---------------------
  //

  io.on('connection', (socket) => {
    logger.info('generateThumbnails.regenerateAll - a user connected');
    io.emit('connected');

    socket.on('disconnect', () => {
      logger.info('generateThumbnails.regenerateAll - a user disconnected');
    });
  });


  const folderStatic = config.get('storage.static');
  const folderPictures = path.join(__dirname, '..', folderStatic, '/pictures');
  const folderThumbnails = path.join(__dirname, '..', folderStatic, '/thumbnails');
  const folderThumbnailsBackup = path.join(__dirname, '..', folderStatic, `/thumbnails.save.${Date.now()}`);

  // Rename thumbnails folder
  try {
    fs.renameSync(folderThumbnails, folderThumbnailsBackup);
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
  _timeStartProcessing = Date.now();
  logger.info(`generateThumbnails.regenerateAll duration init = ${_timeStartProcessing - _timeStart}`);

  // Send empty body to browser...
  // the updates will come through socket emit messages
  // and displayed in the browser
  res.json({ items: null });

  // Scan the folders
  // and process each file
  let iData = 0;
  let _timeProcessingPrevious = _timeStartProcessing;

  klaw(folderPictures)
    .on('data', function (item) {
      iData += 1;
      if (!item.stats.isDirectory()) {
        this.pause();
        const fileName = path.basename(item.path);
        Jimp.read(item.path).then((picture) => {
          picture.scaleToFit(256, 256)            // resize
          .quality(60)                 // set JPEG quality
          .write(path.join(folderThumbnails, fileName), () => {
            io.emit('regenerateAllThumbnails.OK', fileName);
            const _timeProcessing = Date.now();
            logger.info(`generateThumbnails.regenerateAll ${_timeProcessing - _timeProcessingPrevious}ms for #${iData}: ${fileName}`);
            _timeProcessingPrevious = _timeProcessing;
            this.resume();
           });
        }).catch((errJimp) => {
          logger.error('! generateThumbnails.regenerateAll returns err (2): ', errJimp);
          io.emit('regenerateAllThumbnails.KO', fileName);
          this.resume();
        });
      }
    })
    .on('end', function () {
      const duration = Date.now() - _timeStart;
      logger.info(`generateThumbnails.regenerateAll ended in ${Math.round(duration / 1000)} seconds for ${iData} pictures (avg: ${Math.round(duration / iData)}ms)`);
      io.emit('regenerateAllThumbnails.done');
    });
}