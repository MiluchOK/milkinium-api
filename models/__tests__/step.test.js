const Step = require('../../models/step');
const ObjectId = require('mongoose').Types.ObjectId;

const validStepData = {
    body: "Some Step"
}


const requiredFields = ['body']

describe('Steps', function () {

    test('should allow to create a valid step', function(){
        return new Step(validStepData).validate()
    })


    requiredFields.forEach((field) => {
        it(`should not allow to create a step without required '${field}' field`, (done) => {
            let invalidStepData = Object.assign({}, validStepData)
            delete invalidStepData[field]
            new Step(invalidStepData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});