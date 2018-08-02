const request = require('supertest');
const dbConnect = require('../config/db_connect');
const Project = require('../models/projects');
const app = require('../app');
jest.mock('../middleware/authenticate');


let authMock;
const endpoint = '/v1/projects'

afterEach(() => {
    return dbConnect.teardown();
})

beforeEach(() => {
    authMock = require('../middleware/authenticate')
    return dbConnect.connect(global.__MONGO_URI__)
})

describe('Project', function(){
    describe('index', function(){

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
                expect(response.body.map(p => p.name).sort()).toEqual(
                    expect.arrayContaining(createdProjects.map(p => p.name).sort()),
                );
            })
        })
    })

    describe('create', function(){

        test('should create a project', function(){
            const projectData = {name: 'foo1'}
            return request(app)
            .post(endpoint)
            .send(projectData)
            .expect(201)
            .then((response) => {
                expect(response.body).toEqual({
                    id: expect.any(String),
                    cases: [],
                    name: projectData.name
                  })
            })
        })

    })
})