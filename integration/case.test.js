const request = require('supertest');

const dbConnect = require('../config/db_connect');
const Case = require('../models/cases');
const Project = require('../models/projects');
jest.mock('../middleware/authenticate');

let authMock;
let app;
let project;

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
    })
})

describe('Case', function(){
    describe('index', function(){
        test('should be protected', function(){
            return request(app)
            .get(`/v1/projects/${project._id}/cases`)
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return all cases for a project', function(){
            let createdCases;
            return Promise.all([Case.createRandom({project: project._id}), Case.createRandom({project: project._id})])
            .then((cases) => {
                createdCases = cases
                return request(app)
                .get(`/v1/projects/${project._id}/cases`)
                .expect(200)
            })
            .then((response) => {
                expect(response.body.map(c => c.name).sort()).toEqual(createdCases.map(c => c.name).sort())
                console.log(response.body[0])
            })
        })
    })
})