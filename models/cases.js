const mongoose = require('mongoose');
const faker = require('faker');
const CaseSchema = require('./schemas/caseSchema')

CaseSchema.statics.createRandom = function(args){
    let randomCaseData = {
        title: faker.finance.accountName()
    }
    randomCaseData = Object.assign(randomCaseData, args)
    return CaseModel(randomCaseData).save()
}

//Exporting our model
const CaseModel = mongoose.model('Case', CaseSchema);
module.exports = CaseModel;