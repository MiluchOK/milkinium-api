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
                    name: projectData.name
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

        test('should allow to get a project by id', function(){
            let createdProject;
            return Project.create({name: "fooProject"})
            .then(project => {
                createdProject = project
                return request(app)
                .get(endpoint(project._id))
                .expect(200)
            })
            .then(response => {
                const returnedProject = response.body
                expect(returnedProject).toEqual({
                    id: expect.any(String),
                    name: createdProject.name,
                    cases: []
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
                    cases: []
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