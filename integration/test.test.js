const request = require('supertest');
const errors = require('../errors').tests;
const dbConnect = require('../config/db_connect');
const Project = require('../models/projects');
jest.mock('../middleware/authenticate');
const app = require('../app');

let authMock;
let project;
let caze;
let run;

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
        return r
    })
})


describe('index', function(){
    test('should be protected', function(){
        return request(app)
        .get(`/v1/runs/${run._id}/tests`)
        .then(() => {
            expect(authMock.authMid.mock.calls.length).toBe(1)
        })
    })

    test('should return all tests for a run', function(){
        return run.addCase(caze._id)
        .then(() => {
            return request(app)
            .get(`/v1/runs/${run._id}/tests`)
            .expect(200)
        })
        .then((response) => {
            expect(response.body.tests).toHaveLength(1)
            const targetTest = response.body.tests[0]
            targetTest.id = targetTest.id.toString()
            expect(targetTest).toEqual({
                id: targetTest.id,
                title: caze.title,
                case: caze._id.toString(),
                run: run._id.toString()
            })
        })
    })
})

describe('create', function(){
    test('should add tests to a run', function(){
        const expectedTest = {
            id: expect.any(String),
            case: caze._id.toString(),
            run: run._id.toString(),
            title: caze.title
        }
        return request(app)
        .post(`/v1/runs/${run._id}/tests`)
        .send({cases: [caze._id]})
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({tests: [expectedTest]})
        })
    })

    describe('should not be able to add the same case twice', function(){

        const endpoint = (runId) => (`/v1/runs/${runId}/tests`)

        test('in the same batch', function(){
            return request(app)
            .post(endpoint(run._id))
            .send({cases: [caze._id, caze._id]})
            .expect(400)
            .then(response => {
                expect(response.body).toEqual({error: "validation error"})
            })
        })
    
        test('as 2 separate requests', function(){
            return request(app)
            .post(endpoint(run._id))
            .send({cases: [caze._id]})
            .expect(200)
            .then(() => {
                return request(app)
                .post(endpoint(run._id))
                .send({cases: [caze._id]})
                .expect(400)
            })
            .then(response => {
                expect(response.body).toEqual({error: errors.duplicateCasesForRun})
            })
        })
    })

    describe('should not delete cases that were already added', function(){
        return request(app)
        .post(``)
    })
})