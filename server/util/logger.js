 /* eslint-disable no-console */

const config = require('config');
const logger = require('winston');

const levelConsole = config.get('log.levelConsole');
console.warn(`Config for log.levelConsole: ${levelConsole}`);
if (!config.has('log.levelConsole')) console.error(`! No config defined for log.levelConsole for env ${process.env.NODE_ENV} !`);

const levelFile = config.has('log.levelFile') ? config.get('log.levelFile') : 'debug';
console.warn(`Config for log.levelFile: ${levelFile}`);
if (!config.has('log.levelFile')) console.error(`! No config defined for log.levelFile for env ${process.env.NODE_ENV} !`);

const pathFile = config.has('log.pathFile') ? config.get('log.pathFile') : 'debug';
console.warn(`Config for log.pathFile: ${pathFile}`);
if (!config.has('log.pathFile')) console.error(`! No config defined for log.pathFile for env ${process.env.NODE_ENV} !`);

logger.addColors({
  debug: 'green',
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
});

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { level: levelConsole, colorize: true });
logger.add(logger.transports.File, { level: levelFile, filename: pathFile });

logger.warn('------------------------------------------------------------------------');
logger.warn('                    FOOD-MANIAC  START');
logger.warn('------------------------------------------------------------------------');

logger.debug('Logger test: debug level');
logger.info('Logger test: info level');
logger.warn('Logger test: warn level');
logger.error('Logger test: error level');

module.exports = logger;
