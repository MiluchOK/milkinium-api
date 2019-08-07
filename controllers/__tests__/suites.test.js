const mockingoose = require('mockingoose').default;
const controller = require('../suitesController');
let MockExpressRequest = require('mock-express-request');
let MockExpressResponse = require('mock-express-response');

// Mocks
let project_title;
let mockNext;
let mockReq;
let mockRes;

describe('Suites', function () {
    beforeEach(() => {
        mockingoose.resetAll();
        mockNext = jest.fn();
        mockNext.mockImplementation((error) => {
            throw error
        })
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
                expect(mockRes._getJSON()).toHaveProperty('name', project_title)
            })
        })
    })
})