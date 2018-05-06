const isProduction = process.env.NODE_ENV === 'production';

module.exports = isProduction ? require('./prod') : require('./dev');

