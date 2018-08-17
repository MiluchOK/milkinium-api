const request = require('supertest');
const Case = require('../models').case;
const Project = require('../models').project;
jest.mock('../middleware/authenticate');
const app = require('../app');

let authMock;
let project;

beforeEach(() => {
    authMock = require('../middleware/authenticate')
    return Project.createRandom()
    .then(p => {
        project = p
    })
})

describe('Case', function(){
    describe('index', function(){

        const endpoint = (projectId) => (`/v1/projects/${projectId}/cases`)

        test('should return all cases for a project', function(){
            let createdCases;
            const promises = [Case.createRandom({project: project._id}), Case.createRandom({project: project._id})]
            return Promise.all(promises)
            .then(cases => {
                createdCases = cases
                return request(app)
                .get(endpoint(project._id))
                .expect(200)
            })
            .then(response => {
                expect(response.body).toHaveProperty('cases')
                const responseCases = response.body.cases
                expect(responseCases).toHaveLength(promises.length)
                createdCases.forEach(caze => {
                    expect(responseCases).toContainObject(JSON.parse(JSON.stringify(caze)))
                    const targetResponseCaze = responseCases.find(c => c.id == caze.id)
                    expect(targetResponseCaze).toEqual({
                        id: caze.id.toString(),
                        title: caze.title,
                        project: caze.project.toString()
                    })
                });
            })
        })

        test('should return 404 for accessing not existing project', function(){
            return request(app)
            .get(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({error: "Not Found"})
            })
        })
    })


    describe('show', function(){

        let endpoint = (caseId) => (`/v1/cases/${caseId}`)

        test('should return a specific case', function(){
            let createdCase
            return Case.createRandom({project: project._id})
            .then(caze => {
                createdCase = caze
                return request(app)
                .get(endpoint(caze._id))
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual({
                    id: createdCase._id.toString(),
                    project: createdCase.project.toString(),
                    title: createdCase.title
                })
            })
        })

        test('should return 404 when a non-existent case is accessed', function(){
            return request(app)
            .get(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({error: 'Not Found'})
            })
        })
    })

    describe('create', function(){

        let endpoint = (projectId) => (`/v1/projects/${projectId}/cases`)
        const caseData = {title: 'foooo'}

        test('should create a case for a project', function(){
            return request(app)
            .post(endpoint(project._id))
            .send(caseData)
            .expect(201)
            .then(response => {
                expect(response.body).toEqual({
                    id: expect.any(String),
                    project: project._id.toString(),
                    title: caseData.title
                })
            })
        })

        test('should not create a case for a non-existing project', function(){
            return request(app)
            .post(endpoint('507f1f77bcf86cd799439011'))
            .send(caseData)
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({error: 'Not Found'})
            })
        })
    })

    describe('delete', function(){

        const caseData = {title: 'foooo'}
        let endpoint = (caseId) => (`/v1/cases/${caseId}`)

        test('should allow to delete a specific test case', function(){
            return project.createCase(caseData)
            .then(caze => {
                return request(app)
                .delete(endpoint(caze._id))
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual({message: "Deleted"})
            })
        })

        test('should return 404 if non-existent case is tried to be deleted', function(){
            return request(app)
            .delete(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({error: 'Not Found'})
            })
        })
    })

    describe('update', function(){

        let endpoint = (caseId) => (`/v1/cases/${caseId}`)
        const caseData = {title: 'foooo'}
        const updateCaseData = {title: 'foooRandom'}

        test('should allow to update a case', function(){
            let createdCase;
            return project.createCase(caseData)
            .then(caze => {
                createdCase = caze
                return request(app)
                .put(endpoint(caze._id))
                .send(updateCaseData)
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual({message: 'success'})
            })
            .then(() => {
                return project.getCases()
            })
            .then(cases => {
                expect(cases).toHaveLength(1)
                expect(cases[0].toJSON()).toEqual({
                    id: createdCase.id,
                    project: createdCase.project,
                    title: updateCaseData.title
                })
            })
        })

        test('should return 404 if the case to update does not exist', function(){
            return request(app)
            .put(endpoint('507f1f77bcf86cd799439011'))
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({error: 'Not Found'})
            })
        })
    })
})




