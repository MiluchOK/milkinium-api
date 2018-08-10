const mongoose = require('mongoose');
const faker = require('faker');
const CaseSchema = require('./schemas/caseSchema')
const Test = require('./tests');

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

// const sureFindPlugin = require('./plugins/sureFind')
// CaseSchema.plugin(sureFindPlugin)

//Exporting our model
const CaseModel = mongoose.model('Case', CaseSchema);
module.exports = CaseModel;