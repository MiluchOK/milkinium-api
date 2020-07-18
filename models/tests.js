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
        toJSON: toJson
});

TestSchema.methods.addResult = function(result){
    this.results.push(result)
    return this.save()
    .then(doc => {
        return result
    })
};

TestSchema.methods.getResults = function(){
    return this.results;
};

TestSchema.methods.getLeadingResult = function(){
    if(this.results.length > 0){
        return this.results[this.results.length-1]
    } else {
        logger('debug', 'No results')
        return {
            status: {
                label: "pending"
            }}
    }
}

TestSchema.statics.createRandom = function(args){
    randomData = {
        title: "foo",
        case: args.case,
        run: args.run,
        results: []
    };

    return TestModel(randomData).save()
};

//Exporting our model
const TestModel = mongoose.model('Test', TestSchema);
module.exports = TestModel;