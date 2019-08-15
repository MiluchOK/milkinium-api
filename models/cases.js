const mongoose = require('mongoose');
const faker = require('faker');
const CaseSchema = require('./schemas/caseSchema')
const Test = require('./tests');
const CodedError = require('../errors').codedError;

CaseSchema.statics.createRandom = function(args){
    let randomCaseData = {
        title: faker.finance.accountName()
    }
    randomCaseData = Object.assign(randomCaseData, args)
    return CaseModel(randomCaseData).save()
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

CaseSchema.methods.assignNewSuite = function(suiteId){
    this.suite = suiteId
    return this.save()
}

//Exporting our model
const CaseModel = mongoose.model('Case', CaseSchema);
module.exports = CaseModel;