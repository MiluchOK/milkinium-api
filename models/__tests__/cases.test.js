const Case = require('../../models').case;
const mongoose = require('mongoose');

const requiredFields = ['title']
const validCaseData = {
    title: 'Case1',
    project: mongoose.Types.ObjectId(),
    steps: []
}

describe('Cases', function () {
    test('should allow to create a valid case', function(){
        return new Case(validCaseData).validate()
    })

    requiredFields.forEach((field) => {
        it(`should not allow to create a project without required '${field}' field`, (done) => {
            let invalidCaseData = Object.assign({}, validCaseData)
            console.log(invalidCaseData)
            delete invalidCaseData[field]
            console.log("LKDSNFJLKSDNFLJDSNFLN")
            console.log(invalidCaseData)
            new Case(invalidCaseData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});