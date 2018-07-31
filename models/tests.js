const mongoose = require('mongoose');
const faker = require('faker');
const logger = require('../logger')('tests_model');
const Schema = mongoose.Schema;
const resultsSchema = require('./schemas/resultsSchema')
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
    },
    run: {
        type: Schema.Types.ObjectId,
        ref: 'Run',
        required: true
    },
    results: [resultsSchema]
}, {
        toJSON: toJson,
        id: true
});

TestSchema.methods.addResult = function(result){
    this.results.push(result)
    return this.save()
    .then(doc => {
        return result
    })
}

TestSchema.methods.getResults = function(){
    return this.results;
}

//Exporting our model
const TestModel = mongoose.model('Test', TestSchema);
module.exports = TestModel;