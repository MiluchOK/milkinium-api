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
            mockingoose.Project.toReturn({}, 'findOne')
            const result = controller.create(mockReq, mockRes, mockNext)
            return result
            .then(() => {
                expect(mockRes.statusCode).toBe(201);
                expect(mockRes._getJSON()).toHaveProperty('title', project_title)
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
            mockingoose.Project.toReturn(expectedError, 'findOne');
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
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
            mockingoose.Case.toReturn(expectedError, 'findOne');
            return controller.show(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('update', function(){
        test('should update a specific case', function(){
            mockReq.params.caseId = '222'
            const _doc = {
                title: 'Foo title'
            }
            mockingoose.Case.toReturn(_doc, 'findOneAndUpdate');
            return controller.update(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toHaveProperty('title', _doc.title)
            })
        })

        test('should call next if fails', function(){
            mockReq.params.caseId = '222'
            const expectedError = new Error('Some errror')
            mockingoose.Case.toReturn(expectedError, 'findOneAndUpdate');
            return controller.update(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })

    describe('destroy', function(){
        test('should delete a specific case', function(){
            mockReq.params.caseId = '222'
            mockingoose.Case.toReturn({}, 'findOneAndRemove');
            return controller.destroy(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toEqual({message: "Deleted"})
            })
        })

        test('should call next if fails', function(){
            mockReq.params.caseId = '222'
            const expectedError = new Error('Some errror')
            mockingoose.Case.toReturn(expectedError, 'findOneAndRemove');
            return controller.destroy(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockNext.mock.calls.length).toBe(1)
                expect(mockNext.mock.calls[0][0]).toBe(expectedError)
            })
        })
    })
});