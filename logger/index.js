const log4js = require('log4js');
const config = require('../config');

const loggerConfig = config.logger;

if (loggerConfig.appenders) {
  // log4js.configure(({ appenders } = loggerConfig));
}

module.exports = module => {
  const logger = log4js.getLogger(module.toUpperCase());
  logger.level = loggerConfig.level;

  return (level, message) => logger[level](message);
};