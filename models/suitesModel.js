const mongoose = require('mongoose');
const faker = require('faker');
const SuiteSchema = require('./schemas/suiteSchema');
const Caze = require('./cases');

SuiteSchema.methods.addCases = (caseIds) => {
    caseIds.forEach(cazeId => {
        this.cases.push(cazeId)
    });
    return this
};

SuiteSchema.statics.createRandom = function(args){
    let randomCaseData = {
        title: faker.finance.accountName(),
        cases: []
    };
    randomCaseData = Object.assign(randomCaseData, args)
    return SuiteModel(randomCaseData).save()
};

//Exporting our model
const SuiteModel = mongoose.model('Suite', SuiteSchema);
module.exports = SuiteModel;

