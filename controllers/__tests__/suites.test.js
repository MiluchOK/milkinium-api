const mockingoose = require('mockingoose').default;
const controller = require('../suitesController');
let MockExpressRequest = require('mock-express-request');
let MockExpressResponse = require('mock-express-response');
let mockNext = require('./__mocks__/nextMock');

// Mocks
let mockReq;
let mockRes;

describe('Suites', function () {
    beforeEach(() => {
        mockingoose.resetAll();
        mockingoose.Project.toReturn({}, 'findOne')
        mockReq = new MockExpressRequest({
            params: {
                projectId: 'sdf'
            },
            body: {
                title: 'SuiteName',
            }
        });
        mockRes = new MockExpressResponse();
    });

    describe('create', function(){
        test('should return 201 on succesfull save', function(){
            mockingoose.Suite.toReturn(mockReq.body, 'save');
            return controller.create(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(201)
                expect(mockRes._getJSON()).toHaveProperty('title', mockReq.body.title)
                expect(mockRes._getJSON()).toHaveProperty('cases', [])
            })
        })
    })

    describe('index', function(){
        test('should return list of suites for a given project', function(){
            const returnObjectMock = {
                suites: [
                    {
                        title: 'foo',
                        cases: []
                    },
                    {
                        title: 'boo',
                        cases: []
                    }
                ]
            }
            mockingoose.Project.toReturn(returnObjectMock, 'findOne')
            return controller.index(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toHaveProperty('suites', returnObjectMock.suites)
            })
        })
    })

    describe('show', function(){
        test('should return a suite by id', function(){
            const suiteReturnObjectMock = {
                title: 'foo',
                cases: []
            }
            mockingoose.Suite.toReturn(suiteReturnObjectMock, 'findOne')
            return controller.show(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toHaveProperty('title', suiteReturnObjectMock.title)
                expect(mockRes._getJSON()).toHaveProperty('cases', suiteReturnObjectMock.cases)
            })
        })
    })

    describe('destroy', function(){
        test('should return a Delete message', function(){
            mockingoose.Suite.toReturn({}, 'findOne')
            mockingoose.Suite.toReturn({}, 'remove')
            return controller.destroy(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toHaveProperty('message', 'Deleted')
            })
        })
    })

    describe('update', function(){
        test('should return an Update message', function(){
            mockingoose.Suite.toReturn({}, 'findOne')
            mockingoose.Suite.toReturn({}, 'update')
            return controller.update(mockReq, mockRes, mockNext)
            .then(() => {
                expect(mockRes.statusCode).toBe(200)
                expect(mockRes._getJSON()).toHaveProperty('message', 'Updated')
            })
        })
    })
})
