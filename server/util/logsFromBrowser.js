const logger = require('./logger.js');

module.exports = (app) => {
  app.post('/logs/save', (req, res) => {
    if (!req.body || !req.body.message || !req.body.methodName || !req.body.loggerName) {
      logger.error('logsFromBrowser failed - missing mandatory fields');
      if (!req.body) logger.error('... no req.body!');
      if (req.body && !req.body.message) logger.error('... no req.body.message!');
      if (req.body && req.body.methodName) logger.error('... no req.body.methodName!');
      if (req.body && req.body.loggerName) logger.error('... no req.body.loggerName!');
      res.status(400).end();
    } else {
      logger.log(req.body.methodName, req.body.message, { origin: 'BROWSER', method: req.body.loggerName });
      res.status(200).end();
    }
  });
};
