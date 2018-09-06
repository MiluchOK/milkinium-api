const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toJson = require('../toJson')

const StepTemplateSchema = new Schema({
    body: {
        type: String,
        required: true
    }
}, {
    toJSON: toJson
});

module.exports = StepTemplateSchema