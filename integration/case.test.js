const request = require('supertest');

const dbConnect = require('../config/db_connect');
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
                expect(response.body.cases.map(u => u.name).sort()).toEqual(
                    expect.arrayContaining(createdCases.map(u => u.name).sort()),
                );
            })
        })
    })


    describe('show', function(){
        test('should return a specific case', function(){
            let createdCase
            return Case.createRandom({project: project._id})
            .then((c) => {
                createdCase = c
                return request(app)
                .get(`/v1/cases/${createdCase._id}`)
                .expect(200)
            })
            .then((response) => {
                expect(response.body).toEqual({
                    id: createdCase._id.toString(),
                    project: createdCase.project.toString(),
                    title: createdCase.title
                })
            })
        })
    })

    describe('create', function(){
        test('should create a case for a project', function(){
            const caseData = {title: 'foooo'}
            return request(app)
            .post(`/v1/projects/${project._id}/cases`)
            .send(caseData)
            .expect(201)
            .then((response) => {
                
                expect(response.body).toEqual({
                    id: expect.any(String),
                    project: project._id.toString(),
                    title: caseData.title
                  })
            })
        })
    })
})