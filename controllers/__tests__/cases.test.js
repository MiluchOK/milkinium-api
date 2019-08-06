const mockingoose = require('mockingoose').default;
const controller = require('../cases')
const Promise = require('bluebird')
let MockExpressRequest = require('mock-express-request');
let MockExpressResponse = require('mock-express-response');
const Project = require('../../models/projects')

// Mocks
let project_title;
let mockNext;
let mockReq;
let mockRes;


describe('Cases', function () {

    beforeEach(() => {
        mockingoose.resetAll();
        case_title = "foo";
        mockNext = jest.fn();
        mockNext.mockImplementation((error) => {
            throw error
        })
        mockReq = new MockExpressRequest({
            params: {
                projectId: '111'
            },
            body: {
                title: case_title,
                steps: []
            }
        });
        mockRes = new MockExpressResponse();
        mockRes.statusCode = 500
    });

    describe('create', function(){

        test('should be creatable', function() {
            mockingoose.Project.toReturn({}, 'findOne')
            const result = controller.create(mockReq, mockRes, mockNext)
            return result
            .then(() => {
                expect(mockRes.statusCode).toBe(201);
                expect(mockRes._getJSON()).toHaveProperty('title', case_title)
            })
        })

        test('should call next with the error on save error', function(){
            const err = new Error('Save Failed');
            mockingoose.Project.toReturn({}, 'findOne')
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
            mockingoose.Project.toReturn(cases, 'findOne');
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toEqual(cases)
            })
        })
    
        test('should call next when cases retrieval fails', function(){
            expectedError = new Error('Something broke')
            const customNextMock = jest.fn()
            mockingoose.Project.toReturn(expectedError, 'findOne');
            return controller.index(mockReq, mockRes, customNextMock)
            .then(() => {
                expect(customNextMock.mock.calls.length).toBe(1)
                expect(customNextMock.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('show', function(){
        test('should get a specific case', function(){
            mockReq.params.caseId = '222'
            const _doc = {
                title: 'Foo title'
            }
            mockingoose.Case.toReturn(_doc, 'findOne');
            return controller.show(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toHaveProperty("title", _doc.title)
            })

        })

        test('shold call next when case retrieval fails', function(){
            mockReq.params.caseId = '222'
            expectedError = new Error('Some Error')
            const customNextMock = jest.fn()
            mockingoose.Case.toReturn(expectedError, 'findOne');
            return controller.show(mockReq, mockRes, customNextMock)
            .then(() => {
                expect(customNextMock.mock.calls.length).toBe(1)
                expect(customNextMock.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('update', function(){
        test('should update a specific case', function(){
            mockReq.params.caseId = '222'
            const _doc = {
                title: 'Foo title',
                steps: []
            }
            mockingoose.Case.toReturn({title: 'something'}, 'findOne')
            mockingoose.Case.toReturn(_doc, 'update');
            return controller.update(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toEqual({message: 'success'})
            })
        })

        test('should call next if fails', function(){
            mockReq.params.caseId = '222'
            const customNextMock = jest.fn()
            const expectedError = new Error('Some errror')
            mockingoose.Case.toReturn({}, 'findOne');
            mockingoose.Case.toReturn(expectedError, 'update');
            return controller.update(mockReq, mockRes, customNextMock)
            .then(() => {
                expect(customNextMock.mock.calls.length).toBe(1)
                expect(customNextMock.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('destroy', function(){
        test('should delete a specific case', function(){
            mockReq.params.caseId = '222'
            mockingoose.Case.toReturn({}, 'findOne');
            mockingoose.Case.toReturn({}, 'remove');
            return controller.destroy(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toEqual({message: "Deleted"})
            })
        })

        test('should call next if fails', function(){
            mockReq.params.caseId = '222'
            const expectedError = new Error('Some errror')
            const customNextMock = jest.fn()
            mockingoose.Case.toReturn(expectedError, 'findOne');
            mockingoose.Case.toReturn(expectedError, 'remove');
            return controller.destroy(mockReq, mockRes, customNextMock)
            .then(() => {
                expect(customNextMock.mock.calls.length).toBe(1)
                expect(customNextMock.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })
});