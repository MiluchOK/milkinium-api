const mongoose = require('mongoose');
const faker = require('faker');
const errorMessages = require('../errors').tests;
const Error = require('../errors/codedError');
const Schema = mongoose.Schema;
const Case = require('./index').case;

let RunSchema = new Schema({
    title: {
        type: String,
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
            transform: function(doc, ret, options){ 
                delete ret._id;
                delete ret.__v;
                if(ret.tests == null){
                    ret.tests = []
                }
                return ret;
            },
        },
        id: true
});

RunSchema.virtual('tests', {
    ref: 'Test',
    localField: '_id',
    foreignField: 'run'
});

RunSchema.statics.createRandom = function(args){
    randomData = {
        title: faker.internet.userName()
    }
    randomData = Object.assign(randomData, args)
    return RunModel(randomData).save()
}

RunSchema.methods.getTests = function(args){
    return this.populate({path: 'tests', select: 'title case'})
    .execPopulate()
    .then(run => {
        return run.tests || []
    })
}

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
}


RunSchema.pre('findOne', function() {
    this.populate('tests');
});

//Exporting our model
const RunModel = mongoose.model('Run', RunSchema);
module.exports = RunModel;