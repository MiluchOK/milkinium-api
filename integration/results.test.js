const request = require('supertest');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const errors = require('../errors').tests;
const dbConnect = require('../config/db_connect');
const Project = require('../models/projects');
const Case = require('../models/cases');
const Ttest = require('../models/tests');
const Status = require('../models/status');
jest.mock('../middleware/authenticate');

let authMock;
let connection;
let app;
let project;
let caze;
let run;
let ttest;
let result;
let status;

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