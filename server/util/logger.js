var config = require('config');
var logger = require('winston');

if (config.has('log.levelConsole')){  
    var levelConsole = config.get('log.levelConsole');
    console.error(`Config for log.levelConsole: ${levelConsole}`); // eslint-disable-line no-console
}
else
    console.error("! No config defined for log.levelConsole (or no NODE_ENV defined!) !"); // eslint-disable-line no-console

if (config.has('log.levelFile')){
    var levelFile = config.get('log.levelFile');
    console.error(`Config for log.levelFile: ${levelFile}`); // eslint-disable-line no-console
}
else
    console.error("! No config defined for log.levelFile (or no NODE_ENV defined!) !"); // eslint-disable-line no-console

if (config.has('log.pathFile')){
    var pathFile = config.get('log.pathFile');
    console.error(`Config for log.pathFile: ${pathFile}`); // eslint-disable-line no-console
}
else
    console.error("! No config defined for log.pathFile (or no NODE_ENV defined!) !"); // eslint-disable-line no-console

logger.addColors({
    silly: 'magenta',
    debug: 'green',
    info:  'cyan',
    warn:  'yellow',
    error: 'red'
});

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { level: levelConsole, colorize:true });
logger.add(logger.transports.File, { level: levelFile, filename: pathFile });

logger.warn('------------------------------------------------------------------------');
logger.warn('                    FOOD-MANIAC  START')
logger.warn('------------------------------------------------------------------------');

logger.debug('Logger test: debug level');
logger.info('Logger test: info level');
logger.silly('Logger test: silly level');
logger.warn('Logger test: warn level');
logger.error('Logger test: error level');


module.exports = logger;