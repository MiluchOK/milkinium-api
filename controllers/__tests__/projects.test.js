const mockingoose = require('mockingoose').default;
const controller = require('../projects')
const Promise = require('bluebird')
let MockExpressRequest = require('mock-express-request');
let MockExpressResponse = require('mock-express-response');

// Mocks
let project_title;
let mockNext;
let mockReq;
let mockRes;

describe('Projects', function () {

    beforeEach(() => {
        mockingoose.resetAll();
        project_title = "foo";
        mockNext = jest.fn();
        mockReq = new MockExpressRequest({
            params: {

            },
            body: {
                name: project_title,
            }
        });
        mockRes = new MockExpressResponse();
    });

    describe('create', function(){
        test('should return 201 on succesfull save', function(){
            mockingoose.Project.toReturn(mockReq.body, 'save');
            return controller.create(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(201)
                expect(mockRes._getJSON()).toHaveProperty('name', project_title)
            })
        })

        test('should call next if creation failed', function(){
            expectedError = new Error('Some Error')
            mockingoose.Project.toReturn(expectedError, 'save');
            return controller.create(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('show', function(){
        test('should return a specific project by id', function(){
            _doc = {
                name: 'Project One'
            }
            mockingoose.Project.toReturn(_doc, 'findOne');
            mockReq.params.projectId = '222'
            return controller.show(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toMatchObject(_doc)
            })
        })

        test('should call next if project retrieval failed', function(){
            expectedError = new Error("Retrieval error")
            mockingoose.Project.toReturn(expectedError, 'findOne');
            return controller.show(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('index', function(){
        test('should return 200 and list of projects', function(){
            _expected_response = [
                {
                    name: 'Project One'
                },
                {
                    name: 'Project Two'
                }
            ]
            mockingoose.Project.toReturn(_expected_response, 'find');
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toMatchObject(_expected_response)
            })
        })

        test('should call next if failed', function(){
            expectedError = Error('SomeError')
            mockingoose.Project.toReturn(expectedError, 'find')
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('update', function(){
        test('should return 200 status code if successfully updated', function(){
            targetProject = '222'
            _update = {
                name: 'newName'
            }
            mockReq.body = _update
            mockReq.params.projectId = targetProject
            mockingoose.Project.toReturn(_update, 'findOneAndUpdate')
            return controller.update(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockReq.statusCode).toBe(200)
                expect(mockRes._getJSON()).toBe({success: true})
            })
        })

        xtest('should call next if failed', function(){

        })
    })

    xdescribe('destroy', function(){
        test('should return 200 if successfully destroyed', function(){

        })

        test('should call next if failed', function(){

        })
    })
})