import * as logger from 'winston';
import fs from 'fs-extra';
import config from 'config';
import path from 'path';
import Jimp from 'jimp';
import klaw from 'klaw';


global.regenerateAllProcessing = false;

let io = null;
let _timeStart = null;
let _timeStartProcessing = null;

export function regenerateAll(req, res) {

  if (global.regenerateAllProcessing) {
    logger.error('! generateThumbnails.regenerateAll - Processing already in progress');
    res.json({ error: 'Processing already in progress...' });
    return;
  }
  global.regenerateAllProcessing = true;

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

  // Folder init
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
  io.emit('regenerateAllThumbnails.start');


  // Scan the folders
  // and process each file
  let nbFilesOK = 0;
  let nbFilesKO = 0;
  let _timeProcessingPrevious = _timeStartProcessing;

  klaw(folderPictures)
    .on('data', function (item) {
      if (!item.stats.isDirectory()) {
        // Pause processing of images until current file processed
        this.pause();

        // Process file (resize, reduce quality, save to thumbsnail folder)
        const fileName = path.basename(item.path);
        Jimp.read(item.path).then((picture) => {
          picture.scaleToFit(256, 256)              // resize
            .quality(60)                            // set JPEG quality
            .write(path.join(folderThumbnails, fileName), () => {
              // Stats
              const _timeProcessing = Date.now();
              const durationTotal = _timeProcessing - _timeStart;
              const duration = _timeProcessing - _timeProcessingPrevious;
              _timeProcessingPrevious = _timeProcessing;
              nbFilesOK += 1;
              logger.info(`generateThumbnails.regenerateAll ${_timeProcessing - _timeProcessingPrevious} ms for #${nbFilesOK}: ${fileName}`);

              // Update browser
              io.emit('regenerateAllThumbnails.OK', { fileName, duration, durationTotal, nbFilesOK, nbFilesKO });

              // Resume processing (of next image)
              this.resume();
            });
        }).catch((errJimp) => {
          // Stats
          const _timeProcessing = Date.now();
          const durationTotal = _timeProcessing - _timeStart;
          const duration = _timeProcessing - _timeProcessingPrevious;
          _timeProcessingPrevious = _timeProcessing;
          nbFilesKO += 1;
          logger.error(`! generateThumbnails.regenerateAll - ${fileName} failed (2): `, errJimp);
          io.emit('regenerateAllThumbnails.KO', { fileName, duration, durationTotal, nbFilesOK, nbFilesKO });
          this.resume();
        });
      }
    })
    .on('end', function () {
      const durationTotal = Date.now() - _timeStart;
      logger.info(`generateThumbnails.regenerateAll ended in ${Math.round(durationTotal / 1000)} seconds for ${nbFilesOK} pictures (avg: ${Math.round(durationTotal / nbFilesOK)} ms)`);
      io.emit('regenerateAllThumbnails.done', { durationTotal, nbFilesOK, nbFilesKO });

      global.regenerateAllProcessing = false;
    });
}