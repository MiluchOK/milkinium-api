const mockingoose = require('mockingoose').default;
const controller = require('../cases')
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

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
});