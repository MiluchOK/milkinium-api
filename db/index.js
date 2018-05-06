const mongoose = require('mongoose');
const config = require('../config');

module.exports = {
    dbConnect: () => {
        mongoose.Promise = require('bluebird');
        return mongoose.connect(config.db_host);
    }
};