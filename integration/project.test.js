const request = require('supertest');
const dbConnect = require('../config/db_connect');
const Project = require('../models').project;
const app = require('../app');
jest.mock('../middleware/authenticate');


let authMock;

beforeEach(() => {
    authMock = require('../middleware/authenticate')
})

describe('Project', function(){
    describe('index', function(){

        const endpoint = '/v1/projects'

        test('should return all projects', function(){
            let createdProjects;
            return Promise.all([Project.createRandom(), Project.createRandom()])
            .then((projects) => {
                createdProjects = projects.map((p) => (p.toJSON()))
                return request(app)
                .get(endpoint)
                .expect(200)
            })
            .then((response) => {
                expect(response.body).toHaveProperty('projects')
                const returnedProjects = response.body.projects
                createdProjects.forEach(element => {
                    expect(returnedProjects).toContainObject(element)
                });
            })
        })

        test('should return cases ids for projects', function(){
            const caseData = {title: 'foooo'}
            let createdProject;
            let createdCase;
            return Project.createRandom()
            .then(project => {
                createdProject = project
                return project.createCase(caseData)
            })
            .then(caze => {
                createdCase = caze
                return request(app)
                .get(endpoint)
                .expect(200)
            })
            .then(response => {
                const targetProject = response.body.projects.find(p => p.id === createdProject.id)
                expect(targetProject.cases).toEqual([createdCase.id])
            })
        })

    })

    describe('create', function(){

        const endpoint = '/v1/projects'

        test('should create a project', function(){
            const projectData = {name: 'foo1'}
            return request(app)
            .post(endpoint)
            .send(projectData)
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({
                    id: expect.any(String),
                    cases: [],
                    name: projectData.name,
                    suites: []
                  })
            })
        })

    })

    describe('delete', function(){
        let endpoint = (projectId) => (`/v1/projects/${projectId}`)

        test('should allow to delete a project', function(){
            return Project.createRandom()
            .then(project => {
                return request(app)
                .delete(endpoint(project._id))
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual({message: "Deleted"})
            })
        })

        test('should return 404 if a non-existed project id supplyed', function(){
            return request(app)
            .delete(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({error: "Not Found"})
            })
        })
    })

    describe('show', function(){

        let endpoint = (projectId) => (`/v1/projects/${projectId}`)
        let createdProject;

        beforeEach(() => {
            return Project.createRandom()
            .then(project => {
                createdProject = project
            })
        })

        test('should allow to get a project by id', function(){
            return request(app)
            .get(endpoint(createdProject._id))
            .expect(200)
            .then(response => {
                const returnedProject = response.body
                expect(returnedProject).toEqual({
                    id: expect.any(String),
                    name: createdProject.name,
                    cases: [],
                    suites: []
                })
            })
        })

        test('should show case ids that belongs to the project', function(){
            const casesData = [{title: 'fooCase1'}, {title: 'fooCase2'}]
            const cases = casesData.map(caze => createdProject.createCase(caze))
            let createdCases;
            return Promise.all(cases)
            .then(cs => {
                createdCases = cs.map(c => c.toJSON())
                return request(app)
                .get(endpoint(createdProject._id))
                .expect(200)
            })
            .then(response => {
                const responseCases = response.body.cases
                expect(responseCases).toHaveLength(createdCases.length)
                createdCases.forEach(createdCase => {
                    createdCase.project = createdCase.project.toString()
                    expect(responseCases).toContainObject(createdCase)
                })
            })
        })

        test('should return 404 if non existent user is being retrieved', function(){
            return request(app)
            .get(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                const errorMessage = response.body
                expect(errorMessage).toEqual({error: 'Not Found'})
            })
        })
    })

    describe('update', function(){

        let endpoint = (projectId) => (`/v1/projects/${projectId}`)

        test('should allow to update a project info', function(){
            let createdProject;
            const updateInfo = {name: 'differentName'}
            return Project.create({name: 'fooProject'})
            .then(project => {
                createdProject = project
                return request(app)
                .put(endpoint(project._id))
                .send(updateInfo)
                .expect(200)
            })
            .then(response => {
                const responseMessage = response.body
                expect(responseMessage).toEqual({message: 'success'})
            })
            .then(() => {
                return Project.findById(createdProject._id)
            })
            .then(proj => {
                expect(proj.toJSON()).toEqual({
                    id: expect.any(String),
                    name: updateInfo.name,
                    cases: [],
                    suites: []
                })
            })
        })

        test('should return 404 if non existent user is tried to be updated', function(){
            return request(app)
            .put(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                const errorMessage = response.body
                expect(errorMessage).toEqual({error: 'Not Found'})
            })
        })
    })
})