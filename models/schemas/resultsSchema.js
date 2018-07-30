const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StatusSchema = require('./statusSchema');
const toJson = require('../toJson')

let ResultSchema = new Schema({
    status: {
        type: StatusSchema,
        required: true
    }
}, {
        toJSON: toJson,
        id: true
});

module.exports = ResultSchema;