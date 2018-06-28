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
});