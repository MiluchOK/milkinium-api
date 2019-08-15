const request = require('supertest');
const Case = require('../models').case;
const Project = require('../models').project;
const SuiteModel = require('../models').suite;
jest.mock('../middleware/authenticate');
const app = require('../app');

let project;
let suite;

beforeEach(() => {
    authMock = require('../middleware/authenticate')
    return Project.createRandom()
    .then(p => {
        project = p
        return SuiteModel.createRandom({project: project._id})
    })
    .then(s => {
        suite = s
        return s
    })
})

describe('Suite', function(){
    describe('update', function(){

        const endpoint = (suiteId) => (`/v1/suites/${suiteId}`)

        test('should update a specific suite', function(){
            let testCase;
            return Case.createRandom({project: project._id})
            .then(caze => {
                testCase = caze
                let newSuiteData = suite.toJSON()
                newSuiteData.cases.push(caze._id)
                console.log("new data: ")
                console.log(newSuiteData)
                return request(app)
                .put(endpoint(suite._id))
                .send(newSuiteData)
                .expect(200)
            })
            .then((response) => {
                expect(response.body).toEqual({message: "Updated"})
                return SuiteModel.findById(suite._id)
            })
            .then((updatedSuite) => {
                console.log("UPDATED SUITE: ")
                console.log(updatedSuite)
                let newSuiteData = suite.toJSON()
                expect(updatedSuite.toJSON()).toEqual({
                    id: suite.id,
                    cases: [testCase._id],
                    title: newSuiteData.title
                })
            })
        })
    })
})