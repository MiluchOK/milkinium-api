const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const faker = require('faker');
const toJson = require('../toJson');
const Test = require('../index').test;
const CodedError = require('../../errors').codedError;


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

CaseSchema.statics.createRandom = function(args){
    let randomCaseData = {
        title: faker.finance.accountName()
    }
    randomCaseData = Object.assign(randomCaseData, args)
    return this.create(randomCaseData)
}

CaseSchema.methods.createTest = function(runId){
    return Test.create({
        title: this.title,
        run: runId,
        case: this._id
    })
}

CaseSchema.methods.addStepTemplate = function(stepTemplateId){
    return this.stepTemplates.push(stepTemplateId)
}

CaseSchema.methods.removeStepTemplate = function(stepTemplateId){
    const elementIndex = this.stepTemplates.indexOf(stepTemplateId)
    if(elementIndex === -1){
        throw new CodedError('Step template not found', 404)
    }
    return this.stepTemplates.splice(elementIndex, 1)
}

module.exports = CaseSchema;