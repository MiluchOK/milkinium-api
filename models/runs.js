const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('runs_model');
const Schema = mongoose.Schema;
const toJson = require('./toJson')

let RunSchema = new Schema({
    title: {
        type: String,
        required: true
    }
}, {
        toJSON: toJson,
        id: true
});

RunSchema.statics.createRandom = function(){
    randomData = {
        title: faker.internet.userName()
    }
    return RunModel(randomData).save()
}

//Exporting our model
const RunModel = mongoose.model('Run', RunSchema);
module.exports = RunSchema;