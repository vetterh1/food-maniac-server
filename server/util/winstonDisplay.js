const jade = require('pug');
const fs = require('fs');

module.exports = function(app, logger) {
  // Use the 2nd transport (transports[1]), as it's the File transport (transports[0] is the console)
  const logPath = `${logger.transports[1].dirname}/${logger.transports[1].filename}`;

  app.get('/logs/show', (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 500;
    const level = req.query.level ? Number(req.query.level) : 1; // Warns 0 & 1 (error & warn)
    const levels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 };

    const hours = req.query.hours ? Number(req.query.hours) : 0; // Display logs from last x hours
    const minutes = req.query.minutes ? Number(req.query.minutes) : 0; // Display logs from last x minutes
    const seconds = req.query.seconds ? Number(req.query.seconds) : 0; // Display logs from last x seconds

    // Compute the oldest date.
    // /!\ the hours, minutes and seconds parameters are exclusive
    // if the seconds parameter is specified, minutes & hours will be discarded
    // then, if the minutes parameter is specified, hours will be discarded
    let oldestDateInMs = Date.now();
    if (seconds > 0) {
      oldestDateInMs -= (seconds * 1000);
    } else if (minutes > 0) {
      oldestDateInMs -= (minutes * 60 * 1000);
    } else if (hours > 0) {
      oldestDateInMs -= (hours * 60 * 60 * 1000);
    } else {
      oldestDateInMs = 0;
    }

    fs.exists(logPath, (exist) => {
      if (exist) {
        fs.readFile(logPath, 'utf-8', (error, data) => {
          let lines = [];
          let browserContent = false;
          if (!error) {
            lines = data.toString()
              .split('\n')
              .reverse()
              .splice(1, limit)
              .map((line) => { return JSON.parse(line); })
              .filter((element) => { return levels[element.level] <= level; })
              .filter((element) => { return oldestDateInMs > 0 ? Date.parse(element.timestamp) >= oldestDateInMs : true; })
              .reverse();

            browserContent = lines.some((element) => { return element.origin && element.origin === 'BROWSER' });
          }

          const html = jade.renderFile(`${__dirname}/winstonDisplay.jade`, { lines, logPath, browserContent });
          res.send(html);
        });
      } else {
        const html = jade.renderFile(`${__dirname}/winstonDisplay.jade`, { lines: [] });
        res.send(html);
      }
    });
  });
};
