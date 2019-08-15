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
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret, options){
            delete ret._id;
            delete ret.__v;
            delete ret.project;
            return ret;
        },
    }
});

module.exports = SuiteSchema;