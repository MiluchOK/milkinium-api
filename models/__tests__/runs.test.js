const Run = require('../../models/runs');
const ObjectId = require('mongoose').Types.ObjectId;

const validRunData = {
    title: 'foooo1',
    project: ObjectId()
}


const requiredFields = ['title', 'project']

describe('Runs', function () {

    test('should allow to create a valid run', function(){
        return new Run(validRunData).validate()
    })


    requiredFields.forEach((field) => {
        it(`should not allow to create a run without required '${field}' field`, (done) => {
            let invalidRunData = Object.assign({}, validRunData)
            delete invalidRunData[field]
            new Run(invalidRunData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});