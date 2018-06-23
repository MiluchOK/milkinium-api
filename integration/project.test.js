const request = require('supertest');

const dbConnect = require('../config/db_connect');
const Project = require('../models/projects');
jest.mock('../middleware/authenticate');

let authMock;
let connection;
let app;

afterEach(() => {
    dbConnect.teardown();
})

beforeEach(() => {
    jest.clearAllMocks()
    authMock = require('../middleware/authenticate')
    app = require('../app')
    return dbConnect.connect(global.__MONGO_URI__)
})

describe('Project', function(){
    describe('index', function(){

        const endpoint = '/v1/projects'

        test('should be protected', function(){
            return request(app)
            .get(endpoint)
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return all projects', function(){
            let createdProjects;
            return Promise.all([Project.createRandom(), Project.createRandom()])
            .then((projects) => {
                createdProjects = projects.map((p) => { return p.toJSON() })
                return request(app)
                .get(endpoint)
                .expect(200)
            })
            .then((response) => {
                expect(response.body).toHaveLength(createdProjects.length)
                const sorter = (a, b) => { return ((a.email < b.email) ? -1 : ((a.email > b.email) ? 1 : 0)) }
                expect(response.body.sort(sorter)).toEqual(createdProjects.sort(sorter))
            })
        })
    })
})