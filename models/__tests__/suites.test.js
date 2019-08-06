const SuiteModel = require('../../models').suite;
const mongoose = require('mongoose');

const requiredFields = ['title']
const validSuiteData = {
    title: 'Suite',
    project: mongoose.Types.ObjectId(),
    cases: []
}

describe('Suites', function () {
    test('should allow to create a valid suite', function(){
        return new SuiteModel(validSuiteData).validate()
    })

    requiredFields.forEach((field) => {
        it(`should not allow to create a suite without required '${field}' field`, (done) => {
            let invalidSuiteData = Object.assign({}, validSuiteData)
            delete invalidSuiteData[field]
            new SuiteModel(invalidSuiteData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});