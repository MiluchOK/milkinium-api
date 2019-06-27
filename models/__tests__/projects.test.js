const Project = require('../../models').project;

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
        test(`should not allow to create a project without required '${field}' field`, (done) => {
            let invalidProjectData = Object.assign({}, validProjectData)
            delete invalidProjectData[field]
            new Project(invalidProjectData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })

   test('should not allow to create a project with an empty name', function(done){
       const data = { name: ' ' }
       new Project(data).validate()
       .catch(err => {
           expect(err.errors['name']).toBeTruthy()
           expect(err.errors['name'].toString()).toEqual('Path `name` is required.')
           done()
       })
   })
});