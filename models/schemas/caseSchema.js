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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step'
    }]
}, {
    toJSON: toJson
});

module.exports = CaseSchema;