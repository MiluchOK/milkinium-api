// mongo-environment.js
const NodeEnvironment = require('jest-environment-node');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    console.log('Setup MongoDB Test Environment');
    this.global.__MONGO_URI__ = await global.__MONGOD__.getConnectionString();
    this.global.__MONGO_DB_NAME__ = global.__MONGO_DB_NAME__;
    await super.setup();
  }

  async teardown() {
    console.log('Teardown MongoDB Test Environment');
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;