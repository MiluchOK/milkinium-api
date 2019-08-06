const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toJson = require('../toJson')

const SuiteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    cases: [{
        type: Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    }]
}, {
    toJSON: toJson
});

module.exports = SuiteSchema;