const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toJson = require('../toJson')

const StepSchema = new Schema({
    body: {
        type: String,
        required: true
    }
}, {
    toJSON: toJson
});

module.exports = StepSchema