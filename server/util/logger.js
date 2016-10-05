var config = require('config');
var logger = require('winston');

if (config.has('log.levelConsole'))
  var levelConsole = config.get('log.levelConsole');
else
    console.error("! No config defined for log.levelConsole (or no NODE_ENV defined!) !"); // eslint-disable-line no-console

if (config.has('log.levelFile'))
  var levelFile = config.get('log.levelFile');
else
    console.error("! No config defined for log.levelFile (or no NODE_ENV defined!) !"); // eslint-disable-line no-console

if (config.has('log.pathFile'))
  var pathFile = config.get('log.pathFile');
else
    console.error("! No config defined for log.pathFile (or no NODE_ENV defined!) !"); // eslint-disable-line no-console


logger.setLevels({
    debug:0,
    info: 1,
    silly:2,
    warn: 3,
    error:4
});
logger.addColors({
    debug: 'green',
    info:  'cyan',
    silly: 'magenta',
    warn:  'yellow',
    error: 'red'
});

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { level: levelConsole, colorize:true });
logger.add(logger.transports.File, { level: levelFile, filename: pathFile });

logger.warn('------------------------------------------------------------------------');
logger.warn('                    FOOD-MANIAC  START')
logger.warn('------------------------------------------------------------------------');

module.exports = logger;