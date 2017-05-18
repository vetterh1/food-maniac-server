 /* eslint-disable no-console */

const config = require('config');
const logger = require('winston');
// To use Loggly: require('winston-loggly-bulk');

const levelConsole = config.get('log.levelConsole');
console.warn(`Config for log.levelConsole: ${levelConsole}`);
if (!config.has('log.levelConsole')) console.error(`! No config defined for log.levelConsole for env ${process.env.NODE_ENV} !`);

const levelFile = config.has('log.levelFile') ? config.get('log.levelFile') : 'debug';
console.warn(`Config for log.levelFile: ${levelFile}`);
if (!config.has('log.levelFile')) console.error(`! No config defined for log.levelFile for env ${process.env.NODE_ENV} !`);

const pathWithServer = `log.${process.env.SERVER_NAME}.pathFile`;
const pathFile = config.has(pathWithServer) ? config.get(pathWithServer) : 'debug';
console.warn(`Config for log: ${pathFile}`);
if (!config.has(pathWithServer)) console.error(`! No config defined for ${pathWithServer} for server ${process.env.SERVER_NAME} !`);

logger.addColors({
  debug: 'green',
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
});

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: () => { return (new Date()).toLocaleString(); }, level: levelConsole, colorize: true });
logger.add(logger.transports.File, { timestamp: () => { return (new Date()).toLocaleString(); }, level: levelFile, filename: pathFile });


// To use Loggly:
// logger.add(logger.transports.Loggly, {
//   token: 'ae377f20-4014-44ed-b6b8-7c69c9c4baa5',
//   subdomain: 'lve',
//   tags: ['Winston-NodeJS'],
//   json: true,
// });


logger.warn('------------------------------------------------------------------------');
logger.warn(`                    FOOD-MANIAC  START  (${process.env.SERVER_NAME})`);
logger.warn(`Version: ${process.env.npm_package_version}`);
logger.warn('------------------------------------------------------------------------');

logger.debug('Logger test: debug level');
logger.info('Logger test: info level');
logger.warn('Logger test: warn level');
logger.error('Logger test: error level');

module.exports = logger;
