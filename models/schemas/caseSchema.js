const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toJson = require('../toJson')

const CaseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    steps: [{
        type: Schema.Types.ObjectId,
        ref: 'StepTemplate',
        required: true
    }]
}, {
    toJSON: toJson
});

module.exports = CaseSchema;