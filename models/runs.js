const mongoose = require('mongoose');
const faker = require('faker');
const errorMessages = require('../errors').tests;
const Error = require('../errors/codedError');
const logger = require('../logger')('runs_model');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const Case = require('./cases');
const Test = require('./tests');

let RunSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
}, {
        toJSON: {
            virtuals: true,
            versionKey: false,
            minimize: false,
            transform: function(doc, ret, options){ 
                delete ret._id;
                ret.tests = ret.tests.map(test => test.id);
                return ret;
            },
        }
});

RunSchema.virtual('tests', {
    ref: 'Test',
    localField: '_id',
    foreignField: 'run'
});

RunSchema.statics.createRandom = function(args){
    randomData = {
        title: faker.internet.userName(),
        completed: false
    };
    randomData = Object.assign(randomData, args);
    return RunModel(randomData).save()
};

RunSchema.methods.getCountByStatus = function(){
    return Test.find({'_id': { $in: this.tests }})
        .then(tests => {
            let result = {}
            tests.forEach(test => {
                const label = test.getLeadingResult().status.label
                if ( result[label] ) {
                    result[label] = result[label] + 1
                } else {
                    result[label] = 1
                }
            })
            return result
        })
}

RunSchema.statics.getRunsByProjectId = function(projectId){
    return this.find({project: projectId})
        .populate({path: 'tests'})
};

RunSchema.methods.getTests = function(args){
    return this.populate({path: 'tests', select: 'title case results'})
    .execPopulate()
    .then(run => {
        return run.tests || []
    })
};

RunSchema.methods.addCase = function(caseId){
    return this.getTests()
    .then(currentTests => {
        if(currentTests.map(t => t.case.toString()).includes(caseId)){
            throw new Error(errorMessages.duplicateCasesForRun, 400)
        }
        return Case.findById(caseId)
    })
    .then(caze => {
        return caze.createTest(this._id)
    })
};

RunSchema.methods.addCases = function(caseIds) {
    return caseIds.map((caseId => this.addCase(caseId)))
};

RunSchema.pre('findOne', function() {
    this.populate('tests');
});

//Exporting our model
const RunModel = mongoose.model('Run', RunSchema);
module.exports = RunModel;