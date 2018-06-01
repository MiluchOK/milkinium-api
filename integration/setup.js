const MongodbMemoryServer = require('mongodb-memory-server');

const MONGO_DB_NAME = 'jest';
const mongod = new MongodbMemoryServer.default({
  instance: {
    dbName: MONGO_DB_NAME,
  },
  binary: {
    version: '3.2.19',
  },
});

module.exports = function() {
  console.log("RUNING INTEGRATION")
  global.__MONGOD__ = mongod;
  global.__MONGO_DB_NAME__ = MONGO_DB_NAME;
};