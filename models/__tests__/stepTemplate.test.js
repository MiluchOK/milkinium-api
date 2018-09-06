const StepTemplate = require('../../models/stepTemplateModel');
const ObjectId = require('mongoose').Types.ObjectId;

const validStepData = {
    body: "Some Step"
}


const requiredFields = ['body']

describe('StepTemplate', function () {

    test('should allow to create a valid step template', function(){
        return new StepTemplate(validStepData).validate()
    })


    requiredFields.forEach((field) => {
        it(`should not allow to create a step without required '${field}' field`, (done) => {
            let invalidStepData = Object.assign({}, validStepData)
            delete invalidStepData[field]
            new StepTemplate(invalidStepData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});