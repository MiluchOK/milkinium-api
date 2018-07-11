const mockingoose = require('mockingoose').default;
const Project = require('../../models/projects');

const requiredFields = ['name']
const validProjectData = {
    name: 'Project1'
}

describe('Projects', function () {
    test('should allow to create a valid project', function(){
        const data = {name: 'foo'}
        return new Project(data).validate()
    })

    requiredFields.forEach((field) => {
        it(`should not allow to create a project without required '${field}' field`, (done) => {
            let invalidProjectData = Object.assign({}, validProjectData)
            delete invalidProjectData[field]
            new Project(invalidProjectData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});