const request = require('supertest');
const Project = require('../models/projects');
const Status = require('../models/status');
jest.mock('../middleware/authenticate');

let authMock;
const app = require('../app');
let project;
let caze;
let ttest;
let status;


beforeEach(() => {
    authMock = require('../middleware/authenticate')
    return Project.create({name: "foo1"})
    .then(p => {
        project = p
        return project.createCase({title: "case1"})
    })
    .then((c) => {
        caze = c
        return project.createRun({title: "Run1"})
    })
    .then(r => {
        run = r
        return r.addCase(caze)
    })
    .then(t => {
        ttest = t
        return Status.create({label: "PASSED"})
    })
    .then(s => {
        status = s
        return ttest.addResult({status: s})
    })
})

describe('Result', function(){
    describe('index', function(){
        test('should be protected', function(){
            return request(app)
            .get(`/v1/${ttest._id}/results`)
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return a list of results', function(){
            return request(app)
            .get(`/v1/tests/${ttest._id}/results`)
            .expect(200)
            .then(response => {
                const results = response.body
                expect(results.results).toHaveLength(1)
                expect(results.results[0]).toEqual({
                    id: expect.any(String),
                    status: {
                        id: status._id.toString(),
                        label: status.label
                    }
                })
            })
        })


        test('should add a result to a test', function(){
            return request(app)
            .post(`/v1/tests/${ttest._id}/results`)
            .send({
                status: {
                    label: "SOME WEIRD STATUS"
            }})
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    status: {
                        label: "SOME WEIRD STATUS"
                    }
                })
            })
        })
    })
})