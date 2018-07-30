const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toJson = require('../toJson')

let StatusSchema = new Schema({
    label: {
        type: String,
        required: true
    }
}, {
    toJSON: toJson,
    id: true
});

module.exports = StatusSchema;
