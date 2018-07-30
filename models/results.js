const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('tests_model');
const Schema = mongoose.Schema;
const StatusSchema = require('./schemas/StatusSchema');
const toJson = require('./toJson')

let TestSchema = new Schema({
    status: {
        type: StatusSchema,
        required: true
    }
}, {
        toJSON: toJson,
        id: true
});

//Exporting our model
const TestModel = mongoose.model('Test', TestSchema);
module.exports = TestModel;