const logger = require('../logger')('error_handler');

module.exports = (error, req, res, next) => {
  logger('info', `Throwing an error ${error}`);
  res.status(error.status || 500).json({
    error: error.message
  });
};