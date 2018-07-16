const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('tests_model');
const Schema = mongoose.Schema;
const toJson = require('./toJson')

let TestSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    case: {
        type: Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    }
}, {
        toJSON: toJson,
        id: true
});

//Exporting our model
const TestModel = mongoose.model('Test', TestSchema);
module.exports = TestModel;