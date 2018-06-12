const mockingoose = require('mockingoose').default;
const Project = require('../../models/projects');

describe('Projects', function () {
    test('should allow to create a valid project', function(){
        const data = {name: 'foo'}
        return new Project(data).validate()
    })

    test('should not allow saving without a name', function() {
        return new Project().validate()
        .catch((err) => {
            expect(err.errors.name).toBeTruthy()
        })
    });

    describe('findWithCases', function(){
        test('should populate cases', function(){
            const projectId = '45hn3jk45n345'
            mockingoose.Project.toReturn({cases: []}, 'findOne')
            return Project.findWithCases(projectId)
            .then((doc) => {
                expect(doc).toHaveProperty("cases", [])
            })
        })

        // test('should error out if nothing found', function(){
        //     const expectedError = new Error("Some Error")
        //     mockingoose.Project.toReturn(expectedError, 'findOne')
        //     return Project.findWithCases("222")
        //     .catch((err) => {
        //         expect(err).toBe(expectedError)
        //     })
        // })
    })
});