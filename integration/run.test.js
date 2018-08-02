const request = require('supertest');

const dbConnect = require('../config/db_connect');
const Run = require('../models/runs');
const Case = require('../models/cases');
const Project = require('../models/projects');
jest.mock('../middleware/authenticate');

let authMock;
const app = require('../app');
let project;

afterEach(() => {
    return dbConnect.teardown();
})

beforeEach(() => {
    authMock = require('../middleware/authenticate')
    return dbConnect.connect(global.__MONGO_URI__)
    .then(connection => {
        return Project.create({name: "foo1"})
    })
    .then(p => {
        project = p
    })
})

describe('Run', function(){
    describe('index', function(){
        test('should be protected', function(){
            return request(app)
            .get(`/v1/project/${project._id}/runs`)
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return all runs for a project', function(){
            let createdRuns;
            return Promise.all([Run.createRandom({project: project._id}), Run.createRandom({project: project._id})])
            .then((runs) => {
                createdRuns = runs
                return request(app)
                .get(`/v1/projects/${project._id}/runs`)
                .expect(200)
            })
            .then((response) => {
                expect(response.body.runs.length).toEqual(createdRuns.length)
                expect(response.body.runs.map(u => u.title).sort()).toEqual(
                    expect.arrayContaining(createdRuns.map(u => u.title).sort()),
                );
            })
        })
    })


    describe('show', function(){
        test('should return a specific run', function(){
            let createdRun
            return Run.createRandom({project: project._id})
            .then((r) => {
                return request(app)
                createdRun = r
                .get(`/v1/runs/${createdRun._id}`)
                .expect(200)
            })
            .then((response) => {
                expect(response.body).toEqual(createdRun)
            })
        })
    })

    describe('create', function(){
        test('should create a run for a project', function(){
            const runData = {title: 'foooo'}
            let caze
            return Case.createRandom({project: project})
            .then(c => {
                caze = c
                return request(app)
                .post(`/v1/projects/${project._id}/runs`)
                .send(runData)
                .expect(201)
            })
            .then((response) => {
                expect(response.body).toEqual({
                    id: expect.any(String),
                    project: project._id.toString(),
                    title: runData.title,
                    tests: []
                  })
            })
        })
    })
})