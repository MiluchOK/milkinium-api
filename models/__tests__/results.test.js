const mockingoose = require('mockingoose').default;
const Result = require('../../models/results');

const requiredFields = ['status']
const validResultData = {
    status: {
        label: "Passed"
    }
}

describe('Results', function () {
    test('should allow to create a valid result', function(){
        const data = validResultData
        return new Result(data).validate()
    })

    requiredFields.forEach((field) => {
        it(`should not allow to create a result without required '${field}' field`, (done) => {
            let invalidResultData = Object.assign({}, validResultData)
            delete invalidResultData[field]
            new Result(invalidResultData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});