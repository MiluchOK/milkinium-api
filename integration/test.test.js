const request = require('supertest');
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
        run = project.createRun({title: "Run1"})
        return run;
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
            let createdProjects;
            return Promise.all([Project.createRandom(), Project.createRandom()])
            .then((projects) => {
                createdProjects = projects.map((p) => { return p.toJSON() })
                return request(app)
                .get(`/v1/runs/${run._id}/tests`)
                .expect(200)
            })
            .then((response) => {
                expect(response.body.map(p => p.name).sort()).toEqual(
                    expect.arrayContaining(createdProjects.map(p => p.name).sort()),
                );
            })
        })


        test('should add a test to a run', function(){
            return request(app)
            .post(`/v1/runs/${run.Id}/tests`)
            .send([caze])
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({cases: [caze]})
            })
        })
    })
})