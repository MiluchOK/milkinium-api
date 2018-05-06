const chai = require('chai');
const expect = chai.expect;
const Project = require('../../models/projects');

describe('Projects', function () {
    test('should not allow saving without a name', function (done) {
        new Project().validate((err) => {
            expect(err.errors.name).to.exist;
            done()
        });
    });
});