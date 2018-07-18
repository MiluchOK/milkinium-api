const Test = require('../../models/tests');
const mongoose = require('mongoose');

const requiredFields = ['title', 'case', 'run']
const validTestData = {
    title: 'Case1',
    case: mongoose.Types.ObjectId(),
    run: mongoose.Types.ObjectId()
}

describe('Tests', function () {
    test('should allow to create a valid case', function(){
        return new Test(validTestData).validate()
    })

    requiredFields.forEach((field) => {
        it(`should not allow to create a test without required '${field}' field`, (done) => {
            let invalidTestData = Object.assign({}, validTestData)
            delete invalidTestData[field]
            new Test(invalidTestData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});