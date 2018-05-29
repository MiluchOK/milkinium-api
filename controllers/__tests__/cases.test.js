const mockingoose = require('mockingoose').default;
const controller = require('../cases')
const Promise = require('bluebird')
let MockExpressRequest = require('mock-express-request');
let MockExpressResponse = require('mock-express-response');
const Project = require('../../models/projects')
jest.mock('../../models/projects')

// Mocks
let project_title;
let mockNext;
let mockReq;
let mockRes;


describe('Cases', function () {

    beforeEach(() => {
        project_title = "foo";
        mockNext = jest.fn();
        mockReq = new MockExpressRequest({
            params: {
                projectId: '111'
            },
            body: {
                title: project_title,
            }
        });
        mockRes = new MockExpressResponse();
    });

    describe('create', function(){

        test('should be creatable', function() {
            const result = controller.create(mockReq, mockRes, mockNext)
            return result
            .then(() => {
                expect(mockRes.statusCode).toBe(201);
                expect(mockRes._getJSON()).toHaveProperty('title', project_title)
            })
        })

        test('should call next with the error on save error', function(){
            const err = new Error('Save Failed');
            mockingoose.Case.toReturn(err, 'save');
    
            nextMock = jest.fn();
    
            result = controller.create(mockReq, mockRes, nextMock)
    
            return result
            .then(() => {
                expect(nextMock.mock.calls.length).toBe(1)
                expect(nextMock.mock.calls[0][0]).toBe(err)
            })
        })
    })

    describe('index', function(){

        test('should get all cases', function(){
            const cases = require('../../models/__mocks__/cases.json')
            Project.findWithCases.mockImplementationOnce(() => {
                return Promise.resolve(cases)
            })
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(Project.findWithCases.mock.calls.length).toBe(1)
                expect(Project.findWithCases.mock.calls[0][0]).toBe(mockReq.params.projectId)
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toEqual(cases.cases)
            })
        })
    
        test('should call next when cases retrieval fails', function(){
            expectedError = new Error('Something broke')
            Project.findWithCases.mockImplementationOnce(() => {
                return Promise.reject(expectedError)
            })
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })
});