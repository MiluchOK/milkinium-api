const request = require('supertest');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const dbConnect = require('../config/db_connect');
const Project = require('../models/projects');
const Case = require('../models/cases');
const Ttest = require('../models/tests');
jest.mock('../middleware/authenticate');

let authMock;
let connection;
let app;
let project;
let caze;
let run;
let ttest;

afterEach(() => {
    return dbConnect.teardown();
})

beforeEach(() => {
    jest.clearAllMocks()
    authMock = require('../middleware/authenticate')
    app = require('../app')
    return dbConnect.connect(global.__MONGO_URI__)
    .then(connection => {
        return Project.create({name: "foo1"})
    })
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

describe('Test', function(){
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
    })
})